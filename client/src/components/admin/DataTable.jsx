import React, { useState } from 'react'
import { FiChevronUp, FiChevronDown, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  pageSize = 10,
  searchable = true,
  title
}) => {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const filtered = data.filter(row =>
    !search || columns.some(col =>
      String(row[col.key] || '').toLowerCase().includes(search.toLowerCase())
    )
  )

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0
    const av = a[sortKey], bv = b[sortKey]
    if (av === bv) return 0
    const cmp = av > bv ? 1 : -1
    return sortDir === 'asc' ? cmp : -cmp
  })

  const totalPages = Math.ceil(sorted.length / pageSize)
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
      {(title || searchable) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-gray-100 dark:border-gray-700">
          {title && <h3 className="font-bold text-dark dark:text-white text-lg">{title}</h3>}
          {searchable && (
            <div className="relative flex-1 max-w-xs">
              <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
              />
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider
                    ${col.sortable !== false ? 'cursor-pointer hover:text-primary select-none' : ''}`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      sortDir === 'asc' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  {columns.map((col, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">📭</span>
                    <span>No records found</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr key={row._id || i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-sm text-dark dark:text-gray-300">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
            >
              <FiChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
