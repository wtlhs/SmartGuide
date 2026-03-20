# 集成指南

如何将产品引导功能集成到现有的 Vue 3 项目中。

## 📋 前置要求

- Vue 3.x
- Vue Router 4.x（可选）
- Pinia（可选，也可以只用 localStorage）

## 🚀 快速集成（5 步）

### 步骤 1: 安装依赖

```bash
npm install driver.js pinia
```

### 步骤 2: 复制核心文件

```
src/stores/guideStore.ts     → 你的项目/src/stores/guideStore.ts
src/components/GuidedTour.vue → 你的项目/src/components/GuidedTour.vue
```

### 步骤 3: 配置 Pinia（如果还没有）

在 `main.ts` 中：

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

### 步骤 4: 配置引导步骤

编辑 `GuidedTour.vue` 中的 `allSteps` 数组：

```typescript
const allSteps = [
  {
    element: '#your-element-id',
    popover: {
      title: '步骤标题',
      description: '<p>步骤说明</p><img src="your-image.jpg">',
      side: 'bottom',
      align: 'center'
    }
  }
]
```

### 步骤 5: 在页面中使用

```vue
<template>
  <div>
    <div id="target-element">目标元素</div>
    <button @click="openHelp">帮助</button>
    <GuidedTour ref="tourRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GuidedTour from '@/components/GuidedTour.vue'

const tourRef = ref(null)
const openHelp = () => tourRef.value?.openTour()
</script>
```

## 📝 配置说明

### 步骤属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `element` | 目标元素选择器 | `'#welcome'` |
| `popover.title` | 引导标题 | `'欢迎使用'` |
| `popover.description` | 引导内容（支持 HTML） | `'<p>说明文字</p>'` |
| `popover.side` | 弹出位置 | `'top'`, `'bottom'`, `'left'`, `'right'` |
| `popover.align` | 对齐方式 | `'start'`, `'center'`, `'end'` |

### Driver.js 配置

```typescript
const driverObj = driver({
  showProgress: true,              // 显示进度
  showButtons: ['next', 'previous', 'close'], // 显示的按钮
  nextBtnText: '下一步',
  prevBtnText: '上一步',
  doneBtnText: '完成',
  progressText: '{{current}} / {{total}}',
  allowClose: true,                // 允许点击外部关闭
  overlayColor: 'rgba(0, 0, 0, 0.5)', // 遮罩颜色
  onDestroyStarted: () => {
    // 引导结束时调用
    guideStore.markAsSeen(route.path)
    driverObj.destroy()
  }
})
```

## 🎨 自定义样式

在 `GuidedTour.vue` 的 `<style>` 中添加：

```css
/* 引导框样式 */
.driver-popover {
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
}

/* 标题样式 */
.driver-popover-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  padding: 16px 50px 16px 20px !important;
}

/* 按钮样式 */
.driver-popover-btn {
  padding: 14px 32px !important;
  font-size: 1.05rem !important;
  font-weight: 600 !important;
  min-width: 120px !important;
}

/* 关闭按钮 */
.driver-popover-close-btn {
  position: absolute !important;
  top: 16px !important;
  right: 16px !important;
  color: white !important;
}
```

## 💡 高级用法

### 多页面引导

```typescript
// 根据路由返回不同步骤
const getSteps = () => {
  if (route.path === '/') return homeSteps
  if (route.path === '/about') return aboutSteps
  return []
}
```

### 动态加载步骤

```typescript
const loadSteps = async () => {
  const response = await fetch('/api/tour-steps')
  const steps = await response.json()
  driverObj.setSteps(steps)
  driverObj.drive()
}
```

### 延迟启动

等待数据加载完成后再启动：

```typescript
onMounted(async () => {
  await fetchData()
  // 数据加载完成后启动引导
  if (!guideStore.seen[route.path]) {
    startTour()
  }
})
```

### 条件显示

根据用户权限或状态显示不同步骤：

```typescript
const steps = allSteps.filter(step => {
  if (step.requiredRole) {
    return userStore.hasRole(step.requiredRole)
  }
  return true
})
```

## 🔧 常见问题

### Q: 如何重置引导状态？

```javascript
// 清除所有记录
localStorage.removeItem('guide-seen')

// 清除特定页面
const seen = JSON.parse(localStorage.getItem('guide-seen') || '{}')
delete seen['/']
localStorage.setItem('guide-seen', JSON.stringify(seen))
```

### Q: 如何在移动端优化？

调整弹出位置，避免左右遮挡：

```typescript
{
  element: '#mobile-element',
  popover: {
    side: 'bottom', // 移动端优先使用 bottom
    align: 'center'
  }
}
```

### Q: 如何添加多语言支持？

```typescript
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const steps = [
  {
    element: '#welcome',
    popover: {
      title: t('tour.welcome.title'),
      description: t('tour.welcome.description')
    }
  }
]
```

## 📚 相关资源

- [driver.js 官方文档](https://driverjs.com/)
- [Vue 3 文档](https://vuejs.org)
- [Pinia 文档](https://pinia.vuejs.org)

## 🎯 最佳实践

1. **步骤数量** - 每页 5-8 步，避免用户疲劳
2. **简洁明了** - 每步说明不超过 3 句话
3. **视觉辅助** - 配图说明复杂概念
4. **可跳过** - 允许用户随时跳过
5. **可重看** - 提供帮助按钮重新查看

## ✅ 检查清单

集成完成后，检查以下项：

- [ ] 首次访问能自动弹出引导
- [ ] 完成后刷新不再弹出
- [ ] 帮助按钮能重新打开
- [ ] 引导框不会超出屏幕
- [ ] 按钮清晰可见
- [ ] 图片正常加载
- [ ] 移动端适配正常

---

**集成完成!** 🎉

如有问题,参考项目中的完整示例代码。
