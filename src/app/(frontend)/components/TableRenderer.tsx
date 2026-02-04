import { TableBlockData, TableCell } from '@/types/bylawBlocks';
import { extractTextFromLexicalRoot } from './LexicalUtils';
import { LexicalRenderer } from './LexicalRenderer';
import { InteractiveLexicalRenderer } from './InteractiveLexicalRenderer';
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';
import { RichTextRenderer } from './RichTextRenderer';

type Props = {
  block: TableBlockData;
};

function renderCellContent(cell: TableCell) {
  if (cell.body) {
    return <InteractiveLexicalRenderer data={cell.body as SerializedEditorState} />;
  }

  return cell.text ?? '';
}

function mergeCellClasses(base: string, extra?: string | null) {
  if (!extra) return base;
  return `${base} ${extra}`.trim();
}

function getColSpan(cell: TableCell) {
  // ✅ ensure valid default
  return typeof (cell as any).colSpan === 'number' && (cell as any).colSpan >= 1
    ? (cell as any).colSpan
    : 1;
}

export function TableRenderer({ block }: Props) {
  const baseHeaderClass = 'border px-2 py-1 text-left font-semibold align-bottom';
  const baseCellClass = 'border px-2 py-1 align-top';

  const { title, titleRich, style, rows } = block;
  if (!rows || rows.length === 0) return null;
  const headerRow = rows[0];
  const bodyRows = rows.slice(1);
  const totalCols = headerRow?.cells?.length ?? 1;

  return (
    <figure className="my-4">
      {/* Optional: use style or label/title later if you add them */}
      <div className="overflow-x-auto">
        {titleRich ? (
          <div className="mb-2 text-sm font-semibold text-gray-800">
            <RichTextRenderer block={{ body: titleRich } as any} />
          </div>
        ) : title ? (
          <p className="mb-2 text-sm font-semibold text-gray-800">{title}</p>
        ) : null}{' '}
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr>
              {(headerRow.cells ?? []).map((cell, idx) => (
                <th
                  key={cell.id ?? `h-${idx}`}
                  className={mergeCellClasses(baseHeaderClass, cell.className)}
                  colSpan={getColSpan(cell)}
                  scope="col"
                >
                  {renderCellContent(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rIdx) => (
              <tr key={row.id ?? `r-${rIdx}`}>
                {(row.cells ?? []).map((cell, cIdx) => {
                  const isHeader = !!cell.isHeader;
                  const CellTag = isHeader ? 'th' : 'td';
                  const baseClass = isHeader ? baseHeaderClass : baseCellClass;
                  const colSpan = getColSpan(cell);

                  // Optional: if this is a “section header row” spanning all columns,
                  // you can force it to span the full table even if someone forgot:
                  const normalizedColSpan =
                    isHeader && (row.cells?.length ?? 0) === 1
                      ? Math.max(colSpan, totalCols)
                      : colSpan;

                  return (
                    <CellTag
                      key={cell.id ?? `c-${rIdx}-${cIdx}`}
                      className={mergeCellClasses(baseClass, cell.className)}
                      colSpan={normalizedColSpan} // ✅ spanning header row
                      scope={isHeader ? 'row' : undefined}
                    >
                      {renderCellContent(cell)}
                    </CellTag>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
