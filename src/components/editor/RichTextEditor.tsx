import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import { useCallback } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  onImageUpload?: (file: File) => Promise<string | null>
  placeholder?: string
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        'font-bebas tracking-widest text-sm px-3 py-1.5 border clip-sm transition-colors',
        active
          ? 'border-gh-purple text-gh-purple bg-gh-purple/10'
          : 'border-gh-border text-gh-muted hover:border-gh-purple hover:text-gh-purple',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor, onImageUpload }: { editor: Editor; onImageUpload?: (file: File) => Promise<string | null> }) {
  const addImage = useCallback(async () => {
    if (!onImageUpload) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const url = await onImageUpload(file)
      if (url) editor.chain().focus().setImage({ src: url }).run()
    }
    input.click()
  }, [editor, onImageUpload])

  const addLink = useCallback(() => {
    const url = window.prompt('Enter URL')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }, [editor])

  return (
    <div className="flex flex-wrap gap-2 bg-gh-card2 border border-gh-border border-b-0 p-3">
      <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>B</ToolbarButton>
      <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>I</ToolbarButton>
      <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
      <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarButton>
      <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</ToolbarButton>
      <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</ToolbarButton>
      <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>" Quote</ToolbarButton>
      <ToolbarButton title="Link" active={editor.isActive('link')} onClick={addLink}>🔗 Link</ToolbarButton>
      {onImageUpload && <ToolbarButton title="Insert image" onClick={addImage}>🖼 Image</ToolbarButton>}
      <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>↺</ToolbarButton>
      <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>↻</ToolbarButton>
    </div>
  )
}

export function RichTextEditor({ content, onChange, onImageUpload, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({ HTMLAttributes: { class: 'rounded-sm max-w-full' } }),
      LinkExtension.configure({ openOnClick: false, HTMLAttributes: { class: 'text-gh-gold underline' } }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none font-rajdhani text-gh-text min-h-[280px] px-4 py-4 outline-none [&_h2]:font-bebas [&_h2]:tracking-wide [&_h2]:text-2xl [&_h3]:font-bebas [&_h3]:tracking-wide [&_h3]:text-xl [&_blockquote]:border-l-2 [&_blockquote]:border-gh-gold [&_blockquote]:pl-4 [&_blockquote]:text-gh-muted',
        'data-placeholder': placeholder ?? 'Start writing your article…',
      },
    },
  })

  if (!editor) return null

  return (
    <div className="w-full">
      <Toolbar editor={editor} onImageUpload={onImageUpload} />
      <div className="bg-gh-card2 border border-gh-border focus-within:border-gh-purple transition-colors">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}