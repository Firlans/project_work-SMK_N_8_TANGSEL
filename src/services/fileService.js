import axiosClient from "../axiosClient";

// Upload file
export const uploadFile = async (file) => {
  const renamedFile = new File(
    [file],
    "Pedoman Sikap Positif dan Negatif.pdf",
    {
      type: file.type,
    }
  );

  const formData = new FormData();
  formData.append("file", renamedFile);

  try {
    const response = await axiosClient.post("/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Gagal upload file",
    };
  }
};

// Download file
export const downloadFile = async () => {
  const filename = "Pedoman Sikap Positif dan Negatif.pdf";

  try {
    const response = await axiosClient.get(`/file/${filename}`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Gagal download file",
    };
  }
};
