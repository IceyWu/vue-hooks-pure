import { ref } from 'vue'

function useRequest() {
  const a = ref(1)
  return {
    a,
  }
}

export default useRequest
