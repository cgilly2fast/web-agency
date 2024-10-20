import type { SanitizedGlobalConfig, ServerProps } from 'payload'

import { Logout } from '@payloadcms/ui'
import {
  EntityToGroup,
  EntityType,
  getCreateMappedComponent,
  RenderComponent,
} from '@payloadcms/ui/shared'
import React from 'react'

import { NavHamburger } from './NavHamburger/index'
import { NavWrapper } from './NavWrapper/index'

const baseClass = 'nav'

import { DefaultNavClient } from './index.client'
import { Group, parseGroups } from '@/views/Dashboard/index'

export type NavProps = ServerProps

const DefaultNav: React.FC<NavProps> = async (props) => {
  const start = performance.now()
  const { i18n, locale, params, payload, permissions, searchParams, user } = props

  // if (!payload?.config) {
  //   return null
  // }

  const {
    admin: {
      components: { afterNavLinks, beforeNavLinks },
    },
  } = payload.config

  const createMappedComponent: any = getCreateMappedComponent({
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  const mappedBeforeNavLinks = createMappedComponent(
    beforeNavLinks,
    undefined,
    undefined,
    'beforeNavLinks',
  )
  const mappedAfterNavLinks = createMappedComponent(
    afterNavLinks,
    undefined,
    undefined,
    'afterNavLinks',
  )

  let collections = Object.values(payload.collections).map((item) => item.config)

  let globals = payload.globals.config

  const entities = [
    ...collections.map((collection) => {
      const entityToGroup: EntityToGroup = {
        type: EntityType.collection,
        entity: collection,
      }

      return entityToGroup
    }),
    ...globals.map((global) => {
      const entityToGroup: EntityToGroup = {
        type: EntityType.global,
        entity: global,
      }

      return entityToGroup
    }),
  ]

  let { ids, groups } = await parseGroups([{ entities, label: 'Collections' }], payload, user!)

  groups = groups.map((item) => {
    return {
      ...item,
      entities: item.entities.map((row) => {
        return {
          entity: { slug: row.entity.slug, labels: (row.entity as any).labels },
          type: row.type,
          id: (row as any).id,
        }
      }),
    }
  }) as unknown as Group[]
  const end = performance.now()
  console.log(`Nav Execution time: ${end - start} milliseconds`)
  return (
    <NavWrapper baseClass={baseClass}>
      <nav className={`${baseClass}__wrap`}>
        <RenderComponent mappedComponent={mappedBeforeNavLinks} />
        <DefaultNavClient groups={groups} ids={ids} />
        <RenderComponent mappedComponent={mappedAfterNavLinks} />
        <div className={`${baseClass}__controls`}>
          <Logout />
        </div>
      </nav>
      <div className={`${baseClass}__header`}>
        <div className={`${baseClass}__header-content`}>
          <NavHamburger baseClass={baseClass} />
        </div>
      </div>
    </NavWrapper>
  )
}

export default DefaultNav
