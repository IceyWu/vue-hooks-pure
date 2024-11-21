import type { Ref } from 'vue'
import { deepClone } from '@iceywu/utils'
import { ref } from 'vue'

/**
 * @description Reset ref value
 * @param value - Ref value
 * @returns [value, reset]
 * @example
 * ```ts
 * const [value, reset] = useResettaleRef({ a: 1 })
 * reset()
 * ```
 */
function useResettaleRef<T extends Record<string, any>>(value: T): [Ref, () => void] {
  const originValue = deepClone(value)
  const refValue = ref<T>(value)
  const reset = () => {
    refValue.value = deepClone(originValue)
  }
  return [refValue, reset]
}

export default useResettaleRef
