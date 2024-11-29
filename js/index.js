/// FIREBASE SETUP //--------------------------------------------------------
// Import the functions from the SDKs needed
const generateLicenseCF = 'https://us-central1-opossum-website.cloudfunctions.net/generateLicenseKey';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
import { signInAnonymously, getAuth } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

let db, auth;

function initializeFirebase() {
    return new Promise((resolve, reject) => {
        try {
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
            const app = initializeApp(firebaseConfig);
            db = getDatabase(app);
            auth = getAuth(app);
            resolve(db);
        } catch (error) {
            console.error("Error initializing Firebase:", error);
            reject(error);
        }
    });
}

// Function to get the selected dropdown value
function getSelectedValue() {
    var dropdown = document.querySelector('.home-institution-dropdown .dropdown');
    return dropdown.getAttribute('data-selected-value');
}

// Handle signup process
document.getElementById('generateButton').addEventListener('click', async function() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const institution = document.getElementById('institution').value.trim();
    const userEmail = document.getElementById('userEmail').value.trim();
    const roleSelection = getSelectedValue();
    console.log(roleSelection);

    const registerSection = document.getElementById('registerForm');
    const loadingAnimation = document.getElementById('loader');
    registerSection.style.display = 'none';
    loadingAnimation.style.display = 'contents';

    signInAnonymously(auth)
        .then(async () => {
            try {
                const response = await fetch(generateLicenseCF, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        role: roleSelection,
                        institution: institution,
                        email: userEmail,
                        uid: auth.currentUser.uid
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const licenseKey = data.licenseKey;

                    const registrationSuccess = document.getElementById('registrationSuccess');
                    const generatedLicenseKey = document.getElementById('generatedLicenseKey');
                    generatedLicenseKey.textContent = licenseKey;
                    loadingAnimation.style.display = 'none';
                    registrationSuccess.style.display = 'flex';
                    document.getElementById('userMailConfirmation').textContent = userEmail;
                } else {
                    loadingAnimation.style.display = "none";
                    document.getElementById('registrationFailed').style.display = "contents";
                }
            } catch (error) {
                console.error('Error during license key generation:', error);
                loadingAnimation.style.display = "none";
                document.getElementById('registrationFailed').style.display = "contents";
            }
        })
        .catch((error) => {
            console.error('Error signing in anonymously:', error);
            loadingAnimation.style.display = "none";
            document.getElementById('registrationFailed').style.display = "contents";
        });
});

// Check if the cookieConsent cookie is set to true
function checkCookieConsent() {
    const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)cookieConsent\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    return cookieValue === "true";
}

// Load third-party services after consent is given
async function loadPage() {
    document.body.classList.remove('body-no-scroll');
    const alertPrivacyConsent = document.getElementById('popupPrivacyConsent');
    alertPrivacyConsent.style.opacity = '0';

    try {
        await initializeFirebase();
        await updateDownloadCount();

        document.getElementById('vimeoIframe1').src = "https://www.youtube.com/embed/Z8Rk3Tkk7VI";
        document.getElementById('vimeoIframe2').src = "https://www.youtube.com/embed/6OuPk_c-DlM";

        setTimeout(() => {
            alertPrivacyConsent.style.display = 'none';
        }, 500);
    } catch (error) {
        console.error("An error occurred during page load:", error);
    }
}
