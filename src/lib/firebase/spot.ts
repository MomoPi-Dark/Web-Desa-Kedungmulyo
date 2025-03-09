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

export interface Spot {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type SpotPayload = Omit<Spot, "createdAt" | "updatedAt">;
export type SpotEdit = Partial<SpotPayload>;
export type SpotCreate = Omit<Spot, "id" | "createdAt" | "updatedAt">;

class SpotStore {
  private db = firestore;
  private collectionName = "spot";

  // Get a single spot by its ID
  async getSpot(spotId: string): Promise<Spot | null> {
    try {
      const spotDocRef = doc(this.db, this.collectionName, spotId);
      const spotDoc = await getDoc(spotDocRef);

      if (spotDoc.exists()) {
        const spot: Spot = { id: spotDoc.id, ...spotDoc.data() } as Spot;
        return spot;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting document: ", error);
      throw new Error("Failed to get spot");
    }
  }

  // Create a new spot
  async createSpot(spot: SpotCreate): Promise<string> {
    try {
      const spotWithTimestamps = {
        ...spot,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(
        collection(this.db, this.collectionName),
        spotWithTimestamps,
      );

      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      throw new Error("Failed to create spot");
    }
  }

  // Edit an existing spot
  async editSpot(spotId: string, updatedSpot: SpotEdit): Promise<void> {
    try {
      const spotDocRef = doc(this.db, this.collectionName, spotId);
      const spotDataToUpdate = {
        ...updatedSpot,
        updatedAt: new Date(),
      };
      await updateDoc(spotDocRef, spotDataToUpdate);
    } catch (error) {
      throw new Error("Failed to edit spot");
    }
  }

  // Delete a spot
  async deleteSpot(spotId: string): Promise<void> {
    try {
      const spotDocRef = doc(this.db, this.collectionName, spotId);
      await deleteDoc(spotDocRef);
    } catch (error) {
      throw new Error("Failed to delete spot");
    }
  }

  // Subscribe to real-time changes (for the entire collection)
  subscribe(callback: (spots: Spot[]) => void): () => void {
    const spotsQuery = query(
      collection(this.db, this.collectionName),
      orderBy("createdAt", "desc"), // optional: order by creation date
    );

    const unsubscribe = onSnapshot(spotsQuery, (snapshot) => {
      const spots: Spot[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Spot[];

      callback(spots);
    });

    return unsubscribe;
  }
}

export const spotStore = new SpotStore();
