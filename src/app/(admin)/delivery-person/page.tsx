import DeliveryPresonManagement  from '@/components/DeliverPreson/cmsDeliverPreson'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Delivery-Preson',
  description: 'Manager Delivery-Preson',
}

export default function DashboardPage() {
  return (
    <DeliveryPresonManagement/>
  )
}