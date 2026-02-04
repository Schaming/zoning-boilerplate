'use client';

import { useState } from 'react';
import Link from 'next/link';

type SidebarSubsection = {
  id: string | number;
  slug: string;
  code: string;
  title: string;
  level?: number;
};

type SidebarSection = {
  id: string | number;
  slug: string;
  code: string;
  title: string;
  subsections: SidebarSubsection[];
};

type NavNode = SidebarSubsection & { level: number; children: NavNode[] };

function buildTree(subsections: SidebarSubsection[]): NavNode[] {
  const roots: NavNode[] = [];
  const stack: NavNode[] = [];

  subsections.forEach(sub => {
    const level = sub.level ?? 1;
    const node: NavNode = { ...sub, level, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length > 0) {
      stack[stack.length - 1].children.push(node);
    } else {
      roots.push(node);
    }

    stack.push(node);
  });

  return roots;
}

type Props = {
  items: SidebarSection[];
};

const makeKey = (type: 'section' | 'sub', id: string | number) => `${type}:${id}`;

export function AllBylawsSidebar({ items }: Props) {
  const [openState, setOpenState] = useState<Record<string, boolean>>(() => {
    const pairs: [string, boolean][] = [];
    items.forEach(item => {
      pairs.push([makeKey('section', item.id), false]); // sections collapsed by default
      item.subsections.forEach(sub => {
        pairs.push([makeKey('sub', sub.id), false]); // subsections collapsed by default
      });
    });
    return Object.fromEntries(pairs);
  });

  const toggle = (id: string | number) => setOpenState(prev => ({ ...prev, [id]: !prev[id] }));

  const renderNode = (node: NavNode) => {
    const key = makeKey('sub', node.id);
    const isOpen = openState[key] ?? false;
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id} className="space-y-1">
        <div className="flex items-center" style={{ marginLeft: `${(node.level - 1) * 12}px` }}>
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggle(key)}
              aria-label={isOpen ? 'Collapse subsection' : 'Expand subsection'}
              className="mr-2 flex h-6 w-[25px] min-w-[25px] max-w-[25px] items-center justify-center rounded border text-xs"
            >
              {isOpen ? '−' : '+'}
            </button>
          ) : (
            <span className="mr-2 block h-6 w-[25px] min-w-[25px] max-w-[25px]" />
          )}

          <a href={`#${node.slug}`} className="hover:underline">
            {node.code} {node.title}
          </a>
        </div>

        {hasChildren && isOpen && (
          <div className="space-y-1">{node.children.map(child => renderNode(child))}</div>
        )}
      </div>
    );
  };

  return (
    <nav className="text-sm space-y-3" aria-label="Table of Contents">
      {items.map(item => {
        const sectionKey = makeKey('section', item.id);
        const isOpen = openState[sectionKey] ?? false;
        const tree = buildTree(item.subsections);
        const hasChildren = tree.length > 0;

        return (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center">
              {hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggle(sectionKey)}
                  aria-label={isOpen ? 'Collapse subsections' : 'Expand subsections'}
                  className="mr-2 flex h-6 w-[25px] min-w-[25px] max-w-[25px] items-center justify-center rounded border text-xs"
                >
                  {isOpen ? '−' : '+'}
                </button>
              ) : (
                <span className="mr-2 block h-6 w-[25px] min-w-[25px] max-w-[25px]" />
              )}

              <Link href={`#${item.slug}`} className="font-semibold hover:underline">
                {item.code} {item.title}
              </Link>
            </div>

            {hasChildren && isOpen && <div className="ml-2 space-y-1">{tree.map(renderNode)}</div>}
          </div>
        );
      })}
    </nav>
  );
}
