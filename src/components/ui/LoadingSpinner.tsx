export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="w-8 h-8 border-2 border-gh-border border-t-gh-red rounded-full animate-spin" />
    </div>
  )
}
