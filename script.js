// ===============================================
// 1. IMPORTS + FIREBASE SETUP
// ===============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  initializeFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  arrayUnion,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===============================================
// 1.1. FIREBASE CONFIG (your real values here)
// ===============================================
const firebaseConfig = {
  apiKey: "AIzaSyCl_56G2VXgQfYSdpwzN_4N6TppZQkgJSI",
  authDomain: "oneroof-86614.firebaseapp.com",
  projectId: "oneroof-86614",
  storageBucket: "oneroof-86614.firebasestorage.app",
  messagingSenderId: "725388800834",
  appId: "1:725388800834:web:af6c1e289cba255b6c4edb",
  measurementId: "G-SF9RDBYYG9"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// ⚠️ Replace with your moderator UID
const MOD_UID = "REPLACE_WITH_YOUR_MOD_UID";

// ===============================================
// 2. ELEMENT GRABBER
// ===============================================
const $ = (id) => document.getElementById(id);

// Views
const landingView = $("landing-view");
const loginView = $("login-view");
const registerView = $("register-view");
const dashboardView = $("dashboard-section");

// Header
const searchToggleBtn = $("search-toggle-btn");
const searchWrap = $("header-search-wrap");
const searchCloseBtn = $("search-close-btn");
const headerSearch = $("header-search-input");
const headerNavOut = $("header-nav-out");
const headerNavIn = $("header-nav-in");
const profileMenuBtn = $("profile-menu-btn");
const profileDropdown = $("profile-dropdown");
const headerUserName = $("header-user-name");
const dropdownName = $("dropdown-name");
const dropdownEmail = $("dropdown-email");
const brandHomeLink = $("brand-home-link");

// Landing
const heroSignupBtn = $("hero-signup-btn");
const heroLoginBtn = $("hero-login-btn");
const ctaSignupBtn = $("cta-signup-btn");

// Auth
const loginEmail = $("login-email");
const loginPass = $("login-pass");
const loginBtn = $("login-btn");
const loginMsg = $("login-msg");
const registerName = $("register-name");
const registerEmail = $("register-email");
const registerPass = $("register-pass");
const registerBtn = $("register-btn");
const registerMsg = $("register-msg");
const showRegisterLink = $("show-register");
const showLoginLink = $("show-login");
const backFromLogin = $("show-landing-from-login");
const backFromRegister = $("show-landing-from-register");

// Profile
const userName = $("user-name");
const userEmail = $("user-email");
const verifiedBadge = $("verified-badge");
const verifyBanner = $("verify-banner");
const resendVerifyBtn = $("resend-verify-btn");
const verifyMsg = $("verify-msg");
const profileViewMode = $("profile-view-mode");
const profileEditMode = $("profile-edit-mode");
const editProfileBtn = $("edit-profile-btn");
const cancelProfileBtn = $("cancel-profile-btn");
const saveProfileBtn = $("save-profile-btn");
const profileName = $("profile-name");
const profileSchool = $("profile-school");
const profileCity = $("profile-city");
const profileBio = $("profile-bio");
const profileMsg = $("profile-msg");
const viewSchool = $("view-school");
const viewCity = $("view-city");
const viewBio = $("view-bio");
const viewInterests = $("view-interests");

// Housing
const housingType = $("housing-type");
const listingTitle = $("listing-title");
const listingRent = $("listing-rent");
const listingLocation = $("listing-location");
const listingDesc = $("listing-desc");
const postListingBtn = $("post-listing-btn");
const listingMsg = $("listing-msg");
const listingsGrid = $("listings-grid");

// Food
const foodType = $("food-type");
const foodTitle = $("food-title");
const foodLocation = $("food-location");
const foodDatetime = $("food-datetime");
const foodDesc = $("food-desc");
const postFoodBtn = $("post-food-btn");
const foodMsg = $("food-msg");
const foodGrid = $("food-grid");

// Events
const eventTitle = $("event-title");
const eventLocation = $("event-location");
const eventDatetime = $("event-datetime");
const eventDesc = $("event-desc");
const postEventBtn = $("post-event-btn");
const eventMsg = $("event-msg");
const eventsGrid = $("events-grid");

// Free & Help
const postFreeBtn = $("post-free-btn");
const freeTitle = $("free-title");
const freeLocation = $("free-location");
const freeDesc = $("free-desc");
const freeMsg = $("free-msg");
const freeGrid = $("free-grid");
const helpTypePicker = $("help-type-picker");

// Jobs
const jobIndustry = $("job-industry");
const jobTitle = $("job-title");
const jobCompany = $("job-company");
const jobLocation = $("job-location");
const jobDesc = $("job-desc");
const postJobBtn = $("post-job-btn");
const jobMsg = $("job-msg");
const jobsGrid = $("jobs-grid");

// Hear Me Out
const anonymousCheckbox = $("anonymous-checkbox");
const hearDesc = $("hear-desc");
const hearPostBtn = $("hear-post-btn");
const hearMsg = $("hear-msg");
const hearPostsGrid = $("hear-posts-grid");

// Crime Alerts
const alertType = $("alert-type");
const alertSeverity = $("alert-severity");
const alertLocation = $("alert-location");
const alertDesc = $("alert-desc");
const alertAnonymous = $("alert-anonymous");
const postAlertBtn = $("post-alert-btn");
const alertMsg = $("alert-msg");
const alertsGrid = $("alerts-grid");

// Moderation
const modNavLink = $("mod-nav-link");
const reportsList = $("reports-list");
const modMsg = $("mod-msg");

// ===============================================
// 3. UTILITIES
// ===============================================
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function setMsg(el, text, type = "error") {
  if (!el) return;
  el.textContent = text;
  el.style.color = type === "success" ? "var(--success)" : "var(--error)";
}

function formatTimeAgo(timestamp) {
  const now = Date.now();
  const diff = Math.floor((now - timestamp) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  if (diff < 604800) return Math.floor(diff / 86400) + "d ago";
  return new Date(timestamp).toLocaleDateString();
}

// ===============================================
// 4. VIEW CONTROLLER
// ===============================================
function hideAll() {
  [landingView, loginView, registerView, dashboardView].forEach(
    (v) => v && v.classList.add("hidden")
  );
}

function showLanding() {
  hideAll();
  landingView?.classList.remove("hidden");
}

function showLogin() {
  hideAll();
  loginView?.classList.remove("hidden");
  if (loginMsg) loginMsg.textContent = "";
}

function showRegister() {
  hideAll();
  registerView?.classList.remove("hidden");
  if (registerMsg) registerMsg.textContent = "";
}

function showDashboard() {
  hideAll();
  dashboardView?.classList.remove("hidden");
}

brandHomeLink?.addEventListener("click", (e) => {
  e.preventDefault();
  auth.currentUser ? showDashboard() : showLanding();
});
heroSignupBtn?.addEventListener("click", showRegister);
heroLoginBtn?.addEventListener("click", showLogin);
ctaSignupBtn?.addEventListener("click", showRegister);
showRegisterLink?.addEventListener("click", (e) => { e.preventDefault(); showRegister(); });
showLoginLink?.addEventListener("click", (e) => { e.preventDefault(); showLogin(); });
backFromLogin?.addEventListener("click", (e) => { e.preventDefault(); showLanding(); });
backFromRegister?.addEventListener("click", (e) => { e.preventDefault(); showLanding(); });

document.querySelectorAll('[data-show="login"]').forEach((el) =>
  el.addEventListener("click", (e) => { e.preventDefault(); showLogin(); })
);
document.querySelectorAll('[data-show="register"]').forEach((el) =>
  el.addEventListener("click", (e) => { e.preventDefault(); showRegister(); })
);

// ===============================================
// 5. HEADER
// ===============================================
searchToggleBtn?.addEventListener("click", () => {
  searchWrap?.classList.remove("hidden");
  searchToggleBtn.classList.add("hidden");
  headerSearch?.focus();
});

searchCloseBtn?.addEventListener("click", () => {
  searchWrap?.classList.add("hidden");
  searchToggleBtn?.classList.remove("hidden");
  if (headerSearch) headerSearch.value = "";
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && searchWrap && !searchWrap.classList.contains("hidden")) {
    searchWrap.classList.add("hidden");
    searchToggleBtn?.classList.remove("hidden");
    if (headerSearch) headerSearch.value = "";
  }
});

profileMenuBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  profileDropdown?.classList.toggle("hidden");
});
document.addEventListener("click", () => profileDropdown?.classList.add("hidden"));
profileDropdown?.addEventListener("click", (e) => e.stopPropagation());

$("menu-logout")?.addEventListener("click", async (e) => {
  e.preventDefault();
  profileDropdown?.classList.add("hidden");
  await signOut(auth);
});

$("menu-view-profile")?.addEventListener("click", (e) => {
  e.preventDefault();
  profileDropdown?.classList.add("hidden");
  showPage("home");
});

$("menu-edit-profile")?.addEventListener("click", (e) => {
  e.preventDefault();
  profileDropdown?.classList.add("hidden");
  showPage("home");
  document.getElementById("profile-view-mode")?.classList.add("hidden");
  document.getElementById("profile-edit-mode")?.classList.remove("hidden");
});

// ===============================================
// 6. AUTH
// ===============================================
registerBtn?.addEventListener("click", async () => {
  const name = registerName?.value.trim();
  const email = registerEmail?.value.trim();
  const pass = registerPass?.value;

  if (!name || !email || !pass) return setMsg(registerMsg, "Fill in all fields.");
  if (pass.length < 6) return setMsg(registerMsg, "Password must be 6+ characters.");
  if (!email.includes("@")) return setMsg(registerMsg, "Enter a valid email.");

  registerBtn.disabled = true;
  registerBtn.textContent = "Creating...";

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const user = cred.user;
    await updateProfile(user, { displayName: name });

    try { await sendEmailVerification(user); } catch (e) { console.warn(e.message); }
    console.log("Saving to Firestore:", { name, email });

    await setDoc(doc(db, "users", user.uid), {
      name, email, createdAt: new Date().toISOString()
    }, { merge: true });

    setMsg(registerMsg, "Account created! You are now logged in.", "success");
  } catch (e) {
    setMsg(registerMsg, "Error: " + e.message);
  } finally {
    registerBtn.disabled = false;
    registerBtn.textContent = "Create Account";
  }
});

