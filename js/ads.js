// ads.js - CineNova Ad Engine
import { db } from './firebase-config.js';
import { collection, query, where, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

export async function loadActiveAds() {
  const now = Timestamp.now();
  try {
    const q = query(
      collection(db, 'ads'),
      where('status', '==', 'active'),
      where('endDate', '>=', now)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch { return []; }
}

export async function injectAds() {
  const ads = await loadActiveAds();
  if (!ads.length) return;

  const ribbons = ads.filter(a => a.type === 'ribbon');
  const popups = ads.filter(a => a.type === 'popup');
  const redirects = ads.filter(a => a.type === 'redirect');

  // Ribbon Ad
  if (ribbons.length) {
    const ad = ribbons[Math.floor(Math.random() * ribbons.length)];
    renderRibbon(ad);
  }

  // Popup Ad — show after 3 seconds
  if (popups.length) {
    const ad = popups[Math.floor(Math.random() * popups.length)];
    const shown = sessionStorage.getItem(`popup_shown_${ad.id}`);
    if (!shown) {
      setTimeout(() => {
        renderPopup(ad);
        sessionStorage.setItem(`popup_shown_${ad.id}`, '1');
      }, 3000);
    }
  }

  // Redirect Ad — after 8 seconds with countdown warning
  if (redirects.length) {
    const ad = redirects[Math.floor(Math.random() * redirects.length)];
    const shown = sessionStorage.getItem(`redirect_shown_${ad.id}`);
    if (!shown) {
      setTimeout(() => {
        renderRedirectPopup(ad);
        sessionStorage.setItem(`redirect_shown_${ad.id}`, '1');
      }, 8000);
    }
  }
}

function renderRibbon(ad) {
  const wrap = document.getElementById('ribbon-ad-wrap');
  if (!wrap) return;
  wrap.innerHTML = `
    <div class="ribbon-ad" id="ribbon-inner">
      <div class="ribbon-ad-content">
        ${ad.imageUrl ? `<img src="${ad.imageUrl}" alt="ad">` : ''}
        <div class="ribbon-ad-text"><strong>${ad.title || 'Advertisement'}</strong> — ${ad.text || ''}</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        ${ad.link ? `<a href="${ad.link}" target="_blank" rel="noopener" class="ribbon-ad-btn">Learn More</a>` : ''}
        <span class="ribbon-close" id="ribbon-close-btn">&times;</span>
      </div>
    </div>`;
  // Push page content down while ribbon is visible
  document.body.classList.add('has-ribbon');
  document.getElementById('ribbon-close-btn')?.addEventListener('click', () => {
    wrap.innerHTML = '';
    document.body.classList.remove('has-ribbon');
  });
}

function renderPopup(ad) {
  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  overlay.id = 'popup-ad-overlay';
  overlay.innerHTML = `
    <div class="popup-box">
      <div class="popup-close" id="popup-close-btn">&times;</div>
      ${ad.imageUrl ? `<img src="${ad.imageUrl}" class="popup-img" alt="ad">` : ''}
      <div class="popup-body">
        <h3>${ad.title || 'Advertisement'}</h3>
        <p>${ad.text || ''}</p>
        ${ad.link ? `<a href="${ad.link}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Visit Now</a>` : ''}
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('popup-close-btn')?.addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function renderRedirectPopup(ad) {
  let count = 5;
  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  overlay.innerHTML = `
    <div class="popup-box">
      <div class="popup-close" id="redirect-close-btn">&times;</div>
      ${ad.imageUrl ? `<img src="${ad.imageUrl}" class="popup-img" alt="ad">` : ''}
      <div class="popup-body">
        <h3>${ad.title || 'Sponsored'}</h3>
        <p>${ad.text || ''}</p>
        <p style="font-size:12px;color:var(--text3);margin-top:8px">Redirecting in <strong id="redirect-count">${count}</strong>s — <span style="cursor:pointer;color:var(--accent)" id="redirect-skip">Skip</span></p>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const interval = setInterval(() => {
    count--;
    const el = document.getElementById('redirect-count');
    if (el) el.textContent = count;
    if (count <= 0) {
      clearInterval(interval);
      if (ad.link) window.open(ad.link, '_blank');
      overlay.remove();
    }
  }, 1000);

  document.getElementById('redirect-close-btn')?.addEventListener('click', () => { clearInterval(interval); overlay.remove(); });
  document.getElementById('redirect-skip')?.addEventListener('click', () => { clearInterval(interval); overlay.remove(); });
}
