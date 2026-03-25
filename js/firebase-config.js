// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBeAOzlNA-Hm9omfi7yWp3NjtHVDTOGHog",
  authDomain: "cinenova-01.firebaseapp.com",
  databaseURL: "https://cinenova-01-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cinenova-01",
  storageBucket: "cinenova-01.firebasestorage.app",
  messagingSenderId: "765046178677",
  appId: "1:765046178677:web:58b6dea2b6bf4444f1c93c",
  measurementId: "G-JF1FTQ7NM4"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const IMAGEKIT = {
  urlEndpoint: "https://ik.imagekit.io/destinydriving",
  publicKey: "public_Dm9o2L7td86DzeKvGQMW6hUNQN0=",
  authEndpoint: "/api/imagekit-auth"
};

export function logDownload(movieId) {
  logEvent(analytics, 'movie_download', { movie_id: movieId });
}

export function toast(msg, type = 'info') {
  const container = document.querySelector('.toast-container') || (() => {
    const c = document.createElement('div');
    c.className = 'toast-container';
    document.body.appendChild(c);
    return c;
  })();
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span> ${msg}`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

export function formatDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getYouTubeId(url) {
  const r = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return r ? r[1] : null;
}

export function getYouTubeThumbnail(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
}

export function initNavbar(activePage) {
  const isMobile = () => window.innerWidth <= 768;
  const btn = document.querySelector('.nav-mobile-btn');
  const menu = document.querySelector('.mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => menu.classList.toggle('open'));
  }
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.dataset.page === activePage) a.classList.add('active');
  });
}

export function renderNavbar(activePage) {
  return `
  <nav class="navbar">
    <a href="/index.html" class="nav-logo">CINE<span>NOVA</span></a>
    <ul class="nav-links">
      <li><a href="/index.html" data-page="home">Home</a></li>
      <li><a href="/movies.html" data-page="movies">Movies</a></li>
      <li><a href="/vlogs.html" data-page="vlogs">Vlogs</a></li>
      <li><a href="/advertise.html" data-page="advertise" class="nav-cta">Advertise</a></li>
    </ul>
    <button class="nav-mobile-btn" aria-label="Menu">☰</button>
  </nav>
  <div class="mobile-menu">
    <a href="/index.html" data-page="home">Home</a>
    <a href="/movies.html" data-page="movies">Movies</a>
    <a href="/vlogs.html" data-page="vlogs">Vlogs</a>
    <a href="/advertise.html" data-page="advertise">Advertise</a>
  </div>`;
}

export function renderFooter() {
  return `
  <footer>
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="logo">CINE<span style="color:var(--text)">NOVA</span></div>
        <p>Your ultimate destination for movies, trailers, and entertainment. Stream, discover, and download your favorite films.</p>
      </div>
      <div class="footer-col">
        <h4>Navigation</h4>
        <ul>
          <li><a href="/index.html">Home</a></li>
          <li><a href="/movies.html">Movies</a></li>
          <li><a href="/vlogs.html">Vlogs</a></li>
          <li><a href="/advertise.html">Advertise</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Genres</h4>
        <ul>
          <li><a href="/movies.html?cat=Action">Action</a></li>
          <li><a href="/movies.html?cat=Drama">Drama</a></li>
          <li><a href="/movies.html?cat=Comedy">Comedy</a></li>
          <li><a href="/movies.html?cat=Horror">Horror</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <ul>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Use</a></li>
          <li><a href="#">DMCA</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} CineNova. Built by <strong style="color:var(--accent)">The Palace Tech House</strong> — The Palace, Inc.</p>
      <p style="color:var(--text3)">All rights reserved.</p>
    </div>
  </footer>`;
}
