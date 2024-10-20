'use client'
import { CustomDocumentBody } from '@/components/CustomDocumentFields'
import { EditDepthProvider, useStepNav, useTheme } from '@payloadcms/ui'
import IntegrationCard from './IntegrationCard'
import IntegrationSection from './IntegrationSection'
import { Media } from '@/payload-types'
import { ConnectedIntegration } from '..'
import { useDirectDocuments } from '@/providers/DirectDocumentProvider'
import IntegrationDrawerDefault from './IntegrationDrawerDefault'
import IntegrationDrawerConnected from './IntegrationDrawerConnected'

interface IntegrationPageProps {
  sections: {
    name: string
    integrations: ConnectedIntegration[]
  }[]
  firmLogo: Media
  firmLogoDark: Media
}

const IntegrationsPage: React.FC<IntegrationPageProps> = ({ sections, firmLogo, firmLogoDark }) => {
  const { stepNav, setStepNav } = useStepNav()

  if (stepNav.length === 0) {
    setStepNav([
      {
        label: 'Integrations & Apps',
        url: 'admin/integrations',
      },
    ])
  }
  return (
    <EditDepthProvider depth={1}>
      <CustomDocumentBody>
        {sections.map((section, i) => (
          <IntegrationSection title={section.name} key={i}>
            {section.integrations.map((app, j) => (
              <IntegrationCard
                icon={app.icon}
                name={app.name}
                description={app.description}
                key={j}
              >
                {!app.connected ? (
                  <IntegrationDrawerDefault
                    name={app.name}
                    drawer={app.drawer}
                    firmLogo={firmLogo}
                    icon={app.icon}
                    integrationId={app.id}
                    provider={app.provider}
                  />
                ) : (
                  <IntegrationDrawerConnected
                    name={app.name}
                    drawer={app.drawer}
                    firmLogo={firmLogo}
                    icon={app.icon}
                    connectedTo={app.connectedTo}
                    integrationId={app.id}
                    provider={app.provider}
                  />
                )}
              </IntegrationCard>
            ))}
          </IntegrationSection>
        ))}
      </CustomDocumentBody>
    </EditDepthProvider>
  )
}

export default IntegrationsPage
