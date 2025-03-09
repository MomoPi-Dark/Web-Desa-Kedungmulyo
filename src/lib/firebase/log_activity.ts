import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "./firebase";

export interface LogActivityPayload {
  activity: string;
  status:
    | "success"
    | "info"
    | "error"
    | "warning"
    | "update"
    | "delete"
    | "create"
    | "read"
    | "unknown";
  timestamp: Date;
  identity?: string | "unknown" | null;
}

class LogsStore {
  private db: Firestore;
  private collectionName = "logs";

  constructor() {
    this.db = firestore;
  }

  public async logActivity({
    activity,
    status,
    identity,
  }: {
    activity: string;
    status: LogActivityPayload["status"];
    identity?: string | null;
  }): Promise<void> {
    try {
      await addDoc(collection(this.db, this.collectionName), {
        activity,
        status,
        timestamp: new Date(),
        identity: identity || null,
      });
    } catch (error) {
      console.error("Error menyimpan log:", error);
    }
  }

  // Fungsi untuk mengambil logs dari Firestore
  public async getLogs(): Promise<any[]> {
    try {
      const collectionRef = collection(this.db, this.collectionName);
      const snapshot = await getDocs(collectionRef);
      const logs: LogActivityPayload[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        logs.push({
          activity: data.activity,
          identity: data.identity,
          status: data.status,
          timestamp: data.timestamp.toDate(),
        });
      });
      return logs;
    } catch (error) {
      console.error("Error mengambil log:", error);
      return [];
    }
  }

  // Fungsi untuk subscribe ke logs dengan callback
  public subscribe(callback: (logs: LogActivityPayload[]) => void): () => void {
    const collectionRef = collection(this.db, this.collectionName);
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const logs: LogActivityPayload[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          logs.push({
            activity: data.activity,
            status: data.status,
            timestamp: data.timestamp.toDate(),
            identity: data.identity,
          });
        });
        callback(logs);
      },
      (error) => {
        console.error("Error mengambil log:", error);
      },
    );

    return unsubscribe;
  }

  // Fungsi untuk menghapus log berdasarkan ID
  public async clearLog(logId: string): Promise<void> {
    try {
      const logRef = doc(this.db, this.collectionName, logId);
      await deleteDoc(logRef);
      // console.log(`Log dengan ID ${logId} berhasil dihapus.`);
    } catch (error) {
      console.error("Error menghapus log:", error);
    }
  }

  // Fungsi untuk menghapus semua logs
  public async clearAllLogs(): Promise<void> {
    try {
      const collectionRef = collection(this.db, this.collectionName);
      const snapshot = await getDocs(collectionRef);
      const batch = writeBatch(this.db);
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (error) {
      console.error("Error menghapus semua log:", error);
    }
  }
}

export const logStore = new LogsStore();
