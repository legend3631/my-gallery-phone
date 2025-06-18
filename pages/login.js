import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push('/')
    })
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Login failed:', error.message)
      alert('Login failed. Trying to sign up...')

      // Try signing up
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email,
        password
      })

      console.log('Signup response:', signUpData)

      if (signUpError) {
        console.error('Signup failed:', signUpError)
        alert('Signup failed. Check browser console for full error.')
      } else {
        alert('Signup successful! Now try logging in again.')
      }
    } else {
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
          onChange={e => setEmail(e.target.value)}
          required
          style={{ display: 'block', marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
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
