// ===============================================
// 1. IMPORT FIREBASE MODULES
// ===============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===============================================
// 2. YOUR FIREBASE CONFIG (paste YOUR keys here)
// ===============================================
const firebaseConfig = {
  apiKey: "AIzaSyA1gpp2WBn4f7uh0zlv_t2Cmb2V8PP0J_4",
  authDomain: "oneroof-d26a8.firebaseapp.com",
  projectId: "oneroof-d26a8",
  storageBucket: "oneroof-d26a8.firebasestorage.app",
  messagingSenderId: "162429418881",
  appId: "1:162429418881:web:7906ed36a546557968fc80"
};

// ===============================================
// 3. INITIALIZE FIREBASE
// ===============================================
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
// ===============================================
// 4. GRAB HTML ELEMENTS
// ===============================================
const loginView      = document.getElementById("login-view");
const registerView   = document.getElementById("register-view");
const dashboardSection = document.getElementById("dashboard-section");

const registerName  = document.getElementById("register-name");
const registerEmail = document.getElementById("register-email");
const registerPass  = document.getElementById("register-pass");
const registerBtn   = document.getElementById("register-btn");
const registerMsg   = document.getElementById("register-msg");

const loginEmail = document.getElementById("login-email");
const loginPass  = document.getElementById("login-pass");
const loginBtn   = document.getElementById("login-btn");
const loginMsg   = document.getElementById("login-msg");

const showRegisterLink = document.getElementById("show-register");
const showLoginLink    = document.getElementById("show-login");

const userName   = document.getElementById("user-name");
const userEmail  = document.getElementById("user-email");
const logoutBtn  = document.getElementById("logout-btn");

// ===============================================
// 4b. TOGGLE BETWEEN LOGIN AND REGISTER
// ===============================================
showRegisterLink.addEventListener("click", (e) => {
  e.preventDefault();              // stop the page from jumping
  loginView.classList.add("hidden");
  registerView.classList.remove("hidden");
  loginMsg.textContent = "";
});

showLoginLink.addEventListener("click", (e) => {
  e.preventDefault();
  registerView.classList.add("hidden");
  loginView.classList.remove("hidden");
  registerMsg.textContent = "";
});

// ===============================================
// 5. REGISTER A NEW USER
// ===============================================
registerBtn.addEventListener("click", async () => {
  const name  = registerName.value.trim();
  const email = registerEmail.value.trim();
  const pass  = registerPass.value;

  if (!name || !email || !pass) {
    registerMsg.textContent = "Please fill in all fields.";
    return;
  }
  if (pass.length < 6) {
    registerMsg.textContent = "Password must be at least 6 characters.";
    return;
  }

  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // Attach the display name
    await updateProfile(user, { displayName: name });

    // Save a profile document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    });

    registerMsg.textContent = "Account created! You are now logged in.";
  } catch (error) {
    registerMsg.textContent = "Error: " + error.message;
  }
});

// ===============================================
// 6. LOG IN AN EXISTING USER
// ===============================================
loginBtn.addEventListener("click", async () => {
  const email = loginEmail.value.trim();
  const pass  = loginPass.value;

  if (!email || !pass) {
    loginMsg.textContent = "Please enter email and password.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, pass);
    loginMsg.textContent = "Logged in!";
  } catch (error) {
    loginMsg.textContent = "Error: " + error.message;
  }
});

// ===============================================
// 7. LOG OUT
// ===============================================
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// ===============================================
// 8. WATCH AUTH STATE (auto switch screens)
// ===============================================
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Logged in → show dashboard
    loginView.classList.add("hidden");
    registerView.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    userName.textContent  = user.displayName || "friend";
    userEmail.textContent = user.email;
  } else {
    // Logged out → show login form by default
    dashboardSection.classList.add("hidden");
    registerView.classList.add("hidden");
    loginView.classList.remove("hidden");

    // Clear all inputs and messages
    registerName.value = registerEmail.value = registerPass.value = "";
    loginEmail.value = loginPass.value = "";
    registerMsg.textContent = loginMsg.textContent = "";
  }
});