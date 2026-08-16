import fs from "fs";
import path from "path";
import admin from "firebase-admin";

function loadJson(name) {
  const p = path.join(process.cwd(), "data", "mock", `${name}.json`);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

async function main() {
  // Initialize admin SDK
  const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.SERVICE_ACCOUNT_PATH;
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else if (process.env.FIRESTORE_EMULATOR_HOST) {
    // Connect to emulator
    admin.initializeApp();
    const db = admin.firestore();
    db.settings({ host: process.env.FIRESTORE_EMULATOR_HOST, ssl: false });
  } else {
    console.error(
      "No credentials found. Set GOOGLE_APPLICATION_CREDENTIALS or SERVICE_ACCOUNT_PATH, or set FIRESTORE_EMULATOR_HOST to use the emulator."
    );
    process.exit(1);
  }

  const db = admin.firestore();

  const collections = ["careers", "interests", "strengths", "subjects", "programmes"];

  for (const col of collections) {
    const items = loadJson(col);
    console.log(`Seeding collection: ${col} (${items.length} documents)`);
    const batch = db.batch();
    for (const item of items) {
      const ref = db.collection(col).doc(item.id ?? undefined);
      batch.set(ref, item);
    }
    await batch.commit();
    console.log(`Seeded ${col}`);
  }

  console.log("Seeding complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
