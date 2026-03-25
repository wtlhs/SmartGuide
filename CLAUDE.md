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

## Image Carousel Pattern

Single guide step supports multi-image carousel with auto-play:

**Carousel Data Structure:**
```typescript
interface CarouselSlide {
  image: string
  title: string
  description: string
}

const carouselData: CarouselSlide[] = [
  {
    image: 'https://example.com/image1.jpg',
    title: 'Feature 1',
    description: 'Description with <strong>HTML</strong> support'
  }
]
```

**Carousel HTML Template:**
```html
<div class="carousel-container" style="padding: 8px 0;">
  <div class="carousel-content"></div>
  <div class="carousel-controls">
    <button class="carousel-btn carousel-prev" onclick="window.carouselPrev && window.carouselPrev()">‹</button>
    <div class="carousel-indicators">
      <span class="carousel-indicator active" onclick="window.carouselGoTo && window.carouselGoTo(0)"></span>
    </div>
    <button class="carousel-btn carousel-next" onclick="window.carouselNext && window.carouselNext()">›</button>
  </div>
</div>
```

**Carousel Initialization (in `onHighlighted` callback):**
```typescript
onHighlighted: () => {
  const currentStep = driverObj.getActiveIndex()
  if (currentStep === 0 && route.path === '/') {
    setTimeout(() => {
      (window as any).carouselNext = nextSlide
      (window as any).carouselPrev = prevSlide
      (window as any).carouselGoTo = goToSlide
      initCarousel(carouselData)
    }, 50)
  }
}
```

**Critical Implementation Notes:**
- Carousel must be re-initialized in `onHighlighted` when switching back to carousel step
- Functions exposed to window object for onclick handlers
- Auto-play interval: 5000ms (5 seconds)
- Call `stopAutoPlay()` in `onHighlightStarted` and `onDestroyStarted`

## GIF Image Support

GIFs require fixed aspect ratio containers to prevent layout shift on load:

**GIF Container Pattern:**
```html
<div style="position: relative; width: 100%; aspect-ratio: 16/9; background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
  <img src="https://example.com/demo.gif"
       alt="Demo"
       style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.3s ease;"
       onload="this.style.opacity='1'; this.parentElement.querySelector('.loading-text').style.display='none';"
       onerror="this.src='fallback.jpg';"
       loading="lazy">
  <span class="loading-text" style="color: #999; font-size: 14px;">加载中...</span>
</div>
```

**GIF Best Practices:**
- Use `aspect-ratio` (not fixed height) to prevent layout shift
- `object-fit: cover` fills container without whitespace
- Fade-in on load with opacity transition
- Gradient background as loading placeholder
- `loading="lazy"` for performance
- Fallback image on error via `onerror` handler

**Positioning Considerations:**
- Fixed aspect ratio prevents popover repositioning after image loads
- Smart scroll enabled: `smoothScroll: true`, `scrollIntoViewOptions: { behavior: 'smooth', block: 'center' }`
- Auto-scroll correction in `onHighlighted` if popover top < 0

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
  showButtons: ['next', 'previous', 'close'],
  smoothScroll: true,
  scrollIntoViewOptions: {
    behavior: 'smooth',
    block: 'center'
  }
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
  - Must call `stopAutoPlay()` to clear carousel interval
- `onHighlightStarted`: Called when step begins highlighting
  - Call `stopAutoPlay()` to stop carousel when leaving step
- `onHighlighted`: Called after step is fully visible
  - Re-initialize carousel if returning to carousel step
  - Auto-scroll correction if popover is clipped by viewport

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

## Common Issues & Solutions

**Issue: Carousel not displaying on step return**
- Cause: Carousel state not re-initialized when switching steps
- Solution: Add re-initialization logic in `onHighlighted` callback
- Check: `driverObj.getActiveIndex()` matches carousel step index

**Issue: GIF causes popover to shift position**
- Cause: Container height unknown before image loads
- Solution: Use `aspect-ratio` on container, not fixed height
- Avoid: `height: auto` on images without fixed container

**Issue: Popover clipped by viewport top**
- Cause: Target element near top, popover renders above
- Solution: Add scroll correction in `onHighlighted`:
  ```typescript
  const rect = popover.getBoundingClientRect()
  if (rect.top < 0) {
    window.scrollBy({ top: rect.top - 20, behavior: 'smooth' })
  }
  ```

**Issue: Body scroll locked after tour**
- Cause: Missing cleanup in `onDestroyStarted`
- Solution: Always restore `document.body.style.overflow = ''`

**Issue: Carousel auto-play continues after tour closed**
- Cause: Interval not cleared on destroy
- Solution: Call `stopAutoPlay()` in both `onDestroyStarted` and `onHighlightStarted`

## Debugging Tips

**Enable console logging:**
```typescript
console.warn('[Carousel] Container or slide not found', {
  hasContainer: !!carouselContainer,
  hasSlide: !!slide,
  currentIndex: currentSlideIndex
})
```

**Check guide state:**
```javascript
// Browser console
localStorage.getItem('guide-seen')
// Reset guide state
localStorage.removeItem('guide-seen')
```

**Verify step configuration:**
```typescript
console.log('Current steps:', getSteps())
console.log('Active step index:', driverObj.getActiveIndex())
```

**Test carousel lifecycle:**
- Open guide → Navigate to carousel step → Verify auto-play
- Click next/prev → Verify manual control
- Switch to another step → Verify `stopAutoPlay()` called
- Return to carousel step → Verify re-initialization
- Close guide → Verify cleanup

## Technical Constraints

**Immutability (CRITICAL):**
- All state updates MUST use spread operator
- Never mutate `seen.value` directly: `seen.value[path] = true` ❌
- Always create new object: `seen.value = { ...seen.value, [path]: true }` ✓
- Rationale: Ensures Vue reactivity triggers correctly

**Carousel Window Functions:**
- Functions must be attached to `window` for onclick access
- Check existence before calling: `window.carouselPrev && window.carouselPrev()`
- Cleanup not required (functions remain between tours)

**Image Loading Strategy:**
- Use `loading="lazy"` for all images
- Provide gradient background placeholder
- Implement fade-in transition on load
- Always include `onerror` fallback handler
- For GIFs: aspect-ratio container prevents layout shift

**Performance Considerations:**
- Auto-play interval: 5000ms (balance UX vs annoyance)
- Debounce scroll corrections: 100ms delay minimum
- Limit carousel slides: 3-5 max for cognitive load
- Image dimensions: 400x180px optimal for popover width
- Lazy load all images to reduce initial bundle

**Browser Compatibility:**
- `aspect-ratio` CSS property: Modern browsers (not IE11)
- If IE11 support needed: use `padding-bottom` hack:
  ```css
  .aspect-16-9 {
    position: relative;
    padding-bottom: 56.25%; /* 9/16 = 0.5625 */
    height: 0;
  }
  .aspect-16-9 > img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  ```
