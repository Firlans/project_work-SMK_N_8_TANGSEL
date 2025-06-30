import PresensiPickerRow from "./PresensiPickerRow";

const PresensiPickerTable = ({
  siswaList,
  presensi,
  selectedStatus,
  selectedKeterangan,
  onSelectStatus,
  onKeteranganChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto transition-all duration-300">
      <table className="min-w-full table-auto text-sm sm:text-base transition-colors duration-300">
        <thead className="bg-slate-100 dark:bg-gray-900 transition-colors duration-300">
          <tr className="text-left text-slate-900 dark:text-slate-200 transition-colors duration-300">
            <th className="px-3 py-2 font-medium whitespace-nowrap">No</th>
            <th className="px-3 py-2 font-medium whitespace-nowrap">
              Nama Siswa
            </th>
            <th className="px-3 py-2 font-medium whitespace-nowrap">Status</th>
            <th className="px-3 py-2 font-medium whitespace-nowrap">
              Keterangan
            </th>
            <th className="px-3 py-2 text-center font-medium whitespace-nowrap">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-200 divide-y divide-slate-200 dark:divide-slate-900 transition-colors duration-300">
          {siswaList.map((siswa, idx) => {
            const existing = presensi.find((p) => p.id_siswa === siswa.id);
            return (
              <PresensiPickerRow
                key={siswa.id}
                idx={idx}
                siswa={siswa}
                statusPresensi={existing || null}
                selectedStatus={selectedStatus}
                selectedKeterangan={selectedKeterangan}
                onSelectStatus={onSelectStatus}
                onKeteranganChange={onKeteranganChange}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PresensiPickerTable;
