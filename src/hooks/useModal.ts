import { IModalProps } from '@/components/Modal'
import { useState, useRef } from 'react'

export interface IUseModal {
  modalProps: Pick<IModalProps, 'visible' | 'onClose' | 'onCancel' | 'okLoading' | 'payload'>
  open: (payload?: any) => void
  close: () => void
  setOkLoading: (loading: boolean) => void
  payload?: any
}

function useModal(): IUseModal {
  const [visible, setVisible] = useState(false)
  const [payload, setPayload] = useState<any>({})
  const [okLoading, setOkLoading] = useState(false)

  function onClose() {
    setVisible(false)
    setOkLoading(false)
  }
  function onCancel() {
    onClose()
  }

  function open(p) {
    setVisible(true)
    if (p) setPayload(p)
  }
  function close() {
    onClose()
  }

  return {
    modalProps: {
      visible,
      onClose,
      onCancel,
      okLoading,
      payload,
    },
    open,
    close,
    setOkLoading,
    payload,
  }
}
export default useModal
