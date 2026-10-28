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
  updateProfile,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  initializeFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  orderBy,
  deleteDoc,
  where,
  limit, 
  addDoc,
  arrayUnion,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===============================================
// 2. FIREBASE CONFIG (your real values here)
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

// ===============================================
// 3. INIT
// ===============================================
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = initializeFirestore(app, {experimentalForceLongPolling:true});

// ===============================================
// 4. GRAB ELEMENTS
// ===============================================

const loginView        = document.getElementById("login-view");
const registerView     = document.getElementById("register-view");
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

const userName  = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");

const profileSchool  = document.getElementById("profile-school");
const profileCity    = document.getElementById("profile-city");
const profileBio     = document.getElementById("profile-bio");
const saveProfileBtn = document.getElementById("save-profile-btn");
const profileMsg     = document.getElementById("profile-msg");

const profileViewMode  = document.getElementById("profile-view-mode");
const profileEditMode  = document.getElementById("profile-edit-mode");
const editProfileBtn   = document.getElementById("edit-profile-btn");
const cancelProfileBtn = document.getElementById("cancel-profile-btn");

const viewSchool    = document.getElementById("view-school");
const viewCity      = document.getElementById("view-city");
const viewBio       = document.getElementById("view-bio");
const viewInterests = document.getElementById("view-interests");

const listingTitle    = document.getElementById("listing-title");
const listingRent     = document.getElementById("listing-rent");
const listingLocation = document.getElementById("listing-location");
const listingDesc     = document.getElementById("listing-desc");
const postListingBtn  = document.getElementById("post-listing-btn");
const listingMsg      = document.getElementById("listing-msg");
const listingsGrid    = document.getElementById("listings-grid");

const modPanel = document.getElementById("mod-panel");
const reportsList = document.getElementById("reports-list");
const modMsg = document.getElementById("mod-msg");

const postCategory = document.getElementById("post-category");
const postTitle    = document.getElementById("post-title");
const postLocation = document.getElementById("post-location");
const postDatetime = document.getElementById("post-datetime");
const postDesc     = document.getElementById("post-desc");
const postSubmitBtn = document.getElementById("post-submit-btn");
const postMsg      = document.getElementById("post-msg");
const postsGrid    = document.getElementById("posts-grid");

// Job referral elements
const jobTitle    = document.getElementById("job-title");
const jobCompany  = document.getElementById("job-company");
const jobLocation = document.getElementById("job-location");
const jobDesc     = document.getElementById("job-desc");
const postJobBtn  = document.getElementById("post-job-btn");
const jobMsg      = document.getElementById("job-msg");
const jobsGrid    = document.getElementById("jobs-grid");

const searchInput = document.getElementById("search-input");

const verifiedBadge   = document.getElementById("verified-badge");
const verifyBanner    = document.getElementById("verify-banner");
const resendVerifyBtn = document.getElementById("resend-verify-btn");
const verifyMsg       = document.getElementById("verify-msg");

