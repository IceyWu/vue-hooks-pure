import type { Ref } from 'vue'
import { debounce, isBoolean } from '@iceywu/utils'
import { ref } from 'vue'

interface UseToggleOptions {
  delay?: number
  debounceVal?: number
}

/**
 * @description Toggle value
 * @param initialValue - Initial value
 * @param options - Options
 * @param options.delay - Delay time
 * @param options.debounceVal - Debounce time
 * @returns [value, toggle]
 * @example
 * ```ts
 * const [value, toggle] = useToggle()
 * toggle()
 * ```
 */
function useToggle(
  initialValue: boolean = false,
  options: UseToggleOptions = {},
): [Ref<boolean>, (value?: boolean) => void] {
  const { delay = 0, debounceVal = 400 } = options
  const value = ref(initialValue)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const toggleFn = (val?: boolean) => {
    if (isBoolean(val)) {
      value.value = val
    }
    else {
      value.value = !value.value
    }
  }

  const handleToggle = (val?: boolean) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    if (delay) {
      const delayVal = delay - debounceVal > 0 ? delay - debounceVal : delay
      timeoutId = setTimeout(() => {
        toggleFn(val)
        timeoutId = null
      }, delayVal)
    }
    else {
      toggleFn(val)
    }
  }

  const toggle = delay === 0 ? handleToggle : debounce(handleToggle, debounceVal)

  return [value, toggle]
}

export default useToggle
