interface ExtensionGridProps {
  title: string
  children: React.ReactNode
}

const IntegrationSection: React.FC<ExtensionGridProps> = ({ title, children }) => {
  return (
    <div className="mb-12">
      <header>
        <h3 className="group-field__title mb-[10px]">{title}</h3>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {children}
      </div>
    </div>
  )
}

export default IntegrationSection
