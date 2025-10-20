import CustomerPage from '@/components/CustomerCMS/cmsCustomer'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Customer',
  description: 'Manager Customer',
}

export default function DashboardPage() {
  return (
    <CustomerPage/>
  )
}