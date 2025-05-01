import { useState, useEffect } from "react";

const JadwalModal = ({
  isOpen,
  onClose,
  onSubmit,
  jadwalData,
  mode,
  mataPelajaran,
  kelasData,
}) => {
  const [formData, setFormData] = useState({
    id_kelas: jadwalData?.id_kelas || "",
    id_mata_pelajaran: jadwalData?.id_mata_pelajaran || "",
    id_hari: jadwalData?.id_hari || "",
    jam_mulai: jadwalData?.jam_mulai || "",
    jam_selesai: jadwalData?.jam_selesai || "",
  });

  useEffect(() => {
    if (jadwalData && mode === "edit") {
      setFormData(jadwalData);
    }
  }, [jadwalData, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Log data yang akan dikirim
    console.log("📝 Mengirim data jadwal:", {
      mode: mode,
      formData: formData,
    });

    try {
      // Kirim data ke parent component
      onSubmit(formData);
      console.log("✅ Data berhasil disimpan:", {
        mode: mode,
        data: formData,
      });
    } catch (err) {
      console.error("❌ Error saat menyimpan data:", {
        mode: mode,
        error: err.message,
        data: formData,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {mode === "add" ? "Tambah Jadwal" : "Edit Jadwal"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Hari</label>
            <select
              className="w-full border rounded p-2"
              value={formData.id_hari}
              onChange={(e) =>
                setFormData({ ...formData, id_hari: e.target.value })
              }
              required
            >
              <option value="">Pilih Hari</option>
              {[1, 2, 3, 4, 5].map((id) => (
                <option key={id} value={id}>
                  {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"][id - 1]}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Jam Mulai</label>
            <input
              type="time"
              className="w-full border rounded p-2"
              value={formData.jam_mulai}
              onChange={(e) =>
                setFormData({ ...formData, jam_mulai: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Jam Selesai</label>
            <input
              type="time"
              className="w-full border rounded p-2"
              value={formData.jam_selesai}
              onChange={(e) =>
                setFormData({ ...formData, jam_selesai: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Kelas</label>
            <select
              className="w-full border rounded p-2"
              value={formData.id_kelas}
              onChange={(e) =>
                setFormData({ ...formData, id_kelas: e.target.value })
              }
              required
            >
              <option value="">Pilih Kelas</option>
              {kelasData &&
                Object.values(kelasData).map((kelas) => (
                  <option key={kelas.id} value={kelas.id}>
                    {kelas.nama_kelas}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Mata Pelajaran</label>
            <select
              className="w-full border rounded p-2"
              value={formData.id_mata_pelajaran}
              onChange={(e) =>
                setFormData({ ...formData, id_mata_pelajaran: e.target.value })
              }
              required
            >
              <option value="">Pilih Mata Pelajaran</option>
              {mataPelajaran.map((mapel) => (
                <option key={mapel.id} value={mapel.id}>
                  {mapel.id} - {mapel.nama_pelajaran}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JadwalModal;
