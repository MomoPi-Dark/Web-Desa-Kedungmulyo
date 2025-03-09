import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "./firebase";

export interface Tips {
  id: string;
  image: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type TipsPayload = Omit<Tips, "createdAt" | "updatedAt">;
export type TipsEdit = Partial<TipsPayload>;
export type TipsCreate = Omit<Tips, "id" | "createdAt" | "updatedAt">;

class TipsStore {
  private db = firestore;
  private collectionName = "tips";

  // Get a single tips by its ID
  async getTips(tipsId: string): Promise<Tips | null> {
    try {
      const tipsDocRef = doc(this.db, this.collectionName, tipsId);
      const tipsDoc = await getDoc(tipsDocRef);

      if (tipsDoc.exists()) {
        const tips: Tips = { id: tipsDoc.id, ...tipsDoc.data() } as Tips;
        return tips;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting document: ", error);
      throw new Error("Failed to get tips");
    }
  }

  // Create a new tips
  async createTips(tips: TipsCreate): Promise<string> {
    try {
      const tipsWithTimestamps = {
        ...tips,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(
        collection(this.db, this.collectionName),
        tipsWithTimestamps,
      );

      console.log("Document written with ID: ", docRef.id);
      return docRef.id; // return the document ID
    } catch (error) {
      console.error("Error adding document: ", error);
      throw new Error("Failed to create tips");
    }
  }

  // Edit an existing tips
  async editTips(tipsId: string, updatedTips: TipsEdit): Promise<void> {
    try {
      const tipsDocRef = doc(this.db, this.collectionName, tipsId);
      const tipsDataToUpdate = {
        ...updatedTips,
        updatedAt: new Date(),
      };
      await updateDoc(tipsDocRef, tipsDataToUpdate);
    } catch (error) {
      throw new Error("Failed to edit tips");
    }
  }

  // Delete a tips
  async deleteTips(tipsId: string): Promise<void> {
    try {
      const tipsDocRef = doc(this.db, this.collectionName, tipsId);
      await deleteDoc(tipsDocRef);
    } catch (error) {
      throw new Error("Failed to delete tips");
    }
  }

  // Subscribe to real-time changes (for the entire collection)
  subscribe(callback: (tips: Tips[]) => void): () => void {
    const tipsQuery = query(
      collection(this.db, this.collectionName),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(tipsQuery, (snapshot) => {
      const tips: Tips[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tips[];

      callback(tips);
    });

    return unsubscribe;
  }
}

export const tipsStore = new TipsStore();
