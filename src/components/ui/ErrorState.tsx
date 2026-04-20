import { Button } from './Button'
interface Props { message?: string; onRetry?: () => void }
export function ErrorState({ message = 'Failed to load data.', onRetry }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-gh-muted">
      <span className="text-3xl">⚠</span>
      <p className="font-rajdhani text-sm tracking-wider">{message}</p>
      {onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Retry</Button>}
    </div>
  )
}
