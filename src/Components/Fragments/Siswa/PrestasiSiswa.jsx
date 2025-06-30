import { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import LoadingSpinner from "../../Elements/Loading/LoadingSpinner";
import Badge from "../../Elements/Badges/Index";
import { FaEye, FaPlus } from "react-icons/fa";
import ImagePreview from "../../Elements/Image Pop Up/ImagePreview";
import ModalPrestasi from "../Admin/Data Prestasi/FormPrestasi";

const getBuktiPrestasiURL = (filename) =>
  axiosClient.defaults.baseURL + "/images/prestasi/" + filename;

const PrestasiSiswa = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [namaSiswa, setNamaSiswa] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      const { data: profileData } = await axiosClient.get("/profile");
      const idSiswa = profileData.data.id;
      setNamaSiswa(profileData.data.nama_lengkap);

      const res = await axiosClient.get(`/prestasi/siswa/${idSiswa}`);
      setData(res.data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner text={"Memuat prestasi..."} />;

  return (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm transition-all duration-300 ease-in-out">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
          Daftar Prestasi
        </h2>
        <button
          className="bg-amber-500 dark:bg-slate-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-slate-700 px-4 py-2  flex items-center justify-center gap-2 transition-colors duration-300 w-full sm:w-auto"
          onClick={() => {
            setSelected(null);
            setShowModal(true);
          }}
        >
          <FaPlus className="w-4 h-4" /> Tambah Prestasi
        </button>
      </div>

      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-all duration-300 ease-in-out">
            <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
              <tr>
                {["No", "Nama Siswa", "Foto", "Deskripsi", "Status"].map(
                  (label, i) => (
                    <th
                      key={i}
                      className={`${
                        label === "Status" ? "text-center" : "text-left"
                      } px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors`}
                    >
                      {label}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
              {data.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-800 dark:text-gray-100 transition-colors">
                    {index + 1}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-800 dark:text-gray-100 transition-colors">
                    {namaSiswa}
                  </td>
                  <td className="px-6 py-4">
                    {item.nama_foto ? (
                      <button
                        onClick={() =>
                          setPreviewImage(getBuktiPrestasiURL(item.nama_foto))
                        }
                        className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
                      >
                        <FaEye />
                      </button>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        -
                      </span>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-800 dark:text-gray-100 transition-colors">
                    <div className="max-w-xs sm:max-w-sm line-clamp-2">
                      {item.deskripsi}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-4 text-center">
                    <Badge status={item.status?.toLowerCase()} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ModalPrestasi
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelected(null);
          }}
          onSuccess={() => {
            fetchData();
            setShowModal(false);
          }}
          initialData={selected}
        />
      )}

      <ImagePreview
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage}
      />
    </div>
  );
};

export default PrestasiSiswa;
