async function handleLogin(e) {
  e.preventDefault()
  setLoading(true)

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error('Login error:', error.message)
    alert('Login failed: ' + error.message)

    // Try signing up
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password
    })

    if (signUpError) {
      console.error('Signup error:', signUpError)
      alert('Signup failed: ' + JSON.stringify(signUpError))
    } else {
      alert('Signup successful! Now try logging in again.')
    }
  } else {
    router.push('/')
  }

  setLoading(false)
}
