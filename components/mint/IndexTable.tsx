import React from 'react';

// Using generics to make the table component strongly typed and reusable.
interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface IndexTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

// The generic <T extends {}> ensures that T is an object type.
const IndexTable = <T extends {}>({ columns, data, onRowClick }: IndexTableProps<T>) => {
  const rowClasses = onRowClick ? 'hover:bg-gray-800/70 cursor-pointer' : '';

  return (
    <div className="overflow-hidden border border-gray-700 rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800/50">
            <tr>
              {columns.map(col => (
                <th 
                  key={String(col.accessor)} 
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-900/50 divide-y divide-gray-700">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={rowClasses} 
                  onClick={() => onRowClick && onRowClick(row)}
                  tabIndex={onRowClick ? 0 : -1}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && onRowClick) {
                      e.preventDefault();
                      onRowClick(row);
                    }
                  }}
                >
                  {columns.map(col => (
                    <td 
                      key={`${rowIndex}-${String(col.accessor)}`} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                    >
                      {String(row[col.accessor] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndexTable;
