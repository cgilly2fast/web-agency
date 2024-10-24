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
import { Firm, User } from '@/payload-types'
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

export type ParsedGroups = {
  ids: {
    header: string
    footer: string
    aiConfig: string
    calendarSettings: string
    firm: string
  }
  groups: Group[]
}

export async function parseGroups(collections: Group[], payload: BasePayload, user: User) {
  if (!user || !payload || !collections || collections.length === 0)
    return {
      ids: { header: '', footer: '', aiConfig: '', calendarSettings: '', firm: '' },
      groups: [],
    }

  let chatGroup: Group = {
    entities: [
      {
        type: 'custom-route',
        entity: { slug: 'chat', labels: { singular: 'Chat', plural: 'Chats' } },
      },
    ],
    label: 'AI Live Chat',
  }
  let group: Group = collections[0]
  const firm = user.firm as Firm

  const headerID = typeof firm.header === 'string' ? firm.header : firm.header!.id
  const footerID = typeof firm.footer === 'string' ? firm.footer : firm.footer!.id
  const aiConfigID = typeof firm.aiConfig === 'string' ? firm.aiConfig : firm.aiConfig!.id
  const calendarID =
    typeof user.calendarSettings === 'string' ? user.calendarSettings : user.calendarSettings!.id

  const header = {
    entity: payload.collections['headers'].config,
    id: headerID,
    type: user.roles.includes('super-admin') ? EntityType.collection : EntityType.direct,
  }

  const footer = {
    entity: payload.collections['footers'].config,
    id: footerID,
    type: user.roles.includes('super-admin') ? EntityType.collection : EntityType.direct,
  }

  const availability = {
    entity: payload.collections['calendar-settings'].config,
    id: calendarID,
    type: user.roles.includes('super-admin') ? EntityType.collection : EntityType.direct,
  }

  const chat = {
    entity: payload.collections['ai-configs'].config,
    id: aiConfigID,
    type: user.roles.includes('super-admin') ? EntityType.collection : EntityType.direct,
  }

  const userSettings = {
    entity: payload.collections['users'].config,
    id: user.id,
    type: EntityType.direct,
  }

  const firmSettings = {
    entity: payload.collections['firms'].config,
    id: firm.id,
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
    entities: [
      firmSettings,
      userSettings,
      availability,
      {
        type: 'custom-route',
        entity: {
          slug: 'integrations',
          labels: { singular: 'Integrations', plural: 'Integrations' },
        },
      },
    ],
    label: 'Settings',
  }

  const devGroup: Group = {
    entities: [dGroup.interactions, dGroup.integrations, dGroup['auth-tokens']],
    label: 'Dev Only',
  }

  if (user.roles.includes('super-admin') || user.firmRole.includes('admin')) {
    settingsGroup.entities.push(dGroup.users)
  }

  let groups = [websiteGroup, appointmentGroup, chatGroup, formGroup, settingsGroup]

  if (user.roles.includes('super-admin')) {
    groups.push(devGroup)
  }

  return {
    ids: {
      header: headerID,
      footer: footerID,
      aiConfig: aiConfigID,
      calendarSettings: calendarID,
      firm: firm.id,
    },
    groups,
  }
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
  const start = performance.now()
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
    const { ids, groups } = await parseGroups(navGroups, payload, user)
    navGroups = groups
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
  const end = performance.now()
  console.log(`Dashboard Execution time: ${end - start} milliseconds`)
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
