import { AdminPendudukFields } from "../firebase/admin_penduduk";

export interface PopulationDataItem {
  value: number;
  label: string;
  key: AdminPendudukFields;
}

const initialPopulationData: PopulationDataItem[] = [
  { value: 0, label: "Penduduk", key: "penduduk" },
  { value: 0, label: "Kepala Keluarga", key: "kepala_keluarga" },
  { value: 0, label: "Laki-Laki", key: "lk" },
  { value: 0, label: "Perempuan", key: "pr" },
  { value: 0, label: "Penduduk Sementara", key: "penduduk_sementara" },
  { value: 0, label: "Mutasi Penduduk", key: "mutasi_penduduk" },
];

export default initialPopulationData;
