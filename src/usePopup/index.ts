import type { Component } from 'vue'
import { h } from 'vue'
import { domAdd } from './domAdd'

interface Renderer {
  header?: () => any
  default?: () => any
  footer?: () => any
}

interface PopupOptions {
  renderer?: Renderer
  [key: string]: any
}
interface PopupInstance {
  add: () => void
  destroy: () => void
  close: () => void
}

function domSet(el: HTMLDivElement) {
  el.setAttribute(
    'style',
    'position: absolute; width: 100%; height: 100vh; top: 0; left: 0; z-index: 9999;',
  )
}

function usePopup(com: Component, options: PopupOptions = {}) {
  const { renderer, ...data } = options
  return new Promise((resolve) => {
    let popupInstance: PopupInstance | null = null
    const addDom = h(com, {
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
    resolve(popupInstance)
  })
}

export default usePopup