// Grab the link
const forgotPasswordLink = $("forgot-password-link");

// Add the listener
forgotPasswordLink?.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = loginEmail?.value.trim();
  if (!email) {
    setMsg(loginMsg, "Please enter your email address first, then click 'Forgot password'.");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    setMsg(loginMsg, "Password reset email sent! Check your inbox.", "success");
  } catch (error) {
    setMsg(loginMsg, "Error: " + error.message);
  }
});

loginBtn?.addEventListener("click", async () => {
  const email = loginEmail?.value.trim();
  const pass = loginPass?.value;
  if (!email || !pass) return setMsg(loginMsg, "Enter email and password.");

  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (e) {
    setMsg(loginMsg, "Error: " + e.message);
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Log In";
  }
});

resendVerifyBtn?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await sendEmailVerification(user);
    setMsg(verifyMsg, "Verification email sent!", "success");
  } catch (e) {
    setMsg(verifyMsg, "Error: " + e.message);
  }
});

// ===============================================
// 7. PROFILE
// ===============================================

cancelProfileBtn?.addEventListener("click", () => {
  if (auth.currentUser) loadProfile(auth.currentUser);
  profileEditMode?.classList.add("hidden");
  profileViewMode?.classList.remove("hidden");
});

saveProfileBtn?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const newName = profileName?.value.trim();
  const interests = [];
  document.querySelectorAll(".interests-grid input:checked").forEach((cb) => interests.push(cb.value));

  saveProfileBtn.disabled = true;
  saveProfileBtn.textContent = "Saving...";

  try {
    await setDoc(doc(db, "users", user.uid), {
      name: newName,
      school: profileSchool?.value.trim(),
      city: profileCity?.value.trim(),
      bio: profileBio?.value.trim(),
      interests
    }, { merge: true });

    if (newName && newName !== user.displayName) {
      await updateProfile(user, { displayName: newName });
    }

    if (userName) userName.textContent = newName || "friend";
    if (headerUserName) headerUserName.textContent = (newName || "User").split(" ")[0];
    if (dropdownName) dropdownName.textContent = newName || "User";

    renderProfileView();
    profileEditMode?.classList.add("hidden");
    profileViewMode?.classList.remove("hidden");
    setMsg(profileMsg, "Profile saved ✅", "success");
  } catch (e) {
    setMsg(profileMsg, "Error: " + e.message);
  } finally {
    saveProfileBtn.disabled = false;
    saveProfileBtn.textContent = "Save Profile";
  }
});

// ===============================================
// DELETE ACCOUNT
// ===============================================
document.getElementById("delete-account-btn")?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const step1 = confirm(
    "Delete your OneRoof account?\n\n" +
    "This will permanently delete:\n" +
    "• Your profile\n" +
    "• All your listings, posts, jobs, and alerts\n" +
    "• Your messages\n" +
    "• Your vouches\n\n" +
    "This cannot be undone."
  );
  if (!step1) return;

  const step2 = prompt("Type DELETE (all caps) to confirm:");
  if (step2 !== "DELETE") {
    alert("Cancelled. Your account was not deleted.");
    return;
  }

  const btn = document.getElementById("delete-account-btn");
  if (btn) { btn.disabled = true; btn.textContent = "Deleting..."; }

  try {
    await deleteUserData(user.uid);
    await deleteUser(user);
    alert("Your account has been deleted. Goodbye!");
  } catch (e) {
    if (e.code === "auth/requires-recent-login") {
      alert("For security, please log out and log back in, then try deleting your account again.");
    } else {
      alert("Error deleting account: " + e.message);
    }
    if (btn) { btn.disabled = false; btn.textContent = "Delete Account"; }
  }
});

// ===============================================
// DELETE USER DATA FROM FIRESTORE
// ===============================================
async function deleteUserData(uid) {
  try {
    await deleteDoc(doc(db, "users", uid));

    const listings = await getDocs(query(collection(db, "listings"), where("user_id", "==", uid)));
    for (const d of listings.docs) {
      await deleteDoc(doc(db, "listings", d.id));
    }

    const posts = await getDocs(query(collection(db, "posts"), where("host_id", "==", uid)));
    for (const d of posts.docs) {
      await deleteDoc(doc(db, "posts", d.id));
    }

    const jobs = await getDocs(query(collection(db, "jobs"), where("poster_id", "==", uid)));
    for (const d of jobs.docs) {
      await deleteDoc(doc(db, "jobs", d.id));
    }

    const hear = await getDocs(query(collection(db, "hear_me_out"), where("author_id", "==", uid)));
    for (const d of hear.docs) {
      await deleteDoc(doc(db, "hear_me_out", d.id));
    }

    const alerts = await getDocs(query(collection(db, "crime_alerts"), where("reporter_id", "==", uid)));
    for (const d of alerts.docs) {
      await deleteDoc(doc(db, "crime_alerts", d.id));
    }

    const sentMsgs = await getDocs(query(collection(db, "messages"), where("from_user", "==", uid)));
    for (const d of sentMsgs.docs) {
      await deleteDoc(doc(db, "messages", d.id));
    }
    const receivedMsgs = await getDocs(query(collection(db, "messages"), where("to_user", "==", uid)));
    for (const d of receivedMsgs.docs) {
      await deleteDoc(doc(db, "messages", d.id));
    }

    const receivedVouches = await getDocs(query(collection(db, "vouches"), where("to_user", "==", uid)));
    for (const d of receivedVouches.docs) {
      await deleteDoc(doc(db, "vouches", d.id));
    }
    const givenVouches = await getDocs(query(collection(db, "vouches"), where("from_user", "==", uid)));
    for (const d of givenVouches.docs) {
      await deleteDoc(doc(db, "vouches", d.id));
    }
  } catch (e) {
    console.warn("Data deletion error:", e.message);
  }
}

function renderProfileView() {
  if (viewSchool) viewSchool.textContent = profileSchool?.value.trim() || "School not set";
  if (viewCity) viewCity.textContent = profileCity?.value.trim() || "City not set";
  if (viewBio) viewBio.textContent = profileBio?.value.trim() || "No intro yet.";

  const interests = [];
  document.querySelectorAll(".interests-grid input:checked").forEach((cb) => interests.push(cb.value));
  const interestsEl = document.getElementById("view-interests");
  if (interestsEl) {
    if (interests.length) {
      const icons = { "Housing": "🏠", "Food": "🍽️", "Events": "🎉", "Jobs": "💼", "Free Items": "🎁", "Support": "💬" };
      interestsEl.innerHTML = interests.map((i) =>
        `<span class="interest-pill">${icons[i] || "•"} ${escapeHtml(i)}</span>`
      ).join("");
    } else {
      interestsEl.innerHTML = '<span style="color:var(--text-muted);font-size:13px;">Add interests to connect with people who share them</span>';
    }
  }
}

async function loadProfile(user) {
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      const d = snap.data();

      if (userName) userName.textContent = d.name || user.displayName || "friend";

      if (profileSchool) profileSchool.value = d.school || "";
      if (profileCity) profileCity.value = d.city || "";
      if (profileBio) profileBio.value = d.bio || "";
      if (profileName) profileName.value = d.name || "";

      const interests = d.interests || [];
      document.querySelectorAll(".interests-grid input").forEach((cb) => {
        cb.checked = interests.includes(cb.value);
      });

      renderProfileView();
      profileEditMode?.classList.add("hidden");
      profileViewMode?.classList.remove("hidden");

      try {
        const [followerSnap, followingSnap, vouchSnap, listingsSnap, postsSnap, jobsSnap] = await Promise.all([
          getDocs(query(collection(db, "follows"), where("following_id", "==", user.uid))),
          getDocs(query(collection(db, "follows"), where("follower_id", "==", user.uid))),
          getDocs(query(collection(db, "vouches"), where("to_user", "==", user.uid))),
          getDocs(query(collection(db, "listings"), where("user_id", "==", user.uid))),
          getDocs(query(collection(db, "posts"), where("host_id", "==", user.uid))),
          getDocs(query(collection(db, "jobs"), where("poster_id", "==", user.uid)))
        ]);

        document.getElementById("own-follower-count").textContent = followerSnap.size;
        document.getElementById("own-following-count").textContent = followingSnap.size;
        document.getElementById("own-vouch-count").textContent = vouchSnap.size;
        document.getElementById("count-listings").textContent = listingsSnap.size;
        document.getElementById("count-posts").textContent = postsSnap.size;
        document.getElementById("count-jobs").textContent = jobsSnap.size;

        const { avg, count } = await loadVouchesFor(user.uid);
        const ratingEl = document.getElementById("own-rating-display");
        if (ratingEl && count > 0) {
          ratingEl.innerHTML = `${renderDiamondRating(avg)} ${avg} · `;
        }

        if (count > 0) {
          const vouchList = document.getElementById("own-vouch-list");
          if (vouchList) renderVouchList(vouchList, (await loadVouchesFor(user.uid)).vouches.slice(0, 3));
        }
      } catch (e) {
        console.warn("Profile counts error:", e.message);
      }
    }
  } catch (e) {
    console.error("Profile load error:", e);
  }
}

function updateVerificationUI(user) {
  const verifyInline = document.getElementById("verify-inline");
  const verifiedBadge = document.getElementById("verified-badge");
  const unverifiedBadge = document.getElementById("unverified-badge");

  if (user.emailVerified) {
    verifiedBadge?.classList.remove("hidden");
    unverifiedBadge?.classList.add("hidden");
    verifyInline?.classList.add("hidden");
  } else {
    verifiedBadge?.classList.add("hidden");
    unverifiedBadge?.classList.remove("hidden");
    verifyInline?.classList.remove("hidden");
  }
}

