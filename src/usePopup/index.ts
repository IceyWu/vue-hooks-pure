import type { Component } from 'vue'
import { h } from 'vue'
import { domAdd } from './domAdd'

interface Renderer {
  header?: () => any
  default?: () => any
  footer?: () => any
}
interface DomSetOptions {
  alignCenter?: boolean
  modal?: boolean
  modalColor?: string
}

interface PopupOptions extends DomSetOptions {
  renderer?: Renderer
  [key: string]: any
}

interface PopupInstance {
  add: () => void
  destroy: () => void
  close: () => void
}

function domSet(el: HTMLDivElement, options?: DomSetOptions) {
  const { alignCenter = true, modal = true, modalColor } = options || {}
  if (alignCenter) {
    el.style.display = 'flex'
    el.style.justifyContent = 'center'
    el.style.alignItems = 'center'
  }
  if (modal) {
    el.style.position = 'absolute'
    el.style.width = '100%'
    el.style.height = '100vh'
    el.style.top = '0'
    el.style.left = '0'
    el.style.zIndex = '9999'
    el.style.backgroundColor = modalColor || 'rgba(0, 0, 0, 0.5)'
  }
}

/**
 * @description Popup
 * @param com - Component
 * @param options - Options
 * @param options.renderer - Renderer
 * @param options.alignCenter - Align center
 * @param options.modal - Modal
 * @param options.modalColor - Modal color
 * @returns Promise
 * @example
 */
function usePopup(com: Component, options: PopupOptions = {}) {
  const { renderer, alignCenter = true, modal = true, modalColor, ...data } = options
  return new Promise((resolve, reject) => {
    let popupInstance: PopupInstance | null = null
    const addDom = h(com, {
      data,
    })
    const handleClose = () => {
      popupInstance?.destroy()
    }
    const handleCancel = () => {
      popupInstance?.destroy()
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('cancel')
    }
    const handleOk = () => {
      resolve({
        done: popupInstance?.destroy,
        data,
      })
    }

    popupInstance = domAdd(
      h(
        addDom,
        {
          ...data,
          onClose: handleClose,
          onCancel: handleCancel,
          onOk: handleOk,
        },
        {
          header: renderer?.header,
          default: renderer?.default,
          footer: renderer?.footer,
        },
      ),
      { domSet: (el: HTMLDivElement) => domSet(el, { alignCenter, modal, modalColor }),

      },
    )
    popupInstance.add()
    resolve(popupInstance)
  })
}

export default usePopup
