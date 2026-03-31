"use client";

interface Table {
  id: string;
  table_number: number;
}

interface Props {
  tables: Table[];
  selected: string | null;
  onChange: (tableId: string | null) => void;
}

export default function TableFilter({ tables, selected, onChange }: Props) {
  return (
    <div className="table-filter" data-testid="table-filter">
      <label htmlFor="tableFilter">테이블 필터</label>
      <select
        id="tableFilter"
        value={selected ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        data-testid="table-filter-select"
      >
        <option value="">전체 테이블</option>
        {tables.map((t) => (
          <option key={t.id} value={t.id}>
            테이블 {t.table_number}
          </option>
        ))}
      </select>
    </div>
  );
}