// ===============================================
// 8. DASHBOARD PAGE NAVIGATION
// ===============================================
function showPage(pageName) {
  document.querySelectorAll(".dash-page").forEach((p) => p.classList.add("hidden"));
  document.getElementById("page-" + pageName)?.classList.remove("hidden");
  document.querySelectorAll(".dash-nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === pageName);
  });

  if (pageName === "housing") loadListings();
  if (pageName === "food") loadFood();
  if (pageName === "events") loadEvents();
  if (pageName === "free") loadFree();
  if (pageName === "jobs") loadJobs();
  if (pageName === "hear") loadHear();
  if (pageName === "alerts") loadAlerts();
  if (pageName === "mod") loadReports();
  if (pageName === "messages") loadMessages();
  if (pageName === "home") updateHubCounts();
}

document.querySelectorAll(".dash-nav-link").forEach((link) => {
  link.addEventListener("click", () => showPage(link.dataset.page));
});

document.querySelectorAll('[data-goto]').forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    showPage(el.dataset.goto);
  });
});

// ===============================================
// 9. POSTER LINK + USER PROFILE MODAL
// ===============================================
let currentProfileUid = null;
let currentProfileName = "";

function addPosterLine(card, uid, name) {
  const user = auth.currentUser;
  if (!user || user.uid === uid) return;

  const line = document.createElement("div");
  line.className = "item-meta";
  line.style.marginBottom = "8px";
  line.innerHTML = `Posted by <a href="#" class="poster-link">${escapeHtml(name || "member")}</a>`;

  line.querySelector(".poster-link").addEventListener("click", (e) => {
    e.preventDefault();
    openUserProfile(uid, name);
  });

  card.insertBefore(line, card.firstChild);
}

async function openUserProfile(uid, name) {
  if (!uid) return;

  const modal = document.getElementById("user-profile-modal");
  if (!modal) return;

  currentProfileUid = uid;
  currentProfileName = name || "user";
  console.log("🔵 openUserProfile — currentProfileUid:", currentProfileUid, "name:", currentProfileName);

  document.getElementById("modal-user-name").textContent = name || "User";
  document.getElementById("modal-user-subtitle").textContent = "Loading...";
  document.getElementById("modal-user-bio").textContent = "—";
  document.getElementById("modal-user-interests").textContent = "—";
  document.getElementById("modal-count-listings").textContent = "0";
  document.getElementById("modal-count-posts").textContent = "0";
  document.getElementById("modal-count-jobs").textContent = "0";

  modal.classList.remove("hidden");

  try {
    const userSnap = await getDoc(doc(db, "users", uid));
    if (userSnap.exists()) {
      const d = userSnap.data();
      const subtitle = [d.school, d.city].filter(Boolean).join(" · ") || "OneRoof member";
      document.getElementById("modal-user-subtitle").textContent = subtitle;
      document.getElementById("modal-user-bio").textContent = d.bio || "—";
      document.getElementById("modal-user-interests").textContent =
        (d.interests && d.interests.length) ? d.interests.join(", ") : "—";
    }

    const [listings, posts, jobs] = await Promise.all([
      getDocs(query(collection(db, "listings"), where("user_id", "==", uid))),
      getDocs(query(collection(db, "posts"), where("host_id", "==", uid))),
      getDocs(query(collection(db, "jobs"), where("poster_id", "==", uid)))
    ]);

    document.getElementById("modal-count-listings").textContent = listings.size;
    document.getElementById("modal-count-posts").textContent = posts.size;
    document.getElementById("modal-count-jobs").textContent = jobs.size;

    const { count, vouches } = await loadVouchesFor(uid);
    const vouchSection = document.getElementById("modal-vouch-section");
    const vouchList = document.getElementById("modal-vouch-list");
    const vouchBtn = document.getElementById("modal-vouch-btn");

    if (count > 0) {
      vouchSection?.classList.remove("hidden");
      renderVouchList(vouchList, vouches);
    } else {
      vouchSection?.classList.add("hidden");
    }

    if (auth.currentUser && auth.currentUser.uid !== uid) {
      vouchBtn?.classList.remove("hidden");
    } else {
      vouchBtn?.classList.add("hidden");
    }
  } catch (e) {
    console.error("Profile load error:", e);
  }

  // FOLLOW BUTTON
  const followBtn = document.getElementById("modal-follow-btn");

  if (followBtn && auth.currentUser && auth.currentUser.uid !== uid) {
    followBtn.classList.remove("hidden");

    const followQuery = query(
      collection(db, "follows"),
      where("follower_id", "==", auth.currentUser.uid),
      where("following_id", "==", uid)
    );
    const followSnap = await getDocs(followQuery);
    const isFollowing = !followSnap.empty;

    followBtn.textContent = isFollowing ? "✓ Following" : "+ Follow";
    followBtn.className = isFollowing ? "btn-muted" : "";

    const newFollowBtn = followBtn.cloneNode(true);
    followBtn.parentNode.replaceChild(newFollowBtn, followBtn);

    newFollowBtn.addEventListener("click", async () => {
      newFollowBtn.disabled = true;
      try {
        if (isFollowing) {
          for (const doc of followSnap.docs) {
            await deleteDoc(doc(db, "follows", doc.id));
          }
          newFollowBtn.textContent = "+ Follow";
          newFollowBtn.className = "";
        } else {
          await addDoc(collection(db, "follows"), {
            follower_id: auth.currentUser.uid,
            following_id: uid,
            createdAt: Date.now()
          });
          newFollowBtn.textContent = "✓ Following";
          newFollowBtn.className = "btn-muted";
        }
      } catch (e) {
        alert("Error: " + e.message);
      } finally {
        newFollowBtn.disabled = false;
      }
    });
  } else if (followBtn) {
    followBtn.classList.add("hidden");
  }

  try {
    const followerSnap = await getDocs(
      query(collection(db, "follows"), where("following_id", "==", uid))
    );
    const followingSnap = await getDocs(
      query(collection(db, "follows"), where("follower_id", "==", uid))
    );
    const followerEl = document.getElementById("modal-follower-count");
    const followingEl = document.getElementById("modal-following-count");
    if (followerEl) followerEl.textContent = followerSnap.size;
    if (followingEl) followingEl.textContent = followingSnap.size;
  } catch (e) {
    console.warn("Follow counts error:", e.message);
  }
}

function closeUserProfile() {
  document.getElementById("user-profile-modal")?.classList.add("hidden");
  currentProfileUid = null;
  currentProfileName = "";
}

document.getElementById("modal-close-btn")?.addEventListener("click", closeUserProfile);
document.getElementById("user-profile-modal")?.addEventListener("click", (e) => {
  if (e.target.id === "user-profile-modal") closeUserProfile();
});

// ✅ FIXED: modal-message-btn — saves uid BEFORE closing
document.getElementById("modal-message-btn")?.addEventListener("click", () => {
  if (!currentProfileUid) return;
  const uid = currentProfileUid;
  const name = currentProfileName;
  closeUserProfile();
  openMessageDialog({
    to_user: uid,
    to_name: name,
    post_id: "",
    post_title: ""
  });
});

// ✅ FIXED: modal-report-btn — saves uid BEFORE closing
document.getElementById("modal-report-btn")?.addEventListener("click", () => {
  if (!currentProfileUid) return;
  const uid = currentProfileUid;
  const name = currentProfileName;

  const reason = prompt(
    "Report this user?\n\n1. Spam\n2. Scam\n3. Inappropriate\n4. Harassment\n5. Other\n\nEnter number (1-5):"
  );
  if (!reason) return;
  const reasons = ["Spam", "Scam", "Inappropriate", "Harassment", "Other"];
  const idx = parseInt(reason.trim(), 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= reasons.length) return;
  
  addDoc(collection(db, "reports"), {
    reporter_id: auth.currentUser.uid,
    reporter_email: auth.currentUser.email || "",
    post_id: uid,
    post_type: "profile",
    post_title: `User: ${name}`,
    post_owner_id: uid,
    reason: reasons[idx],
    status: "open",
    createdAt: Date.now()
  }).then(() => {
    alert("Report submitted. Thank you.");
    closeUserProfile();
  }).catch((e) => {
    alert("Error: " + e.message);
  });
});

// ===============================================
// 10. VOUCH SYSTEM — diamonds + vouches
// ===============================================

// ✅ FIXED: modal-vouch-btn — saves uid BEFORE closing
document.getElementById("modal-vouch-btn")?.addEventListener("click", () => {
  if (!currentProfileUid) return;
  const uid = currentProfileUid;
  const name = currentProfileName;
  closeUserProfile();
  openVouchDialog(uid, name);
});

const VOUCH_CONTEXTS = {
  "sublease": "🏡 Sublease",
  "roommate": "🏠 Roommate",
  "cooking-group": "🍽️ Cooking group",
  "event": "🎉 Event",
  "study": "📚 Study",
  "job-referral": "💼 Job referral",
  "ride": "🚗 Ride",
  "help": "🆘 Help"
};

function renderDiamondRating(avg) {
  const filled = Math.round(avg || 0);
  let html = "";
  for (let i = 0; i < 5; i++) {
    html += i < filled ? '<span class="filled">💎</span>' : '<span class="empty">🤍</span>';
  }
  return `<span class="diamond-rating">${html}</span>`;
}

async function loadVouchesFor(uid) {
  try {
    const q = query(collection(db, "vouches"), where("to_user", "==", uid));
    const snap = await getDocs(q);
    const vouches = [];
    let total = 0;
    snap.forEach((d) => {
      const v = d.data();
      vouches.push({ id: d.id, ...v });
      if (v.rating) total += v.rating;
    });
    vouches.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const avg = vouches.length ? (total / vouches.length).toFixed(1) : "0.0";
    return { avg, count: vouches.length, vouches };
  } catch (e) {
    console.warn("Load vouches error:", e.message);
    return { avg: "0.0", count: 0, vouches: [] };
  }
}

