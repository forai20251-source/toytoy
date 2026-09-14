import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import config from '../../firebase-applet-config.json';

// Suppress transient backend connection retry warnings
try {
  setLogLevel('silent');
} catch {
  // Ignore in case logger level is restricted
}

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(config) : getApp();

// Use getFirestore with firestoreDatabaseId as required by Firebase specification
export const db = getFirestore(app, config.firestoreDatabaseId);

export default app;
