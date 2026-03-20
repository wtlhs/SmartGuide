# SmartGuide

一个基于 Vue 3 + TypeScript + Vite 的智能产品引导系统,使用 **driver.js** 实现。

## ✨ 核心特性

- ✅ **首次自动弹出** - 用户第一次访问时自动显示引导
- ✅ **状态持久化** - 完成后不再自动弹出
- ✅ **多页面支持** - 不同页面配置不同引导步骤
- ✅ **图文并茂** - 支持图片和富文本内容
- ✅ **帮助按钮** - 随时重新查看引导
- ✅ **零依赖问题** - 使用 driver.js，无 CSP 问题
- ✅ **响应式设计** - 自适应位置，不会撑开页面

## 🚀 快速开始

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问：**http://localhost:5176/**

### 体验流程

1. **访问首页** - 自动弹出 5 步引导
2. **完成引导** - 点击"下一步"或关闭按钮
3. **刷新页面** - 不再自动弹出
4. **点击"帮助"按钮** - 随时重新查看
5. **访问"关于"页面** - 体验不同的引导

## 🛠️ 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全
- **Pinia** - Vue 官方状态管理库
- **Vue Router** - 官方路由管理器
- **driver.js** - 轻量级引导库
- **Vite** - 下一代前端构建工具

## 📁 项目结构

```
src/
├── components/
│   └── GuidedTour.vue        # 引导组件
├── router/
│   └── index.ts              # 路由配置
├── stores/
│   └── guideStore.ts         # Pinia 状态管理
├── views/
│   ├── HomeView.vue          # 首页
│   └── AboutView.vue         # 关于页
├── App.vue                   # 根组件
└── main.ts                   # 入口文件
```

## 🔧 核心实现

### 1. 状态管理 (guideStore.ts)

使用 Pinia + localStorage 管理引导状态：

```typescript
const seen = ref<Record<string, boolean>>({})

const markAsSeen = (path: string) => {
  seen.value = { ...seen.value, [path]: true } // 不可变更新
  localStorage.setItem('guide-seen', JSON.stringify(seen.value))
}
```

### 2. 引导组件 (GuidedTour.vue)

使用 driver.js 创建引导：

```typescript
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const driverObj = driver({
  showProgress: true,
  nextBtnText: '下一步',
  prevBtnText: '上一步',
  doneBtnText: '完成',
  onDestroyStarted: () => {
    guideStore.markAsSeen(route.path)
    driverObj.destroy()
  },
  steps: []
})
```

### 3. 步骤配置

```typescript
const steps = [
  {
    element: '#welcome-banner',
    popover: {
      title: '👋 欢迎使用',
      description: '<div>内容支持 HTML 和图片</div>',
      side: 'bottom',
      align: 'center'
    }
  }
]
```

## 📖 引导流程

### 首页（5 步）
1. 👋 欢迎页面
2. 📍 导航栏
3. 🚀 操作按钮
4. 📖 使用说明
5. ❓ 帮助按钮

### 关于页（3 步）
1. ℹ️ 关于项目
2. ⭐ 核心功能
3. 🛠️ 技术栈

## 🎨 自定义样式

在 `GuidedTour.vue` 的 `<style>` 中覆盖样式：

```css
.driver-popover {
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
}

.driver-popover-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.driver-popover-btn {
  padding: 14px 32px !important;
  font-size: 1.05rem !important;
}
```

## 💡 扩展建议

### 动态加载步骤

```typescript
const loadSteps = async () => {
  const response = await fetch('/api/tour-steps')
  return await response.json()
}
```

### 多语言支持

```typescript
{
  popover: {
    title: t('tour.welcome.title'),
    description: t('tour.welcome.description')
  }
}
```

### 权限控制

```typescript
const steps = allSteps.filter(step =>
  hasPermission(step.requiredRole)
)
```

## 📝 集成到现有项目

查看 [INTEGRATION.md](./INTEGRATION.md) 了解如何集成到你的项目。

## 🔐 编码规范

- ✅ **不可变数据** - 使用展开运算符创建新对象
- ✅ **小文件** - 每个文件职责单一
- ✅ **错误处理** - localStorage 操作有 try/catch
- ✅ **类型安全** - 完整的 TypeScript 类型

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📝 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解最新更新和技术栈变更。
