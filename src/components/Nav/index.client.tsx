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
import React, { Fragment } from 'react'
import { Group } from '@/views/Dashboard'
import { transformTitle } from '@/utils/transformTitle'

const baseClass = 'nav'

interface DefaultNavClientProps {
  groups: Group[]
}
export const DefaultNavClient: React.FC<DefaultNavClientProps> = ({ groups }) => {
  const pathname = usePathname()

  const {
    config: {
      collections,
      globals,
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const { i18n } = useTranslation()
  const { navOpen } = useNav()

  // const groups = groupNavItems(
  //   [
  //     ...collections
  //       .filter(({ slug }) => isEntityVisible({ collectionSlug: slug }))
  //       .map((collection) => {
  //         const entityToGroup: EntityToGroup = {
  //           type: EntityType.collection,
  //           entity: collection,
  //         }

  //         return entityToGroup
  //       }),
  //     ...globals
  //       .filter(({ slug }) => isEntityVisible({ globalSlug: slug }))
  //       .map((global) => {
  //         const entityToGroup: EntityToGroup = {
  //           type: EntityType.global,
  //           entity: global,
  //         }

  //         return entityToGroup
  //       }),
  //   ],
  //   permissions!,
  //   i18n,
  // )

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