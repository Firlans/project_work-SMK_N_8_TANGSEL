import { useState } from "react";
import axiosClient from "../../../../axiosClient";
import LoadingSpinner from "../../../Elements/Loading/LoadingSpinner";

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
    id_waktu: data?.id_waktu ? [data.id_waktu] : [],
    id_kelas: data?.id_kelas || "",
    id_guru: data?.id_guru || "",
    id_mata_pelajaran: data?.id_mata_pelajaran || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const hariOptions = [
    { id: 1, nama: "Senin" },
    { id: 2, nama: "Selasa" },
    { id: 3, nama: "Rabu" },
    { id: 4, nama: "Kamis" },
    { id: 5, nama: "Jumat" },
    { id: 6, nama: "Sabtu" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const requiredFields = [
      "id_kelas",
      "id_guru",
      "id_hari",
      "id_mata_pelajaran",
    ];
    const emptyFields = requiredFields.filter((field) => !formData[field]);
    if (formData.id_waktu.length === 0) emptyFields.push("id_waktu");

    if (emptyFields.length > 0) {
      setError(`Field berikut harus diisi: ${emptyFields.join(", ")}`);
      return;
    }

    const bentrokList = formData.id_waktu.filter((idWaktu) =>
      jadwal.some(
        (j) =>
          j.id !== data?.id &&
          j.id_guru === formData.id_guru &&
          j.id_hari === formData.id_hari &&
          j.id_waktu === idWaktu
      )
    );

    if (bentrokList.length > 0) {
      setError("Beberapa jam yang dipilih sudah ada jadwal untuk guru ini.");
      return;
    }

    try {
      setLoading(true);
      if (data?.id) {
        // mode edit: tetap pakai 1 waktu
        const response = await axiosClient.put(`/jadwal/${data.id}`, {
          ...formData,
          id_waktu: formData.id_waktu[0],
        });
        onSuccess(response.data.data);
      } else {
        const createdList = [];

        for (const waktuId of formData.id_waktu) {
          const payload = { ...formData, id_waktu: waktuId };
          const res = await axiosClient.post("/jadwal", payload);
          createdList.push(res.data.data);
        }
        onSuccess(createdList);
      }
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.message;
        if (typeof errors === "string") {
          setError(errors);
        } else {
          const errorMessages = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("\n");
          setError(errorMessages);
        }
      } else {
        setError(err.response?.data?.message || "Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  if (loading) return <LoadingSpinner text="Menyimpan jadwal..." />;

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
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Pilih Waktu (bisa lebih dari 1)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {waktu.map((w) => (
                <label key={w.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={w.id}
                    checked={formData.id_waktu.includes(w.id)}
                    onChange={(e) => {
                      const waktuId = Number(e.target.value);
                      const selected = formData.id_waktu.includes(waktuId)
                        ? formData.id_waktu.filter((id) => id !== waktuId)
                        : [...formData.id_waktu, waktuId];
                      setFormData((prev) => ({ ...prev, id_waktu: selected }));
                    }}
                    className="accent-amber-500"
                  />
                  <span className="text-sm text-gray-800 dark:text-gray-100">
                    {w.jam_mulai.slice(0, 5)} - {w.jam_selesai.slice(0, 5)}
                  </span>
                </label>
              ))}
            </div>
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
