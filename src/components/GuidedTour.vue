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

// 轮播图数据结构
interface CarouselSlide {
  image: string
  title: string
  description: string
}

// 轮播图数据
const carouselData: CarouselSlide[] = [
  {
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=180&fit=crop',
    title: '智能引导系统',
    description: '这是一个<strong>智能引导系统</strong>，帮助您快速了解页面功能。'
  },
  {
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=180&fit=crop',
    title: '多图展示',
    description: '支持<strong>图片轮播</strong>功能，在同一引导步骤中展示多张图片和说明。'
  },
  {
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=180&fit=crop',
    title: '灵活交互',
    description: '可<strong>手动切换</strong>幻灯片或等待自动播放，每5秒自动切换。'
  }
]

// 轮播状态管理
let currentSlideIndex = 0
let carouselSlides: CarouselSlide[] = []
let autoPlayInterval: number | null = null

// 初始化轮播功能
const initCarousel = (slides: CarouselSlide[]) => {
  carouselSlides = slides
  currentSlideIndex = 0
  renderCarousel()
  startAutoPlay()
}

// 渲染当前幻灯片
const renderCarousel = () => {
  const slide = carouselSlides[currentSlideIndex]
  const carouselContainer = document.querySelector('.carousel-content')

  if (carouselContainer && slide) {
    carouselContainer.innerHTML = `
      <div class="carousel-slide active">
        <h3 class="carousel-slide-title">${slide.title}</h3>
        <img src="${slide.image}" alt="${slide.title}" class="carousel-image" onerror="this.style.display='none'">
        <p class="carousel-description">${slide.description}</p>
      </div>
    `
    updateIndicators()
  } else {
    console.warn('[Carousel] Container or slide not found', {
      hasContainer: !!carouselContainer,
      hasSlide: !!slide,
      currentIndex: currentSlideIndex
    })
  }
}

// 下一张幻灯片
const nextSlide = () => {
  currentSlideIndex = (currentSlideIndex + 1) % carouselSlides.length
  renderCarousel()
}

// 上一张幻灯片
const prevSlide = () => {
  currentSlideIndex = (currentSlideIndex - 1 + carouselSlides.length) % carouselSlides.length
  renderCarousel()
}

// 跳转到指定幻灯片
const goToSlide = (index: number) => {
  currentSlideIndex = index
  renderCarousel()
  resetAutoPlay()
}

// 更新指示器
const updateIndicators = () => {
  const indicators = document.querySelectorAll('.carousel-indicator')
  indicators.forEach((indicator, index) => {
    if (index === currentSlideIndex) {
      indicator.classList.add('active')
    } else {
      indicator.classList.remove('active')
    }
  })
}

// 自动播放
const startAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
  autoPlayInterval = window.setInterval(() => {
    nextSlide()
  }, 5000) // 每5秒切换一次
}

// 重置自动播放
const resetAutoPlay = () => {
  startAutoPlay()
}

