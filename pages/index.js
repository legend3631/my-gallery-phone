import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Home() {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const user = supabase.auth.getUser()

  useEffect(() => {
    fetchImages()
  }, [])

  async function fetchImages() {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setImages(data)
  }

  async function uploadImage(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)

    const filename = `${Date.now()}-${file.name}`
    const { data, error: uploadError } = await supabase.storage
      .from('user-uploads')
      .upload(filename, file)

    if (uploadError) {
      alert('Upload failed')
      setUploading(false)
      return
    }

    const url = supabase.storage.from('user-uploads').getPublicUrl(filename).data.publicUrl
    const { error: insertError } = await supabase
      .from('images')
      .insert({ image_url: url, user_id: (await supabase.auth.getUser()).data.user?.id })

    if (!insertError) {
      fetchImages()
    }
    setUploading(false)
  }

  async function deleteImage(id, url) {
    const path = url.split('/').pop()
    await supabase.storage.from('user-uploads').remove([path])
    await supabase.from('images').delete().eq('id', id)
    fetchImages()
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📸 My Gallery</h2>

      <input type="file" onChange={uploadImage} disabled={uploading} />
      {uploading && <p>Uploading...</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
        {images.map(img => (
          <div key={img.id} style={{ border: '1px solid #ccc', padding: 10 }}>
            <img src={img.image_url} alt="upload" style={{ width: '100%' }} />
            <button onClick={() => deleteImage(img.id, img.image_url)}>🗑️ Delete</button>
            <a href={img.image_url} download>⬇️ Download</a>
          </div>
        ))}
      </div>
    </div>
  )
}
