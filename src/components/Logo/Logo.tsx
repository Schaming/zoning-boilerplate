import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="CivicZone"
      width={260}
      height={90}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[16rem] w-full h-auto', className)}
      src="/media/civiczone-logo.svg"
    />
  )
}
