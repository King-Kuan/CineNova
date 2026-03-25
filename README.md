# CineNova — Deployment Guide
### Built by The Palace Tech House — The Palace, Inc.

---

## 📁 Project Structure

```
cinenova/
├── index.html          — Homepage
├── movies.html         — All movies with filters
├── movie.html          — Single movie page (trailer, download, comments)
├── vlogs.html          — Vlogs page
├── advertise.html      — Advertiser signup
├── admin.html          — Full admin dashboard (auth protected)
├── setup.html          — ⚠️ LOCAL ONLY — One-time admin account setup
├── css/
│   └── main.css        — Global styles
├── js/
│   ├── firebase-config.js  — Firebase init + shared utilities
│   └── ads.js              — Ad injection engine
└── vercel.json         — Vercel routing config
```

---

## 🚀 Setup Instructions

### Step 1 — Create Admin Account (LOCAL ONLY)
1. Open `setup.html` locally in your browser (e.g. using VS Code Live Server)
2. Enter your admin email and password
3. Click **Create Admin Account**
4. ⚠️ **DELETE or RENAME `setup.html` before deploying to Vercel**

### Step 2 — Firestore Rules
In the Firebase Console → Firestore → Rules, set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for movies, vlogs, ads
    match /movies/{id} { allow read: if true; allow write: if request.auth != null; }
    match /vlogs/{id} { allow read: if true; allow write: if request.auth != null; }
    match /ads/{id} { allow read: if true; allow write: if request.auth != null; }
    // Comments: anyone can create, only admin can delete
    match /comments/{id} { allow read, create: if true; allow delete: if request.auth != null; }
    // Downloads: anyone can create (for tracking), admin reads
    match /downloads/{id} { allow create: if true; allow read, write: if request.auth != null; }
    // Advertisers: anyone can create application, admin manages
    match /advertisers/{id} { allow create: if true; allow read, update, delete: if request.auth != null; }
  }
}
```

### Step 3 — Firestore Indexes
Create these composite indexes in Firebase Console → Firestore → Indexes:

| Collection   | Fields                          | Order |
|-------------|----------------------------------|-------|
| movies       | createdAt DESC                  | —     |
| movies       | downloads DESC                  | —     |
| downloads    | timestamp ASC + movieId ASC     | —     |
| downloads    | timestamp ASC                   | —     |
| ads          | status ASC + endDate ASC        | —     |
| comments     | movieId ASC + createdAt DESC    | —     |
| advertisers  | status ASC + createdAt DESC     | —     |

### Step 4 — Deploy to Vercel
1. Push project to a GitHub repository
2. Connect the repo to Vercel
3. Deploy — no build step needed (pure HTML/JS)
4. Ensure `setup.html` is NOT in the deployed repo

---

## 🎬 Firestore Collections

### `movies`
| Field         | Type      | Description                         |
|---------------|-----------|-------------------------------------|
| title         | string    | Movie title                         |
| category      | string    | Genre (Action, Drama, etc.)         |
| description   | string    | Synopsis                            |
| posterUrl     | string    | ImageKit URL                        |
| trailerUrl    | string    | YouTube URL                         |
| downloadLinks | array     | Array of download URLs              |
| year          | string    | Release year                        |
| duration      | string    | e.g. "2h 15min"                     |
| rating        | number    | 1–5                                 |
| language      | string    | e.g. "English"                      |
| quality       | string    | HD, Full HD, 4K                     |
| director      | string    | Director name                       |
| cast          | string    | Cast names                          |
| downloads     | number    | Download counter                    |
| createdAt     | timestamp | Auto-set on creation                |

### `ads`
| Field       | Type      | Description                         |
|-------------|-----------|-------------------------------------|
| title       | string    | Ad headline                         |
| type        | string    | ribbon / popup / redirect           |
| text        | string    | Ad body text                        |
| link        | string    | Destination URL                     |
| imageUrl    | string    | Optional ad image URL               |
| startDate   | string    | YYYY-MM-DD                          |
| endDate     | timestamp | End datetime                        |
| status      | string    | active / paused                     |
| createdAt   | timestamp | —                                   |

---

## 📣 Ad Types
- **Ribbon** — Top-of-page banner across all pages
- **Popup** — Full overlay popup, shown once per session after 3s
- **Redirect** — Countdown redirect popup, shown once per session after 8s

---

## 🔑 Keys Reference
- **Firebase Project:** cinenova-01
- **ImageKit Endpoint:** https://ik.imagekit.io/destinydriving
- **ImageKit Public Key:** public_Dm9o2L7td86DzeKvGQMW6hUNQN0=

---

© The Palace Tech House — The Palace, Inc.
