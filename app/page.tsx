
import Dashboard from '../dashboard'
import AuthGuard from '@/components/AuthGuard'

export default function Page() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  )
}
