'use client';

import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { getClientSideURL } from '@/utilities/getURL';

export type Amendment = {
  id: string | number;
  amendmentId: string;
  year: number;
  title: string;
  body: SerializedEditorState;
};

type ReferenceType = 'definition' | 'amendment';

// Claude: Added images field to DefinitionData
type DefinitionData = {
  type: 'definition';
  term: string;
  content: SerializedEditorState | null;
  images?: Array<{
    id: string | number;
    url: string;
    alt?: string;
    filename?: string;
  }> | null;
};

type AmendmentData = {
  type: 'amendment';
  amendment: Amendment;
};

type ReferenceData = DefinitionData | AmendmentData | null;

type ReferenceSidebarState = {
  data: ReferenceData;
  loading: boolean;
  error: string | null;
  lookupId: number;
  selectTerm: (term: string) => Promise<void>;
  selectAmendment: (amendment: Amendment) => void;
  clear: () => void;
};

export const ReferenceSidebarContext = createContext<ReferenceSidebarState | undefined>(undefined);

// Claude: Modified to return both text and images
async function fetchDefinitionText(term: string): Promise<{ text: SerializedEditorState | null; images: any[] | null }> {
  if (!term) return { text: null, images: null };
  const base = getClientSideURL();
  const url = `${base}/api/definitions?where[term][equals]=${encodeURIComponent(term)}&depth=2&limit=1`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return { text: null, images: null };
  const json = await res.json();
  const doc = json?.docs?.[0];
  const text = doc?.definitionContent?.text;
  const images = doc?.definitionContent?.images;
  return {
    text: text && typeof text === 'object' ? (text as SerializedEditorState) : null,
    images: Array.isArray(images) ? images : null
  };
}

// Claude: Updated cache to store both text and images
export function ReferenceSidebarProvider({ children }: { children: React.ReactNode }) {
  const cache = useRef<Map<string, { text: SerializedEditorState; images: any[] | null }>>(new Map());
  const [data, setData] = useState<ReferenceData>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lookupId, setLookupId] = useState(0);

  const selectTerm = async (term: string) => {
    if (!term) return;
    setLookupId(prev => prev + 1);
    setError(null);

    const cached = cache.current.get(term);
    if (cached !== undefined) {
      setData({ type: 'definition', term, content: cached.text, images: cached.images });
      setLoading(false);
      return;
    }

    // Show loading state with term
    setData({ type: 'definition', term, content: null, images: null });
    setLoading(true);

    try {
      const result = await fetchDefinitionText(term);
      if (result.text) {
        cache.current.set(term, { text: result.text, images: result.images });
        setData({ type: 'definition', term, content: result.text, images: result.images });
      } else {
        setData({ type: 'definition', term, content: null, images: null });
        setError('Definition not found');
      }
    } catch (err) {
      console.error('selectTerm failed', err);
      setData({ type: 'definition', term, content: null, images: null });
      setError('Failed to load definition');
    } finally {
      setLoading(false);
    }
  };

  const selectAmendment = (amendment: Amendment) => {
    setLookupId(prev => prev + 1);
    setError(null);
    setLoading(false);
    setData({ type: 'amendment', amendment });
  };

  const clear = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  const value = useMemo(
    () => ({ data, loading, error, lookupId, selectTerm, selectAmendment, clear }),
    [data, loading, error, lookupId],
  );

  return (
    <ReferenceSidebarContext.Provider value={value}>
      {children}
    </ReferenceSidebarContext.Provider>
  );
}

export function useReferenceSidebar() {
  const ctx = useContext(ReferenceSidebarContext);
  if (!ctx) throw new Error('useReferenceSidebar must be used within ReferenceSidebarProvider');
  return ctx;
}