const anonymousCheckbox = document.getElementById("anonymous-checkbox");
const hearDesc          = document.getElementById("hear-desc");
const hearPostBtn       = document.getElementById("hear-post-btn");
const hearMsg           = document.getElementById("hear-msg");
const hearPostsGrid     = document.getElementById("hear-posts-grid");
// ===============================================
// 4b. TOGGLE LOGIN / REGISTER
// ===============================================
showRegisterLink.addEventListener("click", (e) => {
  e.preventDefault();
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
// 4c. POST CATEGORY: SHOW/HIDE DATETIME
// ===============================================
postCategory.addEventListener("change", () => {
  postDatetime.classList.toggle("hidden", postCategory.value !== "events");
});

// ===============================================
// 5a. REGISTER
// ===============================================
registerBtn.addEventListener("click", async () => {
  const name  = registerName.value.trim();
  const email = registerEmail.value.trim();
  const pass  = registerPass.value;

  registerMsg.textContent = "";

  if (!name || !email || !pass) {
    registerMsg.textContent = "Please fill in all fields.";
    return;
  }
  if (pass.length < 6) {
    registerMsg.textContent = "Password must be at least 6 characters.";
    return;
  }

  registerBtn.disabled = true;
  registerBtn.textContent = "Creating...";

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const user = cred.user;

    await updateProfile(user, { displayName: name });

    // Send verification email (non-blocking — don't fail registration if this fails)
    try {
      await sendEmailVerification(user);
    } catch (e) {
      console.warn("Verification email not sent:", e.message);
    }

    await setDoc(
      doc(db, "users", user.uid),
      { name, email, createdAt: new Date().toISOString() },
      { merge: true }
    );

    registerMsg.textContent = "Account created! You are now logged in.";
  } catch (error) {
    registerMsg.textContent = "Error: " + error.message;
  } finally {
    registerBtn.disabled = false;
    registerBtn.textContent = "Create Account";
  }
});

// ===============================================
// 5b. SAVE PROFILE
// ===============================================
saveProfileBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const interests = [];
  document.querySelectorAll(".interests-grid input:checked").forEach((cb) => {
    interests.push(cb.value);
  });

  saveProfileBtn.disabled = true;
  saveProfileBtn.textContent = "Saving...";
  profileMsg.textContent = "";

  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        school: profileSchool.value.trim(),
        city: profileCity.value.trim(),
        bio: profileBio.value.trim(),
        interests
      },
      { merge: true }
    );

    profileMsg.textContent = "Profile saved successfully! ✅";
    profileMsg.style.color = "#27ae60";

        renderProfileView();
    profileViewMode.classList.remove("hidden");
    profileEditMode.classList.add("hidden");

  } catch (error) {
    profileMsg.textContent = "Error: " + error.message;
    profileMsg.style.color = "#e74c3c";
  } finally {
    saveProfileBtn.disabled = false;
    saveProfileBtn.textContent = "Save Profile";
  }
});

// ===============================================
// 5c. LOAD PROFILE ON LOGIN
// ===============================================
async function loadProfile(user) {
  try {
    const profileRef  = doc(db, "users", user.uid);
    const profileSnap = await getDoc(profileRef, { source: "server" });

    if (profileSnap.exists()) {
      const data = profileSnap.data();

      profileSchool.value = data.school || "";
      profileCity.value   = data.city   || "";
      profileBio.value    = data.bio    || "";

      const interests = data.interests || [];
      document.querySelectorAll(".interests-grid input").forEach((cb) => {
        cb.checked = interests.includes(cb.value);
        renderProfileView();
      });
    } else {
    // No profile yet — switch to edit mode so user can fill it in
    renderProfileView();
    profileViewMode.classList.add("hidden");
    profileEditMode.classList.remove("hidden");
    profileMsg.textContent = "Welcome! Complete your profile to build trust.";
    profileMsg.style.color = "#888";
  }
  } catch (error) {
    console.error("Could not load profile:", error);
    profileMsg.textContent = "Could not load profile: " + error.message;
    profileMsg.style.color = "#e74c3c";
  }
}
// ===============================================
// 5d. POST LISTING
// ===============================================
postListingBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const title    = listingTitle.value.trim();
  const rent     = Number(listingRent.value);
  const location = listingLocation.value.trim();
  const desc     = listingDesc.value.trim();

  listingMsg.textContent = "";

  if (!title || !rent || !location) {
    listingMsg.textContent = "Title, rent, and location required.";
    listingMsg.style.color = "#e74c3c";
    return;
  }

  postListingBtn.disabled = true;
  postListingBtn.textContent = "Posting...";

  try {
    await setDoc(doc(collection(db, "listings")), {
      user_id: user.uid,
      title, rent, location,
      description: desc,
      createdAt: Date.now()
    });

    listingTitle.value = "";
    listingRent.value = "";
    listingLocation.value = "";
    listingDesc.value = "";

    listingMsg.textContent = "Listing posted! ✅";
    listingMsg.style.color = "#27ae60";
  } catch (error) {
    listingMsg.textContent = "Error: " + error.message;
    listingMsg.style.color = "#e74c3c";
  } finally {
    postListingBtn.disabled = false;
    postListingBtn.textContent = "Post Listing";
  }
});

