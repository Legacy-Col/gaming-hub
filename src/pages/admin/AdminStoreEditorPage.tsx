import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useProductDetail } from '@/hooks/useProductDetails'
import { useStoreAdmin } from '@/hooks/useStoreAdmin'
import type { StoreCategory } from '@/types'

const inputClass = 'w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-3 outline-none transition-colors duration-200 focus:border-gh-purple placeholder:text-gh-faint'
const labelClass = 'font-mono text-[11px] tracking-[2px] uppercase text-gh-muted'
const CATEGORIES: StoreCategory[] = ['gaming-gear', 'anime-merch']

export function AdminStoreEditorPage() {
  const { id } = useParams<{ id?: string }>()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()

  const { data: existing, loading: loadingExisting } = useProductDetail(id ?? '', isEditMode)
  const { createItem, updateItem, isSaving, error, success } = useStoreAdmin()

  const [name, setName] = useState('')
  const [category, setCategory] = useState<StoreCategory>('gaming-gear')
  const [priceNGN, setPriceNGN] = useState('')
  const [tokenCost, setTokenCost] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [emoji, setEmoji] = useState('🎮')
  const [inStock, setInStock] = useState(true)

  useEffect(() => {
    if (isEditMode && existing) {
      setName(existing.name)
      setCategory(existing.category)
      setPriceNGN(existing.priceNGN.toString())
      setTokenCost(existing.tokenCost.toString())
      setImageUrl(existing.imageUrl ?? '')
      setEmoji(existing.emoji)
      setInStock(existing.inStock)
    }
  }, [isEditMode, existing])

  const handleSave = async () => {
    const payload = {
      name,
      category,
      priceNGN: Number(priceNGN),
      tokenCost: Number(tokenCost),
      imageUrl: imageUrl || undefined,
      emoji,
      inStock,
    }

    if (isEditMode && existing) {
      await updateItem(existing.id, payload)
      navigate('/admin/store')
    } else {
      const result = await createItem(payload)
      if (result) navigate('/admin/store')
    }
  }

  if (isEditMode && loadingExisting) {
    return <><Navbar /><main className="min-h-screen bg-gh-bg pt-24"><LoadingSpinner /></main><Footer /></>
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gh-bg px-4 sm:px-6 lg:px-12 pt-24 pb-16">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          <div className="border-l-[3px] border-gh-purple pl-5">
            <p className="section-label text-gh-purple">// ADMIN</p>
            <h1 className="font-bebas text-gh-text leading-none" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              {isEditMode ? 'EDIT ITEM' : 'NEW STORE ITEM'}
            </h1>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Item Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Pro Wireless Headset" className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as StoreCategory)} className={inputClass}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Emoji Icon</label>
              <input value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="🎧" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Price (₦)</label>
              <input type="number" value={priceNGN} onChange={e => setPriceNGN(e.target.value)} placeholder="45000" className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Token Cost</label>
              <input type="number" value={tokenCost} onChange={e => setTokenCost(e.target.value)} placeholder="200" className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Image URL</label>
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://…" className={inputClass} />
          </div>

          <label className="flex items-center gap-3 font-rajdhani text-sm text-gh-text cursor-pointer">
            <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} className="w-4 h-4" />
            In stock
          </label>

          {error && <p className="font-rajdhani text-sm text-gh-red">{error}</p>}
          {success && <p className="font-rajdhani text-sm text-green-500">{success}</p>}

          <div className="flex gap-3 pt-2 border-t border-gh-border">
            <Button variant="gold" size="lg" disabled={isSaving || !name.trim()} onClick={handleSave}>
              {isSaving ? 'Saving…' : isEditMode ? 'Save Changes' : 'Add Item'}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}