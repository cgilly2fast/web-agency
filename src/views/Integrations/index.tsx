import React from 'react'
import { AdminViewProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, RenderTitle } from '@payloadcms/ui'
import IntegrationsPage from './component'

const baseClass = `doc-header`

const Integrations: React.FC<AdminViewProps> = ({ initPageResult, params, searchParams }) => {
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req?.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <RenderTitle className={`doc-header__title`} title="Integrations & Apps" />
      </Gutter>
      <IntegrationsPage />
    </DefaultTemplate>
  )
}

export default Integrations
