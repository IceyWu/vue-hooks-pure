/**
 * 用户访问相关的弹窗
 */
import { h } from 'vue'
import { domAdd } from './domAdd'

function domSet(el: HTMLDivElement) {
  el.setAttribute(
    'style',
    'position: absolute; width: 100%; height: 100vh; top: 0; left: 0; z-index: 9999;',
  )
}

function usePopup(options: any, com: any) {
  const { renderer, ...data } = options
  return new Promise(() => {
    let popupInstance: any
    const addDom = h(com as any, {
      data,
    })
    const handleClose = () => {
      popupInstance?.destroy()
    }

    popupInstance = domAdd(
      h(
        addDom,
        {
          ...data,
          onClose: handleClose,
        },
        {
          header: renderer?.header,
          default: renderer?.default,
          footer: renderer?.footer,
        },
      ),
      { domSet },
    )
    popupInstance.add()
  })
}

export default usePopup
