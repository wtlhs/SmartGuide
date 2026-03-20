/**
 * 引导状态管理
 *
 * 使用 Pinia 管理用户是否已看过某个路径的引导
 * 数据持久化到 localStorage
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGuideStore = defineStore('guide', () => {
  // 存储每个路径是否已看过引导
  // key: 路径 (如 '/'), value: 是否已看过
  const seen = ref<Record<string, boolean>>({})

  /**
   * 初始化：从 localStorage 读取已看过的记录
   * 自动在 store 创建时调用
   */
  const init = (): void => {
    try {
      const raw = localStorage.getItem('guide-seen')
      if (raw) {
        const parsed = JSON.parse(raw)
        // 简单的类型校验
        if (typeof parsed === 'object' && parsed !== null) {
          seen.value = parsed
        }
      }
    } catch (error) {
      console.warn('[GuideStore] 解析 guide-seen 失败:', error)
      seen.value = {}
    }
  }

  // 自动初始化
  init()

  /**
   * 标记某个路径为已看过
   * 使用不可变更新
   */
  const markAsSeen = (path: string): void => {
    if (!path || typeof path !== 'string') {
      console.warn('[GuideStore] markAsSeen: 无效的路径参数')
      return
    }

    // 不可变更新
    seen.value = { ...seen.value, [path]: true }

    try {
      localStorage.setItem('guide-seen', JSON.stringify(seen.value))
    } catch (error) {
      console.error('[GuideStore] 持久化 guide-seen 失败:', error)
    }
  }

  /**
   * 检查某个路径是否已看过
   */
  const isSeen = (path: string): boolean => {
    if (!path || typeof path !== 'string') {
      return false
    }
    return !!seen.value[path]
  }

  /**
   * 清除所有记录（用于测试）
   */
  const clear = (): void => {
    seen.value = {}
    try {
      localStorage.removeItem('guide-seen')
    } catch (error) {
      console.error('[GuideStore] 清除 guide-seen 失败:', error)
    }
  }

  return {
    seen,
    init,
    markAsSeen,
    isSeen,
    clear
  }
})
