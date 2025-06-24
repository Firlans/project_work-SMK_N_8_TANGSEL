import LoadingSpinner from "../../../../Elements/Loading/LoadingSpinner";
import CheckboxField from "./Fields/CheckboxField";
import InputField from "./Fields/InputField";
import SelectField from "./Fields/SelectField";
import TextareaField from "./Fields/TextareaField";
import Notification from "./Notification";
import useFormUser from "./useFormUser";

const FormUser = ({ mode, user, onClose, onSuccess }) => {
  const {
    formData,
    errors,
    loading,
    notification,
    kelasList,
    privileges,
    showPassword,
    handleChange,
    handleDataChange,
    handlePrivilegeChange,
    togglePassword,
    handleSubmit,
  } = useFormUser({ mode, user, onClose, onSuccess });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <Notification notification={notification} />
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {mode === "create" ? "Tambah User Baru" : "Edit User"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Nama Lengkap"
            value={formData.name}
            onChange={(val) => handleChange("name", val)}
            error={errors.name}
          />
          <InputField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(val) => handleChange("email", val)}
            error={errors.email}
          />
          {mode === "edit" && (
            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(val) => handleChange("password", val)}
              error={errors.password}
              showToggle
              togglePassword={togglePassword}
              mode={mode}
            />
          )}

          <SelectField
            label="Profile"
            value={formData.profile}
            options={[
              { label: "Guru", value: "guru" },
              { label: "Siswa", value: "siswa" },
            ]}
            onChange={(val) => handleChange("profile", val)}
          />

          {/* PRIVILEGES */}
          {formData.profile === "guru" && (
            <div className="space-y-2">
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Privileges
              </label>
              {["is_admin", "is_guru", "is_conselor"].map((key) => (
                <CheckboxField
                  key={key}
                  label={key.replace("is_", "").replace("_", " ")}
                  checked={privileges[key]}
                  onChange={() => handlePrivilegeChange(key)}
                />
              ))}
            </div>
          )}

          {/* FIELD TAMBAHAN */}
          {mode === "create" && (
            <>
              <InputField
                label="Tanggal Lahir"
                type="date"
                value={formData.data.tanggal_lahir}
                onChange={(val) => handleDataChange("tanggal_lahir", val)}
                error={errors.tanggal_lahir}
              />
              <TextareaField
                label="Alamat"
                value={formData.data.alamat}
                onChange={(val) => handleDataChange("alamat", val)}
                error={errors.alamat}
              />
              <InputField
                label="No. Telepon"
                value={formData.data.no_telp}
                onChange={(val) => handleDataChange("no_telp", val)}
                error={errors.no_telp}
              />
              <SelectField
                label="Jenis Kelamin"
                value={formData.data.jenis_kelamin}
                options={[
                  { label: "Laki-laki", value: "L" },
                  { label: "Perempuan", value: "P" },
                ]}
                onChange={(val) => handleDataChange("jenis_kelamin", val)}
              />
              {formData.profile === "guru" ? (
                <InputField
                  label="NIP"
                  value={formData.data.nip}
                  onChange={(val) => handleDataChange("nip", val)}
                  error={errors.nip}
                />
              ) : (
                <>
                  <InputField
                    label="NISN"
                    value={formData.data.nisn}
                    onChange={(val) => handleDataChange("nisn", val)}
                    error={errors.nisn}
                  />
                  <InputField
                    label="NIS"
                    value={formData.data.nis}
                    onChange={(val) => handleDataChange("nis", val)}
                    error={errors.nis}
                  />
                  <InputField
                    label="Semester"
                    value={formData.data.semester}
                    onChange={(val) => handleDataChange("semester", val)}
                    error={errors.semester}
                  />
                  <SelectField
                    label="Kelas"
                    value={formData.data.id_kelas}
                    options={kelasList.map((k) => ({
                      label: k.nama_kelas,
                      value: k.id,
                    }))}
                    onChange={(val) => handleDataChange("id_kelas", val)}
                    error={errors.id_kelas}
                  />
                </>
              )}
            </>
          )}

          {/* BUTTONS */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-zinc-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-zinc-500 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-amber-500 dark:bg-zinc-800 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-zinc-500 transition-colors"
            >
              {mode === "create" ? "Tambah" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormUser;
