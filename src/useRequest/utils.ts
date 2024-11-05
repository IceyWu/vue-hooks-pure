export interface ListObj {
  data: any[]
  loading: boolean
  finished: boolean
  refreshing: boolean
  total?: number
}
export interface ParamsObj {
  page: number
  size: number
}

export const baseDefaultPageKey = {
  page: 'page',
  size: 'size',
}
