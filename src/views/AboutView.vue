<template>
  <div class="page">
    <header class="header">
      <h1>关于本项目</h1>
      <button class="help-btn" @click="openHelp" title="查看引导">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>帮助</span>
      </button>
    </header>

    <main class="content">
      <section id="about-title" class="title-section">
        <h2>Vue 3 产品引导 Demo</h2>
        <p>
          本演示展示了如何在 Vue 3 项目中实现一个完整的产品导览功能，
          包括首次访问自动弹出、多页面支持、图片展示等特性。
        </p>
      </section>

      <section id="feature-list" class="features">
        <h3>功能特点</h3>
        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <h4>首次自动弹出</h4>
            <p>用户第一次访问页面时自动显示引导，完成后不再自动弹出</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📄</div>
            <h4>多页面支持</h4>
            <p>不同页面可以配置不同的引导步骤，互不干扰</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🖼️</div>
            <h4>图文并茂</h4>
            <p>每个步骤支持图片展示，更直观地传达信息</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔄</div>
            <h4>随时重看</h4>
            <p>用户可以通过帮助按钮随时重新查看引导内容</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💾</div>
            <h4>本地存储</h4>
            <p>使用 localStorage 记录用户已看过的页面，无需服务器</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">♿</div>
            <h4>无障碍支持</h4>
            <p>基于 Shepherd.js，提供良好的键盘导航和屏幕阅读器支持</p>
          </div>
        </div>
      </section>

      <section class="tech-stack">
        <h3>技术栈</h3>
        <ul>
          <li><strong>Vue 3</strong> - 渐进式 JavaScript 框架</li>
          <li><strong>TypeScript</strong> - 类型安全</li>
          <li><strong>Pinia</strong> - Vue 官方状态管理库</li>
          <li><strong>Vue Router</strong> - 官方路由管理器</li>
          <li><strong>vue-tour</strong> - 基于 Shepherd.js 的 Vue 3 导览组件</li>
          <li><strong>Vite</strong> - 下一代前端构建工具</li>
        </ul>
      </section>
    </main>

    <!-- 引导层组件 -->
    <GuidedTour ref="tourRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GuidedTour from '@/components/GuidedTour.vue'

const tourRef = ref<InstanceType<typeof GuidedTour> | null>(null)

const openHelp = (): void => {
  tourRef.value?.openTour()
}
</script>

<style scoped>
.page {
  min-height: calc(100vh - 60px);
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.header h1 {
  font-size: 2rem;
  color: #9b59b6;
}

.help-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 2px solid #9b59b6;
  color: #9b59b6;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.help-btn:hover {
  background: #9b59b6;
  color: white;
}

.content {
  max-width: 900px;
  margin: 0 auto;
}

.title-section {
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(155, 89, 182, 0.3);
}

.title-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.title-section p {
  font-size: 1.1rem;
  line-height: 1.6;
}

.features {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid #e0e0e0;
}

.features h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-item {
  padding: 1.5rem;
  border-radius: 8px;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
}

.feature-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.feature-item h4 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.feature-item p {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #666;
}

.tech-stack {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.tech-stack h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
}

.tech-stack ul {
  padding-left: 1.5rem;
}

.tech-stack li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  color: #666;
}
</style>
