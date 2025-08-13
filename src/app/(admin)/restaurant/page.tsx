import RestaurantManagement  from '@/components/RestaurantCMS/RestaurantManagement'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'restaurant',
  description: 'application restaurant',
}

export default function DashboardPage() {
  return (
    <RestaurantManagement/>
  )
}
