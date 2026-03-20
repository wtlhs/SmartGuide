<template>
  <div class="page">
    <header class="header">
      <h1>首页</h1>
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
      <!-- 引导目标元素 -->
      <section id="welcome-banner" class="banner">
        <h2>欢迎使用新功能</h2>
        <p>
          我们刚刚发布了一系列激动人心的新功能，帮助您更高效地完成工作。
          点击下方的按钮开始探索吧！
        </p>
      </section>

      <button id="action-button" class="action-btn">
        开始使用新功能
      </button>

      <section class="info">
        <h3>使用说明</h3>
        <ul>
          <li>首次访问此页面会自动弹出引导</li>
          <li>完成引导后，下次访问不会再自动弹出</li>
          <li>点击右上角的"帮助"按钮可以随时重新查看引导</li>
          <li>切换到"关于"页面会看到不同的引导内容</li>
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
  color: #1976d2;
}

.help-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 2px solid #1976d2;
  color: #1976d2;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.help-btn:hover {
  background: #1976d2;
  color: white;
}

.content {
  max-width: 800px;
  margin: 0 auto;
}

.banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.banner h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.banner p {
  font-size: 1.1rem;
  line-height: 1.6;
}

.action-btn {
  width: 100%;
  padding: 1.2rem 2rem;
  font-size: 1.2rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  margin-bottom: 2rem;
}

.action-btn:hover {
  background: #1565c0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.info {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.info h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
}

.info ul {
  padding-left: 1.5rem;
}

.info li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  color: #666;
}
</style>
