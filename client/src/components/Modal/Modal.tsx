import { useEffect } from 'react'
import { createPortal } from 'react-dom'


interface ModalProps {
    children: JSX.Element
}

const el = document.createElement('div')
const modalRoot = document.getElementById('modal-root')


const Modal = ({ children }: ModalProps) => {

    useEffect(() => {
        // The portal element is inserted in the DOM tree after
        // the Modal's children are mounted, meaning that children
        // will be mounted on a detached DOM node. If a child
        // component requires to be attached to the DOM tree
        // immediately when mounted, for example to measure a
        // DOM node, or uses 'autoFocus' in a descendant, add
        // state to Modal and only render the children when Modal
        // is inserted in the DOM tree.
        modalRoot?.appendChild(el)

        return () => {
            modalRoot?.removeChild(el)
        }
    }, [])

    return (
        createPortal(children, el)
    )
}

export default Modal
