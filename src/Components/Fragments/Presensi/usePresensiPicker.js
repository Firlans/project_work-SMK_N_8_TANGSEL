import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";

const usePresensiPicker = (idJadwal, idPertemuan) => {
  const [siswaList, setSiswaList] = useState([]);
  const [presensi, setPresensi] = useState([]);
  const [tanggalPertemuan, setTanggalPertemuan] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({});
  const [selectedKeterangan, setSelectedKeterangan] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resJadwal = await axiosClient.get(`/jadwal/${idJadwal}`);
        const idKelas = resJadwal.data.data.id_kelas;

        const [resSiswa, resPresensi, resPertemuan] = await Promise.all([
          axiosClient.get("/siswa"),
          axiosClient.get(`/absen/pertemuan/${idPertemuan}`),
          axiosClient.get(`/pertemuan/${idPertemuan}`),
        ]);

        const siswaKelas = resSiswa.data.data
          .sort((a, b) => a.nama_lengkap.localeCompare(b.nama_lengkap))
          .filter((s) => s.id_kelas === idKelas);
        setSiswaList(siswaKelas);
        setPresensi(resPresensi.data?.data || []);
        setTanggalPertemuan(resPertemuan.data.data.tanggal);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idJadwal, idPertemuan]);

  const clearSelection = () => {
    setSelectedStatus({});
    setSelectedKeterangan({});
  };

  const updateSelection = (idSiswa, status) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [idSiswa]: status,
    }));
  };

  const updateKeterangan = (idSiswa, value) => {
    setSelectedKeterangan((prev) => ({
      ...prev,
      [idSiswa]: value,
    }));
  };

  const saveAll = async () => {
    setLoadingSave(true);
    try {
      const requests = Object.entries(selectedStatus).map(
        async ([idSiswa, status]) => {
          const existing = presensi.find((p) => p.id_siswa === Number(idSiswa));
          const payload = {
            id_siswa: Number(idSiswa),
            id_pertemuan: idPertemuan,
            tanggal: tanggalPertemuan,
            status,
            keterangan: selectedKeterangan[idSiswa] || "",
          };

          if (existing && existing.id) {
            return axiosClient.put(`/absen/${existing.id}`, payload);
          } else {
            return axiosClient.post("/absen", payload);
          }
        }
      );

      await Promise.all(requests);
      clearSelection();
      const updated = await axiosClient.get(`/absen/pertemuan/${idPertemuan}`);
      setPresensi(updated.data.data);
    } catch (err) {
      alert("Gagal menyimpan data.");
    } finally {
      setLoadingSave(false);
    }
  };

  const editPresensi = (idSiswa) => {
    const data = presensi.find((p) => p.id_siswa === idSiswa);
    if (data) {
      setSelectedStatus((prev) => ({
        ...prev,
        [idSiswa]: data.status,
      }));
      setSelectedKeterangan((prev) => ({
        ...prev,
        [idSiswa]: data.keterangan || "",
      }));
    }
  };

  const deletePresensi = async (idSiswa) => {
    const siswa = siswaList.find((s) => s.id === idSiswa);
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus presensi untuk siswa "${siswa?.nama_lengkap}"? Data status & keterangan akan dihapus.`
    );

    if (!confirmDelete) return;

    const existing = presensi.find((p) => p.id_siswa === idSiswa);
    if (existing?.id) {
      await axiosClient.delete(`/absen/${existing.id}`);

      const updated = await axiosClient.get(`/absen/pertemuan/${idPertemuan}`);
      setPresensi(updated.data.data);
    }
  };

  return {
    siswaList,
    presensi,
    selectedStatus,
    selectedKeterangan,
    loading,
    loadingSave,
    updateSelection,
    updateKeterangan,
    clearSelection,
    saveAll,
    editPresensi,
    deletePresensi,
  };
};

export default usePresensiPicker;
