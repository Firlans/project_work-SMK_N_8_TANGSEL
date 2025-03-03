import Card from "../Elements/Card";
import MonitoringTable from "../Fragments/MonitoringTable";

const DashboardContent = () => {
  const teachers = [{ name: "Pak Budi", detail: "Matematika" }];
  const students = [{ name: "John Doe", detail: "Kelas 10A" }];
  const schedules = [{ name: "Senin", detail: "08:00 - 10:00 (Matematika)" }];

  return (
    <div className="p-6 flex-1">
      {/* Statistik Cards */}
      <div className="flex space-x-4">
        <Card title="Jumlah Guru" value="30" />
        <Card title="Jumlah Siswa" value="500" />
        <Card title="Jumlah Kelas" value="20" />
      </div>

      <div className="mt-6 space-y-6">
        <MonitoringTable title="Monitoring Data Guru" data={teachers} />
        <MonitoringTable title="Monitoring Data Siswa" data={students} />
        <MonitoringTable title="Monitoring Jadwal" data={schedules} />
      </div>
    </div>
  );
};

export default DashboardContent;
