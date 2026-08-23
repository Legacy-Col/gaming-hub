import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { useArticle } from '@/hooks/useArticle'
import { useArticleEditor } from '@/hooks/useArticleEditor'
import type { ArticleStatus } from '@/types'

const inputClass =
  'w-full bg-gh-card2 border border-gh-border text-gh-text font-rajdhani text-base px-4 py-3 outline-none transition-colors duration-200 focus:border-gh-purple placeholder:text-gh-faint'

const labelClass = 'font-mono text-[11px] tracking-[2px] uppercase text-gh-muted'

export function ArticleEditorPage() {
  const { slug } = useParams<{ slug?: string }>()
  const isEditMode = Boolean(slug)
  const navigate = useNavigate()

  const { data: existing, loading: loadingExisting } = useArticle(slug ?? '', isEditMode)
  const { createArticle, updateArticle, uploadImage, isSaving, error, success } = useArticleEditor()

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [contentHtml, setContentHtml] = useState('')
  const [status, setStatus] = useState<ArticleStatus>('draft')

  // Pre-fill form once the existing article loads (edit mode only)
  useEffect(() => {
    if (isEditMode && existing) {
      setTitle(existing.title)
      setExcerpt(existing.excerpt)
      setCoverImageUrl(existing.coverImageUrl ?? '')
      setTagsInput(existing.tags.join(', '))
      setContentHtml(existing.contentHtml)
      setStatus(existing.status)
    }
  }, [isEditMode, existing])

  const handleCoverUpload = async (file: File) => {
    const url = await uploadImage(file)
    if (url) setCoverImageUrl(url)
  }

  const handleSave = async (publishStatus: ArticleStatus) => {
    const payload = {
      title,
      excerpt,
      contentHtml,
      coverImageUrl: coverImageUrl || undefined,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      status: publishStatus,
    }

    if (isEditMode && existing) {
      const result = await updateArticle(existing.id, payload)
      navigate(`/articles/${result?.slug ?? existing.slug}`)
    } else {
      const result = await createArticle(payload)
      if (result) navigate(`/articles/${result.slug}`)
    }
  }

  if (isEditMode && loadingExisting) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gh-bg pt-24"><LoadingSpinner /></main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gh-bg px-4 sm:px-6 lg:px-12 pt-24 pb-16">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">

          <div className="border-l-[3px] border-gh-gold pl-5">
            <p className="section-label text-gh-gold">// ADMIN</p>
            <h1 className="font-bebas text-gh-text leading-none" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
              {isEditMode ? 'EDIT ARTICLE' : 'WRITE ARTICLE'}
            </h1>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Article title"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="A short one- or two-sentence summary shown on the articles list"
              rows={2}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Cover Image</label>
            {coverImageUrl && (
              <img src={coverImageUrl} alt="Cover preview" className="w-full aspect-[16/9] object-cover clip-md mb-2" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleCoverUpload(file)
              }}
              className="font-rajdhani text-sm text-gh-muted"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Tags (comma separated)</label>
            <input
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="Tournaments, Community, Partnerships"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Content</label>
            <RichTextEditor content={contentHtml} onChange={setContentHtml} onImageUpload={uploadImage} />
          </div>

          {error && <p className="font-rajdhani text-sm text-gh-red">{error}</p>}
          {success && <p className="font-rajdhani text-sm text-green-500">{success}</p>}

          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gh-border">
            <Button
              variant="outline"
              size="lg"
              disabled={isSaving || !title.trim()}
              onClick={() => handleSave('draft')}
            >
              {isSaving ? 'Saving…' : 'Save Draft'}
            </Button>
            <Button
              variant="gold"
              size="lg"
              disabled={isSaving || !title.trim() || !contentHtml.trim()}
              onClick={() => handleSave('published')}
            >
              {isSaving ? 'Publishing…' : status === 'published' ? 'Update & Publish' : 'Publish'}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}