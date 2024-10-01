import React, { forwardRef, Ref } from 'react'
import styles from './index.module.scss'

type Props = {
  left?: boolean
  right?: boolean
  className?: string
  children: React.ReactNode
}

export const Gutter = forwardRef<HTMLDivElement, Props>(({
  left = true,
  right = true,
  className,
  children
}, ref) => {
  return (
    <div
      ref={ref}
      className={`
        ${styles.gutter}
        ${left ? styles.gutterLeft : ''}
        ${right ? styles.gutterRight : ''}
        ${className || ''}
      `.trim()}
    >
      {children}
    </div>
  )
})

Gutter.displayName = 'Gutter'