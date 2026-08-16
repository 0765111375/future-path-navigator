Seeding Firestore with mock NextPath data

Overview

This folder contains a small Node script that seeds a Firestore database with mock collections used by NextPath. Collections created:
- careers
- interests
- strengths
- subjects
- programmes

Usage

1) Install dependencies (if you haven't already):

```bash
npm install
```

2) Provide credentials — one of the following:
- Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of a service account JSON file with Firestore write permissions.
- Or set `SERVICE_ACCOUNT_PATH` to the same path.
- Or run the Firebase Emulator and set `FIRESTORE_EMULATOR_HOST=localhost:8080` (or your emulator host).

3) Run the seeding script:

```bash
npm run seed:firestore
```

Notes

- The script writes documents using the `id` field from each JSON file as the document id when present.
- If you prefer the Firebase CLI to import JSON, you can also convert these JSON files into the `firestore` import format.
