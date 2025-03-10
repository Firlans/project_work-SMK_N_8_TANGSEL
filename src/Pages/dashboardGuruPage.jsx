import React, { useState } from "react";
import { FaUser, FaUserCheck, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const dummyData = {
  profile: {
    name: "Budi Santoso",
    nip: "198505152010011005",
    gender: "Laki-laki",
    birthPlace: "Jakarta",
    birthDate: "1985-05-15",
    address: "Jl. Pendidikan No. 123, Ciputat, Tangerang Selatan",
    phone: "081234567890",
    email: "budi.santoso@gmail.com",
    role: "Guru",
    subject: "Matematika",
  },
  attendance: {
    subjects: ["Matematika Dasar", "Matematika Lanjut"],
    classes: ["X RPL 1", "X RPL 2", "XI RPL 1"],
    meetings: [1, 2, 3, 4, 5, 6, 7, 8],
    students: [
      { id: 1, name: "Ahmad Rizki", status: "hadir" },
      { id: 2, name: "Budi Pratama", status: "sakit" },
      { id: 3, name: "Cindy Putri", status: "izin" },
    ],
  },
  schedule: [
    {
      subject: "Matematika Dasar",
      class: "X RPL 1",
      time: "07:00 - 08:30",
      day: "Senin",
    },
    {
      subject: "Matematika Lanjut",
      class: "XI RPL 1",
      time: "08:30 - 10:00",
      day: "Senin",
    },
    {
      subject: "Matematika Dasar",
      class: "X RPL 2",
      time: "07:00 - 08:30",
      day: "Selasa",
    },
  ],
};

const Sidebar = ({ setActivePage, activePage }) => {
  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "attendance", label: "Kehadiran Siswa", icon: <FaUserCheck /> },
    { id: "schedule", label: "Jadwal Mengajar", icon: <FaCalendarAlt /> },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen p-6 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800">Dashboard Guru</h2>
      </div>
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              activePage === item.id
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-white border-b p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">
        SMK Negeri 8 Kota Tangerang Selatan
      </h1>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    alamat: "",
    noTelp: "",
    email: "",
  });

  const profileData = {
    nama: dummyData.profile.name,
    nip: dummyData.profile.nip,
    jenisKelamin: dummyData.profile.gender,
    tempatLahir: dummyData.profile.birthPlace,
    tanggalLahir: new Date(dummyData.profile.birthDate).toLocaleDateString(
      "id-ID"
    ),
    alamat: dummyData.profile.address,
    noTelp: dummyData.profile.phone,
    email: dummyData.profile.email,
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData({
      alamat: profileData.alamat,
      noTelp: profileData.noTelp,
      email: profileData.email,
    });
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the data
    console.log("Saving updated data:", editedData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile Guru</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Edit Profile
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
            >
              Save
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Non-editable fields */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Nama Lengkap</span>
            <span className="font-medium">{profileData.nama}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">NIP</span>
            <span className="font-medium">{profileData.nip}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Jenis Kelamin</span>
            <span className="font-medium">{profileData.jenisKelamin}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Tempat, Tanggal Lahir</span>
            <span className="font-medium">
              {profileData.tempatLahir}, {profileData.tanggalLahir}
            </span>
          </div>
        </div>
        <div className="space-y-4">
          {/* Editable fields */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Alamat</span>
            {isEditing ? (
              <input
                type="text"
                value={editedData.alamat}
                onChange={(e) =>
                  setEditedData({ ...editedData, alamat: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <span className="font-medium">{profileData.alamat}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Nomor Telepon</span>
            {isEditing ? (
              <input
                type="tel"
                value={editedData.noTelp}
                onChange={(e) =>
                  setEditedData({ ...editedData, noTelp: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <span className="font-medium">{profileData.noTelp}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Email</span>
            {isEditing ? (
              <input
                type="email"
                value={editedData.email}
                onChange={(e) =>
                  setEditedData({ ...editedData, email: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <span className="font-medium">{profileData.email}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AttendanceList = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState("");
  const [students, setStudents] = useState(dummyData.attendance.students);
  const [notes, setNotes] = useState({});

  const handleAttendanceChange = (studentId, status) => {
    setStudents(
      students.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const handleNoteChange = (studentId, note) => {
    setNotes((prev) => ({
      ...prev,
      [studentId]: note,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          className="p-2 border rounded-lg"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">Pilih Mata Pelajaran</option>
          {dummyData.attendance.subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded-lg"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Pilih Kelas</option>
          {dummyData.attendance.classes.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded-lg"
          value={selectedMeeting}
          onChange={(e) => setSelectedMeeting(e.target.value)}
        >
          <option value="">Pilih Pertemuan</option>
          {dummyData.attendance.meetings.map((meeting) => (
            <option key={meeting} value={meeting}>
              Pertemuan {meeting}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nama Siswa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Keterangan
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {["hadir", "sakit", "izin", "alfa"].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          handleAttendanceChange(student.id, status)
                        }
                        className={`px-3 py-1 rounded-lg text-sm ${
                          student.status === status
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="border rounded-lg px-2 py-1 w-full"
                    placeholder="Tambah keterangan"
                    value={notes[student.id] || ""}
                    onChange={(e) =>
                      handleNoteChange(student.id, e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Schedule = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Jadwal Mengajar</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Hari
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mata Pelajaran
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kelas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Waktu
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dummyData.schedule.map((schedule, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">{schedule.day}</td>
                <td className="px-6 py-4">{schedule.subject}</td>
                <td className="px-6 py-4">{schedule.class}</td>
                <td className="px-6 py-4">{schedule.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DashboardGuruPage = () => {
  const [activePage, setActivePage] = useState("profile");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar setActivePage={setActivePage} activePage={activePage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-8">
          {activePage === "profile" && <Profile />}
          {activePage === "attendance" && <AttendanceList />}
          {activePage === "schedule" && <Schedule />}
        </div>
      </div>
    </div>
  );
};

export default DashboardGuruPage;
