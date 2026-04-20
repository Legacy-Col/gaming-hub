interface Props { amount: number; className?: string }
export function TokenBadge({ amount, className = '' }: Props) {
  return <span className={`token-badge ${className}`}>◈ {amount.toLocaleString()}</span>
}
