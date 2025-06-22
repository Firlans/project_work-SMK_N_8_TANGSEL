import { useState } from "react";
import axiosClient from "../../../../axiosClient";

const FormJadwal = ({
  isOpen,
  onClose,
  data,
  waktu,
  kelas,
  guru,
  jadwal,
  mapel,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    id_hari: data?.id_hari || "",
    id_waktu: data?.id_waktu || "",
    id_kelas: data?.id_kelas || "",
    id_guru: data?.id_guru || "",
    id_mata_pelajaran: data?.id_mata_pelajaran || "",
  });
  const [error, setError] = useState("");

  const hariOptions = [
    { id: 1, nama: "Senin" },
    { id: 2, nama: "Selasa" },
    { id: 3, nama: "Rabu" },
    { id: 4, nama: "Kamis" },
    { id: 5, nama: "Jumat" },
    { id: 6, nama: "Sabtu" },
  ];

  const checkJadwalBentrok = () => {
    const existingSchedule = jadwal.find(
      (j) =>
        j.id !== data?.id && // Exclude current schedule for edit
        j.id_guru === formData.id_guru &&
        j.id_hari === formData.id_hari &&
        j.id_waktu === formData.id_waktu
    );

    return existingSchedule;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi required fields
    const requiredFields = [
      "id_kelas",
      "id_guru",
      "id_hari",
      "id_waktu",
      "id_mata_pelajaran",
    ];
    const emptyFields = requiredFields.filter((field) => !formData[field]);

    if (emptyFields.length > 0) {
      setError(`Field berikut harus diisi: ${emptyFields.join(", ")}`);
      return;
    }

    // Cek jadwal bentrok di frontend
    const bentrok = checkJadwalBentrok();
    if (bentrok) {
      setError("Guru sudah memiliki jadwal di hari dan waktu yang sama");
      return;
    }

    try {
      const response = data?.id
        ? await axiosClient.put(`/jadwal/${data.id}`, formData)
        : await axiosClient.post("/jadwal", formData);

      onSuccess(response.data.data);

      // // ✅ Buat pertemuan otomatis jika tambah baru
      // if (!data?.id) {
      //   await axiosClient.post("/pertemuan", {
      //     id_jadwal: response.data.data.id,
      //     nama_pertemuan: "Pertemuan 1",
      //     tanggal: new Date().toISOString().split("T")[0],
      //   });
      //   console.log("Pertemuan otomatis berhasil dibuat");
      // }
    } catch (err) {
      if (err.response?.status === 422) {
        // Handle validation errors from backend
        const errors = err.response.data.message;
        if (typeof errors === "string") {
          setError(errors);
        } else {
          // Handle multiple validation errors
          const errorMessages = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("\n");
          setError(errorMessages);
        }
      } else {
        setError(err.response?.data?.message || "Terjadi kesalahan");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-lg relative transition-colors duration-300">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white transition-colors duration-300">
          {data ? "Edit" : "Tambah"} Jadwal
        </h2>

        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* HARI */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">
              Hari
            </label>
            <select
              name="id_hari"
              value={formData.id_hari}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  id_hari: Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white transition-all duration-300"
              required
            >
              <option value="">Pilih Hari</option>
              {hariOptions.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.nama}
                </option>
              ))}
            </select>
          </div>

          {/* WAKTU */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">
              Waktu
            </label>
            <select
              name="id_waktu"
              value={formData.id_waktu}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  id_waktu: Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white transition-all duration-300"
              required
            >
              <option value="">Pilih Waktu</option>
              {waktu.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.jam_mulai.slice(0, 5)} - {w.jam_selesai.slice(0, 5)}
                </option>
              ))}
            </select>
          </div>

          {/* KELAS */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">
              Kelas
            </label>
            <select
              name="id_kelas"
              value={formData.id_kelas}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  id_kelas: Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white transition-all duration-300"
              required
            >
              <option value="">Pilih Kelas</option>
              {kelas.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama_kelas}
                </option>
              ))}
            </select>
          </div>

          {/* GURU */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">
              Guru
            </label>
            <select
              name="id_guru"
              value={formData.id_guru}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  id_guru: Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white transition-all duration-300"
              required
            >
              <option value="">Pilih Guru</option>
              {guru.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nama}
                </option>
              ))}
            </select>
          </div>

          {/* MATA PELAJARAN */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">
              Mata Pelajaran
            </label>
            <select
              name="id_mata_pelajaran"
              value={formData.id_mata_pelajaran}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  id_mata_pelajaran: Number(e.target.value),
                }))
              }
              className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white transition-all duration-300"
              required
            >
              <option value="">Pilih Mata Pelajaran</option>
              {mapel.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama_pelajaran}
                </option>
              ))}
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-zinc-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-zinc-500 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 dark:bg-zinc-800 text-white dark:text-white rounded-lg hover:bg-amber-600 dark:hover:bg-zinc-500 transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormJadwal;
