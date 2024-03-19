'use client'
import { useState, useEffect } from 'react'
import ProModal from './ProModal'

const ModalProvider = () => {

  const [isMounted, setisMounted] = useState(false)

  useEffect(() => {
    setisMounted(true)
  }, [])

  if (!isMounted) return null


  return (
    <div>
      <ProModal />
    </div>
  )
}

export default ModalProvider
