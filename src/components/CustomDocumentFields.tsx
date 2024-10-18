'use client'

import React from 'react'
import { Gutter } from '@payloadcms/ui'

const baseClass = 'document-fields'

type CustomDocumentBodyProps = {
  children?: React.ReactNode
  sidebarChildren?: React.ReactNode
  description?: React.ReactNode
  forceSidebarWrap?: boolean
  className?: string
}

export const CustomDocumentBody: React.FC<CustomDocumentBodyProps> = ({
  children,
  sidebarChildren,
  description,
  forceSidebarWrap = false,
  className = '',
}) => {
  const hasSidebarChildren = Boolean(sidebarChildren)

  return (
    <div
      className={[
        baseClass,
        hasSidebarChildren ? `${baseClass}--has-sidebar` : `${baseClass}--no-sidebar`,
        forceSidebarWrap && `${baseClass}--force-sidebar-wrap`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={`${baseClass}__main`}>
        <Gutter className={`${baseClass}__edit`}>
          {description && (
            <header className={`${baseClass}__header`}>
              <div className={`${baseClass}__sub-header`}>{description}</div>
            </header>
          )}
          {children}
        </Gutter>
      </div>
      {hasSidebarChildren && (
        <div className={`${baseClass}__sidebar-wrap`}>
          <div className={`${baseClass}__sidebar`}>
            <div className={`${baseClass}__sidebar-fields`}>{sidebarChildren}</div>
          </div>
        </div>
      )}
    </div>
  )
}
