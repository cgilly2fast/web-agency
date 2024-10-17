import type {
  BasePayload,
  ClientCollectionConfig,
  ClientGlobalConfig,
  ClientUser,
  CollectionSlug,
  Permissions,
  SanitizedCollectionConfig,
  SanitizedGlobalConfig,
  ServerProps,
  VisibleEntities,
} from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { Button, Card, Gutter, Locked, SetStepNav, SetViewActions } from '@payloadcms/ui'
import { formatAdminURL, getCreateMappedComponent, RenderComponent } from '@payloadcms/ui/shared'
import React, { Fragment } from 'react'

// import './index.scss'
import { User } from '@/payload-types'
import { transformTitle } from '@/utils/transformTitle'

const baseClass = 'dashboard'

/******** ADDED CODE *******/
enum EntityType {
  collection = 'collections',
  global = 'globals',
  direct = 'direct',
}
export type EntityToGroup =
  | {
      entity: ClientCollectionConfig | SanitizedCollectionConfig
      type: EntityType.collection
    }
  | {
      entity: ClientCollectionConfig | SanitizedCollectionConfig
      type: EntityType.direct
    }
  | {
      entity: ClientGlobalConfig | SanitizedGlobalConfig
      type: EntityType.global
    }

type Entities =
  | EntityToGroup
  | {
      entity: ClientCollectionConfig | SanitizedCollectionConfig
      id: string
      type: string
    }
  | {
      entity: { slug: string; labels: { singular: string; plural: string } }
      type: string
    }
export type Group = {
  entities: Entities[]
  label: string
}

function arrayToObject(arr: Entities[]) {
  let obj: any = {}
  for (let i = 0; i < arr.length; i++) {
    obj[arr[i].entity.slug] = arr[i]
  }
  return obj
}

export async function parseGroups(groups: Group[], payload: BasePayload, user: User) {
  if (!user || !payload || !groups || groups.length === 0) return []

  let chatGroup: Group = {
    entities: [
      {
        type: 'custom-route',
        entity: { slug: 'chat', labels: { singular: 'Chat', plural: 'Chats' } },
      },
    ],
    label: 'AI Live Chat',
  }
  let group: Group = groups[0]

  const firmID = typeof user.firm === 'string' ? user.firm : user.firm.id

  const headerData = await payload.find({
    collection: 'headers',
    where: {
      firm: {
        equals: firmID,
      },
    },
  })
  const header = {
    entity: payload.collections['headers'].config,
    id: headerData.docs[0].id,
    type: user.roles.includes('super-admin') ? EntityType.collection : EntityType.direct,
  }

  const footerData = await payload.find({
    collection: 'footers',
    where: {
      firm: {
        equals: firmID,
      },
    },
  })
  const footer = {
    entity: payload.collections['footers'].config,
    id: footerData.docs[0].id,
    type: user.roles.includes('super-admin') ? EntityType.collection : EntityType.direct,
  }

  const availabilityData = await payload.find({
    collection: 'availability-settings',
    where: {
      user: {
        equals: user.id,
      },
    },
  })
  const availability = {
    entity: payload.collections['availability-settings'].config,
    id: availabilityData.docs[0].id,
    type: user.roles.includes('super-admin') ? EntityType.collection : EntityType.direct,
  }

  const chatData = await payload.find({
    collection: 'ai-configs',
    where: {
      firm: {
        equals: firmID,
      },
    },
  })
  const chat = {
    entity: payload.collections['ai-configs'].config,
    id: chatData.docs[0].id,
    type: user.roles.includes('super-admin') ? EntityType.collection : EntityType.direct,
  }

  const userSettings = {
    entity: payload.collections['users'].config,
    id: user.id,
    type: EntityType.direct,
  }

  const firmSettings = {
    entity: payload.collections['firms'].config,
    id: firmID,
    type: user.roles.includes('super-admin') ? EntityType.collection : EntityType.direct,
  }

  chatGroup.entities.push(chat)

  const dGroup = arrayToObject(group!.entities)

  const websiteGroup: Group = {
    entities: [dGroup.pages, dGroup.blogs, dGroup.media, header, footer],
    label: 'Website',
  }

  const appointmentGroup: Group = {
    entities: [dGroup['meeting-templates'], dGroup['meetings']],
    label: 'Appointments',
  }

  const formGroup: Group = {
    entities: [dGroup.forms, dGroup['form-submissions']],
    label: 'Forms',
  }

  const settingsGroup: Group = {
    entities: [firmSettings, userSettings, availability],
    label: 'Settings',
  }

  if (user.roles.includes('super-admin') || user.firmRole.includes('admin')) {
    settingsGroup.entities.push(dGroup.users)
  }

  if (user.roles.includes('super-admin')) {
    settingsGroup.entities.push(dGroup.interactions)
  }

  return [websiteGroup, appointmentGroup, chatGroup, formGroup, settingsGroup]
}

