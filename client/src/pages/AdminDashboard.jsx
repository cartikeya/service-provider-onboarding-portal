import React, { useEffect, useState } from "react";
import API from "../api/axios";
import StatsOverview from "../components/admin/StatsOverview";
import FilterBar from "../components/admin/FilterBar";
import ProviderTable from "../components/admin/ProviderTable";
import ProviderDetailModal from "../components/admin/ProviderDetailModal";
import RejectModal from "../components/admin/RejectModal";

export default function AdminDashboard() {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, [search, statusFilter, page]);

  const fetchProviders = async () => {
    try {
      const res = await API.get("/admin/providers", {
        params: { search, status: statusFilter, page, limit: 8 },
      });
      if (res.data.success) {
        setProviders(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch providers:", err);
    }
  };

  const handleStatusUpdate = async (id, status, remark = "") => {
    try {
      const res = await API.patch(`/admin/providers/${id}/status`, {
        status,
        rejectionRemark: remark,
      });

      if (res.data.success) {
        setIsRejectOpen(false);
        setSelectedProvider(null);
        fetchProviders();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Control Panel
          </h1>
          <p className="text-xs text-gray-500">
            Review provider applications and verify uploaded documents.
          </p>
        </header>

        <StatsOverview />

        <FilterBar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onFilterChange={() => setPage(1)}
        />

        <ProviderTable
          providers={providers}
          onSelect={setSelectedProvider}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />

        <ProviderDetailModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
          onApprove={(id) => handleStatusUpdate(id, "approved")}
          onRejectClick={() => setIsRejectOpen(true)}
        />

        <RejectModal
          isOpen={isRejectOpen}
          onClose={() => setIsRejectOpen(false)}
          providerName={selectedProvider?.name}
          onSubmit={(remark) =>
            handleStatusUpdate(selectedProvider._id, "rejected", remark)
          }
        />
      </div>
    </div>
  );
}
