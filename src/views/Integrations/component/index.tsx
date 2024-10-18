'use client'
import { CustomDocumentBody } from '@/components/CustomDocumentFields'
import { useStepNav } from '@payloadcms/ui'
import IntegrationCard from './IntegrationCard'
import IntegrationSection from './IntegrationSection'

const IntegrationsPage: React.FC = ({}) => {
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
    <CustomDocumentBody>
      <IntegrationSection title="Calendars">
        <IntegrationCard
          icon="/api/media/file/google-calendar.svg"
          name="Google Calendar"
          description="Add events to your calendar to prevent double-booking."
        />
        <IntegrationCard
          icon="/api/media/file/microsoft-outlook.svg"
          name="Outlook Calendar"
          description="Add events to your calendar to prevent double-booking."
        />
      </IntegrationSection>
      <IntegrationSection title="Video Conferencing">
        <IntegrationCard
          icon="/api/media/file/zoom.svg"
          name="Zoom"
          description="Include Zoom details in your appointment events."
        />
        <IntegrationCard
          icon="/api/media/file/google-meet.svg"
          name="Zoom"
          description="Include Google Meet details in your appointment events."
        />
        <IntegrationCard
          icon="/api/media/file/microsoft-teams.svg"
          name="Zoom"
          description="Include Google Meet details in your appointment events."
        />
      </IntegrationSection>
      <IntegrationSection title="Sales & CRM">
        <IntegrationCard
          icon="/api/media/file/google-calendar.svg"
          name="Clio Grow"
          description="Create a new lead in Clio Grow once an appointment is booked."
        />
        <IntegrationCard
          icon="/api/media/file/microsoft-outlook.svg"
          name="Lead Docket"
          description="Create a new lead in Lead Docket once an appointment is booked."
        />
      </IntegrationSection>
      <IntegrationSection title="Email Messaging">
        <IntegrationCard
          icon="/api/media/file/gmail.svg"
          name="Gmail"
          description="Send automated email from your Gmail account."
        />
        <IntegrationCard
          icon="/api/media/file/microsoft-outlook.svg"
          name="Outlook"
          description="Send automated email from your Outlook account."
        />
      </IntegrationSection>
      <IntegrationSection title="Payments">
        <IntegrationCard
          icon="/api/media/file/stripe.svg"
          name="Gmail"
          description="Collect payments before the meeting"
        />
        <IntegrationCard
          icon="/api/media/file/paypal.svg"
          name="Outlook"
          description="Collect payments before the meeting"
        />
      </IntegrationSection>
    </CustomDocumentBody>
  )
}

export default IntegrationsPage
