import React from "react";

const FormPresensi = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  statusOptions, 
  isEdit = false 
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">Tanggal</label>
        <input
          type="date"
          value={formData.tanggal}
          onChange={(e) =>
            setFormData({ ...formData, tanggal: e.target.value })
          }
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value })
          }
          className="w-full p-2 border rounded"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">Keterangan</label>
        <textarea
          value={formData.keterangan}
          onChange={(e) =>
            setFormData({ ...formData, keterangan: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {isEdit ? "Update" : "Simpan"}
        </button>
      </div>
    </form>
  );
};

export default FormPresensi;