import { getMaintenanceConfig } from '@/lib/maintenance'
import { ComingSoonContent } from '@/components/coming-soon-content'

export default function ComingSoonPage() {
  const config = getMaintenanceConfig()
  return <ComingSoonContent config={config} />
}
