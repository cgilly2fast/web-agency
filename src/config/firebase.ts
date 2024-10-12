import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
import { getFunctions } from 'firebase/functions'
import { getFirestore } from 'firebase/firestore'
export const firebaseConfig = {
    apiKey: process.env.PAYLOAD_PUBLIC_APIKEY,
    authDomain: process.env.PAYLOAD_PUBLIC_AUTHDOMAIN,
    databaseURL: process.env.PAYLOAD_PUBLIC_DB,
    projectId: process.env.SERVICE_ACCOUNT_PROJECT_ID,
    storageBucket: process.env.GCS_BUCKET,
    messagingSenderId: process.env.PAYLOAD_PUBLIC_SID,
    appId: process.env.PAYLOAD_PUBLIC_APPID,
    measurementId: process.env.PAYLOAD_PUBLIC_MID,
}

const app = initializeApp(firebaseConfig)
// export const analytics = getAnalytics(app)
export const functions = getFunctions(app)
export const db = getFirestore(app)
