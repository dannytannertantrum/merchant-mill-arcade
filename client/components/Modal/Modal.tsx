import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'


interface ModalProps {
    children: JSX.Element
}

const Modal = ({ children }: ModalProps) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        return () => setMounted(false)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        createPortal(children, document.querySelector('#modal-root'))
    )
}

export default Modal
