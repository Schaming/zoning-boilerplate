import type { LexicalNode, LexicalRoot } from '@/types/bylawBlocks'

export function extractTextFromLexicalNode(node: LexicalNode): string {
  if ('text' in node && typeof node.text === 'string') {
    return node.text
  }

  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map(extractTextFromLexicalNode).join('')
  }

  return ''
}

export function extractTextFromLexicalRoot(root?: LexicalRoot): string {
  if (!root?.root) return ''
  const top = root.root
  if (!Array.isArray(top.children)) return ''
  return top.children.map(extractTextFromLexicalNode).join('\n')
}
