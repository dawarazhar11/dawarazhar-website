import { getMaintenanceConfig } from '@/lib/maintenance'
import { ComingSoonContent } from '@/components/coming-soon-content'

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function ComingSoonPage() {
  const config = getMaintenanceConfig()
  return <ComingSoonContent config={config} />
}
