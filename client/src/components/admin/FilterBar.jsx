import React from "react";
import { Search } from "lucide-react";

export default function FilterBar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onFilterChange,
}) {
  const statuses = ["", "pending", "approved", "rejected"];

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => {
              setStatusFilter(st);
              onFilterChange();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
              statusFilter === st
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {st === "" ? "All Applications" : st}
          </button>
        ))}
      </div>
    </div>
  );
}
