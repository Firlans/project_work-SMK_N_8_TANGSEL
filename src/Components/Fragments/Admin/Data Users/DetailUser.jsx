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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">User Details</h2>
        <div className="space-y-4">
          <div>
            <label className="font-bold">Name:</label>
            <p>{userData.name}</p>
          </div>
          <div>
            <label className="font-bold">Email:</label>
            <p>{userData.email}</p>
          </div>
          <div>
            <label className="font-bold">Privilege:</label>
            <p className="capitalize">{userData.profile}</p>
            {userData.privileges && (
              <>
                {userData.privileges.is_admin === 1 && <p>- Admin</p>}
                {userData.privileges.is_guru === 1 && <p>- Guru</p>}
                {userData.privileges.is_siswa === 1 && <p>- Siswa</p>}
                {userData.privileges.is_conselor === 1 && <p>- Konselor</p>}
                {userData.privileges.is_superadmin === 1 && (
                  <p>- Super Admin</p>
                )}
              </>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailUser;
