// Vercel Serverless Function for OTP Vote Submission
// Handles POST requests to /api/vote

// Firebase V9 Modular SDK
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore/lite');

// =====================================================
// FIREBASE CONFIGURATION
// =====================================================
// Replace these with your actual Firebase credentials
const firebaseConfig = {
        apiKey: "AIzaSyAqaaLWhpXmuFN1zVwciTictlkj-4BJe8c",
        authDomain: "spark-alliance.firebaseapp.com",
        projectId: "spark-alliance",
        storageBucket: "spark-alliance.firebasestorage.app",
        messagingSenderId: "741055626542",
        appId: "1:741055626542:web:b09767007d9817507a8ebf",
        measurementId: "G-K2QQQDZSM8"
};

// Initialize Firebase (singleton pattern for warm calls)
let db;
function getDb() {
    if (!db) {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
    }
    return db;
}

module.exports = async function handler(req, res) {
    // Set CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST method
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed' 
        });
    }

    try {
        // Extract data from request body
        const { department, reg_no, otp } = req.body;

        // Validate required fields
        if (!department || !reg_no || !otp) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: department, reg_no, otp' 
            });
        }

        // Get Firestore instance
        const firestore = getDb();

        // Add document to Firestore votes collection
        const docRef = await addDoc(collection(firestore, 'votes'), {
            department: department,
            reg_no: reg_no,
            otp: otp,
            status: 'pending',
            createdAt: serverTimestamp()
        });

        console.log('Vote submitted successfully:', docRef.id);

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Vote submitted successfully',
            id: docRef.id
        });

    } catch (error) {
        console.error('Error submitting vote:', error);

        // Return error response
        return res.status(500).json({
            success: false,
            error: 'Failed to submit vote'
        });
    }
};
