import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push('/')
    })
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError) {
      setErrorMsg('Login failed: ' + loginError.message)

      const { error: signUpError } = await supabase.auth.signUp({ email, password })

      if (signUpError) {
        setErrorMsg('Signup failed: ' + signUpError.message)
      } else {
        setErrorMsg('Signup successful! Now try logging in again.')
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
        <button type="submit" disabled={loading} style={{ backgroundColor: 'green', color: 'white', padding: 10 }}>
          {loading ? 'Processing...' : 'Login / Sign Up'}
        </button>
      </form>

      {errorMsg && (
        <div style={{ marginTop: 20, color: 'red' }}>
          <strong>{errorMsg}</strong>
        </div>
      )}
    </div>
  )
}
