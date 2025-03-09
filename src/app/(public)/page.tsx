import { perangkatStore } from "@/lib/firebase/perangkat_desa";
import HomeClient from "../../components/pages/Home";

export type DataList = {
  id: string;
  jabatan: string;
  name: string;
  image: string | null;
};

const pengurusDesaList: DataList[] = [
  { jabatan: "Kepala Desa", name: "", image: "", id: "kepala" },
  {
    jabatan: "Sekretaris Desa",
    image: "",
    id: "sekretaris",
    name: "",
  },
  { jabatan: "Staf Desa", image: "", id: "staf", name: "" },
  {
    jabatan: "Dusun 1",
    name: "",
    image: "",
    id: "kepala_dusun.dusun_1",
  },
];

// Fetch all data from Firestore using PerangkatStore
const getData = async () => {
  const dataList: DataList[] = [];

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
    dataList.push(...pengurusUpdate);
  });

  return dataList;
};

export default async function Home() {
  const dataList = await getData();

  // Pass the mapped data to the HomeClient component
  return <HomeClient data={dataList} />;
}
