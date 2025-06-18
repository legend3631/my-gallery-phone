import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Optional: sign out existing session to reset
    supabase.auth.signOut()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Try login first
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      console.log('Login failed:', loginError.message)

      // Try signup
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        alert('Signup failed: ' + signUpError.message)
        setLoading(false)
        return
      }

      // Auto-login after signup
      const { error: secondLoginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (secondLoginError) {
        alert('Login still failed: ' + secondLoginError.message)
      } else {
        router.push('/')
      }
    } else {
      // Login successful
      router.push('/')
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🔐 Login or Sign Up</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', marginBottom: 10 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Login / Sign Up'}
        </button>
      </form>
    </div>
  )
}
