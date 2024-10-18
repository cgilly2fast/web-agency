import Image from 'next/image'

export interface IntegrationCardProps {
  icon: string
  name: string
  description: string
}
const IntegrationCard: React.FC<IntegrationCardProps> = ({ icon, name, description }) => {
  return (
    <div className="flex flex-col items-start p-4 bg-white rounded-lg border-[1.5px] border-solid border-[#ebebeb] shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
      <div className="w-12 h-12 mb-3">
        <Image
          src={icon}
          alt={`${name} icon`}
          className="w-full h-full object-contain"
          width={48}
          height={48}
        />
      </div>
      <h3 className="text-sm font-medium text-gray-900 mb-1">{name}</h3>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  )
}

export default IntegrationCard
