import { useCallback, useEffect, useMemo, useState } from "react";
import axiosClient from "../../../axiosClient";
import Cookies from "js-cookie";
import { getWaliMuridBySiswaId } from "../../../services/waliMuridService";
import { generateAttendanceNotificationEmail } from "../../../utils/emailNewAttendance";
import { sendEmailNotification } from "../../../services/emailService";

const usePresensiPicker = (idJadwal, idPertemuan, initialNamaMapel, initialNamaPertemuan) => {
  const [siswaList, setSiswaList] = useState([]);
  const [presensi, setPresensi] = useState([]);
  const [tanggalPertemuan, setTanggalPertemuan] = useState("");
  const [className, setClassName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({});
  const [selectedKeterangan, setSelectedKeterangan] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState(false);

  const teacherInfo = useMemo(() => {
    const userPrivilege = JSON.parse(Cookies.get("userPrivilege") || "{}");
    return {
      id: userPrivilege.id_user,
      name: Cookies.get("name") || userPrivilege.name || "Guru Tidak Dikenal",
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resJadwal = await axiosClient.get(`/jadwal/${idJadwal}`);
        const idKelas = resJadwal.data.data.id_kelas;

        const resKelas = await axiosClient.get(`/kelas/${idKelas}`);
        setClassName(resKelas.data.data.nama_kelas);

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

  const sendAttendanceNotification = useCallback(
    async (
      siswa,
      status,
      keterangan,
      teacherName,
      currentClassName,
      meetingDate,
      timestamp,
      mapelName,
      meetingName
    ) => {
      try {
        const waliMurid = await getWaliMuridBySiswaId(siswa.id);
        if (!waliMurid || !waliMurid.email) {
          // console.warn(
          //   `Email wali murid tidak ditemukan untuk siswa ID ${siswa.id}. Notifikasi tidak terkirim.`
          // );
          return;
        }

        const dateParts = meetingDate.split("-");
        const formattedMeetingDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        const timePart = timestamp.split(" ")[1];

        const subject = `Pembaruan Presensi ${siswa.nama_lengkap} - ${formattedMeetingDate} - ${timePart}`;
        const emailHtml = generateAttendanceNotificationEmail({
          studentName: siswa.nama_lengkap,
          className: currentClassName,
          meetingDate: meetingDate,
          newStatus: status,
          keterangan: keterangan,
          teacherName: teacherName,
          timestamp: timestamp,
          mapelName: mapelName,
          meetingName: meetingName
        });

        await sendEmailNotification(waliMurid.email, subject, emailHtml);
        // console.log(
        //   `Notifikasi presensi berhasil dikirim ke ${waliMurid.email} untuk ${siswa.nama_lengkap}`
        // );
      } catch (emailErr) {
        // console.error(
        //   `Gagal mengirim notifikasi presensi untuk ${siswa.nama_lengkap}:`,
        //   emailErr
        // );
      }
    },
    []
  );

  const saveAll = async () => {
    setLoadingSave(true);
    const notificationsToSend = [];

    try {
      const currentTimestamp = new Date()
        .toLocaleString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(/\./g, ":");

      const saveRequests = Object.entries(selectedStatus).map(
        async ([idSiswa, status]) => {
          const numIdSiswa = Number(idSiswa);
          const existing = presensi.find((p) => p.id_siswa === numIdSiswa);
          const payload = {
            id_siswa: numIdSiswa,
            id_pertemuan: idPertemuan,
            tanggal: tanggalPertemuan,
            status,
            keterangan: selectedKeterangan[idSiswa] || "",
          };

          let requestPromise;
          let changed = false;

          if (existing && existing.id) {
            // Cek apakah ada perubahan status atau keterangan
            if (
              existing.status !== status ||
              existing.keterangan !== (selectedKeterangan[idSiswa] || "")
            ) {
              requestPromise = axiosClient.put(
                `/absen/${existing.id}`,
                payload
              );
              changed = true;
            } else {
              // Tidak ada perubahan, tidak perlu melakukan request PUT, tapi kita tetap ingin Promise.all()
              requestPromise = Promise.resolve();
            }
          } else {
            requestPromise = axiosClient.post("/absen", payload);
            changed = true; // Selalu true jika entri baru
          }

          // Jika ada perubahan, tambahkan notifikasi ke daftar
          if (changed) {
            const siswa = siswaList.find((s) => s.id === numIdSiswa);
            if (siswa) {
              notificationsToSend.push(
                sendAttendanceNotification(
                  siswa,
                  status,
                  selectedKeterangan[idSiswa] || "",
                  teacherInfo.name,
                  className,
                  tanggalPertemuan,
                  currentTimestamp,
                  initialNamaMapel,
                  initialNamaPertemuan,
                )
              );
            }
          }

          return requestPromise;
        }
      );

      await Promise.all(saveRequests);
      await Promise.all(notificationsToSend);

      clearSelection();
      const updated = await axiosClient.get(`/absen/pertemuan/${idPertemuan}`);
      setPresensi(updated.data.data);
    } catch (err) {
      // alert("Gagal menyimpan data.");
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
    tanggalPertemuan,
    className,
  };
};

export default usePresensiPicker;
