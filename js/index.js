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
            resolve(db); // Resolve with db if you might use it right away
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

// handle signup process
document.getElementById('generateButton').addEventListener('click', async function() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const institution = document.getElementById('institution').value;
    const userEmail = document.getElementById('userEmail').value;
    const roleSelection = getSelectedValue();
    console.log(roleSelection)

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
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error signing in anonymously:', errorCode, errorMessage);
      });
});

// Check if the cookieConsent cookie is set to true
function checkCookieConsent() {
    const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)cookieConsent\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    return cookieValue === "true";
}

// load third party sercices after consent is given
async function loadPage() {
    document.body.classList.remove('body-no-scroll');
    const alertPrivacyConsent = document.getElementById('popupPrivacyConsent');
    alertPrivacyConsent.style.opacity = '0';

    try {
        await initializeFirebase();
        await updateDownloadCount();

        document.getElementById('vimeoIframe1').src = "https://player.vimeo.com/video/737562868?h=20a00338b4&dnt=1";
        document.getElementById('vimeoIframe2').src = "https://player.vimeo.com/video/737870683?h=20a00338b4&dnt=1";

        setTimeout(() => {
            alertPrivacyConsent.style.display = 'none';
        }, 500);
    } catch (error) {
        console.error("An error occurred during page load:", error);
    }
}

function checkButtonState() {
    const userEmail = document.getElementById('userEmail').value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const agreeCheckbox = document.getElementById('agreeTerms');
    const generateButton = document.getElementById('generateButton');
    const consentPrivacyButton = document.getElementById('consentPrivacyButton')
    consentPrivacyButton.addEventListener('click', function() {
        document.cookie = "cookieConsent=true; path=/; max-age=" + (60*60*24*365); // Set cookie for 1 year
        loadPage();
    });

    if (emailPattern.test(userEmail) && agreeCheckbox.checked) {
        generateButton.removeAttribute('disabled');
    } else {
        generateButton.setAttribute('disabled', true);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (!checkCookieConsent()) {
        document.getElementById('popupPrivacyConsent').style.display = 'flex';
        document.body.classList.add('body-no-scroll');
        checkButtonState();
    } 
    else {
        checkButtonState();
        handleMenuNavigation();
        loadPage();
    }
});

document.getElementById('userEmail').addEventListener('input', checkButtonState);
document.getElementById('agreeTerms').addEventListener('change', checkButtonState);

// copy license key after successfull signup
document.getElementById('copyButton').addEventListener('click', function() {
    const licenseKey = document.getElementById('generatedLicenseKey').textContent;
    copyToClipboard(licenseKey);
    document.getElementById("clipboardC").style.display = "none";
    document.getElementById("checkmarkC").style.display = "block";
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        document.getElementById('copyButtonText').textContent = 'Copied';
    }).catch(function(err) {
        console.error('Failed to copy text: ', err);
    });
}


// FAQ Events
document.addEventListener('DOMContentLoaded', function() {
    var faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
            var answer = this.nextElementSibling;
            var svgArrow = this.querySelector('.svg-icon');

            answer.classList.toggle('active');
            var isOpen = answer.classList.contains('active');

            answer.style.maxHeight = isOpen ? answer.scrollHeight + 20 + "px": null;

            this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

            svgArrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
            svgArrow.style.transition = 'transform 0.5s ease';
        });
    });
});

// make Menu work on INDEX
function handleMenuNavigation() {
const hash = window.location.hash;
if (hash) {
    const targetSection = document.querySelector(hash);
    if (targetSection) {
    targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    }
}
}

document.addEventListener('DOMContentLoaded', handleMenuNavigation);
window.addEventListener('hashchange', handleMenuNavigation);

// Fetch Opossum Download Count
function updateDownloadCount() {
    return new Promise((resolve, reject) => {
        const downloadCountRef = ref(db, 'downloadCount');
        get(downloadCountRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                document.getElementById('download-count').textContent = data.count;
                resolve();
            } else {
                console.log('No download count data available.');
                reject('No data available');
            }
        }).catch((error) => {
            console.error('Error fetching download count:', error);
            reject(error);
        });
    });
}