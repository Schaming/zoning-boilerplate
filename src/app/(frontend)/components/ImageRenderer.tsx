// components/ImageRenderer.tsx
import Image from 'next/image'

type Media = {
  id: string | number
  url: string
  alt?: string
  width?: number
  height?: number
}

export type ImageBlockData = {
  blockType: 'image'
  image: Media | null
  caption?: string
  alt?: string
}

type Props = {
  block: ImageBlockData
}

export function ImageRenderer({ block }: Props) {
  const media = block.image
  if (!media || !media.url) return null

  const alt = block.alt || media.alt || ''

  if (!alt && process.env.NODE_ENV !== 'production') {
    console.warn('ImageRenderer: Image is missing alt text. This will render as decorative (alt="").', {
      blockId: block.image?.id,
      url: block.image?.url,
    })
  }

  const width = media.width || 800 // fallback if your Payload media doesn’t have these
  const height = media.height || 600

  return (
    <figure className="my-4 text-center">
      <div className="inline-block max-w-full">
        <Image
          src={media.url}
          alt={alt}
          width={width}
          height={height}
          style={{ height: 'auto', width: '100%' }}
        />
      </div>
      {block.caption && (
        <figcaption className="mt-1 text-xs text-gray-600">{block.caption}</figcaption>
      )}
    </figure>
  )
}
