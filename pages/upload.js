import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function Upload() {
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/login')
    })
  }, [])

  async function uploadFile(e) {
    e.preventDefault()
    if (!file) return alert('Please choose a file.')

    setLoading(true)
    const user = (await supabase.auth.getUser()).data.user
    const filePath = `${user.id}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) {
      alert(uploadError.message)
      setLoading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    await supabase.from('images').insert({
      user_id: user.id,
      url: urlData.publicUrl,
    })

    alert('Upload successful!')
    setFile(null)
    setLoading(false)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📤 Upload Image</h2>
      <form onSubmit={uploadFile}>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  )
}
