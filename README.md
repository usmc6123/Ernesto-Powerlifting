# Reyes Training Log (RTL)

[![Open in Google AI Studio](https://img.shields.io/badge/Open%20in-Google%20AI%20Studio-blue?logo=google&logoColor=white)](https://aistudio.google.com/apps/b31c8b29-41d6-439b-b9b0-a12bcf991d56?showPreview=true&showAssistant=true)

A full-stack powerlifting and gym training tracker built using **React, Vite, TypeScript, Tailwind CSS, Express, and Firebase Admin SDK** (configured to deploy seamlessly to Vercel/Cloud Run).

## Features
- **Strict Personal Security**: Powered by JWT token authentication with a single hardcoded passcode.
- **Dynamic Goals Tracker**: Log lifts targets and watch real-time baseline-to-target percentage progress meters advance as your workout maximums increase.
- **Progression Estimator**: Chart historic working weight alongside total repetition counts. Calculates estimated 1RM values using the Epley progression formula.
- **Discipline Heatmap**: Visual 7-column calendar color-coding trained, skipped, rest, and future unlogged workouts based on real logged sessions.
- **MoM Statistical Comparator**: Side-by-side performance grids showcasing monthly best squat, bench, and deadlift.

---

## Environment Variables Required

Add these secrets in your hosting dashboard or a local `.env` file:

```env
# Secret key used to sign and verify JWT authorization tokens
JWT_SECRET="reyes-training-log-jwt-secret-key-12345"

# Stringified JSON representing your Firebase service account private key config
FIREBASE_CONFIG='{"type": "service_account", "project_id": "YOUR_PROJECT", "private_key": "-----BEGIN PRIVATE KEY-----\n...", "client_email": "..."}'

# Optional custom passkey code (defaults to "reyes2026")
ADMIN_PASSWORD="reyes"
```

---

## Setup & Local Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Database**:
   - Create a Firestore Database in your Firebase Console.
   - Go to Project Settings -> Service Accounts -> Generate New Private Key.
   - Stringify the generated JSON file and paste it into the `FIREBASE_CONFIG` environment variable inside your `.env` or AI Studio secrets configuration.

3. **Running in Development**:
   Starts the dual-mode Express backend proxies integrated with Vite:
   ```bash
   npm run dev
   ```

4. **Production compilation**:
   ```bash
   npm run build
   npm run start
   ```

---

## Automatic Seeding

Upon first login / app load, if the `sessions` collection in your Firestore is empty, the server automatically boots a one-time seeding process to populate the database with real historical powerlifting training logs spanning **January - June 2026**. This ensures the application displays immediately beautiful stats.