function renderVouchList(container, vouches) {
  if (!container) return;
  if (!vouches.length) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">No vouches yet.</p>';
    return;
  }
  container.innerHTML = "";
  vouches.forEach((v) => {
    const card = document.createElement("div");
    card.className = "vouch-card";
    const contextLabel = VOUCH_CONTEXTS[v.context] || "🤝 Vouch";
    card.innerHTML = `
      <div class="vouch-card-message">"${escapeHtml(v.message)}"</div>
      <div class="vouch-card-meta">
        ${renderDiamondRating(v.rating)}
        <span>— ${escapeHtml(v.from_name || "someone")}</span>
        <span>· ${escapeHtml(contextLabel)}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

async function updateOwnVouches(uid) {
  const { avg, count, vouches } = await loadVouchesFor(uid);
  const trustLine = document.getElementById("own-trust-line");
  const section = document.getElementById("own-vouch-section");
  const list = document.getElementById("own-vouch-list");

  if (count > 0) {
    if (trustLine) {
      trustLine.classList.remove("hidden");
      trustLine.innerHTML = `${renderDiamondRating(avg)} ${avg} · Trusted by ${count} community member${count === 1 ? "" : "s"}`;
    }
    if (section) section.classList.remove("hidden");
    renderVouchList(list, vouches.slice(0, 3));
  } else {
    if (trustLine) trustLine.classList.add("hidden");
    if (section) section.classList.add("hidden");
  }
}

// ===============================================
// 10a. VOUCH DIALOG — create a new vouch
// ===============================================
let selectedDiamonds = 0;
let currentVouchTarget = null;

function openVouchDialog(uid, name) {
  if (!uid) {
    alert("Cannot vouch — user not found.");
    return;
  }
  if (!auth.currentUser || auth.currentUser.uid === uid) {
    alert("You can't vouch for yourself.");
    return;
  }

  currentVouchTarget = { uid, name };

  const dialog = document.getElementById("vouch-dialog");
  const title = document.getElementById("vouch-dialog-title");
  if (title) title.textContent = `Vouch for ${name || "this person"}`;
  if (dialog) dialog.classList.remove("hidden");

  selectedDiamonds = 0;
  document.querySelectorAll("#diamond-picker .diamond-btn").forEach((b) => b.classList.remove("selected"));
  const label = document.getElementById("diamond-value-label");
  if (label) label.textContent = "0/5";

  const msg = document.getElementById("vouch-msg");
  if (msg) msg.textContent = "";
  const msgText = document.getElementById("vouch-message");
  if (msgText) msgText.value = "";
}

function closeVouchDialog() {
  document.getElementById("vouch-dialog")?.classList.add("hidden");
  currentVouchTarget = null;
}

document.querySelectorAll("#diamond-picker .diamond-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedDiamonds = Number(btn.dataset.value);
    document.querySelectorAll("#diamond-picker .diamond-btn").forEach((b) => {
      const v = Number(b.dataset.value);
      b.classList.toggle("selected", v <= selectedDiamonds);
    });
    const label = document.getElementById("diamond-value-label");
    if (label) label.textContent = `${selectedDiamonds}/5`;
  });
});

document.getElementById("vouch-submit-btn")?.addEventListener("click", async () => {
  if (!currentVouchTarget) return;
  const user = auth.currentUser;
  if (!user) return;

  const context = document.getElementById("vouch-context")?.value || "help";
  const message = document.getElementById("vouch-message")?.value.trim();
  const msgEl = document.getElementById("vouch-msg");
  const submitBtn = document.getElementById("vouch-submit-btn");

  if (selectedDiamonds === 0) {
    if (msgEl) { msgEl.textContent = "Pick a diamond rating."; msgEl.style.color = "var(--error)"; }
    return;
  }
  if (!message) {
    if (msgEl) { msgEl.textContent = "Write a short message."; msgEl.style.color = "var(--error)"; }
    return;
  }

  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Posting..."; }

  try {
    await addDoc(collection(db, "vouches"), {
      from_user: user.uid,
      from_name: user.displayName || "user",
      to_user: currentVouchTarget.uid,
      rating: selectedDiamonds,
      context,
      message,
      createdAt: Date.now()
    });

    if (msgEl) { msgEl.textContent = "Vouch posted! ✅"; msgEl.style.color = "var(--success)"; }
    setTimeout(() => { closeVouchDialog(); }, 700);
  } catch (e) {
    if (msgEl) { msgEl.textContent = "Error: " + e.message; msgEl.style.color = "var(--error)"; }
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Post Vouch"; }
  }
});

document.getElementById("vouch-cancel-btn")?.addEventListener("click", closeVouchDialog);
document.getElementById("vouch-dialog")?.addEventListener("click", (e) => {
  if (e.target.id === "vouch-dialog") closeVouchDialog();
});

// ===============================================
// 11. SIMPLE INBOX — MESSAGING
// ===============================================
let currentMessageContext = null;

function openMessageDialog(ctx) {
  const dialog = document.getElementById("message-dialog");
  if (!dialog) return;

  currentMessageContext = ctx;

  const title = document.getElementById("message-dialog-title");
  const context = document.getElementById("message-dialog-context");
  const input = document.getElementById("message-input");
  const msg = document.getElementById("message-msg");

  if (title) title.textContent = `Send a message to ${ctx.to_name || "this person"}`;
  if (context) context.textContent = ctx.post_title ? `Re: ${ctx.post_title}` : "";
  if (input) input.value = "";
  if (msg) msg.textContent = "";

  dialog.classList.remove("hidden");
  input?.focus();
}

function closeMessageDialog() {
  document.getElementById("message-dialog")?.classList.add("hidden");
  currentMessageContext = null;
}

async function sendMessage() {
  if (!currentMessageContext) return;
  const user = auth.currentUser;
  if (!user) return;

  const input = document.getElementById("message-input");
  const msgEl = document.getElementById("message-msg");
  const sendBtn = document.getElementById("message-send-btn");

  const text = input?.value.trim();
  if (!text) {
    if (msgEl) { msgEl.textContent = "Write a message first."; msgEl.style.color = "var(--error)"; }
    return;
  }

  if (sendBtn) { sendBtn.disabled = true; sendBtn.textContent = "Sending..."; }

  try {
    await addDoc(collection(db, "messages"), {
      from_user: user.uid,
      from_name: user.displayName || "user",
      from_email: user.email || "",
      to_user: currentMessageContext.to_user,
      to_name: currentMessageContext.to_name || "",
      post_id: currentMessageContext.post_id || "",
      post_title: currentMessageContext.post_title || "",
      message: text,
      read: false,
      createdAt: Date.now()
    });

    if (msgEl) { msgEl.textContent = "Message sent! ✅"; msgEl.style.color = "var(--success)"; }
    setTimeout(closeMessageDialog, 800);
  } catch (e) {
    if (msgEl) { msgEl.textContent = "Error: " + e.message; msgEl.style.color = "var(--error)"; }
  } finally {
    if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = "Send"; }
  }
}

document.getElementById("message-cancel-btn")?.addEventListener("click", closeMessageDialog);
document.getElementById("message-send-btn")?.addEventListener("click", sendMessage);
document.getElementById("message-dialog")?.addEventListener("click", (e) => {
  if (e.target.id === "message-dialog") closeMessageDialog();
});

function addMessageButton(card, ctx) {
  const user = auth.currentUser;
  if (!user || user.uid === ctx.to_user) return;

  const btn = document.createElement("button");
  btn.textContent = "💬 Message";
  btn.className = "message-btn";
  btn.addEventListener("click", () => openMessageDialog(ctx));
  card.appendChild(btn);
}

async function loadMessages() {
  const grid = document.getElementById("messages-grid");
  if (!grid) return;

  const user = auth.currentUser;
  if (!user) return;

  try {
    const q = query(
      collection(db, "messages"),
      where("to_user", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const snap = await getDocs(q);

    grid.innerHTML = "";
    if (snap.empty) {
      grid.innerHTML = '<p style="color:var(--text-muted);">No messages yet. When someone contacts you, it will show up here.</p>';
      return;
    }

    snap.forEach((d) => {
      const m = d.data();
      const card = document.createElement("div");
      card.className = "msg-card" + (m.read ? "" : " unread");
      const timeAgo = formatTimeAgo(m.createdAt);

      card.innerHTML = `
        <div class="msg-header">
          <div class="msg-from">${escapeHtml(m.from_name || "Someone")} ${m.read ? "" : "🔵"}</div>
          <div class="msg-time">${timeAgo}</div>
        </div>
        ${m.post_title ? `<div class="msg-post">Re: ${escapeHtml(m.post_title)}</div>` : ""}
        <div class="msg-body">${escapeHtml(m.message)}</div>
      `;

      const replyBtn = document.createElement("button");
      replyBtn.textContent = "💬 Reply";
      replyBtn.className = "message-btn";
      replyBtn.addEventListener("click", () => {
        openMessageDialog({
          to_user: m.from_user,
          to_name: m.from_name,
          post_id: m.post_id,
          post_title: m.post_title
        });
      });

      if (!m.read) {
        const readBtn = document.createElement("button");
        readBtn.textContent = "Mark as read";
        readBtn.className = "btn-small btn-muted";
        readBtn.style.marginLeft = "8px";
        readBtn.addEventListener("click", async () => {
          await updateDoc(doc(db, "messages", d.id), { read: true });
          loadMessages();
        });
        card.appendChild(replyBtn);
        card.appendChild(readBtn);
      } else {
        card.appendChild(replyBtn);
      }

      grid.appendChild(card);
    });
  } catch (e) {
    grid.innerHTML = `<p style="color:var(--error);">Error: ${escapeHtml(e.message)}</p>`;
  }
}

// ===============================================
// 12. HOUSING
// ===============================================
postListingBtn?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const title = listingTitle?.value.trim();
  const rent = Number(listingRent?.value);
  const location = listingLocation?.value.trim();
  const desc = listingDesc?.value.trim();
  const type = housingType?.value || "rent-room";

  if (!title || !rent || !location) return setMsg(listingMsg, "Title, rent, location required.");

  postListingBtn.disabled = true;
  postListingBtn.textContent = "Posting...";

  try {
    await addDoc(collection(db, "listings"), {
      user_id: user.uid,
      owner_name: user.displayName || "user",
      owner_email: user.email || "",
      housing_type: type,
      title, rent, location, description: desc,
      attendees: [],
      createdAt: Date.now(),
      comment_count: 0
    });

    if (listingTitle) listingTitle.value = "";
    if (listingRent) listingRent.value = "";
    if (listingLocation) listingLocation.value = "";
    if (listingDesc) listingDesc.value = "";

    setMsg(listingMsg, "Listing posted ✅", "success");
    loadListings();
  } catch (e) {
    setMsg(listingMsg, "Error: " + e.message);
  } finally {
    postListingBtn.disabled = false;
    postListingBtn.textContent = "Post Listing";
  }
});

async function loadListings() {
  if (!listingsGrid) return;
  try {
    const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const filterEl = document.querySelector('input[name="housing-filter"]:checked');
    const filter = filterEl ? filterEl.value : "all";

    listingsGrid.innerHTML = "";
    let count = 0;

    snap.forEach((d) => {
      const l = d.data();
      if (filter !== "all" && l.housing_type !== filter) return;
      count++;

      const card = document.createElement("div");
      card.className = "item-card";

      const typeLabel = {
        "landlord": "🏢 Landlord",
        "sublease": "🔄 Sublease",
        "rent-room": "🚪 Rent Room",
        "share-single": "🛏️ Share Single",
        "shared-apt": "🏠 Shared Apt"
      }[l.housing_type] || "";

      card.innerHTML = `
        ${typeLabel ? `<div class="type-badge">${typeLabel}</div>` : ""}
        <strong>${escapeHtml(l.title)}</strong>
        <div class="item-meta">$${escapeHtml(l.rent)}/mo · ${escapeHtml(l.location)}</div>
        <div class="item-desc">${escapeHtml(l.description || "")}</div>
      `;

      addPosterLine(card, l.user_id, l.owner_name);

      if (auth.currentUser && l.user_id === auth.currentUser.uid) {
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.className = "btn-small btn-danger";
        del.addEventListener("click", async () => {
          if (!confirm("Delete?")) return;
          await deleteDoc(doc(db, "listings", d.id));
          loadListings();
        });
        card.appendChild(del);
      } else {
        const commentCount = l.comment_count || 0;

        const replyBtn = document.createElement("button");
        replyBtn.textContent = `💬 ${commentCount}`;
        replyBtn.className = "btn-small";
        replyBtn.addEventListener("click", () => {
          const commentForm = card.querySelector(".comment-form textarea");
          if (commentForm) {
            commentForm.scrollIntoView({ behavior: "smooth", block: "center" });
            commentForm.focus();
          }
        });
        card.appendChild(replyBtn);

        const attendees = l.attendees || [];
        const alreadyInterested = auth.currentUser && attendees.includes(auth.currentUser.uid);
        const interestedBtn = document.createElement("button");
        interestedBtn.textContent = alreadyInterested ? "👍 Interested ✓" : "👍 Interested";
        interestedBtn.disabled = alreadyInterested;
        interestedBtn.className = "btn-small";
        interestedBtn.addEventListener("click", async () => {
          try {
            await updateDoc(doc(db, "listings", d.id), {
              attendees: arrayUnion(auth.currentUser.uid)
            });
            loadListings();
          } catch (e) { alert("Error: " + e.message); }
        });
        card.appendChild(interestedBtn);

        addCommentSection(card, "listings", d.id, l.title);
      }

      listingsGrid.appendChild(card);
    });

    if (count === 0) {
      listingsGrid.innerHTML = '<p style="color:var(--text-muted);">No listings yet.</p>';
    }
  } catch (e) {
    listingsGrid.innerHTML = `<p style="color:var(--error);">Error: ${escapeHtml(e.message)}</p>`;
  }
}

// ===============================================
// 13. FOOD / EVENTS
// ===============================================
async function postGeneric(category, subtype, titleVal, locationVal, descVal, datetimeVal, msgEl, btn) {
  const user = auth.currentUser;
  if (!user) return;
  if (!titleVal) return setMsg(msgEl, "Title required.");

  btn.disabled = true;
  btn.textContent = "Posting...";

  try {
    const payload = {
      host_id: user.uid,
      host_name: user.displayName || "user",
      host_email: user.email || "",
      category,
      title: titleVal,
      location: locationVal || "",
      description: descVal || "",
      datetime: datetimeVal || "",
      attendees: [],
      comment_count: 0,
      createdAt: Date.now()
    };

    if (category === "food") payload.food_type = subtype;
    if (category === "events") {
      payload.event_type = subtype;
      payload.going = [];
    }

    await addDoc(collection(db, "posts"), payload);
    setMsg(msgEl, "Posted ✅", "success");
  } catch (e) {
    setMsg(msgEl, "Error: " + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Post";
  }
}

postFoodBtn?.addEventListener("click", async () => {
  await postGeneric(
    "food",
    selectedFoodType,
    foodTitle?.value.trim(),
    foodLocation?.value.trim(),
    foodDesc?.value.trim(),
    foodDatetime?.value || "",
    foodMsg,
    postFoodBtn
  );
  if (foodTitle) foodTitle.value = "";
  if (foodLocation) foodLocation.value = "";
  if (foodDesc) foodDesc.value = "";
  if (foodDatetime) foodDatetime.value = "";
  loadFood();
});

postEventBtn?.addEventListener("click", async () => {
  await postGeneric(
    "events",
    selectedEventType,
    eventTitle?.value.trim(),
    eventLocation?.value.trim(),
    eventDesc?.value.trim(),
    eventDatetime?.value || "",
    eventMsg,
    postEventBtn
  );
  if (eventTitle) eventTitle.value = "";
  if (eventLocation) eventLocation.value = "";
  if (eventDesc) eventDesc.value = "";
  if (eventDatetime) eventDatetime.value = "";
  loadEvents();
});

async function loadCategoryPosts(category, gridEl) {
  if (!gridEl) return;
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    gridEl.innerHTML = "";
    let count = 0;

    snap.forEach((d) => {
      const p = d.data();
      if (p.category !== category) return;
      count++;

      const isHost = auth.currentUser && p.host_id === auth.currentUser.uid;
      const attendees = p.attendees || [];
      const goingList = p.going || [];
      const alreadyInterested = auth.currentUser && attendees.includes(auth.currentUser.uid);
      const alreadyGoing = auth.currentUser && goingList.includes(auth.currentUser.uid);
      const dateLine = p.datetime ? `<div class="item-meta">🕒 ${escapeHtml(p.datetime)}</div>` : "";

      let typeBadge = "";
      if (category === "food" && p.food_type) {
        const labels = {
          "dining-out": "🍴 Dining Out",
          "recommendations": "💡 Recommendations",
          "cooking-partner": "👨‍🍳 Cooking Partner",
          "recipe-ideas": "📖 Recipe Ideas",
          "cooking-help": "🆘 Cooking Help"
        };
        typeBadge = `<div class="type-badge">${labels[p.food_type] || "🍽️ Food"}</div>`;
      }
      if (category === "events" && p.event_type) {
        const labels = {
          "going-out": "🎉 Going Out",
          "explore": "🥾 Explore Together",
          "recommendations": "💡 Recommendations",
          "activity-partner": "👥 Activity Partner",
          "free-event": "🆓 Free Event"
        };
        typeBadge = `<div class="type-badge">${labels[p.event_type] || "🎉 Event"}</div>`;
      }

      const card = document.createElement("div");
      card.className = "item-card";
      card.innerHTML = `
        ${typeBadge}
        <strong>${escapeHtml(p.title)}</strong>
        <div class="item-meta">${escapeHtml(p.location || "")}</div>
        ${dateLine}
        <div class="item-desc">${escapeHtml(p.description || "")}</div>
        <div class="item-meta">👥 ${attendees.length} interested${goingList.length ? ` · ✨ ${goingList.length} going` : ""}</div>
      `;

      addPosterLine(card, p.host_id, p.host_name);

      if (!isHost) {
        const replyBtn = document.createElement("button");
        replyBtn.textContent = `💬 ${p.comment_count || 0}`;
        replyBtn.className = "btn-small";
        replyBtn.addEventListener("click", () => {
          const form = card.querySelector(".comment-form textarea");
          if (form) {
            form.scrollIntoView({ behavior: "smooth", block: "center" });
            form.focus();
          }
        });
        card.appendChild(replyBtn);

        const isQandA = (
          (category === "food" && ["recommendations", "recipe-ideas"].includes(p.food_type)) ||
          (category === "events" && p.event_type === "recommendations")
        );

        if (!isQandA) {
          const interestedBtn = document.createElement("button");
          interestedBtn.textContent = alreadyInterested ? "👍 Interested ✓" : "👍 Interested";
          interestedBtn.disabled = alreadyInterested;
          interestedBtn.className = "btn-small";
          interestedBtn.addEventListener("click", async () => {
            try {
              await updateDoc(doc(db, "posts", d.id), {
                attendees: arrayUnion(auth.currentUser.uid)
              });
              loadCategoryPosts(category, gridEl);
            } catch (e) { alert("Error: " + e.message); }
          });
          card.appendChild(interestedBtn);
        }

        if (category === "events" && !["recommendations", "activity-partner"].includes(p.event_type)) {
          const goingBtn = document.createElement("button");
          goingBtn.textContent = alreadyGoing ? "✨ Going ✓" : "✨ Going";
          goingBtn.disabled = alreadyGoing;
          goingBtn.className = "btn-small";
          goingBtn.addEventListener("click", async () => {
            try {
              await updateDoc(doc(db, "posts", d.id), {
                going: arrayUnion(auth.currentUser.uid)
              });
              loadCategoryPosts(category, gridEl);
            } catch (e) { alert("Error: " + e.message); }
          });
          card.appendChild(goingBtn);
        }
      } else {
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.className = "btn-small btn-danger";
        del.addEventListener("click", async () => {
          if (!confirm("Delete?")) return;
          await deleteDoc(doc(db, "posts", d.id));
          loadCategoryPosts(category, gridEl);
        });
        card.appendChild(del);
      }

      addCommentSection(card, "posts", d.id);

      gridEl.appendChild(card);
    });

    if (count === 0) gridEl.innerHTML = '<p style="color:var(--text-muted);">Nothing here yet.</p>';
  } catch (e) {
    gridEl.innerHTML = `<p style="color:var(--error);">Error: ${escapeHtml(e.message)}</p>`;
  }
}

function loadFood()   { loadCategoryPosts("food",   foodGrid); }
function loadEvents() { loadCategoryPosts("events", eventsGrid); }

// ===============================================
// 14. FREE & HELP
// ===============================================
const HELP_TYPES = {
  stuff: { emoji: "🎁", label: "Stuff" },
  request: { emoji: "📦", label: "Request" },
  ride: { emoji: "🚗", label: "Ride" },
  lend: { emoji: "🔧", label: "Lend" },
  skill: { emoji: "🛠️", label: "Skill" },
  study: { emoji: "📚", label: "Study" },
  general: { emoji: "💬", label: "General" }
};

let selectedHelpType = "stuff";

helpTypePicker?.querySelectorAll(".type-pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    helpTypePicker.querySelectorAll(".type-pill").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedHelpType = btn.dataset.type;

    const placeholders = {
      stuff: "Title (e.g., Free desk, Free books)",
      request: "Title (e.g., Need boxes for moving)",
      ride: "Title (e.g., Ride to SFO Sunday 6am)",
      lend: "Title (e.g., Need a drill for the day)",
      skill: "Title (e.g., Can review your resume)",
      study: "Title (e.g., Study partner for CS 301, How is Prof Smith?)",
      general: "Title (describe your post)"
    };
    if (freeTitle) freeTitle.placeholder = placeholders[selectedHelpType] || "Title";
  });
});

const foodTypePicker = $("food-type-picker");
let selectedFoodType = "dining-out";

foodTypePicker?.querySelectorAll(".type-pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    foodTypePicker.querySelectorAll(".type-pill").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedFoodType = btn.dataset.type;

    const placeholders = {
      "dining-out": "Title (e.g., Dinner at Tartine Friday, want company?)",
      "recommendations": "Title (e.g., Best cheap eats near CSUEB?)",
      "cooking-partner": "Title (e.g., Cooking Thai food Saturday, join me)",
      "recipe-ideas": "Title (e.g., What can I make with rice, eggs, spinach?)",
      "cooking-help": "Title (e.g., First time cooking — need guidance)"
    };
    const titleInput = document.getElementById("food-title");
    if (titleInput) titleInput.placeholder = placeholders[selectedFoodType] || "Title";
  });
});

const eventTypePicker = $("event-type-picker");
let selectedEventType = "going-out";

eventTypePicker?.querySelectorAll(".type-pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    eventTypePicker.querySelectorAll(".type-pill").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedEventType = btn.dataset.type;

    const placeholders = {
      "going-out": "Title (e.g., Billie Eilish concert Friday — who's in?)",
      "explore": "Title (e.g., Hiking Mission Peak Saturday morning)",
      "recommendations": "Title (e.g., Best clubs near campus for a fun night?)",
      "activity-partner": "Title (e.g., Looking for a gym buddy at 24 Hour Fitness)",
      "free-event": "Title (e.g., Free concert in Golden Gate Park Sunday)"
    };
    const titleInput = document.getElementById("event-title");
    if (titleInput) titleInput.placeholder = placeholders[selectedEventType] || "Title";

    const datetimeInput = document.getElementById("event-datetime");
    if (datetimeInput) {
      datetimeInput.style.display = ["recommendations", "activity-partner"].includes(selectedEventType)
        ? "none" : "block";
    }
  });
});

postFreeBtn?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const title = freeTitle?.value.trim();
  const location = freeLocation?.value.trim() || "";
  const desc = freeDesc?.value.trim() || "";

  if (!title) return setMsg(freeMsg, "Title is required.");

  postFreeBtn.disabled = true;
  postFreeBtn.textContent = "Posting...";

  try {
    await addDoc(collection(db, "posts"), {
      host_id: user.uid,
      host_name: user.displayName || "user",
      host_email: user.email || "",
      category: "free",
      help_type: selectedHelpType,
      title,
      location,
      description: desc,
      attendees: [],
      createdAt: Date.now(),
      comment_count: 0
    });

    if (freeTitle) freeTitle.value = "";
    if (freeLocation) freeLocation.value = "";
    if (freeDesc) freeDesc.value = "";

    setMsg(freeMsg, "Posted ✅", "success");
    loadFree();
  } catch (e) {
    setMsg(freeMsg, "Error: " + e.message);
  } finally {
    postFreeBtn.disabled = false;
    postFreeBtn.textContent = "Post";
  }
});

async function loadFree() {
  const grid = document.getElementById("free-grid");
  if (!grid) return;

  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    const filterEl = document.querySelector('input[name="free-filter"]:checked');
    const filter = filterEl ? filterEl.value : "all";

    grid.innerHTML = "";
    let count = 0;

    snap.forEach((d) => {
      const p = d.data();
      if (p.category !== "free") return;

      const helpType = p.help_type || "stuff";
      if (filter !== "all" && helpType !== filter) return;
      count++;

      const typeMeta = HELP_TYPES[helpType] || HELP_TYPES.general;
      const attendees = p.attendees || [];
      const alreadyInterested = auth.currentUser && attendees.includes(auth.currentUser.uid);
      const isHost = auth.currentUser && p.host_id === auth.currentUser.uid;
      const locationLine = p.location ? `<div class="item-meta">📍 ${escapeHtml(p.location)}</div>` : "";

      const card = document.createElement("div");
      card.className = "item-card";
      card.innerHTML = `
        <div class="type-badge">${typeMeta.emoji} ${typeMeta.label}</div>
        <strong>${escapeHtml(p.title)}</strong>
        ${locationLine}
        <div class="item-desc">${escapeHtml(p.description || "")}</div>
        <div class="item-meta">👥 ${attendees.length} interested</div>
      `;

      addPosterLine(card, p.host_id, p.host_name);

      if (!isHost) {
        const replyBtn = document.createElement("button");
        replyBtn.textContent = `💬 ${p.comment_count || 0}`;
        replyBtn.className = "btn-small";
        replyBtn.addEventListener("click", () => {
          const form = card.querySelector(".comment-form textarea");
          if (form) {
            form.scrollIntoView({ behavior: "smooth", block: "center" });
            form.focus();
          }
        });
        card.appendChild(replyBtn);

        const interestedBtn = document.createElement("button");
        interestedBtn.textContent = alreadyInterested ? "👍 Interested ✓" : "👍 Interested";
        interestedBtn.disabled = alreadyInterested;
        interestedBtn.className = "btn-small";
        interestedBtn.addEventListener("click", async () => {
          try {
            await updateDoc(doc(db, "posts", d.id), {
              attendees: arrayUnion(auth.currentUser.uid)
            });
            loadFree();
          } catch (e) { alert("Error: " + e.message); }
        });
        card.appendChild(interestedBtn);
      } else {
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.className = "btn-small btn-danger";
        del.addEventListener("click", async () => {
          if (!confirm("Delete this post?")) return;
          await deleteDoc(doc(db, "posts", d.id));
          loadFree();
        });
        card.appendChild(del);
      }

      addCommentSection(card, "posts", d.id);

      grid.appendChild(card);
    });

    if (count === 0) {
      grid.innerHTML = '<p style="color:var(--text-muted);">Nothing here yet. Be the first to post!</p>';
    }
  } catch (e) {
    grid.innerHTML = `<p style="color:var(--error);">Error: ${escapeHtml(e.message)}</p>`;
  }
}
document.querySelectorAll('input[name="free-filter"]').forEach((r) => {
  r.addEventListener("change", loadFree);
});

// ===============================================
// 15. JOBS
// ===============================================
postJobBtn?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const title = jobTitle?.value.trim();
  const company = jobCompany?.value.trim();
  const location = jobLocation?.value.trim();
  const desc = jobDesc?.value.trim();
  const industry = jobIndustry?.value || "other";

  if (!title || !company) return setMsg(jobMsg, "Title and company required.");

  postJobBtn.disabled = true;
  postJobBtn.textContent = "Posting...";

  try {
    await addDoc(collection(db, "jobs"), {
      poster_id: user.uid,
      poster_name: user.displayName || "user",
      poster_email: user.email || "",
      industry, title, company, location, description: desc,
      requesters: [],
      createdAt: Date.now(),
      comment_count: 0,
    });
    if (jobTitle) jobTitle.value = "";
    if (jobCompany) jobCompany.value = "";
    if (jobLocation) jobLocation.value = "";
    if (jobDesc) jobDesc.value = "";
    setMsg(jobMsg, "Referral posted ✅", "success");
    loadJobs();
  } catch (e) {
    setMsg(jobMsg, "Error: " + e.message);
  } finally {
    postJobBtn.disabled = false;
    postJobBtn.textContent = "Post Referral";
  }
});

async function loadJobs() {
  if (!jobsGrid) return;
  try {
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    jobsGrid.innerHTML = "";
    let count = 0;

    snap.forEach((d) => {
      const j = d.data();
      count++;

      const isMine = auth.currentUser && j.poster_id === auth.currentUser.uid;
      const requesters = j.requesters || [];
      const alreadyInterested = auth.currentUser && requesters.includes(auth.currentUser.uid);

      const industryLabel = {
        "food-service": "🍔 Food Service", "cafe": "☕ Café",
        "hospitality": "🏨 Hospitality", "retail": "🛍️ Retail",
        "tech": "💻 Tech", "healthcare": "🏥 Healthcare",
        "trades": "🏗️ Trades", "education": "📚 Education", "other": "📦 Other"
      }[j.industry] || "";

      const card = document.createElement("div");
      card.className = "item-card";
      card.innerHTML = `
        ${industryLabel ? `<div class="type-badge">${industryLabel}</div>` : ""}
        <strong>${escapeHtml(j.title)} @ ${escapeHtml(j.company)}</strong>
        <div class="item-meta">${escapeHtml(j.location || "")}</div>
        <div class="item-desc">${escapeHtml(j.description || "")}</div>
        <div class="item-meta">👥 ${requesters.length} interested</div>
      `;

      addPosterLine(card, j.poster_id, j.poster_name);

      if (!isMine) {
        const replyBtn = document.createElement("button");
        replyBtn.textContent = `💬 ${j.comment_count || 0}`;
        replyBtn.className = "btn-small";
        replyBtn.addEventListener("click", () => {
          const form = card.querySelector(".comment-form textarea");
          if (form) {
            form.scrollIntoView({ behavior: "smooth", block: "center" });
            form.focus();
          }
        });
        card.appendChild(replyBtn);

        const interestedBtn = document.createElement("button");
        interestedBtn.textContent = alreadyInterested ? "👍 Interested ✓" : "👍 Interested";
        interestedBtn.disabled = alreadyInterested;
        interestedBtn.className = "btn-small";
        interestedBtn.addEventListener("click", async () => {
          try {
            await updateDoc(doc(db, "jobs", d.id), {
              requesters: arrayUnion(auth.currentUser.uid)
            });
            loadJobs();
          } catch (e) { alert("Error: " + e.message); }
        });
        card.appendChild(interestedBtn);
      } else {
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.className = "btn-small btn-danger";
        del.addEventListener("click", async () => {
          if (!confirm("Delete?")) return;
          await deleteDoc(doc(db, "jobs", d.id));
          loadJobs();
        });
        card.appendChild(del);
      }

      addCommentSection(card, "jobs", d.id);

      jobsGrid.appendChild(card);
    });

    if (count === 0) {
      jobsGrid.innerHTML = '<p style="color:var(--text-muted);">No referrals yet.</p>';
    }
  } catch (e) {
    jobsGrid.innerHTML = `<p style="color:var(--error);">Error: ${escapeHtml(e.message)}</p>`;
  }
}

// ===============================================
// 16. HEAR ME OUT
// ===============================================
const REACTIONS = [
  { emoji: "🤗", label: "I hear you" },
  { emoji: "💪", label: "You've got this" },
  { emoji: "💙", label: "You're not alone" },
  { emoji: "🙏", label: "Thanks for sharing" }
];

hearPostBtn?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;
  const text = hearDesc?.value.trim();
  if (!text) return setMsg(hearMsg, "Write something first.");
  if (text.length > 1000) return setMsg(hearMsg, "Keep it under 1000 characters.");

  const anon = anonymousCheckbox?.checked;

  hearPostBtn.disabled = true;
  hearPostBtn.textContent = "Sharing...";
  try {
    await addDoc(collection(db, "hear_me_out"), {
      author_id: user.uid,
      author_name: anon ? "Anonymous" : (user.displayName || "user"),
      is_anonymous: anon,
      text,
      reactions: {},
      createdAt: Date.now(),
      comment_count: 0,
    });
    if (hearDesc) hearDesc.value = "";
    if (anonymousCheckbox) anonymousCheckbox.checked = false;
    setMsg(hearMsg, "Thanks for sharing. You're not alone. 💙", "success");
    loadHear();
  } catch (e) {
    setMsg(hearMsg, "Error: " + e.message);
  } finally {
    hearPostBtn.disabled = false;
    hearPostBtn.textContent = "Share";
  }
});

async function loadHear() {
  if (!hearPostsGrid) return;
  try {
    const q = query(collection(db, "hear_me_out"), orderBy("createdAt", "desc"), limit(30));
    const snap = await getDocs(q);
    hearPostsGrid.innerHTML = "";
    let count = 0;

    snap.forEach((d) => {
      const h = d.data();
      count++;
      const likes = h.likes || [];
      const isMine = auth.currentUser && h.author_id === auth.currentUser.uid;
      const alreadyLiked = auth.currentUser && likes.includes(auth.currentUser.uid);

      const card = document.createElement("div");
      card.className = "item-card";
      card.innerHTML = `
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:6px;"><strong>${escapeHtml(h.author_name || "Anonymous")}</strong></div>
        <div class="item-desc" style="white-space:pre-wrap;">${escapeHtml(h.text)}</div>
        <div class="item-meta" style="margin-top:8px;">❤️ ${likes.length}</div>
      `;

      if (!isMine) {
        const replyBtn = document.createElement("button");
        replyBtn.textContent = `💬 ${h.comment_count || 0}`;
        replyBtn.className = "btn-small";
        replyBtn.addEventListener("click", () => {
          const form = card.querySelector(".comment-form textarea");
          if (form) {
            form.scrollIntoView({ behavior: "smooth", block: "center" });
            form.focus();
          }
        });
        card.appendChild(replyBtn);

        const likeBtn = document.createElement("button");
        likeBtn.textContent = alreadyLiked ? "❤️ Liked ✓" : "❤️ Like";
        likeBtn.disabled = alreadyLiked;
        likeBtn.className = "btn-small";
        likeBtn.addEventListener("click", async () => {
          try {
            await updateDoc(doc(db, "hear_me_out", d.id), {
              likes: arrayUnion(auth.currentUser.uid)
            });
            loadHear();
          } catch (e) { alert("Error: " + e.message); }
        });
        card.appendChild(likeBtn);
      } else {
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.className = "btn-small btn-danger";
        del.addEventListener("click", async () => {
          if (!confirm("Delete?")) return;
          await deleteDoc(doc(db, "hear_me_out", d.id));
          loadHear();
        });
        card.appendChild(del);
      }

      addCommentSection(card, "hear_me_out", d.id);

      hearPostsGrid.appendChild(card);
    });

    if (count === 0) {
      hearPostsGrid.innerHTML = '<p style="color:var(--text-muted);">No posts yet.</p>';
    }
  } catch (e) {
    hearPostsGrid.innerHTML = `<p style="color:var(--error);">Error: ${escapeHtml(e.message)}</p>`;
  }
}

// ===============================================
// 17. CRIME ALERTS
// ===============================================
postAlertBtn?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const location = alertLocation?.value.trim();
  const desc = alertDesc?.value.trim();
  const type = alertType?.value || "crime";
  const severity = alertSeverity?.value || "medium";
  const anon = alertAnonymous?.checked;

  if (!location || !desc) return setMsg(alertMsg, "Location and description required.");

  postAlertBtn.disabled = true;
  postAlertBtn.textContent = "Posting...";

  try {
    await addDoc(collection(db, "crime_alerts"), {
      reporter_id: user.uid,
      reporter_name: anon ? "Anonymous" : (user.displayName || "user"),
      is_anonymous: anon,
      alert_type: type,
      severity,
      location,
      description: desc,
      likes: [],
      aware: [],
      createdAt: Date.now(),
      comment_count: 0
    });
    if (alertLocation) alertLocation.value = "";
    if (alertDesc) alertDesc.value = "";
    if (alertAnonymous) alertAnonymous.checked = false;
    setMsg(alertMsg, "Alert posted. Stay safe.", "success");
    loadAlerts();
  } catch (e) {
    setMsg(alertMsg, "Error: " + e.message);
  } finally {
    postAlertBtn.disabled = false;
    postAlertBtn.textContent = "Post Alert";
  }
});

async function loadAlerts() {
  if (!alertsGrid) return;
  try {
    const q = query(collection(db, "crime_alerts"), orderBy("createdAt", "desc"), limit(30));
    const snap = await getDocs(q);
    alertsGrid.innerHTML = "";
    let count = 0;

    snap.forEach((d) => {
      const a = d.data();
      count++;

      const likes = a.likes || [];
      const aware = a.aware || [];
      const isMine = auth.currentUser && a.reporter_id === auth.currentUser.uid;
      const alreadyLiked = auth.currentUser && likes.includes(auth.currentUser.uid);
      const alreadyAware = auth.currentUser && aware.includes(auth.currentUser.uid);

      const typeEmoji = {
        crime: "🚨", suspicious: "👤", "unsafe-area": "⚠️", encounter: "😰"
      }[a.alert_type] || "🚨";

      const sevLabel = {
        low: "Low", medium: "Medium", high: "High"
      }[a.severity] || "Medium";

      const sevColor = {
        low: "var(--success)", medium: "var(--warning)", high: "var(--error)"
      }[a.severity] || "var(--warning)";

      const card = document.createElement("div");
      card.className = "item-card";
      card.innerHTML = `
        <div class="type-badge" style="background:${sevColor}22;color:${sevColor};">
          ${typeEmoji} ${escapeHtml(a.alert_type)} · ${sevLabel}
        </div>
        <strong>${escapeHtml(a.location)}</strong>
        <div class="item-desc">${escapeHtml(a.description)}</div>
        <div class="item-meta">Reported by ${escapeHtml(a.reporter_name)} · ${new Date(a.createdAt).toLocaleString()}</div>
        <div class="item-meta">❤️ ${likes.length} · 👍 ${aware.length} aware</div>
      `;

      if (!isMine) {
        const replyBtn = document.createElement("button");
        replyBtn.textContent = `💬 ${a.comment_count || 0}`;
        replyBtn.className = "btn-small";
        replyBtn.addEventListener("click", () => {
          const form = card.querySelector(".comment-form textarea");
          if (form) {
            form.scrollIntoView({ behavior: "smooth", block: "center" });
            form.focus();
          }
        });
        card.appendChild(replyBtn);

        const likeBtn = document.createElement("button");
        likeBtn.textContent = alreadyLiked ? "❤️ Liked ✓" : "❤️ Like";
        likeBtn.disabled = alreadyLiked;
        likeBtn.className = "btn-small";
        likeBtn.addEventListener("click", async () => {
          try {
            await updateDoc(doc(db, "crime_alerts", d.id), {
              likes: arrayUnion(auth.currentUser.uid)
            });
            loadAlerts();
          } catch (e) { alert("Error: " + e.message); }
        });
        card.appendChild(likeBtn);

        const awareBtn = document.createElement("button");
        awareBtn.textContent = alreadyAware ? "👍 Aware ✓" : "👍 Aware";
        awareBtn.disabled = alreadyAware;
        awareBtn.className = "btn-small";
        awareBtn.addEventListener("click", async () => {
          try {
            await updateDoc(doc(db, "crime_alerts", d.id), {
              aware: arrayUnion(auth.currentUser.uid)
            });
            loadAlerts();
          } catch (e) { alert("Error: " + e.message); }
        });
        card.appendChild(awareBtn);
      } else {
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.className = "btn-small btn-danger";
        del.addEventListener("click", async () => {
          if (!confirm("Delete?")) return;
          await deleteDoc(doc(db, "crime_alerts", d.id));
          loadAlerts();
        });
        card.appendChild(del);
      }

      addCommentSection(card, "crime_alerts", d.id);

      alertsGrid.appendChild(card);
    });

    if (count === 0) {
      alertsGrid.innerHTML = '<p style="color:var(--text-muted);">No alerts yet.</p>';
    }
  } catch (e) {
    alertsGrid.innerHTML = `<p style="color:var(--error);">Error: ${escapeHtml(e.message)}</p>`;
  }
}

// ===============================================
// 18. MODERATION
// ===============================================
async function loadReports() {
  if (!reportsList) return;
  if (!auth.currentUser || auth.currentUser.uid !== MOD_UID) return;

  modNavLink?.classList.remove("hidden");
  reportsList.innerHTML = "Loading...";

  try {
    const q = query(collection(db, "reports"), where("status", "==", "open"), limit(50));
    const snap = await getDocs(q);

    reportsList.innerHTML = "";
    if (snap.empty) {
      reportsList.innerHTML = '<p style="color:var(--text-muted);">No open reports. 🎉</p>';
      return;
    }

    const reports = [];
    snap.forEach((d) => reports.push({ id: d.id, ...d.data() }));
    reports.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    reports.forEach((r) => {
      const row = document.createElement("div");
      row.className = "item-card";

      row.innerHTML = `
        <strong>🚩 ${escapeHtml(r.reason)}</strong>
        <div class="item-meta">Type: ${escapeHtml(r.post_type || "unknown")}</div>
        <div class="item-meta">Post: ${escapeHtml(r.post_title || r.listing_id || "")}</div>
        <div class="item-meta">Reporter: ${escapeHtml(r.reporter_email || r.reporter_id || "")}</div>
      `;

      const resolveBtn = document.createElement("button");
      resolveBtn.textContent = "Resolve";
      resolveBtn.className = "btn-small btn-success";
      resolveBtn.addEventListener("click", async () => {
        await setDoc(doc(db, "reports", r.id), { status: "resolved" }, { merge: true });
        loadReports();
      });

      row.appendChild(resolveBtn);
      reportsList.appendChild(row);
    });
  } catch (e) {
    reportsList.innerHTML = `<p style="color:var(--error);">Error: ${escapeHtml(e.message)}</p>`;
  }
}

// ===============================================
// 19. HUB COUNTS
// ===============================================
async function updateHubCounts() {
  try {
    const listingsSnap = await getDocs(collection(db, "listings"));
    const postsSnap = await getDocs(collection(db, "posts"));
    const jobsSnap = await getDocs(collection(db, "jobs"));
    const hearSnap = await getDocs(collection(db, "hear_me_out"));
    const alertsSnap = await getDocs(collection(db, "crime_alerts"));

    let foodCount = 0, eventCount = 0, freeCount = 0;
    postsSnap.forEach((d) => {
      const p = d.data();
      if (p.category === "food") foodCount++;
      if (p.category === "events") eventCount++;
      if (p.category === "free") freeCount++;
    });

    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    set("hub-count-housing", listingsSnap.size);
    set("hub-count-food", foodCount);
    set("hub-count-events", eventCount);
    set("hub-count-free", freeCount);
    set("hub-count-jobs", jobsSnap.size);
    set("hub-count-hear", hearSnap.size);
    set("hub-count-alerts", alertsSnap.size);
  } catch (e) {
    console.warn("Hub counts error:", e.message);
  }
}

// ===============================================
// COMMENTS — with nested replies
// ===============================================
function addCommentSection(card, collectionName, postId) {
  const user = auth.currentUser;
  if (!user) return;

  const section = document.createElement("div");
  section.className = "comment-section";
  section.innerHTML = `
    <div class="comment-list"></div>
    <div class="comment-form">
      <textarea placeholder="Write a comment..." rows="2"></textarea>
      <button class="btn-small">Reply</button>
    </div>
  `;
  card.appendChild(section);

  loadComments(section, collectionName, postId);

  const sendBtn = section.querySelector(".comment-form button");
  const textarea = section.querySelector(".comment-form textarea");

  sendBtn.addEventListener("click", async () => {
    const text = textarea.value.trim();
    if (!text) return;

    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";

    try {
      await addDoc(collection(db, collectionName, postId, "comments"), {
        author_id: user.uid,
        author_name: user.displayName || "user",
        text,
        parent_id: null,
        createdAt: Date.now()
      });

      try {
        await updateDoc(doc(db, collectionName, postId), {
          comment_count: increment(1)
        });
      } catch (e) { console.warn(e.message); }

      textarea.value = "";
      loadComments(section, collectionName, postId);
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = "Reply";
    }
  });
}

async function loadComments(container, collectionName, postId) {
  const list = container.querySelector(".comment-list");
  if (!list) return;

  try {
    const q = query(
      collection(db, collectionName, postId, "comments"),
      orderBy("createdAt", "asc"),
      limit(50)
    );
    const snap = await getDocs(q);

    list.innerHTML = "";
    if (snap.empty) {
      list.innerHTML = '<p class="comment-empty">No comments yet — be the first!</p>';
      return;
    }

    const allComments = [];
    snap.forEach((d) => allComments.push({ id: d.id, ...d.data() }));

    const topLevel = allComments.filter((c) => !c.parent_id);
    const replies = allComments.filter((c) => c.parent_id);

    topLevel.forEach((c) => {
      const item = renderCommentItem(c, replies, collectionName, postId, container);
      list.appendChild(item);
    });
  } catch (e) {
    list.innerHTML = `<p class="comment-error">Error: ${escapeHtml(e.message)}</p>`;
  }
}

function renderCommentItem(comment, allReplies, collectionName, postId, container) {
  const row = document.createElement("div");
  row.className = "comment-item";

  const timeAgo = formatTimeAgo(comment.createdAt);
  row.innerHTML = `
    <div class="comment-author">
      <strong>${escapeHtml(comment.author_name || "user")}</strong>
      <span class="comment-time">${timeAgo}</span>
    </div>
    <div class="comment-text">${escapeHtml(comment.text)}</div>
    <button class="comment-reply-btn">Reply</button>
  `;

  const replyBtn = row.querySelector(".comment-reply-btn");
  replyBtn.addEventListener("click", () => {
    let form = row.querySelector(".reply-form");
    if (form) {
      form.remove();
      return;
    }

    form = document.createElement("div");
    form.className = "reply-form";
    form.innerHTML = `
      <textarea placeholder="Write a reply..." rows="2"></textarea>
      <button class="btn-small">Reply</button>
    `;
    row.appendChild(form);

    const sendBtn = form.querySelector("button");
    const textarea = form.querySelector("textarea");
    textarea.focus();

    sendBtn.addEventListener("click", async () => {
      const text = textarea.value.trim();
      if (!text) return;

      sendBtn.disabled = true;
      sendBtn.textContent = "Replying...";

      try {
        await addDoc(collection(db, collectionName, postId, "comments"), {
          author_id: auth.currentUser.uid,
          author_name: auth.currentUser.displayName || "user",
          text,
          parent_id: comment.id,
          createdAt: Date.now()
        });

        try {
          await updateDoc(doc(db, collectionName, postId), {
            comment_count: increment(1)
          });
        } catch (e) { console.warn(e.message); }

        form.remove();
        loadComments(container, collectionName, postId);
      } catch (e) {
        alert("Error: " + e.message);
        sendBtn.disabled = false;
        sendBtn.textContent = "Reply";
      }
    });
  });

  const commentReplies = allReplies.filter((r) => r.parent_id === comment.id);
  if (commentReplies.length > 0) {
    const repliesWrapper = document.createElement("div");
    repliesWrapper.className = "comment-replies";

    commentReplies.forEach((r) => {
      const replyItem = document.createElement("div");
      replyItem.className = "comment-item comment-reply";
      const timeAgo = formatTimeAgo(r.createdAt);
      replyItem.innerHTML = `
        <div class="comment-author">
          <strong>${escapeHtml(r.author_name || "user")}</strong>
          <span class="comment-time">${timeAgo}</span>
        </div>
        <div class="comment-text">${escapeHtml(r.text)}</div>
      `;
      repliesWrapper.appendChild(replyItem);
    });

    row.appendChild(repliesWrapper);
  }

  return row;
}

// ===============================================
// 20. AUTH STATE WATCHER
// ===============================================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    showDashboard();

    if (userName) userName.textContent = user.displayName || "Welcome";
    document.getElementById("verified-badge")?.classList.add("hidden");
    document.getElementById("unverified-badge")?.classList.add("hidden");
    if (userEmail) userEmail.textContent = user.email;
    if (headerUserName) headerUserName.textContent = (user.displayName || "User").split(" ")[0];
    if (dropdownName) dropdownName.textContent = user.displayName || "User";
    if (dropdownEmail) dropdownEmail.textContent = user.email;

    headerNavOut?.classList.add("hidden");
    headerNavIn?.classList.remove("hidden");
    searchToggleBtn?.classList.remove("hidden");

    updateVerificationUI(user);

    if (user.uid === MOD_UID) {
      modNavLink?.classList.remove("hidden");
    } else {
      modNavLink?.classList.add("hidden");
    }

    await loadProfile(user);

    try {
      const [listings, posts, jobs] = await Promise.all([
        getDocs(query(collection(db, "listings"), where("user_id", "==", user.uid))),
        getDocs(query(collection(db, "posts"), where("host_id", "==", user.uid))),
        getDocs(query(collection(db, "jobs"), where("poster_id", "==", user.uid)))
      ]);
      const elL = document.getElementById("count-listings");
      const elP = document.getElementById("count-posts");
      const elJ = document.getElementById("count-jobs");
      if (elL) elL.textContent = listings.size;
      if (elP) elP.textContent = posts.size;
      if (elJ) elJ.textContent = jobs.size;
    } catch (e) {
      console.warn("Activity counts error:", e.message);
    }

    updateOwnVouches(user.uid);
    showPage("home");
    updateHubCounts();
  } else {
    showLanding();

    headerNavOut?.classList.remove("hidden");
    headerNavIn?.classList.add("hidden");
    searchToggleBtn?.classList.add("hidden");
    searchWrap?.classList.add("hidden");

    if (registerName) registerName.value = "";
    if (registerEmail) registerEmail.value = "";
    if (registerPass) registerPass.value = "";
    if (loginEmail) loginEmail.value = "";
    if (loginPass) loginPass.value = "";
    if (registerMsg) registerMsg.textContent = "";
    if (loginMsg) loginMsg.textContent = "";
    if (profileMsg) profileMsg.textContent = "";
  }
});