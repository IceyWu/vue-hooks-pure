# vue-hooks-pure

这是一个包含多个 Vue 自定义 Hook 的库，提供了 `useRequest`、`useResettableRef`、`useToggle`、`usePopup` 和 `useKeepAliveLifecycle` 等实用 Hook。

## 安装

```bash
npm install vue-hooks-pure
```

## 可用的 Hooks

---

### useRequest

`useRequest` 用于处理数据请求，支持加载状态、分页、刷新、加载更多等功能。

#### 基本用法

```js
import { useRequest } from 'vue-hooks-pure'

// 定义你的请求函数，返回 Promise
async function request(params) {
  // 这里可以是 axios/fetch 等
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: [1, 2, 3], total: 3 })
    }, 1000)
  })
}

// 基础用法
const {
  loading, // Ref<boolean>，加载状态
  result, // Ref<any>，请求结果
  getData, // 获取数据方法
  onRefresh, // 刷新数据
  onLoad, // 加载更多
  search, // 查询条件 Ref（用于传递额外的接口参数）
  getParamsVal, // 获取当前参数
} = useRequest(request, {
  target: 'list',
  // 都是可选参数
  listOptions: {
    defaultPage: 0, // 默认页码
    defaultSize: 10, // 默认每页数量
    defaultPageKey: 'page', // 页码参数名
    defaultSizeKey: 'size', // 每页数量参数名
    defaultDataKey: 'data', // 数据字段名
    defaultTotalKey: 'total', // 总数字段名
    defaultLoadingKey: 'loading', // loading 字段名
    defaultFinishedKey: 'finished', // finished 字段名
    defaultRefreshKey: 'refreshing', // refreshing 字段名
    default: [], // 数据默认值
    getLength: data => data.length, // 自定义获取数据长度
    getTotal: res => res.total, // 自定义获取总数
    getFinished: (data, total) => data.length >= total, // 自定义判断是否加载完
  },
  loadingDelay: 300, // 可选：loading 延迟
  onRequestEnd: (err, resData) => {
    // 可选：请求结束回调
    if (err) {
      // 错误处理
      console.error('请求出错:', err)
      return
    }
    // 正常处理
    console.log('请求结果:', resData)
  },
})

// 主动获取数据
getData()

// 刷新数据（可选参数 isReload，true 时重置参数）
onRefresh()

// 加载更多（可选参数 isReload，true 时重新加载）
onLoad()

// 获取当前请求参数
const params = getParamsVal()
```

#### 进阶用法

- 支持传入返回请求函数的函数（如依赖外部变量时）：

```js
const { loading, result, getData } = useRequest(
  () => () => fetchListApi(params),
  { target: 'list' }
)
```

- 支持自定义数据处理：

```js
const { result } = useRequest(request, {
  getVal: res => res.data.list, // 只取接口返回的 list 字段
})
```

**方法补充说明：**

- `getData(reloadSize)`：获取数据，reloadSize 可指定一次性加载多少条
- `onRefresh(isReload)`：刷新数据，isReload=true 时重置参数
- `onLoad(isReload)`：加载更多，isReload=true 时重新加载
- `getParamsVal(reloadSize)`：获取当前请求参数

---

### useResettableRef

`useResettableRef` 提供一个可重置的 ref。

```js
import { useResettableRef } from 'vue-hooks-pure'

const initialValue = { count: 0 }
const [refValue, reset] = useResettableRef(initialValue)

function increment() {
  refValue.value.count++
}

function resetValue() {
  reset() // 重置为初始值
}
```

**方法补充：**

- `reset()`：重置 ref 为初始值

---

### useToggle

`useToggle` 用于在两个状态之间切换，支持延迟和防抖。

```js
import { useToggle } from 'vue-hooks-pure'

const [value, toggle, setValue] = useToggle(false, {
  delay: 1000, // 延迟切换时间（毫秒）
  debounceVal: 400, // 防抖时间（毫秒）
})

function handleToggle() {
  toggle() // 切换状态
}

// 也可以直接设置状态
setValue(true)
```

**方法补充：**

- `toggle()`：切换状态
- `setValue(val)`：直接设置状态

---

### usePopup

`usePopup` 用于创建一个弹窗组件。

#### 使用方法

```js
import { usePopup } from 'vue-hooks-pure'
import MyComponent from './MyComponent.vue'

async function openPopup() {
  try {
    // 调用 usePopup 打开弹窗
    const popup = usePopup(MyComponent, {
      renderer: {
        // 弹窗标题
        header: () => <h1>弹窗标题</h1>,
        // 弹窗内容
        default: () => <p>弹窗内容</p>,
        // 弹窗底部按钮
        footer: () => <button>关闭</button>,
      },
      // 弹窗是否居中显示
      alignCenter: true,
      // 是否显示遮罩层
      modal: true,
      // 遮罩层颜色
      modalColor: 'rgba(0, 0, 0, 0.5)',
    })
    popup.add() // 显示弹窗
    // popup.close()  // 关闭弹窗
    // popup.destroy()// 销毁弹窗
  }
  catch (error) {
    console.error('弹窗取消：', error)
  }
}
```

**方法补充：**

- `popup.add()`：显示弹窗
- `popup.close()`：关闭弹窗
- `popup.destroy()`：销毁弹窗

---

### useKeepAliveLifecycle

`useKeepAliveLifecycle` 用于在 keep-alive 组件中监听激活和失活生命周期。

#### 使用方法

```js
// 只在首次挂载和 keep-alive 激活时分别执行
import {
  useActivatedOnly,
  useMountedAndActivated,
  useMountedOrActivated,
} from 'vue-hooks-pure'

// 1. 首次挂载时执行 hook(true)，keep-alive 激活时执行 hook(false)
useMountedOrActivated((isMounted) => {
  if (isMounted) {
    // 首次挂载时
  }
  else {
    // keep-alive 激活时
  }
})

// 2. 只在 keep-alive 激活时执行 hook，首次挂载不执行
useActivatedOnly(() => {
  // keep-alive 激活时
})

// 3. 分别在首次挂载和 keep-alive 激活时执行不同函数
useMountedAndActivated(
  () => {
    // 首次挂载时
  },
  () => {
    // keep-alive 激活时
  }
)
```

**方法补充：**

- `useMountedOrActivated(fn)`：首次挂载和 keep-alive 激活时分别执行
- `useActivatedOnly(fn)`：只在 keep-alive 激活时执行
- `useMountedAndActivated(mountedFn, activatedFn)`：首次挂载和激活时分别执行不同函数

---

## 目录

- [usePopup](#usepopup)
- [useRequest](#userequest)
- [useResettableRef](#useresettableref)
- [useToggle](#usetoggle)
- [useKeepAliveLifecycle](#usekeepalivelifecycle)

---

如需更多用法和参数说明，请查阅源码或补充文档。