/******** ADDED CODE *******/
export type DashboardProps = {
  globalData: Array<{ data: { _isLocked: boolean; _userEditing: ClientUser | null }; slug: string }>
  Link: React.ComponentType<any>
  navGroups?: Group[]
  permissions: Permissions
  visibleEntities: VisibleEntities
} & ServerProps

const DefaultDashboard: React.FC<DashboardProps> = async (props) => {
  let {
    globalData,
    i18n,
    i18n: { t },
    Link,
    locale,
    navGroups,
    params,
    payload: {
      config: {
        admin: {
          components: { afterDashboard, beforeDashboard },
        },
        routes: { admin: adminRoute },
      },
    },
    payload,
    permissions,
    searchParams,
    user,
  } = props
  if (user && navGroups) {
    navGroups = await parseGroups(navGroups, payload, user)
  }

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

  const mappedBeforeDashboards = createMappedComponent(
    beforeDashboard,
    undefined,
    undefined,
    'beforeDashboard',
  )

  const mappedAfterDashboards = createMappedComponent(
    afterDashboard,
    undefined,
    undefined,
    'afterDashboard',
  )

  return (
    <div className={baseClass}>
      <SetStepNav nav={[]} />
      <SetViewActions actions={[]} />
      <Gutter className={`${baseClass}__wrap`}>
        <RenderComponent mappedComponent={mappedBeforeDashboards} />
        <Fragment>
          <SetViewActions actions={[]} />
          {!navGroups || navGroups?.length === 0 ? (
            <p>no nav groups....</p>
          ) : (
            navGroups.map(({ entities, label }, groupIndex) => {
              return (
                <div className={`${baseClass}__group`} key={groupIndex}>
                  <h2 className={`${baseClass}__label`}>{label}</h2>
                  <ul className={`${baseClass}__card-list`}>
                    {entities.map((args, entityIndex) => {
                      const { type, entity } = args
                      let title: string | any = ''
                      let buttonAriaLabel: string = ''
                      let createHREF: string = ''
                      let href: string = ''
                      let hasCreatePermission: boolean = false
                      let lockStatus = null
                      let userEditing = null

                      if (type === EntityType.collection) {
                        title = getTranslation(entity.labels.plural, i18n)

                        buttonAriaLabel = t('general:showAllLabel', { label: title })

                        href = formatAdminURL({ adminRoute, path: `/collections/${entity.slug}` })

                        createHREF = formatAdminURL({
                          adminRoute,
                          path: `/collections/${entity.slug}/create`,
                        })

                        hasCreatePermission =
                          permissions?.collections?.[entity.slug]?.create?.permission
                      }

                      if (type === EntityType.global) {
                        title = getTranslation((entity as any).label, i18n)

                        buttonAriaLabel = t('general:editLabel', {
                          label: getTranslation((entity as any).label, i18n),
                        })

                        href = formatAdminURL({
                          adminRoute,
                          path: `/globals/${entity.slug}`,
                        })

                        // Find the lock status for the global
                        const globalLockData = globalData.find(
                          (global) => global.slug === entity.slug,
                        )
                        if (globalLockData) {
                          lockStatus = globalLockData.data._isLocked
                          userEditing = globalLockData.data._userEditing
                        }
                      }
                      /******** ADDED CODE *******/
                      if (type === EntityType.direct) {
                        title = transformTitle(entity.labels as any)

                        title = getTranslation(title, i18n)

                        buttonAriaLabel = t('general:showAllLabel', { label: title })

                        href = formatAdminURL({
                          adminRoute,
                          path: `/collections/${entity.slug}/${(args as any).id}`,
                        })
                      }

                      if (type === 'custom-route') {
                        title = transformTitle(entity.labels as any)

                        title = getTranslation(title, i18n)

                        buttonAriaLabel = t('general:showAllLabel', { label: title })

                        href = formatAdminURL({
                          adminRoute,
                          path: `/${entity.slug}`,
                        })
                      }
                      /******** ADDED CODE *******/
                      return (
                        <li key={entityIndex}>
                          <Card
                            actions={
                              lockStatus && user?.id !== userEditing?.id ? (
                                <Locked className={`${baseClass}__locked`} user={userEditing!} />
                              ) : hasCreatePermission && type === EntityType.collection ? (
                                <Button
                                  aria-label={t('general:createNewLabel', {
                                    label: getTranslation(entity.labels.singular, i18n),
                                  })}
                                  buttonStyle="icon-label"
                                  el="link"
                                  icon="plus"
                                  iconStyle="with-border"
                                  Link={Link}
                                  round
                                  to={createHREF}
                                />
                              ) : undefined
                            }
                            buttonAriaLabel={buttonAriaLabel}
                            href={href}
                            id={`card-${entity.slug}`}
                            Link={Link}
                            title={title}
                            titleAs="h3"
                          />
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })
          )}
        </Fragment>
        <RenderComponent mappedComponent={mappedAfterDashboards} />
      </Gutter>
    </div>
  )
}

export default DefaultDashboard
