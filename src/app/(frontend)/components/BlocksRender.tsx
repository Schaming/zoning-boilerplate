// components/BlocksRenderer.tsx
import { BylawBlock } from '@/types/bylawBlocks'
import { RichTextRenderer } from './RichTextRenderer'
import { TableRenderer } from './TableRenderer'
import { ListRenderer } from './ListRenderer'
import { ImageRenderer } from './ImageRenderer'

type Props = {
  blocks: BylawBlock[]
}

export function BlocksRenderer({ blocks }: Props) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map(block => {
        const key = block.id ?? `${block.blockType}-${Math.random().toString(36).slice(2)}`
        switch (block.blockType) {
          case 'richText':
            return <RichTextRenderer key={key} block={block} />
          case 'table':
            return <TableRenderer key={key} block={block} />
          case 'list':
            return <ListRenderer key={key} block={block} />
          case 'image':
            return <ImageRenderer key={key} block={block} />
          default:
            // exhaustive check protection
            console.warn('Unknown blockType', block)
            return null
        }
      })}
    </>
  )
}
