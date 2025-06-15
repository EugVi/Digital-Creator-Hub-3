
'use client'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/auth')
      } else {
        setLoading(false)
      }
    })

    return () => unsub()
  }, [router])

  if (loading) return <div className="p-8 text-center text-lg">Verificando autenticação...</div>

  return <>{children}</>
}
