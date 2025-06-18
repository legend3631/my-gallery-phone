import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
      else fetchImages(user.id)
    })
  }, [])

  async function fetchImages(user_id) {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) alert(error.message)
    else setImages(data)

    setLoading(false)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🖼️ My Uploaded Images</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        images.map(img => (
          <div key={img.id} style={{ marginBottom: 10 }}>
            <img src={img.url} alt="Uploaded" width="200" />
          </div>
        ))
      )}
    </div>
  )
}
