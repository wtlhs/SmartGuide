# 更新日志

## [1.1.0] - 2026-03-19

### ✨ 重大更新

**技术栈迁移：vue3-tour → driver.js**

#### 为什么迁移？

- ❌ vue3-tour 有 CSP (Content Security Policy) 兼容性问题
- ❌ 按钮默认隐藏，需要 hover 才显示
- ❌ 引导框定位问题，容易超出视口
- ✅ driver.js 更现代、更轻量、更稳定

#### 新特性

- ✅ **零依赖问题** - driver.js 无 CSP 问题
- ✅ **按钮一直可见** - 不需要 hover
- ✅ **智能定位** - 自动调整位置避免溢出
- ✅ **更大的按钮** - 更好的用户体验
- ✅ **优化的关闭按钮** - 不再和标题重叠
- ✅ **渐变标题** - 更美观的视觉效果

#### 改进

- 📦 **更小的体积** - driver.js 更轻量
- 🎨 **更好的样式控制** - 完全自定义外观
- 🚀 **更快的性能** - 零依赖
- 📱 **更好的移动端适配** - 响应式定位

### 🔧 技术细节

**替换的依赖：**
- 移除: `vue3-tour@1.0.3`
- 新增: `driver.js@1.0.0`

**核心变化：**
- 重写 `GuidedTour.vue` 组件
- 更新引导步骤配置格式
- 优化样式覆盖方式
- 移除 vue3-tour 相关导入

### 📝 文档更新

- ✅ 更新 README.md - 反映 driver.js
- ✅ 更新 INTEGRATION.md - 新的集成指南
- ✅ 删除冗余文档 - 保持简洁

---

## [1.0.0] - 2026-03-19

### ✨ 初始版本

**基于 vue3-tour 的产品引导系统**

#### 功能

- ✅ 首次访问自动弹出
- ✅ 状态持久化
- ✅ 多页面支持
- ✅ 图文并茂
- ✅ 帮助按钮重新打开
- ✅ Emoji 图标
- ✅ Unsplash 图片

#### 技术栈

- Vue 3 + TypeScript
- Pinia 状态管理
- Vue Router
- vue3-tour
- Vite

---

## 升级指南

### 从 vue3-tour 升级到 driver.js

1. **卸载旧依赖**
   ```bash
   npm uninstall vue3-tour
   ```

2. **安装新依赖**
   ```bash
   npm install driver.js
   ```

3. **更新组件**
   - 替换 `src/components/GuidedTour.vue`
   - 更新 `src/main.ts`（移除 vue3-tour 导入）

4. **更新样式**
   - 移除 vue3-tour 的样式覆盖
   - 添加 driver.js 的样式自定义

5. **测试**
   - 清除 localStorage
   - 验证引导流程
   - 检查多页面支持

---

**详细集成指南请查看 [INTEGRATION.md](./INTEGRATION.md)**
