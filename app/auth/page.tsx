
'use client'
import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError('')
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      router.push('/')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">{isLogin ? 'Login' : 'Cadastro'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="w-full p-2 border rounded" required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {isLogin ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className="mt-4 text-blue-500 underline text-sm">
        {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem conta? Faça login'}
      </button>
    </div>
  )
}
