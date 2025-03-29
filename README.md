```markdown:README.md
# vue-hooks-pure

这是一个包含多个 Vue 自定义 Hook 的库，提供了 `usePopup`、`useRequest`、`useResettaleRef` 和 `useToggle` 等实用 Hook。

## 安装

```bash
npm install vue-hooks-pure
```

## 可用的 Hooks

### usePopup

`usePopup` 用于创建一个弹窗组件。

#### 使用方法

```js
import { usePopup } from 'vue-hooks-pure'
import MyComponent from './MyComponent.vue'

async function openPopup() {
  try {
    // 调用 usePopup 打开弹窗
    const result = await usePopup(MyComponent, {
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
    console.log('弹窗关闭，结果：', result)
  }
  catch (error) {
    console.error('弹窗取消：', error)
  }
}
```

### useRequest

`useRequest` 用于处理数据请求，支持加载状态、分页等功能。

```js
import { useRequest } from 'vue-hooks-pure'

async function request(params) {
  // 模拟请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: [1, 2, 3] })
    }, 1000)
  })
}

const {
  loading, // 加载状态
  result, // 请求结果
  getData, // 获取数据方法
  onRefresh, // 刷新数据
  onLoad, // 加载更多
  search, // 搜索方法
  getParamsVal // 获取参数值
} = useRequest(request, {
  target: 'list',
  listOptions: {
    defaultPage: 0,
    defaultSize: 10,
  },
})

async function loadData() {
  await getData()
}
```

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

### useToggle

`useToggle` 用于在两个状态之间切换，支持延迟和防抖。

```js
import { useToggle } from 'vue-hooks-pure'

const [value, toggle] = useToggle(false, {
  delay: 1000, // 延迟时间
  debounceVal: 400, // 防抖时间
})

function handleToggle() {
  toggle() // 切换状态
}
```
```
