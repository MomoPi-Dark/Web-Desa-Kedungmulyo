import {
  collection,
  doc,
  Firestore,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { firestore } from "./firebase";

export interface AdminPendudukPayload {
  value: number;
  updatedAt: Date;
  prevUpdatedAt: Date;
}

export type AdminPendudukFields =
  | "kepala_keluarga"
  | "penduduk"
  | "lk"
  | "pr"
  | "penduduk_sementara"
  | "mutasi_penduduk"
  | "belum_kawin"
  | "kawin"
  | "cerai_hidup"
  | "cerai_mati"
  | "kawin_tercatat"
  | "kawin_tidak_tercatat"
  | "islam"
  | "kristen"
  | "katholik"
  | "hindu"
  | "buddha"
  | "konghucu"
  | "kepercayaan_lainnya";

class AdminPendudukStore {
  private db: Firestore;
  private collectionName = "administrasi_penduduk";

  constructor() {
    this.db = firestore;
  }

  /**
   * Updates or creates a specific field in the "administrasi_penduduk" collection.
   * @param field - The document ID to update or create.
   * @param value - The new value to set.
   * @throws Will throw an error if the update or creation fails.
   */
  async update(field: AdminPendudukFields, value: number): Promise<void> {
    try {
      const docRef = doc(this.db, this.collectionName, field);
      const docSnap = await getDoc(docRef);

      const currentTime = new Date();

      if (docSnap.exists()) {
        const docData = docSnap.data();
        const prevUpdatedAt = docData?.updatedAt || null;

        if (docData?.value === value) {
          return;
        }

        const updateData = {
          value,
          updatedAt: currentTime,
          prevUpdatedAt,
        };

        await setDoc(docRef, updateData, { merge: true });
      } else {
        const newData = {
          value,
          createdAt: currentTime,
          updatedAt: currentTime,
        };

        await setDoc(docRef, newData);
      }
    } catch (error) {
      return Promise.reject(
        `Gagal memperbarui atau membuat dokumen "${field}" dalam koleksi "${this.collectionName}".`,
      );
    }
  }

  /**
   * Subscribes to updates for a specific field or all documents in the "administrasi_penduduk" collection.
   * @param callback - Callback function to handle the updates.
   * @param field - (Optional) Field name to subscribe to. If not provided, subscribes to all documents.
   * @returns Unsubscribe function to stop listening for updates.
   */
  subscribe(
    callback: (data: Record<AdminPendudukFields, AdminPendudukPayload>) => void,
  ): () => void;
  subscribe(
    callback: (data: AdminPendudukPayload | null) => void,
    field: AdminPendudukFields,
  ): () => void;
  subscribe(
    callback: (data: any) => void,
    field?: AdminPendudukFields,
  ): () => void {
    if (field) {
      const docRef = doc(this.db, this.collectionName, field);

      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() || {};
            callback(data);
          } else {
            callback(null);
          }
        },
        (error) => {
          console.error(`Error subscribing to field "${field}":`, error);
        },
      );

      return unsubscribe;
    } else {
      const collectionRef = collection(this.db, this.collectionName);

      const unsubscribe = onSnapshot(
        collectionRef,
        (snapshot) => {
          const allData: Record<string, AdminPendudukPayload> = {};
          snapshot.forEach((doc) => {
            allData[doc.id] = doc.data() as AdminPendudukPayload;
          });
          callback(allData);
        },
        (error) => {
          console.error(
            `Error subscribing to collection ${this.collectionName}:`,
            error,
          );
        },
      );

      return unsubscribe;
    }
  }
}

export const adminPendudukStore = new AdminPendudukStore();
