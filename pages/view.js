import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function View() {
  const router = useRouter()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push('/login')
      } else {
        const { data, error } = await supabase
          .from('images')
          .select('*')
          .eq('user_id', user.id)
          .order('id', { ascending: false })

        if (error) {
          alert(error.message)
        } else {
          setImages(data)
        }
        setLoading(false)
      }
    })
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>🖼️ Your Uploaded Images</h2>
      {loading ? (
        <p>Loading...</p>
      ) : images.length === 0 ? (
        <p>No images uploaded yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
          {images.map(img => (
            <div key={img.id}>
              <img src={img.url} alt="Uploaded" style={{ width: '100%', borderRadius: 8 }} />
              <a href={img.url} download>
                ⬇️ Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
