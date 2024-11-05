import type { Ref } from 'vue'
import type { ParamsObj } from './utils'
import { getObjVal, to } from '@iceywu/utils'
import { reactive, ref } from 'vue'
import { baseDefaultPageKey } from './utils'

interface RequestResult {
  loading: Ref<boolean>
  result: any
  getData: (reloadSize?: number) => Promise<void>
  onRefresh: (isReload?: boolean) => Promise<void>
  onLoad: (isReload?: boolean) => Promise<void>
}

interface Request {
  (other?: any): Promise<any>
}

function getListLength(data: any) {
  return data.length
}
function getListFinished(data: any, totalNums: number) {
  return data.length >= totalNums
}
function getListVal(data: any) {
  return data
}

interface ListOptions {
  getLength?: (data: any) => number
  getFinished?: (data: any) => boolean
  getVal?: (data: any) => any
  default?: any
  defaultPageKey?: string
  defaultSizeKey?: string
  defaultDataKey?: string
  defaultLoadingKey?: string
  defaultFinishedKey?: string
  defaultTotalKey?: string
  defaultRefreshKey?: string
}
interface Options {
  target?: string
  listOptions?: ListOptions
}

function useRequest(request: Request, options: Options = { target: 'list' }): RequestResult {
  /**
   * 查询条件
   */
  const search = ref({})

  const result = ref<any>({

  })
  const loading = ref(false)
  const paramsObj = reactive<ParamsObj>({
    page: 0,
    size: 10,
  })

  const setListRefVal = (target: 'data' | 'loading' | 'finished' | 'refreshing' | 'total', val: any, isGet?: boolean) => {
    const { defaultDataKey, defaultLoadingKey, defaultFinishedKey, defaultTotalKey, defaultRefreshKey } = getObjVal(options, 'listOptions', {})
    switch (target) {
      case 'data': {
        const dataKey = defaultDataKey || 'data'

        if (isGet)
          return result.value[dataKey]
        else
          result.value[dataKey] = val
        break
      }
      case 'loading': {
        const loadingKey = defaultLoadingKey || 'loading'
        if (isGet)
          return result.value[loadingKey]
        else
          result.value[loadingKey] = val
        break
      }
      case 'finished': {
        const finishedKey = defaultFinishedKey || 'finished'
        if (isGet)
          return result.value[finishedKey]
        else
          result.value[finishedKey] = val
        break
      }
      case 'refreshing': {
        const refreshingKey = defaultRefreshKey || 'refreshing'

        if (isGet)
          return result.value[refreshingKey]
        else
          result.value[refreshingKey] = val
        break
      }
      case 'total': {
        const totalKey = defaultTotalKey || 'total'

        if (isGet)
          return result.value[totalKey]
        else
          result.value[totalKey] = val
        break
      }
    }
  }
  const getListRefVal = (target: 'data' | 'loading' | 'finished' | 'refreshing' | 'total') => {
    return setListRefVal(target, undefined, true)
  }

  const getParamsVal = (reloadSize?: number) => {
    const params: any = {
    }
    const { defaultPageKey, defaultSizeKey } = getObjVal(options, 'listOptions', {})
    const page_key = defaultPageKey || baseDefaultPageKey.page
    const size_key = defaultSizeKey || baseDefaultPageKey.size

    params[page_key] = paramsObj.page
    params[size_key] = paramsObj.size

    if (reloadSize) {
      params[page_key] = 0
      params[size_key] = reloadSize
    }

    const tempParams = { ...params, ...search.value }
    return tempParams
  }
  /**
   * 数据初始化
   */
  function initData() {
    setListRefVal('loading', false)
    setListRefVal('refreshing', false)
    setListRefVal('refreshing', true)
    setListRefVal('finished', false)
    setListRefVal('data', [])
    loading.value = false
    paramsObj.page = 0
    paramsObj.size = 10
  }
  /**
   * 加载数据
   * @param isReload 是否重新加载
   */
  async function onLoad(isReload = false) {
    result.value

    if (getListRefVal('loading') || getListRefVal('finished') || loading.value)
      return
    const totalNumTemp = getListRefVal('data').length || 0
    if (isReload && totalNumTemp > 0) {
      return await getData(totalNumTemp)
    }
    else {
      paramsObj.page++
      return await getData()
    }
  }
  async function onRefresh(isReload = false) {
    if (!isReload) {
    // 参数重置
      initData()
    }
    else {
      setListRefVal('loading', false)
      setListRefVal('finished', false)
      loading.value = false
    }
    return await onLoad(isReload)
  }

  async function getData(reloadSize?: number) {
    // 加载状态
    setListRefVal('loading', true)
    loading.value = true
    const { target, listOptions } = options

    const { getLength = getListLength, getFinished = getListFinished, getVal = getListVal } = getObjVal(options, 'listOptions', {})
    const tempParams = getParamsVal(reloadSize)

    const [err, resData = []] = await to(request(tempParams))

    const listData = getVal(resData)
    if (target === 'list') {
      if (getListRefVal('refreshing')) {
        setListRefVal('data', listOptions?.default || [])
        setListRefVal('refreshing', false)
      }
      const totalNums = getLength(listData) || 0
      setListRefVal('total', totalNums)
      const tempList = listData || []
      if (reloadSize) {
        setListRefVal('data', tempList)
      }
      else {
        const newList = getListRefVal('data').concat(tempList || [])
        setListRefVal('data', newList)
      }
      setListRefVal('finished', getFinished(listData, totalNums))
    }

    if (err) {
      setListRefVal('finished', true)
    }
    // 加载状态停止
    setListRefVal('loading', false)
    loading.value = false
  }

  return {
    loading,
    result,
    getData,
    onRefresh,
    onLoad,
  }
}

export default useRequest