// ===============================================
// 5e. LIVE LISTINGS LISTENER
// ===============================================
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

let unsubscribeListings = null;

function startListingsListener() {
  loadListingsOnce();
}

async function loadListingsOnce() {
  try {
    const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    listingsGrid.innerHTML = "";
    if (snap.empty) {
      listingsGrid.textContent = "No listings yet.";
      return;
    }

    snap.forEach((d) => {
      const l = d.data();
      const q = (searchInput.value || "").toLowerCase().trim();
      const isMine = auth.currentUser && l.user_id === auth.currentUser.uid;
      const card = document.createElement("div");
      card.style.cssText = "border:1px solid #ddd;border-radius:8px;padding:12px;margin-bottom:10px;";
      card.innerHTML = `
        <strong>${escapeHtml(l.title)}</strong><br>
        $${escapeHtml(l.rent)}/mo — ${escapeHtml(l.location)}<br>
        <small>${escapeHtml(l.description || "")}</small>
      `;

      if (isMine) {
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.style.cssText = "margin-top:8px;background:#e74c3c;width:auto;padding:6px 12px;";
        del.addEventListener("click", async () => {
          await deleteDoc(doc(db, "listings", d.id));
          loadListingsOnce();
        });
        card.appendChild(del);
      } else {
        const reportBtn = document.createElement("button");
        reportBtn.textContent = "Report";
        reportBtn.style.cssText = "margin-top:8px;margin-left:6px;background:#f39c12;width:auto;padding:6px 12px;";
        reportBtn.addEventListener("click", () => openReportDialog(d.id));
        card.appendChild(reportBtn);
      }

      listingsGrid.appendChild(card);
    });
  } catch (error) {
    listingsGrid.textContent = "Could not load listings: " + error.message;
  }
}
// ===============================================
// 5h. POSTS (Food / Events / Free)
// ===============================================
postSubmitBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const category = postCategory.value;
  const title    = postTitle.value.trim();
  const location = postLocation.value.trim();
  const desc     = postDesc.value.trim();
  const dt       = category === "events" ? postDatetime.value : "";

  postMsg.textContent = "";

  if (!title || !location) {
    postMsg.textContent = "Title and location required.";
    postMsg.style.color = "#e74c3c";
    return;
  }
  if (category === "events" && !dt) {
    postMsg.textContent = "Date/time required for events.";
    postMsg.style.color = "#e74c3c";
    return;
  }

  postSubmitBtn.disabled = true;
  postSubmitBtn.textContent = "Posting...";

  try {
    await addDoc(collection(db, "posts"), {
      host_id: user.uid,
      host_name: user.displayName || "user",
      host_email: user.email || "",
      category,
      title,
      location,
      description: desc,
      datetime: dt,
      attendees: [],
      createdAt: Date.now()
    });

    postTitle.value = "";
    postLocation.value = "";
    postDesc.value = "";
    postDatetime.value = "";

    postMsg.textContent = "Posted! ✅";
    postMsg.style.color = "#27ae60";
    loadPostsOnce();
    
  } catch (e) {
    postMsg.textContent = "Error: " + e.message;
    postMsg.style.color = "#e74c3c";
  } finally {
    postSubmitBtn.disabled = false;
    postSubmitBtn.textContent = "Post";
  }
});

