'use client';

import { useMemo, useState } from 'react';

type SubsectionNavItem = {
  id: string | number;
  slug: string;
  code: string;
  title: string;
  level?: number;
};

type NavNode = {
  id: string | number;
  slug: string;
  code: string;
  title: string;
  level: number;
  children: NavNode[];
};

function buildTree(subsections: SubsectionNavItem[]): NavNode[] {
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
  subsections: SubsectionNavItem[];
};

export function SubsectionSidebar({ subsections }: Props) {
  const tree = useMemo(() => buildTree(subsections), [subsections]);
  const [openState, setOpenState] = useState<Record<string | number, boolean>>(() =>
    Object.fromEntries(subsections.map(sub => [sub.id, true])),
  );

  const toggle = (id: string | number) => {
    setOpenState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (node: NavNode) => {
    const isOpen = openState[node.id] ?? true;
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id} className="space-y-1">
        <div className="flex items-center" style={{ marginLeft: `${(node.level - 1) * 12}px` }}>
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggle(node.id)}
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

  return <div className="space-y-1">{tree.map(renderNode)}</div>;
}
