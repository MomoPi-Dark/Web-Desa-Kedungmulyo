import authConfig from "@/lib/authConfig";
import { perangkatStore } from "@/lib/firebase/perangkat_desa";
import { getServerSession } from "next-auth";
import PageClient from "./pageClient";

export type DataList = {
  id: string;
  jabatan: string;
  name: string;
  image: string | null;
};

// Data structure (unchanged)
const pengurusDesaList: DataList[] = [
  { jabatan: "Kepala Desa", name: "", image: "", id: "kepala" },
  {
    jabatan: "Sekretaris Desa",
    image: "",
    id: "sekretaris",
    name: "",
  },
  { jabatan: "Staf Desa", image: "", id: "staf", name: "" },
];

const kepalaDusunDesaList: DataList[] = [
  {
    jabatan: "Dusun 1",
    name: "",
    image: "",
    id: "kepala_dusun.dusun_1",
  },
  {
    jabatan: "Dusun 2",
    image: "",
    name: "",

    id: "kepala_dusun.dusun_2",
  },
  {
    jabatan: "Dusun 3",
    image: "",
    name: "",

    id: "kepala_dusun.dusun_3",
  },
  {
    jabatan: "Dusun 4",
    image: "",
    name: "",

    id: "kepala_dusun.dusun_4",
  },
  {
    jabatan: "Dusun 5",
    image: "",
    name: "",

    id: "kepala_dusun.dusun_5",
  },
];

const kepalaSeksiDesaList: DataList[] = [
  {
    jabatan: "Pelayanan dan Kesra",
    image: "",
    name: "",

    id: "kepala_seksi.pelayanan_dan_kesra",
  },
  {
    jabatan: "Pemerintahan",
    image: "",
    name: "",

    id: "kepala_seksi.pemerintahan",
  },
];

const kepalaUrusanDesaList: DataList[] = [
  {
    jabatan: "Keuangan",
    name: "",

    image: "",
    id: "kepala_urusan.keuangan",
  },
  {
    jabatan: "Umum dan Perencanaan",
    image: "",
    name: "",
    id: "kepala_urusan.umum_dan_perencanaan",
  },
];

// Fetch all data from Firestore using PerangkatStore
const getData = async () => {
  const dataList: Record<string, DataList[]> = {
    pengurusDesa: [],
    kepalaDusun: [],
    kepalaSeksi: [],
    kepalaUrusan: [],
  };

  // Fetch all data for perangkat_desa using perangkatStore
  const allData = await perangkatStore.getAllObject();

  // Process and organize the data into the respective lists
  Object.entries(allData).forEach(([key, value]) => {
    // Update the pengurusDesaList if the key matches
    const pengurusUpdate = pengurusDesaList
      .filter((v) => v.id === key)
      .map((valueDesa) => {
        return { ...valueDesa, ...value };
      });
    dataList.pengurusDesa.push(...pengurusUpdate);

    // Update the kepalaDusunDesaList if the key matches
    const dusunUpdate = kepalaDusunDesaList
      .filter((v) => v.id === key)
      .map((valueDusun) => {
        return { ...valueDusun, ...value };
      });
    dataList.kepalaDusun.push(...dusunUpdate);

    // Update the kepalaSeksiDesaList if the key matches
    const seksiUpdate = kepalaSeksiDesaList
      .filter((v) => v.id === key)
      .map((valueSeksi) => {
        return { ...valueSeksi, ...value };
      });
    dataList.kepalaSeksi.push(...seksiUpdate);

    // Update the kepalaUrusanDesaList if the key matches
    const urusanUpdate = kepalaUrusanDesaList
      .filter((v) => v.id === key)
      .map((valueUrusan) => {
        return { ...valueUrusan, ...value };
      });
    dataList.kepalaUrusan.push(...urusanUpdate);
  });

  return dataList;
};

export default async function Page() {
  const session = await getServerSession(authConfig);

  // Fetch data from Firestore using PerangkatStore
  const data = await getData();

  return (
    <PageClient
      session={session!}
      data={data}
    />
  );
}