async function loadPostsOnce() {
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    const filter = document.querySelector('input[name="post-filter"]:checked').value;

    postsGrid.innerHTML = "";
    if (snap.empty) {
      postsGrid.textContent = "No posts yet.";
      return;
    }

    snap.forEach((d) => {
      const p = d.data();
      if (filter !== "all" && p.category !== filter) return;

      const q = (searchInput.value || "").toLowerCase().trim();
    if (q) {
      const hay = (p.title + " " + (p.description || "") + " " + p.location).toLowerCase();
      if (!hay.includes(q)) return;
    }

      const isHost = auth.currentUser && p.host_id === auth.currentUser.uid;
      const attendees = p.attendees || [];
      const joined = auth.currentUser && attendees.includes(auth.currentUser.uid);

      const card = document.createElement("div");
      card.style.cssText = "border:1px solid #ddd;border-radius:8px;padding:12px;margin-bottom:10px;";

      const dateLine = p.datetime ? `<br><small>${escapeHtml(p.datetime)}</small>` : "";
      const joinLabel = p.category === "food" ? "I'm in" : p.category === "events" ? "Going" : "Claim";

            card.innerHTML = `
        <small style="color:#888;">${escapeHtml(p.category)}</small><br>
        <strong>${escapeHtml(p.title)}</strong><br>
        ${escapeHtml(p.location)}${dateLine}<br>
        <small>${escapeHtml(p.description || "")}</small><br>
        <small>Contact: ${escapeHtml(p.host_email || p.host_name || "—")}</small><br>
        <small>${
          p.category === "food" ? "Interested"
          : p.category === "events" ? "Going"
          : "Claimed"
        }: ${attendees.length}</small>
      `;

      if (!isHost) {
        const joinBtn = document.createElement("button");
        joinBtn.textContent = joined ? "Joined ✓" : joinLabel;
        joinBtn.disabled = joined;
        joinBtn.style.cssText = "margin-top:8px;background:#3498db;width:auto;padding:6px 12px;";
        joinBtn.addEventListener("click", async () => {
          try {
            await updateDoc(doc(db, "posts", d.id), {
              attendees: arrayUnion(auth.currentUser.uid)
            });
            loadPostsOnce();
          } catch (e) {
            alert("Could not join: " + e.message);
          }
        });
        card.appendChild(joinBtn);
      } else {
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.style.cssText = "margin-top:8px;background:#e74c3c;width:auto;padding:6px 12px;";
        del.addEventListener("click", async () => {
          await deleteDoc(doc(db, "posts", d.id));
          loadPostsOnce();
        });
        card.appendChild(del);
      }

      postsGrid.appendChild(card);
    });
  } catch (e) {
    postsGrid.textContent = "Could not load posts: " + e.message;
  }
}

document.querySelectorAll('input[name="post-filter"]').forEach((r) => {
  r.addEventListener("change", loadPostsOnce);
});

// ===============================================
// 5i. SEARCH INPUT LISTENER
// ===============================================
searchInput.addEventListener("input", () => {
  loadListingsOnce();
  loadPostsOnce();
});

// ===============================================
// 5k. PROFILE VIEW / EDIT MODE TOGGLE
// ===============================================
editProfileBtn.addEventListener("click", () => {
  profileViewMode.classList.add("hidden");
  profileEditMode.classList.remove("hidden");
});

cancelProfileBtn.addEventListener("click", () => {
  // Reload saved values from Firestore to discard unsaved changes
  if (auth.currentUser) loadProfile(auth.currentUser);
  profileEditMode.classList.add("hidden");
  profileViewMode.classList.remove("hidden");
});

function renderProfileView() {
  viewSchool.textContent = profileSchool.value.trim() || "—";
  viewCity.textContent   = profileCity.value.trim()   || "—";
  viewBio.textContent    = profileBio.value.trim()    || "—";

  const interests = [];
  document.querySelectorAll(".interests-grid input:checked").forEach((cb) => {
    interests.push(cb.value);
  });
  viewInterests.textContent = interests.length > 0 ? interests.join(", ") : "—";
}

