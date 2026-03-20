# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (hot reload enabled)
npm run dev

# Build for production (includes TypeScript type checking)
npm run build

# Preview production build locally
npm run preview
```

**Development server:** http://localhost:5173/

## Architecture Overview

### Core System: Multi-Page Guided Tour

This is a **Vue 3 + TypeScript + driver.js** guided tour system with per-page state persistence.

**Key Design Decisions:**
- Uses **driver.js** (not vue3-tour) due to CSP compatibility issues with vue3-tour
- Per-route guide state stored in localStorage via Pinia store
- Guides auto-show on first visit, then require manual trigger
- Each route defines its own guide steps independently

### Component Structure

```
GuidedTour.vue (component)
├── Creates driver.js instance with global config
├── Defines step configurations per route
├── Watches route changes to trigger guides
└── Exposes openTour() method via defineExpose

guideStore.ts (Pinia store)
├── Persists seen state to localStorage
├── Uses immutable updates (spread operator)
└── Auto-initializes from localStorage on creation

Views (HomeView.vue, AboutView.vue)
├── Reference GuidedTour component via ref
├── Call openTour() from help buttons
└── Guide auto-triggers on mount if not seen
```

### Guide Flow

1. **First visit to route:**
   - `onMounted` checks `guideStore.seen[route.path]`
   - If not seen → `startTour()` after 500ms delay
   - User completes tour → `onDestroyStarted` callback
   - `guideStore.markAsSeen(route.path)` persists state

2. **Subsequent visits:**
   - Store check returns `true`, tour doesn't auto-start
   - User clicks help button → manual `openTour()` call

3. **Route changes:**
   - `watch(() => route.path)` detects navigation
   - Same first-visit logic applies for new route

## Adding New Guide Steps

**In `GuidedTour.vue`:**

```typescript
const allSteps = [
  {
    element: '#css-selector',  // Target DOM element
    popover: {
      title: 'Step Title',
      description: `
        <div style="padding: 8px 0;">
          <p>Step description (HTML supported)</p>
          <img src="image-url" style="max-width: 100%; border-radius: 8px;">
        </div>
      `,
      side: 'bottom',      // 'top' | 'bottom' | 'left' | 'right'
      align: 'center'      // 'start' | 'center' | 'end'
    }
  }
]
```

**Add new route's steps:**
1. Create new steps array (e.g., `newPageSteps`)
2. Update `getSteps()` function to return correct array for route
3. Add target elements with matching IDs in the view

## State Management Pattern

**Immutable Updates (CRITICAL):**

The codebase enforces immutable state updates:

```typescript
// CORRECT - creates new object
seen.value = { ...seen.value, [path]: true }

// WRONG - mutates in place
seen.value[path] = true  // Never do this
```

This pattern prevents side effects and ensures reactivity works correctly.

## driver.js Integration Notes

**Button Text Configuration:**
```typescript
const driverObj = driver({
  nextBtnText: '下一步',
  prevBtnText: '上一步',
  doneBtnText: '完成',
  progressText: '{{current}} / {{total}}',
  showButtons: ['next', 'previous', 'close']
})
```

**Styling Override Pattern:**
- All styles use `!important` to override driver.js defaults
- Styles target global driver.js classes (not scoped)
- Button text shadow issues fixed by clearing pseudo-elements:
  ```css
  .driver-popover-btn::before,
  .driver-popover-btn::after {
    content: none !important;
  }
  ```

**Critical Callbacks:**
- `onDestroyStarted`: Called when user completes/closes tour
- Must call `driverObj.destroy()` to clean up
- Must restore `document.body.style.overflow` if modified

## Integration Pattern

To integrate into existing Vue 3 projects:

1. **Copy files:**
   - `src/stores/guideStore.ts`
   - `src/components/GuidedTour.vue`

2. **Install dependencies:**
   ```bash
   npm install driver.js pinia
   ```

3. **Setup Pinia** (if not already):
   ```typescript
   // main.ts
   import { createPinia } from 'pinia'
   app.use(createPinia())
   ```

4. **Use in view:**
   ```vue
   <template>
     <button @click="openHelp">Help</button>
     <GuidedTour ref="tourRef" />
   </template>

   <script setup>
   const tourRef = ref(null)
   const openHelp = () => tourRef.value?.openTour()
   </script>
   ```

## Project-Specific Patterns

**Route-based Step Selection:**
```typescript
const getSteps = () => {
  const currentPath = route.path
  if (currentPath === '/') return allSteps
  if (currentPath === '/about') return aboutSteps
  return []
}
```

**Multiple Trigger Points:**
Views can have multiple buttons that trigger the same tour:
- Help button in header
- "Start using feature" button in content
- Both call `tourRef.value?.openTour()`

**Auto-scroll Lock:**
The guide locks body scroll when active:
```typescript
document.body.style.overflow = 'hidden'  // On start
document.body.style.overflow = ''         // On destroy
```

## Path Alias Configuration

The project uses `@` as alias for `src/`:

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  }
}
```

Usage: `import Component from '@/components/Component.vue'`

## Type Safety

- All Vue components use `<script setup lang="ts">`
- Pinia store uses composition API with explicit return types
- Ref types explicitly declared: `ref<InstanceType<typeof GuidedTour> | null>(null)`

## localStorage Key

- Key: `'guide-seen'`
- Format: `Record<string, boolean>` where key is route path
- Clear with: `localStorage.removeItem('guide-seen')`
