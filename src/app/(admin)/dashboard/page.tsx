// app/dashboard/page.tsx
import React from 'react'
import type { Metadata } from 'next'
import { Dashboard } from '@/components/Dashboard'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'application dashboard',
}

export default function DashboardPage() {
  return (
    <Dashboard/>
  )
}

