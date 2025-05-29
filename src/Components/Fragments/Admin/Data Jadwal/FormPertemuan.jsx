import { useEffect, useState } from "react";
import axiosClient from "../../../../axiosClient";

const FormPertemuan = ({ isOpen, onClose, data, idJadwal, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    nama_pertemuan: "",
    tanggal: "",
  });

  const [jumlah, setJumlah] = useState(1);

  useEffect(() => {
    if (data) {
      setEditForm({
        nama_pertemuan: data.nama_pertemuan || "",
        tanggal: data.tanggal || "",
      });
    }
  }, [data]);

  // ✅ Edit 1 pertemuan
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.put(`/pertemuan/${data.id}`, {
        ...editForm,
        id_jadwal: idJadwal,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Gagal mengedit pertemuan:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Tambah banyak pertemuan + buat presensi otomatis
  const handleGenerate = async () => {
    if (jumlah <= 0) return;
    setLoading(true);

    try {
      const today = new Date();

      // Ambil jadwal → dapat id_kelas
      const resJadwal = await axiosClient.get(`/jadwal/${idJadwal}`);
      const idKelas = resJadwal.data.data.id_kelas;

      // Ambil siswa dalam kelas itu
      const resSiswa = await axiosClient.get("/siswa");
      const siswaKelas = resSiswa.data.data.filter(
        (s) => s.id_kelas === idKelas
      );

      // Loop pertemuan satu per satu
      for (let i = 0; i < jumlah; i++) {
        const tanggal = new Date(today);
        tanggal.setDate(today.getDate() + i * 7);
        const tanggalStr = tanggal.toISOString().split("T")[0];

        // Buat pertemuan
        const resPertemuan = await axiosClient.post("/pertemuan", {
          id_jadwal: idJadwal,
          nama_pertemuan: `Pertemuan ${i + 1}`,
          tanggal: tanggalStr,
        });

        const idPertemuan = resPertemuan.data.data.id;

        // Buat presensi untuk semua siswa
        for (const siswa of siswaKelas) {
          const resAbsen = await axiosClient.post("/absen", {
            id_siswa: siswa.id,
            id_pertemuan: idPertemuan,
            status: null,
            keterangan: null,
            tanggal: tanggalStr,
          });
          console.log("✅ Presensi dibuat:", resAbsen.data);
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("❌ Gagal membuat pertemuan/presensi:", err);
      alert("Gagal membuat pertemuan atau presensi.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {data ? "Edit Pertemuan" : "Tambah Banyak Pertemuan"}
        </h2>

        {data ? (
          // FORM EDIT
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Nama Pertemuan
              </label>
              <input
                type="text"
                name="nama_pertemuan"
                value={editForm.nama_pertemuan}
                onChange={(e) =>
                  setEditForm({ ...editForm, nama_pertemuan: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Tanggal</label>
              <input
                type="date"
                name="tanggal"
                value={editForm.tanggal}
                onChange={(e) =>
                  setEditForm({ ...editForm, tanggal: e.target.value })
                }
                className="w-full border px-3 py-2 rounded mt-1"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        ) : (
          // FORM TAMBAH BANYAK
          <>
            <label className="block text-sm mb-2">Jumlah Pertemuan</label>
            <input
              type="number"
              min="1"
              value={jumlah}
              onChange={(e) => setJumlah(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Masukkan jumlah (contoh: 10)"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Buat"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FormPertemuan;
