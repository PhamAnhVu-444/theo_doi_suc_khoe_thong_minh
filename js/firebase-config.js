// Firebase Configuration - Cấu hình từ dự án Android thật
const firebaseConfig = {
    apiKey: "AIzaSyDfNVZBZDvdggrTzspqtEob3IQvYfEgHvE",
    authDomain: "moi-40b08.firebaseapp.com",
    databaseURL: "https://moi-40b08-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "moi-40b08",
    storageBucket: "moi-40b08.firebasestorage.app",
    messagingSenderId: "877727049515",
    appId: "1:877727049515:web:demo-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const database = firebase.database();
const storage = firebase.storage();

// Configure Firestore with new cache settings
db.settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    ignoreUndefinedProperties: true
});

// Enable offline persistence with error handling
db.enablePersistence({ synchronizeTabs: true })
    .catch((err) => {
        console.log('Persistence disabled:', err.code);
        if (err.code == 'failed-precondition') {
            console.log('Multiple tabs open, persistence enabled in one tab only.');
        } else if (err.code == 'unimplemented') {
            console.log('Browser does not support persistence.');
        }
    });

// Global Firebase functions
window.firebaseApp = {
    auth,
    db,
    database,
    storage,
    firebase
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { auth, db, database, storage, firebase };
}
