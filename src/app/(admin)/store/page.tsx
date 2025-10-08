import RestaurantManagement  from '@/components/StoreCMS/StoreManagement'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Store',
  description: 'Manager Store',
}

export default function DashboardPage() {
  return (
    <RestaurantManagement/>
  )
}
