// app/(frontend)/components/RichTextRenderer.tsx
import React from 'react';
import type { LinkFields } from '@payloadcms/richtext-lexical';
import type { RichTextBlockData, LexicalNode } from '@/types/bylawBlocks';
import { InteractiveLexicalRenderer } from './InteractiveLexicalRenderer';
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

type Props = {
  block: RichTextBlockData;
};

/**
 * Turn LinkFields (from LinkFeature) into an href.
 * Adjust this to match your app's routing for internal links.
 */
function getHrefFromLinkFields(fields: LinkFields | undefined): string | null {
  if (!fields) return null;

  // External / custom link (non-internal)
  if (fields.linkType !== 'internal') {
    return fields.url ?? null;
  }

  // Internal link — map to a URL based on relationTo + slug
  const doc = fields.doc;
  if (!doc || !doc.value) return null;

  const value: any = doc.value;
  const slug: string = value.slug || value.id;

  if (doc.relationTo === 'pages') {
    return `/${slug}`;
  }

  if (doc.relationTo === 'posts') {
    return `/posts/${slug}`;
  }

  // Fallback
  return null;
}

/**
 * Render a single Lexical node (and its children) to React.
 */
function renderNode(node: LexicalNode, key: React.Key): React.ReactNode {
  // 1) Plain text node
  if (node.type === 'text') {
    const textNode = node as any;
    const text = textNode.text ?? '';

    // OPTIONAL: you can look at textNode.format bitmask here to add <strong>/<em>/<u>
    // For now, keep it simple and just render the text.
    return <React.Fragment key={key}>{text}</React.Fragment>;
  }

  const anyNode = node as any;

  // 2) Link node from Lexical LinkFeature
  if (node.type === 'link') {
    const fields = anyNode.fields as LinkFields | undefined;
    const href = getHrefFromLinkFields(fields) ?? '#';

    const newTab = fields?.newTab ?? fields?.target === '_blank'; // depends on how the link plugin stores it
    const rel = newTab ? 'noreferrer noopener' : undefined;

    const children = (anyNode.children || []).map((child: LexicalNode, i: number) =>
      renderNode(child, `${key}-link-${i}`),
    );

    return (
      <a key={key} href={href} target={newTab ? '_blank' : '_self'} rel={rel} className="underline">
        {children}
      </a>
    );
  }

  // 3) Paragraph node
  if (node.type === 'paragraph') {
    const children = (anyNode.children || []).map((child: LexicalNode, i: number) =>
      renderNode(child, `${key}-p-${i}`),
    );

    return (
      <p key={key} className="mb-2 whitespace-pre-wrap">
        {children}
      </p>
    );
  }

  // 4) Line break node
  if (node.type === 'linebreak') {
    return <br key={key} />;
  }

  // 5) Fallback: generic container-ish nodes → render children inline
  if (Array.isArray(anyNode.children)) {
    return (
      <span key={key}>
        {anyNode.children.map((child: LexicalNode, i: number) =>
          renderNode(child, `${key}-child-${i}`),
        )}
      </span>
    );
  }

  return null;
}

export function RichTextRenderer({ block }: Props) {
  // const root = block.body?.root;
  // if (!root || !Array.isArray(root.children) || root.children.length === 0) {
  //   return null;
  // }

  // return <>{root.children.map((child, i) => renderNode(child, `root-${i}`))}</>;
  if (!block.body) return null;
  return <InteractiveLexicalRenderer data={block.body as SerializedEditorState} />;
}