// ===============================================
// 5l. JOB REFERRALS
// ===============================================
postJobBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const title    = jobTitle.value.trim();
  const company  = jobCompany.value.trim();
  const location = jobLocation.value.trim();
  const desc     = jobDesc.value.trim();

  jobMsg.textContent = "";

  if (!title || !company) {
    jobMsg.textContent = "Job title and company are required.";
    jobMsg.style.color = "#e74c3c";
    return;
  }

  postJobBtn.disabled = true;
  postJobBtn.textContent = "Posting...";

  try {
    await addDoc(collection(db, "jobs"), {
      poster_id: user.uid,
      poster_name: user.displayName || "user",
      poster_email: user.email || "",
      title,
      company,
      location,
      description: desc,
      requesters: [],
      createdAt: Date.now()
    });

    jobTitle.value = "";
    jobCompany.value = "";
    jobLocation.value = "";
    jobDesc.value = "";

    jobMsg.textContent = "Referral posted! ✅";
    jobMsg.style.color = "#27ae60";
    loadJobsOnce();
  } catch (e) {
    jobMsg.textContent = "Error: " + e.message;
    jobMsg.style.color = "#e74c3c";
  } finally {
    postJobBtn.disabled = false;
    postJobBtn.textContent = "Post Referral";
  }
});

async function loadJobsOnce() {
  try {
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    jobsGrid.innerHTML = "";
    if (snap.empty) {
      jobsGrid.textContent = "No job referrals yet.";
      return;
    }

    snap.forEach((d) => {
      const j = d.data();
      const isMine = auth.currentUser && j.poster_id === auth.currentUser.uid;
      const requesters = j.requesters || [];
      const alreadyRequested = auth.currentUser && requesters.includes(auth.currentUser.uid);

      const card = document.createElement("div");
      card.style.cssText = "border:1px solid #ddd;border-radius:8px;padding:12px;margin-bottom:10px;";

      card.innerHTML = `
        <strong>${escapeHtml(j.title)}</strong> @ ${escapeHtml(j.company)}<br>
        <small>📍 ${escapeHtml(j.location || "—")}</small><br>
        <small>${escapeHtml(j.description || "")}</small><br>
        <small>Contact: ${escapeHtml(j.poster_email || "—")}</small><br>
        <small>Requesters: ${requesters.length}</small>
      `;

      if (!isMine) {
        const reqBtn = document.createElement("button");
        reqBtn.textContent = alreadyRequested ? "Requested ✓" : "Request Referral";
        reqBtn.disabled = alreadyRequested;
        reqBtn.style.cssText = "margin-top:8px;background:#27ae60;width:auto;padding:6px 12px;";
        reqBtn.addEventListener("click", async () => {
          try {
            await updateDoc(doc(db, "jobs", d.id), {
              requesters: arrayUnion(auth.currentUser.uid)
            });
            loadJobsOnce();
          } catch (e) {
            alert("Could not request: " + e.message);
          }
        });
        card.appendChild(reqBtn);
      } else {
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.style.cssText = "margin-top:8px;background:#e74c3c;width:auto;padding:6px 12px;";
        del.addEventListener("click", async () => {
          await deleteDoc(doc(db, "jobs", d.id));
          loadJobsOnce();
        });
        card.appendChild(del);
      }

      jobsGrid.appendChild(card);
    });
  } catch (e) {
    jobsGrid.textContent = "Could not load jobs: " + e.message;
  }
}

// ===============================================
// 5m. HEAR ME OUT
// ===============================================
const SUPPORT_REACTIONS = [
  { emoji: "🤗", label: "I hear you" },
  { emoji: "💪", label: "You've got this" },
  { emoji: "💙", label: "You're not alone" },
  { emoji: "🙏", label: "Thanks for sharing" }
];

hearPostBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const text = hearDesc.value.trim();
  hearMsg.textContent = "";

  if (!text) {
    hearMsg.textContent = "Please write something before sharing.";
    hearMsg.style.color = "#e74c3c";
    return;
  }
  if (text.length > 1000) {
    hearMsg.textContent = "Please keep it under 1000 characters.";
    hearMsg.style.color = "#e74c3c";
    return;
  }

  const isAnon = anonymousCheckbox.checked;

  hearPostBtn.disabled = true;
  hearPostBtn.textContent = "Sharing...";

  try {
    await addDoc(collection(db, "hear_me_out"), {
      author_id: user.uid,
      author_name: isAnon ? "Anonymous" : (user.displayName || "user"),
      is_anonymous: isAnon,
      text,
      reactions: {},
      createdAt: Date.now()
    });

    hearDesc.value = "";
    anonymousCheckbox.checked = false;
    hearMsg.textContent = "Thanks for sharing. You're not alone. 💙";
    hearMsg.style.color = "#27ae60";
    loadHearPosts();
  } catch (e) {
    hearMsg.textContent = "Error: " + e.message;
    hearMsg.style.color = "#e74c3c";
  } finally {
    hearPostBtn.disabled = false;
    hearPostBtn.textContent = "Share";
  }
});

async function loadHearPosts() {
  try {
    const q = query(
      collection(db, "hear_me_out"),
      orderBy("createdAt", "desc"),
      limit(30)
    );
    const snap = await getDocs(q);

    hearPostsGrid.innerHTML = "";
    if (snap.empty) {
      hearPostsGrid.innerHTML =
        '<p style="color:#888;font-size:14px;">No posts yet. Be the first to share.</p>';
      return;
    }

    snap.forEach((d) => {
      const h = d.data();
      const reactions = h.reactions || {};
      const isMine = auth.currentUser && h.author_id === auth.currentUser.uid;

      const card = document.createElement("div");
      card.style.cssText =
        "border:1px solid #ddd;border-radius:8px;padding:12px;margin-bottom:10px;background:#fafafa;";

      const reactionCounts = SUPPORT_REACTIONS.map((r) => {
        const count = (reactions[r.emoji] || []).length;
        return `${r.emoji} ${count}`;
      }).join(" · ");

      card.innerHTML = `
        <div style="font-size:13px;color:#888;margin-bottom:6px;">
          <strong>${escapeHtml(h.author_name || "Anonymous")}</strong>
        </div>
        <p style="margin-bottom:10px;white-space:pre-wrap;">${escapeHtml(h.text)}</p>
        <small style="color:#666;">${reactionCounts}</small>
      `;

      const reactionRow = document.createElement("div");
      reactionRow.style.cssText = "margin-top:10px;display:flex;flex-wrap:wrap;gap:6px;";

      SUPPORT_REACTIONS.forEach((r) => {
        const list = reactions[r.emoji] || [];
        const alreadyReacted = auth.currentUser && list.includes(auth.currentUser.uid);

        const btn = document.createElement("button");
        btn.textContent = `${r.emoji} ${r.label}`;
        btn.disabled = alreadyReacted;
        btn.style.cssText = `
          background: ${alreadyReacted ? "#d4edda" : "#eef4f9"};
          color: #333;
          width: auto;
          padding: 6px 10px;
          font-size: 13px;
          border: 1px solid ${alreadyReacted ? "#27ae60" : "#c5d8e8"};
        `;
        if (!alreadyReacted) {
          btn.addEventListener("click", async () => {
            try {
              await updateDoc(doc(db, "hear_me_out", d.id), {
                [`reactions.${r.emoji}`]: arrayUnion(auth.currentUser.uid)
              });
              loadHearPosts();
            } catch (e) {
              alert("Could not react: " + e.message);
            }
          });
        }
        reactionRow.appendChild(btn);
      });

      if (!isMine) {
        const reportBtn = document.createElement("button");
        reportBtn.textContent = "🚩 Report";
        reportBtn.style.cssText = "background:#f39c12;width:auto;padding:6px 10px;font-size:13px;";
        reportBtn.addEventListener("click", async () => {
          const reason = prompt(
            "Report this post:\n\n1. Harmful content\n2. Harassment\n3. Spam\n4. Other"
          );
          if (!reason) return;
          const reasons = ["Harmful content", "Harassment", "Spam", "Other"];
          const idx = parseInt(reason.trim(), 10) - 1;
          if (isNaN(idx) || idx < 0 || idx >= reasons.length) return;
          try {
            await addDoc(collection(db, "reports"), {
              reporter_id: auth.currentUser.uid,
              listing_id: d.id,
              post_type: "hear_me_out",
              reason: reasons[idx],
              status: "open",
              createdAt: Date.now()
            });
            alert("Report submitted. Thank you for keeping OneRoof safe.");
          } catch (e) {
            alert("Could not report: " + e.message);
          }
        });
        reactionRow.appendChild(reportBtn);
      } else {
        const del = document.createElement("button");
        del.textContent = "Delete";
        del.style.cssText = "background:#e74c3c;width:auto;padding:6px 10px;font-size:13px;";
        del.addEventListener("click", async () => {
          if (!confirm("Delete this post?")) return;
          await deleteDoc(doc(db, "hear_me_out", d.id));
          loadHearPosts();
        });
        reactionRow.appendChild(del);
      }

      card.appendChild(reactionRow);
      hearPostsGrid.appendChild(card);
    });
  } catch (e) {
    hearPostsGrid.textContent = "Could not load posts: " + e.message;
  }
}

