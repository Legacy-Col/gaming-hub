interface StarRatingProps {
    rating: number
    reviewCount?: number
    size?: 'sm' | 'md'
}

export function StarRating({ rating, reviewCount, size = 'sm' }: StarRatingProps) {
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                    <span
                        key={i}
                        className={[
                            i <= Math.round(rating) ? 'text-gh-gold' : 'text-gh-faint',
                            size === 'sm' ? 'text-xs' : 'text-base',
                        ].join(' ')}
                    >
                        ★
                    </span>
                ))}
            </div>
            <span className="font-mono text-[11px] text-gh-muted">
                {rating.toFixed(1)}
                {reviewCount !== undefined && (
                    <span className="text-gh-faint ml-1">({reviewCount})</span>
                )}
            </span>
        </div>
    )
}