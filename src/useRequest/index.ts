import type { Ref } from 'vue'
import type { ParamsObj } from './utils'
import { getObjVal, isFunction, to } from '@iceywu/utils'
import { reactive, ref } from 'vue'
import { baseDefaultPageKey } from './utils'

interface RequestResult {
  loading: Ref<boolean>
  result: any
  search: any
  getData: (reloadSize?: number) => Promise<void>
  onRefresh: (isReload?: boolean) => Promise<void>
  onLoad: (isReload?: boolean) => Promise<void>
  getParamsVal: (reloadSize?: number) => any
}

interface Request {
  (other?: any): Promise<any>
}

function getListLength(data: any) {
  return data?.length || 0
}
function getListFinished(data: any, totalNums: number) {
  return data?.length >= totalNums
}
function getListVal(data: any) {
  return data
}

interface ListOptions {
  getLength?: (data: any) => number
  getTotal?: (data: any) => number
  getFinished?: (data: any, total: any) => boolean
  default?: any
  defaultPageKey?: string
  defaultSizeKey?: string
  defaultDataKey?: string
  defaultLoadingKey?: string
  defaultFinishedKey?: string
  defaultTotalKey?: string
  defaultRefreshKey?: string
  defaultPage?: number
  defaultSize?: number
}
interface Options {
  target?: string
  listOptions?: ListOptions
  getVal?: (data: any) => any
  loadingDelay?: number
  // 新增请求结束回调
  onRequestEnd?: (err: any, resData: any) => void
}

/**
 * @description useRequest
 * @param request - 请求函数或者返回请求函数的函数
 * @param options - Options
 * @param options.target - Target
 * @param options.listOptions - List options
 * @param options.getVal - Get value
 * @param options.loadingDelay - Loading delay
 * @returns RequestResult
 * @example
 * ```ts
 * // 旧方式
 * const { loading, result, getData, onRefresh, onLoad, search } = useRequest(request)
 * // 新方式
 * const { loading, result, getData, onRefresh, onLoad, search } = useRequest(() => newRequest)
 * ```
 */