// 停止自动播放
const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

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
  smoothScroll: true,
  scrollIntoViewOptions: {
    behavior: 'smooth',
    block: 'center'
  },
  onDestroyStarted: () => {
    // 用户点击关闭或完成时
    stopAutoPlay()
    guideStore.markAsSeen(route.path)
    document.body.style.overflow = ''
    driverObj.destroy()
  },
  onHighlightStarted: () => {
    // 每次切换步骤时停止自动播放
    stopAutoPlay()
  },
  onHighlighted: () => {
    // 当步骤高亮完成后，检查是否需要初始化轮播
    const currentStep = driverObj.getActiveIndex()
    if (currentStep === 0 && route.path === '/') {
      // 延迟初始化，确保DOM已渲染
      setTimeout(() => {
        // 将轮播控制函数暴露到 window 对象
        ;(window as any).carouselNext = nextSlide
        ;(window as any).carouselPrev = prevSlide
        ;(window as any).carouselGoTo = goToSlide

        initCarousel(carouselData)
      }, 50)
    }

    // 确保弹窗在视口内可见
    setTimeout(() => {
      const popover = document.querySelector('.driver-popover') as HTMLElement
      if (popover) {
        const rect = popover.getBoundingClientRect()
        if (rect.top < 0) {
          // 如果弹窗顶部被遮挡，滚动页面
          window.scrollBy({
            top: rect.top - 20,
            behavior: 'smooth'
          })
        }
      }
    }, 100)
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
        <div class="carousel-container" style="padding: 8px 0;">
          <div class="carousel-content"></div>
          <div class="carousel-controls">
            <button class="carousel-btn carousel-prev" onclick="window.carouselPrev && window.carouselPrev()">‹</button>
            <div class="carousel-indicators">
              <span class="carousel-indicator active" onclick="window.carouselGoTo && window.carouselGoTo(0)"></span>
              <span class="carousel-indicator" onclick="window.carouselGoTo && window.carouselGoTo(1)"></span>
              <span class="carousel-indicator" onclick="window.carouselGoTo && window.carouselGoTo(2)"></span>
            </div>
            <button class="carousel-btn carousel-next" onclick="window.carouselNext && window.carouselNext()">›</button>
          </div>
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
          <div style="position: relative; width: 100%; aspect-ratio: 16/9; background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); border-radius: 8px; overflow: hidden; margin-bottom: 12px; display: flex; align-items: center; justify-content: center;">
            <img src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif"
                 alt="导航演示"
                 style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.3s ease;"
                 onload="this.style.opacity='1'; this.parentElement.querySelector('.loading-text').style.display='none';"
                 onerror="this.src='https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=180&fit=crop'; this.alt='导航示例';"
                 loading="lazy">
            <span class="loading-text" style="color: #999; font-size: 14px; pointer-events: none;">加载中...</span>
          </div>
          <ul style="margin-top: 8px; padding-left: 20px; line-height: 1.6; margin-bottom: 0;">
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

    // 首次启动时初始化轮播(等待 driver.js 渲染完成)
    setTimeout(() => {
      // 将轮播控制函数暴露到 window 对象
      ;(window as any).carouselNext = nextSlide
      ;(window as any).carouselPrev = prevSlide
      ;(window as any).carouselGoTo = goToSlide

      // 如果是首页，初始化轮播
      if (route.path === '/') {
        initCarousel(carouselData)
      }
    }, 100)
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
  position: fixed !important;
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
  padding: 16px !important;
  line-height: 1.5 !important;
  max-height: 450px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}

/* 确保弹窗不会超出视口 */
.driver-popover.driverjs-theme {
  max-height: 90vh !important;
  overflow: visible !important;
}

.driver-popover-description img {
  max-width: 100% !important;
  height: auto !important;
  border-radius: 8px !important;
  margin: 12px 0 !important;
}

/* GIF 图片特殊样式 - 仅用于非容器内的GIF */
.driver-popover-description > img[src*="giphy"],
.driver-popover-description > img[src*=".gif"] {
  max-width: 100% !important;
  max-height: 200px !important;
  width: auto !important;
  height: auto !important;
  border-radius: 8px !important;
  background: #f5f5f5 !important;
  object-fit: contain !important;
  display: block !important;
}

/* GIF 图片容器和图片样式 */
.driver-popover-description div[style*="aspect-ratio"] {
  max-height: 200px;
}

.driver-popover-description div[style*="aspect-ratio"] img {
  box-shadow: none !important;
  margin: 0 !important;
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
  box-shadow: none !important;
  position: relative !important;
}

/* 清除按钮伪元素，防止文字重影 */
.driver-popover-btn::before,
.driver-popover-btn::after {
  content: none !important;
  display: none !important;
}

.driver-popover-next-btn,
.driver-popover-done-btn {
  background: #1976d2 !important;
  color: white !important;
  border-color: #1976d2 !important;
  text-shadow: none !important;
  box-shadow: none !important;
}

.driver-popover-next-btn::before,
.driver-popover-next-btn::after,
.driver-popover-done-btn::before,
.driver-popover-done-btn::after {
  content: none !important;
  display: none !important;
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
  text-shadow: none !important;
  box-shadow: none !important;
}

.driver-popover-prev-btn::before,
.driver-popover-prev-btn::after {
  content: none !important;
  display: none !important;
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

/* 轮播组件样式 */
.carousel-container {
  position: relative;
  min-height: 280px;
  overflow: visible;
}

.carousel-content {
  position: relative;
  width: 100%;
  overflow: visible;
}

.carousel-slide {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.carousel-slide-title {
  font-size: 1.05em;
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 2px solid #e3f2fd;
}

.carousel-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin: 8px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.carousel-image:hover {
  transform: scale(1.02);
}

.carousel-description {
  color: #555;
  line-height: 1.5;
  font-size: 0.95em;
  padding: 4px 0;
  margin-bottom: 0;
}

.carousel-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.carousel-btn {
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
  line-height: 1;
  padding: 0;
}

.carousel-btn:hover {
  background: #1565c0;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
}

.carousel-btn:active {
  transform: scale(0.95);
}

.carousel-indicators {
  display: flex;
  gap: 8px;
  align-items: center;
}

.carousel-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
}

.carousel-indicator:hover {
  background: #bbb;
}

.carousel-indicator.active {
  background: #1976d2;
  width: 20px;
  border-radius: 4px;
}
</style>
