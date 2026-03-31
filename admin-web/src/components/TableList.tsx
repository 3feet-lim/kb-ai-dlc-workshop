"use client";

interface Table {
  id: string;
  table_number: number;
  created_at: string;
}

interface Props {
  tables: Table[];
}

export default function TableList({ tables }: Props) {
  return (
    <div className="table-list" data-testid="table-list">
      {tables.length === 0 && <p>등록된 테이블이 없습니다.</p>}
      <ul>
        {tables.map((t) => (
          <li key={t.id} className="table-list-item" data-testid={`table-item-${t.table_number}`}>
            <span className="table-number-badge">테이블 {t.table_number}</span>
            <span className="text-muted">
              등록일: {new Date(t.created_at).toLocaleDateString("ko-KR")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
