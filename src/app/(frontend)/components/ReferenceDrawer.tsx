'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useReferenceSidebar } from './ReferenceSidebarContext';
import { InteractiveLexicalRenderer } from './InteractiveLexicalRenderer';

export function ReferenceDrawer() {
  const { data, loading, error, lookupId } = useReferenceSidebar();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (lookupId > 0) {
      setIsOpen(true);
    }
  }, [lookupId]);

  return (
    <>
      <button
        type="button"
        className="md:hidden fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-lg shadow-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        onClick={() => setIsOpen(true)}
      >
        View reference
      </button>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          <section 
            className="relative mt-auto w-full rounded-t-2xl bg-white shadow-xl flex flex-col max-h-[70vh]"
            aria-label="Reference Details"
          >
            <div className="flex items-center justify-between p-4 border-b shrink-0">
              <div className="font-semibold text-sm uppercase text-gray-600 tracking-wider">
                {data?.type === 'definition' ? 'Definition' : data?.type === 'amendment' ? 'Amendment' : 'Reference'}
              </div>
              <button
                type="button"
                className="p-1 text-gray-600 transition hover:text-gray-800"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              {!data && (
                <p className="text-sm text-gray-600 italic">
                  Tap a definition or amendment link to view details.
                </p>
              )}

              {data?.type === 'definition' && (
                <div className="space-y-3">
                  <div className="highlight-def inline-block px-2 py-1 rounded text-sm uppercase tracking-wide">
                    {data.term}
                  </div>
                  {loading && <p className="text-sm text-gray-600 animate-pulse">Loading...</p>}
                  {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                  {!loading && !error && data.content && (
                    <div className="prose prose-sm text-gray-800 border-t pt-3">
                      <InteractiveLexicalRenderer data={data.content} />
                    </div>
                  )}
                  {!loading && !error && !data.content && (
                    <p className="text-sm text-gray-600 italic">No definition found.</p>
                  )}
                </div>
              )}

              {data?.type === 'amendment' && (
                <div className="space-y-3">
                  <div className="bg-amber-100 inline-block px-2 py-1 rounded text-sm font-medium">
                    {data.amendment.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    Year: {data.amendment.year}
                  </div>
                  <div className="prose prose-sm text-gray-800 border-t pt-3">
                    <InteractiveLexicalRenderer data={data.amendment.body} />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
