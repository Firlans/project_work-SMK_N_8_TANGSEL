import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import axiosClient from "../../../../../axiosClient";

export const useBulkUplouder = (onClose, onSuccess) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [log, setLog] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setLog([]);
  };
  const parseFile = () => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        complete: ({ data }) => handleUpload(data),
      });
    } else if (["xls", "xlsx"].includes(ext)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        handleUpload(json);
      };
      reader.readAsBinaryString(file);
    } else {
      alert("Format file tidak didukung. Gunakan .csv atau .xlsx");
    }
  };

  const generatePassword = (user) => {
    const base = "smkn8#";

    if (user.profile === "siswa" && user.nis) {
      return `${base}${user.nis.slice(-4)}`;
    }

    if (user.profile === "guru" && user.nip) {
      return `${base}${user.nip.slice(-4)}`;
    }

    return `${base}0000`;
  };

  const handleUpload = async (users) => {
    setUploading(true);
    setShowLoading(true);
    setProgressText("Memulai upload...");
    setUploadPercentage(0);

    const logResult = [];

    for (const [index, user] of users.entries()) {
      const dataToSubmit = {
        name: user.name || "",
        email: user.email || "",
        password: user.password || generatePassword(user),
        profile: user.profile || "guru",
        is_active: true,
        data: {
          jenis_kelamin: user.jenis_kelamin || "L",
          tanggal_lahir: user.tanggal_lahir || "",
          alamat: user.alamat || "",
          no_telp: user.no_telp || "",
          nip: user.nip || "",
          nisn: user.nisn || "",
          nis: user.nis || "",
          semester: user.semester || "",
          id_kelas: user.id_kelas || "",
        },
        privileges: {
          is_superadmin: false,
          is_admin: user.is_admin == 1,
          is_guru: user.is_guru == 1,
          is_siswa: user.is_siswa == 1,
          is_conselor: user.is_conselor == 1,
        },
      };

      try {
        await axiosClient.post("/user", dataToSubmit);
        logResult.push({ index, status: "success", name: user.name });
      } catch (error) {
        logResult.push({
          index,
          status: "error",
          name: user.name,
          message: error.response?.data?.message || "Unknown error",
        });
      }

      setProgressText(`Mengupload ${index + 1} dari ${users.length} user...`);
      setUploadPercentage(Math.round(((index + 1) / users.length) * 100));
    }

    setLog(logResult);
    setUploading(false);
    setShowLoading(false);
    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  return {
    file,
    uploading,
    log,
    showLoading,
    progressText,
    uploadPercentage,
    handleFileChange,
    parseFile,
  };
};
