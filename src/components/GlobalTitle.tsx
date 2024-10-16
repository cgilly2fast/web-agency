'use client'

import type { MappedComponent } from 'payload'

import React, { useRef } from 'react'
import {
  useAuth,
  useStepNav,
  useDocumentInfo,
  useTranslation,
  useForm,
  useFormModified,
  useEditDepth,
  useOperation,
  useHotkey,
  FormSubmit,
  RenderComponent,
} from '@payloadcms/ui'

export const DefaultSaveButton: React.FC<{ label?: string }> = ({ label: labelProp }) => {
  const { t } = useTranslation()
  const { submit } = useForm()
  const modified = useFormModified()
  const label = labelProp || t('general:save')
  const ref = useRef<HTMLButtonElement>(null)
  const editDepth = useEditDepth()
  const operation = useOperation()
  const { title, setDocumentTitle } = useDocumentInfo()
  const { user } = useAuth()
  const { stepNav } = useStepNav()

  const forceDisable = operation === 'update' && !modified
  const newTitle = (stepNav[0]?.label as string) ?? ''

  if (user && user.roles.includes('super-admin') && newTitle !== title) {
    setDocumentTitle(newTitle)
  }
  useHotkey({ cmdCtrlKey: true, editDepth, keyCodes: ['s'] }, (e) => {
    if (forceDisable) {
      // absorb the event
    }

    e.preventDefault()
    e.stopPropagation()
    if (ref?.current) {
      ref.current.click()
    }
  })

  return (
    <FormSubmit
      buttonId="action-save"
      disabled={forceDisable}
      onClick={() => {
        return void submit()
      }}
      ref={ref}
      size="medium"
      type="button"
    >
      {label}
    </FormSubmit>
  )
}

export default DefaultSaveButton
