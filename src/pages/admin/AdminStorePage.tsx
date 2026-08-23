import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/ErrorState'
import { useStore } from '@/hooks/useStore'
import { useStoreAdmin } from '@/hooks/useStoreAdmin'

export function AdminStorePage() {
  const { data: items, loading, error, refetch } = useStore()
  const { deleteItem, isSaving } = useStoreAdmin()
  const navigate = useNavigate()

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Remove "${name}" from the store?`)) return
    const ok = await deleteItem(id)
    if (ok) refetch()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gh-bg px-4 sm:px-6 lg:px-12 pt-24 pb-16">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="border-l-[3px] border-gh-purple pl-5">
              <p className="section-label text-gh-purple">// ADMIN</p>
              <h1 className="font-bebas text-gh-text leading-none" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
                MANAGE STORE
              </h1>
            </div>
            <Link to="/admin/store/new">
              <Button variant="gold" size="lg">+ New Item</Button>
            </Link>
          </div>

          <div className="bg-gh-card border border-gh-border overflow-hidden">
            <div className="grid px-4 py-3 bg-gh-card2 border-b border-gh-border" style={{ gridTemplateColumns: '1fr 100px 100px 100px 160px', gap: '8px' }}>
              {['Item', 'Category', 'Price', 'Stock', ''].map((h, i) => (
                <span key={i} className="font-mono text-[10px] tracking-[2px] uppercase text-gh-faint font-bold">{h}</span>
              ))}
            </div>

            {loading && <LoadingSpinner />}
            {error && <ErrorState message={error} onRetry={refetch} />}

            {!loading && !error && items?.map(item => (
              <div key={item.id} className="grid items-center px-4 py-3 border-b border-gh-border last:border-b-0 hover:bg-gh-card2 transition-colors" style={{ gridTemplateColumns: '1fr 100px 100px 100px 160px', gap: '8px' }}>
                <div className="flex items-center gap-2 font-rajdhani font-bold text-sm text-gh-text truncate">
                  <span>{item.emoji}</span>{item.name}
                </div>
                <span className="font-mono text-[10px] tracking-widest uppercase text-gh-muted">{item.category}</span>
                <span className="font-mono text-xs text-gh-text">₦{item.priceNGN.toLocaleString()}</span>
                <span className={`font-mono text-[10px] tracking-widest uppercase ${item.inStock ? 'text-green-500' : 'text-gh-red'}`}>
                  {item.inStock ? 'In stock' : 'Out'}
                </span>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/admin/store/${item.id}/edit`)}>Edit</Button>
                  <Button variant="outline" size="sm" disabled={isSaving} onClick={() => handleDelete(item.id, item.name)}>Delete</Button>
                </div>
              </div>
            ))}

            {!loading && !error && items?.length === 0 && (
              <div className="text-center py-16"><p className="font-bebas text-2xl text-gh-muted tracking-widest">STORE IS EMPTY</p></div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}