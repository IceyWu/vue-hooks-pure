import { nextTick, onActivated, onMounted } from 'vue'

interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

/**
 * 首次挂载时执行 hook(true)，keep-alive 激活时执行 hook(false)
 */
export function useMountedOrActivated(hook: Fn) {
  let mounted: boolean
  onMounted(async () => {
    hook(true)
    await nextTick()
    mounted = true
  })
  onActivated(() => {
    if (mounted) {
      hook(false)
    }
  })
}

/**
 * 只在 keep-alive 激活时执行 hook，首次挂载不执行
 */
export function useActivatedOnly(hook: Fn) {
  let mounted: boolean
  onMounted(async () => {
    await nextTick()
    mounted = true
  })
  onActivated(() => {
    if (mounted) {
      hook()
    }
  })
}

/**
 * 分别在首次挂载和 keep-alive 激活时执行不同函数
 */
export function useMountedAndActivated(mountedFn: Fn, activatedFn: Fn) {
  let mounted: boolean
  onMounted(() => {
    mountedFn?.()
    nextTick(() => {
      mounted = true
    })
  })
  onActivated(() => {
    if (mounted) {
      activatedFn?.()
    }
  })
}

export default {
  useMountedOrActivated,
  useActivatedOnly,
  useMountedAndActivated,
}
