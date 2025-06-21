import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import Badge from "../../Elements/Badges/Index";
import { FaEye } from "react-icons/fa";
import ImagePreview from "../../Elements/Image Pop Up/ImagePreview";

const getBuktiPrestasiURL = (filename) =>
  axiosClient.defaults.baseURL + "/images/prestasi/" + filename;

const PrestasiSiswa = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [namaSiswa, setNamaSiswa] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: profileData } = await axiosClient.get("/profile");
        const idSiswa = profileData.data.id;
        setNamaSiswa(profileData.data.nama_lengkap);

        const res = await axiosClient.get(`/prestasi/siswa/${idSiswa}`);
        setData(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil data jadwal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Daftar Prestasi
        </h2>
      </div>

      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                  No
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                  Nama Siswa
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                  Foto
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500">
                  Deskripsi
                </th>
                <th className="px-3 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                    {index + 1}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                    {namaSiswa}
                  </td>
                  <td className="px-6 py-4">
                    {item.nama_foto ? (
                      <button
                        onClick={() =>
                          setPreviewImage(getBuktiPrestasiURL(item.nama_foto))
                        }
                        className="text-blue-600 hover:underline"
                      >
                        <FaEye />
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm">
                    <div className="max-w-xs sm:max-w-sm line-clamp-2">
                      {item.deskripsi}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-center">
                    <Badge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ImagePreview
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage}
      />
    </div>
  );
};

export default PrestasiSiswa;
