// Import the required Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-functions.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB1fjmOBZgeLK1_rlFcqP9tiGwcx2V328E",
    authDomain: "opossum-website.firebaseapp.com",
    databaseURL: "https://opossum-website-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "opossum-website",
    storageBucket: "opossum-website.appspot.com",
    messagingSenderId: "512600023033",
    appId: "1:512600023033:web:9f198a00e96baf05b8a728",
    measurementId: "G-6JDLKFQKLE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const auth = getAuth(app);

// Define the function to call
const unsubscribeUser = httpsCallable(functions, 'unsubscribeUser');

// Extract parameters from URL
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
const token = urlParams.get('token');
const unsubButton = document.getElementById('unsubscribeButton');
const displayEmail = document.getElementById('displayEmail');
const loader = document.getElementById('loader');

document.addEventListener('DOMContentLoaded', async function() {
    if (!email || !token) {
        console.log('Email or token missing from URL parameters.');
        unsubButton.disabled = true;
        displayEmail.textContent = 'Error: Please use the link provided in your personal email!';
    } else {
        displayEmail.textContent = email; // Set the email to display
        unsubButton.disabled = false; // Enable the button if both parameters are present
        
        try {
            const userCredential = await signInAnonymously(auth); // Sign in anonymously
            const uid = userCredential.user.uid; // Retrieve the UID
            unsubButton.addEventListener('click', function() {
                console.log('Attempting to unsubscribe...');
                loader.style.display = 'contents'; 
        
                // Call the cloud function
                unsubscribeUser({ email, token, uid })
                    .then((result) => {
                        console.log('Unsubscribe successful:', result.data);
                        document.getElementById('text').textContent = 'Unsubscribed successfully! You can close this site now.'
                        loader.style.display = 'none';
                        unsubButton.disabled = true;
                        unsubButton.style.display = 'none';
                    })
                    .catch((error) => {
                        console.error('Unsubscribe failed:', error);
                        document.getElementById('text').textContent = 'Failed to unsubscribe. Please try again.'; // Update UI upon failure
                        loader.style.display = 'none'; // Hide loader
                    });
            });
        } catch (error) {
            console.error('Anonymous sign-in failed:', error);
            // Handle sign-in failure
        }
    }
});

//Update copyright year in footer
document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.getElementById('copyright-year');

    if (copyrightElement) {
        copyrightElement.textContent = copyrightElement.textContent.replace('YEAR', currentYear);
    }
});