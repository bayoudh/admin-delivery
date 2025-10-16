import UserManagement  from '@/components/UsersCMS/UserManagement'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Users',
  description: 'Manager Users',
}

export default function DashboardPage() {
  return (
    <UserManagement/>
  )
}