function useRequest(
  request: Request | (() => Request),
  options: Options = { target: 'list' },
): RequestResult {
  /**
   * 查询条件
   */
  const search = ref({})

  const result = ref<any>({})
  const loading = ref(false)
  const paramsObj = reactive<ParamsObj>({
    page: 0,
    size: 10,
  })

  const setListRefVal = (
    target: 'data' | 'loading' | 'finished' | 'refreshing' | 'total',
    val: any,
    isGet?: boolean,
  ) => {
    const {
      defaultDataKey,
      defaultLoadingKey,
      defaultFinishedKey,
      defaultTotalKey,
      defaultRefreshKey,
    } = getObjVal(options, 'listOptions', {})

    if (!result.value) {
      result.value = {}
    }

    switch (target) {
      case 'data': {
        const dataKey = defaultDataKey || 'data'

        if (isGet) {
          return result.value[dataKey]
        }
        else {
          result.value[dataKey] = val
        }
        break
      }
      case 'loading': {
        const loadingKey = defaultLoadingKey || 'loading'
        if (isGet) {
          return result.value[loadingKey]
        }
        else {
          if (val === false) {
            result.value[loadingKey] = val
            loading.value = val
          }
          else {
            result.value[loadingKey] = val
            loading.value = val
          }
        }
        break
      }
      case 'finished': {
        const finishedKey = defaultFinishedKey || 'finished'
        if (isGet)
          return result.value[finishedKey]
        else result.value[finishedKey] = val
        break
      }
      case 'refreshing': {
        const refreshingKey = defaultRefreshKey || 'refreshing'

        if (isGet)
          return result.value[refreshingKey]
        else result.value[refreshingKey] = val
        break
      }
      case 'total': {
        const totalKey = defaultTotalKey || 'total'

        if (isGet)
          return result.value[totalKey]
        else result.value[totalKey] = val
        break
      }
    }
  }
  const getListRefVal = (
    target: 'data' | 'loading' | 'finished' | 'refreshing' | 'total',
  ) => {
    return setListRefVal(target, undefined, true)
  }

  const getParamsVal = (reloadSize?: number) => {
    const params: any = {}
    const requestTarget = getObjVal(options, 'target')

    if (requestTarget === 'list') {
      const { defaultPageKey, defaultSizeKey } = getObjVal(
        options,
        'listOptions',
        {},
      )
      const page_key = defaultPageKey || baseDefaultPageKey.page
      const size_key = defaultSizeKey || baseDefaultPageKey.size

      params[page_key] = paramsObj.page
      params[size_key] = paramsObj.size

      if (reloadSize) {
        params[page_key] = 0
        params[size_key] = reloadSize
      }
    }

    const tempParams = { ...params, ...search.value }
    return tempParams
  }
  /**
   * 数据初始化
   */
  function initData() {
    const requestTarget = getObjVal(options, 'target')
    if (requestTarget === 'list') {
      const { defaultPage, defaultSize } = getObjVal(options, 'listOptions', {})
      setListRefVal('loading', false)
      setListRefVal('refreshing', false)
      setListRefVal('refreshing', true)
      setListRefVal('finished', false)
      setListRefVal('data', [])
      paramsObj.page = defaultPage ?? -1
      paramsObj.size = defaultSize ?? 10
    }
    else {
      result.value = {}
    }
  }
  /**
   * 加载数据
   * @param isReload 是否重新加载
   */
  async function onLoad(isReload = false) {
    const requestTarget = getObjVal(options, 'target')
    if (requestTarget === 'list') {
      if (
        getListRefVal('loading')
        || getListRefVal('finished')
        || loading.value
      ) {
        return
      }
      const totalNumTemp = getListRefVal('data')?.length || 0
      if (isReload && totalNumTemp > 0) {
        return await getData(totalNumTemp)
      }
      else {
        paramsObj.page++
        return await getData()
      }
    }
    else {
      return await getData()
    }
  }
  async function onRefresh(isReload = false) {
    if (getListRefVal('refreshing') || loading.value) {
      return
    }
    if (!isReload) {
      // 参数重置
      initData()
    }
    else {
      setListRefVal('loading', false)
      setListRefVal('finished', false)
    }
    return await onLoad(isReload)
  }

  // 提取公共的延迟处理函数
  function handleDelay(
    callback: () => void,
    defaultDelay: number,
    onRequestEnd?: (err: any, resData: any) => void,
    err?: any,
    resData?: any,
  ) {
    if (defaultDelay !== 0) {
      setTimeout(() => {
        callback()
        if (onRequestEnd) {
          onRequestEnd(err, resData)
        }
      }, defaultDelay)
    }
    else {
      callback()
      if (onRequestEnd) {
        onRequestEnd(err, resData)
      }
    }
  }

  async function getData(reloadSize?: number) {
    // 加载状态
    const { target, listOptions, onRequestEnd } = options
    if (target === 'list') {
      setListRefVal('loading', true)
    }
    else {
      loading.value = true
    }
    const tempParams = getParamsVal(reloadSize)
    // 获取实际的请求函数
    let actualRequest: Request
    if (isFunction(request) && request.length === 0) {
    // 如果函数不接受参数，认为它是返回请求函数的函数
      const result = request()
      if (typeof result === 'function') {
        actualRequest = result
      }
      else {
        console.error('request 函数返回值不是一个可调用的函数')
        return
      }
    }
    else {
    // 否则认为它是普通的请求函数
      actualRequest = request as Request
    }

    const [err, resData = []] = await to(actualRequest(tempParams))

    const { getVal = getListVal } = options || {}

    const listData = getVal(resData)

    // 列表情况
    if (target === 'list') {
      const { getFinished = getListFinished, getTotal = getListLength } = getObjVal(
        options,
        'listOptions',
        {},
      )
      if (getListRefVal('refreshing')) {
        setListRefVal('data', listOptions?.default || [])
      }
      const totalNums = getTotal(resData) || 0
      setListRefVal('total', totalNums)
      const tempList = listData || []
      if (reloadSize) {
        const defaultDelay = getObjVal(options, 'loadingDelay', 0) || 0
        handleDelay(() => {
          setListRefVal('data', tempList)
          setListRefVal('loading', false)
          setListRefVal('refreshing', false)
        }, defaultDelay, onRequestEnd, err, resData)
      }
      else {
        const oldList = getListRefVal('data') || []
        const newList = oldList?.concat(tempList || [])
        const defaultDelay = getObjVal(options, 'loadingDelay', 0) || 0
        handleDelay(() => {
          setListRefVal('data', newList)
          setListRefVal('loading', false)
          setListRefVal('refreshing', false)
        }, defaultDelay, onRequestEnd, err, resData)
      }
      const totalList = setListRefVal('data', undefined, true)
      setListRefVal('finished', getFinished(totalList, totalNums))
    }
    // 其他情况
    else {
      const defaultDelay = getObjVal(options, 'loadingDelay', 0) || 0
      handleDelay(() => {
        result.value = listData
        loading.value = false // 仅更新 loading 状态
      }, defaultDelay, onRequestEnd, err, resData)
    }

    if (err || target !== 'list') {
      // 结束状态
      if (target === 'list') {
        setListRefVal('finished', true)
      }
    }
  }

  return {
    loading,
    result,
    getData,
    onRefresh,
    onLoad,
    search,
    getParamsVal,
  }
}

export default useRequest
