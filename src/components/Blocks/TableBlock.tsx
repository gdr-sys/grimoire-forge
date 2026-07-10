import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { TableBlockData } from '../../types/block';

interface Props {
  data: TableBlockData;
  isSelected: boolean;
  onChange: (patch: Partial<TableBlockData>) => void;
}

export function TableBlock({ data, isSelected, onChange }: Props) {
  const [editingCell, setEditingCell] = useState<string | null>(null);

  function updateHeader(col: number, val: string) {
    const headers = [...data.headers];
    headers[col] = val;
    onChange({ headers });
  }

  function updateCell(row: number, col: number, val: string) {
    const rows = data.rows.map((r) => [...r]);
    rows[row][col] = val;
    onChange({ rows });
  }

  function addColumn() {
    onChange({
      headers: [...data.headers, `Colonna ${data.headers.length + 1}`],
      rows: data.rows.map((r) => [...r, '']),
    });
  }

  function addRow() {
    onChange({ rows: [...data.rows, new Array(data.headers.length).fill('')] });
  }

  function removeRow(idx: number) {
    onChange({ rows: data.rows.filter((_, i) => i !== idx) });
  }

  function removeColumn(col: number) {
    onChange({
      headers: data.headers.filter((_, i) => i !== col),
      rows: data.rows.map((r) => r.filter((_, i) => i !== col)),
    });
  }

  return (
    <div className="overflow-x-auto">
      {data.caption && (
        <p className="mb-1 text-center text-xs italic text-slate-500">{data.caption}</p>
      )}
      <table className={`w-full text-sm ${data.bordered ? 'border border-slate-300 dark:border-slate-600' : ''}`}>
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-700">
            {data.headers.map((h, ci) => (
              <th
                key={ci}
                className={`px-2 py-1 text-left font-semibold ${data.bordered ? 'border border-slate-300 dark:border-slate-600' : ''}`}
              >
                {isSelected ? (
                  <input
                    value={h}
                    onChange={(e) => updateHeader(ci, e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                ) : h}
              </th>
            ))}
            {isSelected && (
              <th className="w-6 px-1">
                <button onClick={addColumn} className="text-slate-400 hover:text-[--color-forge-purple]">
                  <Plus size={12} />
                </button>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr
              key={ri}
              className={data.striped && ri % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800/40' : ''}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-2 ${data.compact ? 'py-0.5' : 'py-1'} ${data.bordered ? 'border border-slate-200 dark:border-slate-700' : ''}`}
                >
                  {isSelected ? (
                    <input
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      className="w-full bg-transparent outline-none"
                    />
                  ) : cell}
                </td>
              ))}
              {isSelected && (
                <td className="w-6 px-1">
                  <button onClick={() => removeRow(ri)} className="text-slate-300 hover:text-red-400">
                    <Minus size={11} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isSelected && (
        <div className="mt-2 flex flex-wrap gap-2">
          <button onClick={addRow} className="flex items-center gap-1 text-xs text-slate-500 hover:text-[--color-forge-purple]">
            <Plus size={11} /> Riga
          </button>
          <label className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
            <input type="checkbox" checked={data.striped} onChange={(e) => onChange({ striped: e.target.checked })} />
            Righe alternate
          </label>
          <label className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
            <input type="checkbox" checked={data.bordered} onChange={(e) => onChange({ bordered: e.target.checked })} />
            Bordi
          </label>
          <label className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
            <input type="checkbox" checked={data.compact} onChange={(e) => onChange({ compact: e.target.checked })} />
            Compatta
          </label>
        </div>
      )}
    </div>
  );
}
