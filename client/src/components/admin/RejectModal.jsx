import React, { useState } from "react";
import Modal from "../common/Modal";

export default function RejectModal({
  isOpen,
  onClose,
  onSubmit,
  providerName,
}) {
  const [remark, setRemark] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(remark);
    setRemark("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Provide Rejection Remark"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit}>
        <p className="text-xs text-gray-500 mb-4">
          Please enter the reason for rejecting{" "}
          <strong className="text-gray-800">{providerName}</strong>'s
          application.
        </p>
        <textarea
          rows="3"
          required
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="e.g., ID proof is blurry, invalid qualification certificate..."
          className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition"
          >
            Submit Rejection
          </button>
        </div>
      </form>
    </Modal>
  );
}
