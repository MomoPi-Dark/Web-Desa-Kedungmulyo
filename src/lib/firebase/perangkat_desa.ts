import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { deepEntries } from "../components";
import { firestore } from "./firebase";

export type DesaStructure = {
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  struktur_desa: {
    kepala: string;
    sekretaris: string;
    staf: string;
    kepala_urusan: {
      umum_dan_perencanaan: string;
      keuangan: string;
    };
    kepala_seksi: {
      pemerintahan: string;
      pelayanan_dan_kesra: string;
    };
    kepala_dusun: {
      dusun_1: string;
      dusun_2: string;
      dusun_3: string;
      dusun_4: string | null; // Bisa null
      dusun_5: string;
    };
  };
};

export type DataPerangkatFields =
  | "kepala"
  | "sekretaris"
  | "staf"
  | "kepala_dusun.dusun_1"
  | "kepala_dusun.dusun_2"
  | "kepala_dusun.dusun_3"
  | "kepala_dusun.dusun_4"
  | "kepala_dusun.dusun_5"
  | "kepala_seksi.pelayanan_dan_kesra"
  | "kepala_seksi.pemerintahan"
  | "kepala_urusan.keuangan"
  | "kepala_urusan.umum_dan_perencanaan";

export interface DataPerangkat {
  jabatan_key: DataPerangkatFields;
  image: string;
  name: string;
}

function setNestedObject(obj: Record<string, any>, path: string, value: any) {
  const keys = path.split(".");
  let current = obj;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      current[key] = current[key] || {};
      current = current[key];
    }
  });
}

class PerangkatStore {
  private db: Firestore;
  private collectionName = "perangkat_desa";

  constructor() {
    this.db = firestore;
  }

  private async init(data: Record<string, any>) {
    try {
      const d = deepEntries(data);

      for (const [key, value] of d) {
        try {
          const customID = key;
          const docRef = doc(this.db, this.collectionName, customID);

          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            console.log(
              `Documet with ID "${customID}" already exists. Skipping.`,
            );
            continue;
          }

          await setDoc(docRef, {
            name: value,
            image: null,
            jabatan_key: key,
          });
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      }
    } catch (error) {
      console.error("Error creating Firestore data:", error);
    }
  }

  async get(field: DataPerangkatFields): Promise<DataPerangkat | null> {
    try {
      const docRef = doc(this.db, this.collectionName, field);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        return {
          jabatan_key: field,
          image: data.image,
          name: data.name,
        };
      } else {
        console.log(`Document with field "${field}" does not exist.`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      throw new Error(`Failed to fetch data for field: ${field}`);
    }
  }

  conversion(data: Record<string, any>) {
    try {
      const result: Record<string, any> = {};

      for (const [key, value] of Object.entries(data)) {
        setNestedObject(result, key, value);
      }

      return result;
    } catch (error) {
      console.error("Error adding document:", error);
      return {};
    }
  }

  async getAllObject(): Promise<Record<DataPerangkatFields, DataPerangkat>> {
    try {
      const querySnapshot = await getDocs(
        collection(this.db, this.collectionName),
      );
      const data: Record<string, any> = {};

      querySnapshot.forEach((doc) => {
        data[doc.id] = {
          key: doc.id,
          ...doc.data(),
        };
      });

      return data;
    } catch (error) {
      console.error("Error fetching all documents:", error);
      throw new Error("Failed to fetch all documents.");
    }
  }

  async getAllArray(): Promise<DataPerangkat[]> {
    try {
      const querySnapshot = await getDocs(
        collection(this.db, this.collectionName),
      );
      const data: any[] = [];

      querySnapshot.forEach((doc) => {
        data.push({ jabatan_key: doc.id as any, ...doc.data() });
      });

      return data;
    } catch (error) {
      console.error("Error fetching all documents:", error);
      throw new Error("Failed to fetch all documents.");
    }
  }

  subscribe(callback: (data: Record<string, any>) => void) {
    const unsubscribe = onSnapshot(
      collection(this.db, this.collectionName),
      (querySnapshot) => {
        const updatedData: Record<string, any> = {};

        querySnapshot.forEach((doc) => {
          updatedData[doc.id] = doc.data();
        });

        console.log(updatedData);

        // Callback with updated data
        callback(updatedData);
      },
    );

    // Return the unsubscribe function
    return unsubscribe;
  }

  async update(id: DataPerangkatFields, updatedData: Partial<DataPerangkat>) {
    try {
      const oldData = await this.get(id);

      if (oldData) {
        const userRef = doc(this.db, this.collectionName, id);
        await setDoc(userRef, { ...oldData, ...updatedData }, { merge: true });
      }
    } catch (error) {
      console.log(error);
      return Promise.reject("Error Updating");
    }
  }
}

export const perangkatStore = new PerangkatStore();
