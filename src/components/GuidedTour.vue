<template>
  <!-- driver.js 不需要模板元素 -->
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useGuideStore } from '@/stores/guideStore'

const route = useRoute()
const guideStore = useGuideStore()

// 创建 driver 实例
const driverObj = driver({
  showProgress: true,
  showButtons: ['next', 'previous', 'close'],
  nextBtnText: '下一步',
  prevBtnText: '上一步',
  doneBtnText: '完成',
  progressText: '{{current}} / {{total}}',
  popoverClass: 'driverjs-theme',
  allowClose: true,
  overlayColor: 'rgba(0, 0, 0, 0.5)',
  stagePadding: 8,
  stageRadius: 8,
  onDestroyStarted: () => {
    // 用户点击关闭或完成时
    guideStore.markAsSeen(route.path)
    document.body.style.overflow = ''
    driverObj.destroy()
  },
  steps: []
})

// 定义所有页面的引导步骤
const allSteps = [
  // ========== 首页步骤 ==========
  {
    element: '#welcome-banner',
    popover: {
      title: '👋 欢迎使用产品引导系统',
      description: `
        <div style="padding: 8px 0;">
          <p style="font-size: 1.05em; margin-bottom: 12px;">
            这是一个<strong>智能引导系统</strong>，帮助您快速了解页面功能。
          </p>
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"
               alt="欢迎引导"
               style="max-width: 100%; border-radius: 8px; margin-bottom: 12px;">
          <p style="color: #666; font-size: 0.95em;">
            💡 提示：您可以随时点击右上角的"帮助"按钮重新查看引导
          </p>
        </div>
      `,
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '.nav',
    popover: {
      title: '📍 导航栏',
      description: `
        <div style="padding: 8px 0;">
          <p style="margin-bottom: 12px;">
            使用顶部导航栏在<strong>首页</strong>和<strong>关于</strong>页面之间切换
          </p>
          <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=180&fit=crop"
               alt="导航示例"
               style="max-width: 100%; border-radius: 8px; margin-bottom: 12px;">
          <ul style="margin-top: 8px; padding-left: 20px; line-height: 1.8;">
            <li><strong>首页</strong> - 主要功能展示区</li>
            <li><strong>关于</strong> - 项目信息和技术栈</li>
          </ul>
        </div>
      `,
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#action-button',
    popover: {
      title: '🚀 主要操作按钮',
      description: `
        <div style="padding: 8px 0;">
          <p style="margin-bottom: 12px;">
            点击此按钮开始使用新功能，进入核心操作流程
          </p>
          <img src="https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=180&fit=crop"
               alt="操作按钮"
               style="max-width: 100%; border-radius: 8px; margin-bottom: 12px;">
          <p style="color: #1976d2; font-weight: 500;">
            ⚡ 按钮具有悬停动画效果，提供良好的交互反馈
          </p>
        </div>
      `,
      side: 'right',
      align: 'start'
    }
  },
  {
    element: '.info',
    popover: {
      title: '📖 使用说明',
      description: `
        <div style="padding: 8px 0;">
          <p style="margin-bottom: 12px;">
            这里列出了引导系统的核心功能特性
          </p>
          <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=200&fit=crop"
               alt="使用说明"
               style="max-width: 100%; border-radius: 8px; margin-bottom: 12px;">
          <ul style="margin-top: 8px; padding-left: 20px; line-height: 1.8;">
            <li>✅ 首次访问自动弹出</li>
            <li>✅ 完成后不再自动弹出</li>
            <li>✅ 帮助按钮重新打开</li>
            <li>✅ 不同页面不同引导</li>
          </ul>
        </div>
      `,
      side: 'top',
      align: 'center'
    }
  },
  {
    element: '.help-btn',
    popover: {
      title: '❓ 帮助按钮',
      description: `
        <div style="padding: 8px 0;">
          <p style="margin-bottom: 12px;">
            <strong>重要功能：</strong>点击此按钮可随时重新查看引导！
          </p>
          <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=180&fit=crop"
               alt="帮助按钮"
               style="max-width: 100%; border-radius: 8px; margin-bottom: 12px;">
          <p style="background: #fff3cd; padding: 12px; border-radius: 6px; border-left: 4px solid #ffc107;">
            💡 <strong>提示：</strong>如果您忘记了如何使用某个功能，随时点击这里重新学习
          </p>
        </div>
      `,
      side: 'left',
      align: 'start'
    }
  }
]

const aboutSteps = [
  // ========== 关于页步骤 ==========
  {
    element: '#about-title',
    popover: {
      title: 'ℹ️ 关于本项目',
      description: `
        <div style="padding: 8px 0;">
          <p style="margin-bottom: 12px;">
            欢迎了解本 Demo 的技术实现和设计理念
          </p>
          <img src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=200&fit=crop"
               alt="关于项目"
               style="max-width: 100%; border-radius: 8px; margin-bottom: 12px;">
          <p style="color: #666;">
            本 Demo 基于 <strong>Vue 3 Composition API</strong> 构建，展示现代化的产品引导实现
          </p>
        </div>
      `,
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#feature-list',
    popover: {
      title: '⭐ 核心功能特点',
      description: `
        <div style="padding: 8px 0;">
          <p style="margin-bottom: 12px;">
            本系统具备以下六大核心特性
          </p>
          <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=200&fit=crop"
               alt="功能特点"
               style="max-width: 100%; border-radius: 8px; margin-bottom: 12px;">
          <div style="background: #f0f7ff; padding: 12px; border-radius: 6px; margin-top: 8px;">
            <p style="margin: 0; font-weight: 500; color: #1976d2;">每个功能都经过精心设计，确保最佳用户体验</p>
          </div>
        </div>
      `,
      side: 'right',
      align: 'start'
    }
  },
  {
    element: '.tech-stack',
    popover: {
      title: '🛠️ 技术栈',
      description: `
        <div style="padding: 8px 0;">
          <p style="margin-bottom: 12px;">
            采用现代化的前端技术栈构建
          </p>
          <img src="https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=180&fit=crop"
               alt="技术栈"
               style="max-width: 100%; border-radius: 8px; margin-bottom: 12px;">
          <ul style="margin-top: 8px; padding-left: 20px; line-height: 1.8;">
            <li><strong>Vue 3</strong> - 渐进式框架</li>
            <li><strong>TypeScript</strong> - 类型安全</li>
            <li><strong>Pinia</strong> - 状态管理</li>
            <li><strong>driver.js</strong> - 引导组件</li>
          </ul>
        </div>
      `,
      side: 'top',
      align: 'center'
    }
  }
]

// 根据当前路径获取步骤
const getSteps = () => {
  const currentPath = route.path
  if (currentPath === '/') {
    return allSteps
  } else if (currentPath === '/about') {
    return aboutSteps
  }
  return []
}

// 启动引导
const startTour = () => {
  const steps = getSteps()

  if (steps.length === 0) {
    console.warn('[GuidedTour] 当前页面没有可用的引导步骤')
    return
  }

  try {
    // 禁用页面滚动
    document.body.style.overflow = 'hidden'

    driverObj.setSteps(steps)
    driverObj.drive()
  } catch (error) {
    console.error('[GuidedTour] 启动导览失败:', error)
  }
}

// 组件挂载后：若当前路径未看过，则自动开始导览
onMounted(() => {
  const currentPath = route.path
  const hasSeen = guideStore.seen[currentPath]

  if (!hasSeen && getSteps().length > 0) {
    // 延迟启动以确保 DOM 已渲染
    setTimeout(() => {
      startTour()
    }, 500)
  }
})

// 监听路由变化
watch(() => route.path, (newPath) => {
  const hasSeen = guideStore.seen[newPath]
  if (!hasSeen && getSteps().length > 0) {
    setTimeout(() => {
      startTour()
    }, 500)
  }
})

// 供外部（帮助按钮）调用的打开方法
const openTour = () => {
  startTour()
}

// 将方法暴露给父组件（通过 ref 调用）
defineExpose({ openTour })
</script>

<style>
/* driver.js 主题自定义 */
.driver-popover {
  background-color: white !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
  max-width: 450px !important;
  color: #2c3e50 !important;
}

.driver-popover-title {
  font-size: 1.15rem !important;
  font-weight: 600 !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  padding: 16px 50px 16px 20px !important;
  border-radius: 12px 12px 0 0 !important;
  margin: 0 !important;
  position: relative !important;
}

.driver-popover-description {
  padding: 20px !important;
  line-height: 1.6 !important;
  max-height: 400px !important;
  overflow-y: auto !important;
}

.driver-popover-description img {
  max-width: 100% !important;
  height: auto !important;
  border-radius: 8px !important;
  margin: 12px 0 !important;
}

.driver-popover-description ul {
  margin: 12px 0 !important;
  padding-left: 24px !important;
}

.driver-popover-description li {
  margin: 8px 0 !important;
  line-height: 1.8 !important;
}

.driver-popover-progress-text {
  color: #666 !important;
  font-size: 0.9rem !important;
}

/* 按钮样式 - 确保一直显示，放大按钮 */
.driver-popover-navigation-btns {
  display: flex !important;
  justify-content: flex-end !important;
  padding: 24px 24px !important;
  gap: 16px !important;
  border-top: 1px solid #eee !important;
  background: white !important;
  border-radius: 0 0 12px 12px !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.driver-popover-btn {
  padding: 14px 32px !important;
  border-radius: 10px !important;
  font-weight: 600 !important;
  font-size: 1.05rem !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  border: 1px solid transparent !important;
  outline: none !important;
  visibility: visible !important;
  opacity: 1 !important;
  display: inline-block !important;
  text-shadow: none !important;
  min-width: 120px !important;
}

.driver-popover-next-btn,
.driver-popover-done-btn {
  background: #1976d2 !important;
  color: white !important;
  border-color: #1976d2 !important;
}

.driver-popover-next-btn:hover,
.driver-popover-done-btn:hover {
  background: #1565c0 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3) !important;
}

.driver-popover-prev-btn {
  background: #f5f5f5 !important;
  color: #666 !important;
  border-color: #ddd !important;
}

.driver-popover-prev-btn:hover {
  background: #e0e0e0 !important;
  border-color: #ccc !important;
}

.driver-popover-close-btn {
  color: white !important;
  font-size: 24px !important;
  position: absolute !important;
  top: 16px !important;
  right: 16px !important;
  z-index: 10 !important;
  padding: 8px !important;
  margin: 0 !important;
  background: transparent !important;
  border: none !important;
  cursor: pointer !important;
  opacity: 0.9 !important;
  transition: opacity 0.2s !important;
}

.driver-popover-close-btn:hover {
  opacity: 1 !important;
  transform: scale(1.1) !important;
}

/* 高亮元素样式 */
.driver-active-element {
  position: relative !important;
  z-index: 10000 !important;
}

.driver-highlighted-element {
  border-radius: 8px !important;
}

/* 遮罩层 */
.driver-overlay {
  background-color: rgba(0, 0, 0, 0.5) !important;
}
</style>
