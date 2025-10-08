import CategoryManagement  from '@/components/Category/cmsCategory'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Category Store',
  description: 'Manager Category Store',
}

export default function DashboardPage() {
  return (
    <CategoryManagement/>
  )
}