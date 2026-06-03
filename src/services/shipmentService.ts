import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface ShipmentData {
  trackingNumber: string;
  sender: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  receiver: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  cargo: {
    type: 'Courier' | 'Cargo' | 'Freight' | 'Sea';
    weight: number;
    commodity: string;
    value: number;
  };
  quote: {
    basePrice: number;
    customsFee: number;
    total: number;
    id: string;
    date: string;
  };
  status: 'Pending' | 'In Transit' | 'Arrived' | 'Delivered';
  createdAt?: any;
  updatedAt?: any;
}

const SHIPMENTS_COLLECTION = 'shipments';

export const shipmentService = {
  async getShipment(trackingNumber: string): Promise<ShipmentData | null> {
    try {
      const docRef = doc(db, SHIPMENTS_COLLECTION, trackingNumber);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as ShipmentData;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${SHIPMENTS_COLLECTION}/${trackingNumber}`);
      return null;
    }
  },

  async listShipments(): Promise<ShipmentData[]> {
    try {
      const querySnapshot = await getDocs(collection(db, SHIPMENTS_COLLECTION));
      return querySnapshot.docs.map(doc => doc.data() as ShipmentData);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, SHIPMENTS_COLLECTION);
      return [];
    }
  },

  async createShipment(data: Omit<ShipmentData, 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const docRef = doc(db, SHIPMENTS_COLLECTION, data.trackingNumber);
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, SHIPMENTS_COLLECTION);
    }
  },

  async updateShipment(trackingNumber: string, data: Partial<ShipmentData>): Promise<void> {
    try {
      const docRef = doc(db, SHIPMENTS_COLLECTION, trackingNumber);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${SHIPMENTS_COLLECTION}/${trackingNumber}`);
    }
  },

  async deleteShipment(trackingNumber: string): Promise<void> {
    try {
      await deleteDoc(doc(db, SHIPMENTS_COLLECTION, trackingNumber));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${SHIPMENTS_COLLECTION}/${trackingNumber}`);
    }
  }
};