// Resend verification email
resendVerifyBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await sendEmailVerification(user);
    verifyMsg.textContent = "Verification email sent! Check your inbox.";
    verifyMsg.style.color = "#27ae60";
  } catch (e) {
    verifyMsg.textContent = "Error: " + e.message;
    verifyMsg.style.color = "#e74c3c";
  }
});

// Update UI based on verification status
function updateVerificationUI(user) {
  if (user.emailVerified) {
    verifiedBadge.classList.remove("hidden");
    verifyBanner.classList.add("hidden");
  } else {
    verifiedBadge.classList.add("hidden");
    verifyBanner.classList.remove("hidden");
  }
}

// ===============================================
// 6. LOGIN
// ===============================================
loginBtn.addEventListener("click", async () => {
  const email = loginEmail.value.trim();
  const pass  = loginPass.value;

  loginMsg.textContent = "";

  if (!email || !pass) {
    loginMsg.textContent = "Please enter email and password.";
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";

  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (error) {
    loginMsg.textContent = "Error: " + error.message;
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Log In";
  }
});

// ===============================================
// 7. LOGOUT
// ===============================================
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// ===============================================
// 5f. REPORT DIALOG + SUBMIT
// ===============================================
const REPORT_REASONS = ["Spam", "Scam", "Inappropriate", "Other"];

async function openReportDialog(listingId) {
  const reason = prompt(
    "Why report this listing?\n\n" + REPORT_REASONS.map((r, i) => `${i + 1}. ${r}`).join("\n") +
    "\n\nEnter number (1-4):"
  );
  if (!reason) return;

  const idx = parseInt(reason.trim(), 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= REPORT_REASONS.length) {
    alert("Invalid choice.");
    return;
  }

  const user = auth.currentUser;
  if (!user) return;

  try {
    await addDoc(collection(db, "reports"), {
      reporter_id: user.uid,
      listing_id: listingId,
      reason: REPORT_REASONS[idx],
      status: "open",
      createdAt: Date.now()
    });
    alert("Report submitted. Thank you.");
  } catch (e) {
    alert("Could not submit report: " + e.message);
  }
}

// ===============================================
// 5g. MODERATOR: LOAD REPORTS
// ===============================================
const MOD_UID = "K6lW6rwoOOcihtjeaQctY6jp4a62";

async function loadReports() {
  if (!auth.currentUser || auth.currentUser.uid !== MOD_UID) return;

  modPanel.classList.remove("hidden");
  reportsList.innerHTML = "Loading...";

  try {
    const q = query(
      collection(db, "reports"),
      where("status", "==", "open"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const snap = await getDocs(q);

    reportsList.innerHTML = "";
    if (snap.empty) {
      reportsList.textContent = "No open reports.";
      return;
    }

    snap.forEach((d) => {
      const r = d.data();
      const row = document.createElement("div");
      row.style.cssText = "border:1px solid #ddd;border-radius:8px;padding:12px;margin-bottom:10px;";

      const resolveBtn = document.createElement("button");
      resolveBtn.textContent = "Resolve";
      resolveBtn.style.cssText = "margin-top:8px;background:#27ae60;width:auto;padding:6px 12px;";
      resolveBtn.addEventListener("click", async () => {
        try {
          await setDoc(doc(db, "reports", d.id), { status: "resolved" }, { merge: true });
          loadReports();
        } catch (e) {
          modMsg.textContent = "Error: " + e.message;
          modMsg.style.color = "#e74c3c";
        }
      });

      const deleteListingBtn = document.createElement("button");
      deleteListingBtn.textContent = "Delete Listing";
      deleteListingBtn.style.cssText = "margin-top:8px;margin-left:6px;background:#e74c3c;width:auto;padding:6px 12px;";
      deleteListingBtn.addEventListener("click", async () => {
        try {
          await deleteDoc(doc(db, "listings", r.listing_id));
          await setDoc(doc(db, "reports", d.id), { status: "resolved" }, { merge: true });
          loadReports();
          loadListingsOnce();
        } catch (e) {
          modMsg.textContent = "Error: " + e.message;
          modMsg.style.color = "#e74c3c";
        }
      });

      row.innerHTML = `
        <strong>${escapeHtml(r.reason)}</strong><br>
        <small>Listing: ${escapeHtml(r.listing_id)}</small><br>
        <small>Reporter: ${escapeHtml(r.reporter_id)}</small>
      `;
      row.appendChild(resolveBtn);
      row.appendChild(deleteListingBtn);
      reportsList.appendChild(row);
    });
  } catch (e) {
    reportsList.textContent = "Could not load reports: " + e.message;
  }
}
// ===============================================
// 8. AUTH STATE WATCHER
// ===============================================
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginView.classList.add("hidden");
    registerView.classList.add("hidden");
    dashboardSection.classList.remove("hidden");

    userName.textContent  = user.displayName || "friend";
    userEmail.textContent = user.email;
    updateVerificationUI(user); 

    // Clear form before loading (prevents stale data from previous user)
    profileSchool.value = "";
    profileCity.value   = "";
    profileBio.value    = "";
    document.querySelectorAll(".interests-grid input").forEach((cb) => {
      cb.checked = false;
    });
    profileMsg.textContent = "";

    await loadProfile(user);
    startListingsListener();
    loadReports();
    loadPostsOnce();
    loadJobsOnce();
    loadHearPosts();

  } else {
    dashboardSection.classList.add("hidden");
    registerView.classList.add("hidden");
    loginView.classList.add("hidden");     
    document.getElementById("landing-view").classList.remove("hidden");   

    registerName.value = registerEmail.value = registerPass.value = "";
    loginEmail.value   = loginPass.value = "";
    registerMsg.textContent = loginMsg.textContent = profileMsg.textContent = "";

    if (unsubscribeListings) { unsubscribeListings(); unsubscribeListings = null;}
    modPanel.classList.add("hidden");
    reportsList.innerHTML = "";
    postsGrid.innerHTML = "";
    listingsGrid.innerHTML = "";
    jobsGrid.innerHTML = "";    
    hearPostsGrid.innerHTML = "";
  }
});