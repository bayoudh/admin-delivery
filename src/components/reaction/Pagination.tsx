interface PaginationProps<T> {
  page: number;
  entries: number;
  filtered: T[]; // the actual filtered list
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

export default function Pagination<T>({
  page,
  entries,
  filtered,
  setPage,
  totalPages,
}: PaginationProps<T>) {
  return (
    <div className="flex justify-between items-center mt-4 text-lg">
      <span>
        Showing {(page - 1) * entries + 1} to{" "}
        {Math.min(page * entries, filtered.length)} of{" "}
        {filtered.length} entries
      </span>
      <div className="flex space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className={`px-3 py-1 rounded-lg border ${
            page === 1
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded-lg border ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className={`px-3 py-1 rounded-lg border ${
            page === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
