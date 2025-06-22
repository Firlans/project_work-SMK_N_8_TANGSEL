import React, { useState, useEffect } from "react";
import axiosClient from "../../../../axiosClient";

const DetailUser = ({ user, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosClient.get(`/user/${user.id}`);
        console.log("Response data:", response.data); // Add this log
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user.id]);

  if (loading || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md mx-4 sm:mx-0 transition-all duration-300">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white transition-colors duration-300">
         Detail User
        </h2>

        <div className="space-y-4 text-gray-700 dark:text-gray-100 transition-colors duration-300">
          <div>
            <label className="font-bold dark:text-white transition-colors duration-300">
              Nama:
            </label>
            <p>{userData.name}</p>
          </div>
          <div>
            <label className="font-bold dark:text-white transition-colors duration-300">
              Email:
            </label>
            <p>{userData.email}</p>
          </div>
          <div>
            <label className="font-bold dark:text-white transition-colors duration-300">
              Privilege:
            </label>
            <p className="capitalize">{userData.profile}</p>
            {userData.privileges && (
              <div className="pl-4 space-y-1">
                {userData.privileges.is_admin === 1 && <p>- Admin</p>}
                {userData.privileges.is_guru === 1 && <p>- Guru</p>}
                {userData.privileges.is_siswa === 1 && <p>- Siswa</p>}
                {userData.privileges.is_conselor === 1 && <p>- Konselor</p>}
                {userData.privileges.is_superadmin === 1 && (
                  <p>- Super Admin</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 dark:bg-zinc-800 text-white dark:text-white rounded-lg hover:bg-amber-600 dark:hover:bg-zinc-500 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailUser;
