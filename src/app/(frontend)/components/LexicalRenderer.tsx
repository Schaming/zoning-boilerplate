// app/(frontend)/components/LexicalRenderer.tsx
import React from 'react';
import type { LinkFields } from '@payloadcms/richtext-lexical';
import type { LexicalNode, LexicalRoot } from '@/types/bylawBlocks';

type Props = {
  root: LexicalRoot;
  className?: string;
};

/** Try to compute an href from LinkFields (external + internal) */
function getHrefFromLinkFields(fields: LinkFields | undefined): string | null {
  if (!fields) return null;

  // External / custom link
  if (fields.linkType !== 'internal') {
    return fields.url ?? null;
  }

  // Internal link: map `doc` to a URL.
  // Adjust this to match your app's routing.
  const doc = fields.doc;
  if (!doc || !doc.value) return null;

  const value: any = doc.value;
  const slug = value.slug || value.id;

  if (doc.relationTo === 'pages') {
    return `/${slug}`;
  }

  if (doc.relationTo === 'posts') {
    return `/posts/${slug}`;
  }

  return null;
}

/** Render a single Lexical node (and its children) to React. */
function renderNode(node: LexicalNode, key: React.Key): React.ReactNode {
  // 1) TEXT NODE
  if (node.type === 'text') {
    const textNode = node as any;
    const text = textNode.text ?? '';

    // You *can* look at textNode.format here to add <strong>, etc.
    // For now we'll just render plain text.
    return <React.Fragment key={key}>{text}</React.Fragment>;
  }

  const anyNode = node as any;

  // 2) LINK NODE (from LinkFeature)
  if (node.type === 'link') {
    const fields = anyNode.fields as LinkFields | undefined;
    const href = getHrefFromLinkFields(fields) ?? '#';
    const newTab = fields?.newTab ?? fields?.target === '_blank'; // depending on how it’s stored
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

  // 3) PARAGRAPH
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

  // 4) LINE BREAK
  if (node.type === 'linebreak') {
    return <br key={key} />;
  }

  // 5) FALLBACK: container-ish nodes -> just render children inline
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

export function LexicalRenderer({ root, className }: Props) {
  if (!root?.root) return null;

  const top = root.root as any;
  const children: LexicalNode[] = Array.isArray(top.children)
    ? (top.children as LexicalNode[])
    : [];

  return (
    <div className={className}>{children.map((child, i) => renderNode(child, `root-${i}`))}</div>
  );
}
