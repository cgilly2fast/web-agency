'use client'

import type { EntityToGroup } from '@payloadcms/ui/shared'

import { getTranslation } from '@payloadcms/translations'
import {
  NavGroup,
  useAuth,
  useConfig,
  useEntityVisibility,
  useNav,
  useTranslation,
} from '@payloadcms/ui'
import { EntityType, formatAdminURL, groupNavItems } from '@payloadcms/ui/shared'
import LinkWithDefault from 'next/link'
import { usePathname } from 'next/navigation'
import React, { Fragment, useEffect } from 'react'
import { Group } from '@/views/Dashboard'
import { transformTitle } from '@/utils/transformTitle'
import { useDirectDocuments } from '@/providers/DirectDocumentProvider'

const baseClass = 'nav'

interface DefaultNavClientProps {
  groups: Group[]
  ids: {
    header: string
    footer: string
    aiConfig: string
    calendarSettings: string
    firm: string
  }
}
export const DefaultNavClient: React.FC<DefaultNavClientProps> = ({ groups, ids }) => {
  const pathname = usePathname()
  const { setFirm, setAiConfig, setCalendarSettings, setHeader, setFooter } = useDirectDocuments()

  useEffect(() => {
    setFirm(ids.firm)
    setAiConfig(ids.aiConfig)
    setCalendarSettings(ids.calendarSettings)
    setHeader(ids.header)
    setFooter(ids.footer)
  }, [ids, setFirm, setAiConfig, setCalendarSettings, setHeader, setFooter])

  const {
    config: {
      collections,
      globals,
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const { i18n } = useTranslation()
  const { navOpen } = useNav()

  return (
    <Fragment>
      {groups.map(({ entities, label }, key) => {
        return (
          <NavGroup key={key} label={label}>
            {entities.map((args, i) => {
              const { type, entity } = args
              let entityLabel: string = ''
              let href: string = ''
              let id: string = ''

              if (type === EntityType.collection) {
                href = formatAdminURL({ adminRoute, path: `/collections/${entity.slug}` })
                entityLabel = getTranslation(entity.labels.plural, i18n)
                id = `nav-${entity.slug}`
              }

              if (type === EntityType.global) {
                href = formatAdminURL({ adminRoute, path: `/globals/${entity.slug}` })
                entityLabel = getTranslation((entity as any).label, i18n) as string
                id = `nav-global-${entity.slug}`
              }

              if (type === 'direct') {
                href = formatAdminURL({
                  adminRoute,
                  path: `/collections/${entity.slug}/${(args as any).id}`,
                })

                let title = transformTitle(entity.labels as any)

                entityLabel = getTranslation(title, i18n) as string
                id = `nav-global-${entity.slug}`
              }

              if (type === 'custom-route') {
                href = formatAdminURL({
                  adminRoute,
                  path: `/${entity.slug}`,
                })

                let title = transformTitle(entity.labels as any)

                entityLabel = getTranslation(title, i18n) as string
                id = `nav-global-${entity.slug}`
              }

              const Link = ((LinkWithDefault as any).default || LinkWithDefault) as any

              const LinkElement = Link || 'a'
              const activeCollection =
                pathname.startsWith(href) && ['/', undefined].includes(pathname[href.length])

              return (
                <LinkElement
                  className={[`${baseClass}__link`, activeCollection && `active`]
                    .filter(Boolean)
                    .join(' ')}
                  href={href}
                  id={id}
                  key={i}
                  tabIndex={!navOpen ? -1 : undefined}
                >
                  {activeCollection && <div className={`${baseClass}__link-indicator`} />}
                  <span className={`${baseClass}__link-label`}>{entityLabel}</span>
                </LinkElement>
              )
            })}
          </NavGroup>
        )
      })}
    </Fragment>
  )
}
