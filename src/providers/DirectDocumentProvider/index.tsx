'use client'
import React, { createContext, useContext, useState } from 'react'

export type DirectDocumentContext = {
  header: string
  footer: string
  aiConfig: string
  calendarSettings: string
  firm: string
  setHeader: (header: string) => void
  setFooter: (footer: string) => void
  setAiConfig: (aiConfig: string) => void
  setCalendarSettings: (calendarSetting: string) => void
  setFirm: (firm: string) => void
}

const initialContext: DirectDocumentContext = {
  header: '',
  footer: '',
  aiConfig: '',
  calendarSettings: '',
  firm: '',
  setHeader: () => null,
  setFooter: () => null,
  setAiConfig: () => null,
  setCalendarSettings: () => null,
  setFirm: () => null,
}

const Context = createContext(initialContext)

const DirectDocumentProvider: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  const [header, setHeader] = useState('')
  const [footer, setFooter] = useState('')
  const [aiConfig, setAiConfig] = useState('')
  const [calendarSettings, setCalendarSettings] = useState('')
  const [firm, setFirm] = useState('')
  return (
    <Context.Provider
      value={{
        header,
        setHeader,
        footer,
        setFooter,
        aiConfig,
        setAiConfig,
        calendarSettings,
        setCalendarSettings,
        firm,
        setFirm,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default DirectDocumentProvider

export const useDirectDocuments = (): DirectDocumentContext => useContext(Context)
