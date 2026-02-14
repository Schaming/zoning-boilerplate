// scripts/definitions/upload-definition-images.ts
// Uploads images from scripts/JSON/images/ to Payload Media collection
// and links them to the corresponding definition-content records

import 'dotenv/config';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import config from '@payload-config';
import { getPayload, Payload } from 'payload';

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGE_FOLDER = path.resolve(__dirname, '../JSON/images');
const DATA_PATH = path.resolve(__dirname, '../JSON/final/definitions.json');

type DefinitionRow = {
  termID?: string;
  terms?: string;
  text?: string;
  type?: string;
  image?: string;
};

// Claude: Helper to get existing media by filename to avoid duplicates
async function getExistingMedia(payload: Payload): Promise<Map<string, string | number>> {
  const map = new Map<string, string | number>();
  let page = 1;

  while (true) {
    const result = await payload.find({
      collection: 'media',
      limit: 100,
      page,
      depth: 0,
      overrideAccess: true,
    });

    result.docs.forEach(doc => {
      if (doc.filename) {
        map.set(String(doc.filename), doc.id);
      }
    });

    if (!result.totalPages || page >= result.totalPages) break;
    page += 1;
  }

  return map;
}

// Claude: Helper to get definition-content by termID
async function getDefinitionContentMap(payload: Payload): Promise<Map<string, string | number>> {
  const map = new Map<string, string | number>();
  let page = 1;

  while (true) {
    const result = await payload.find({
      collection: 'definition-content',
      limit: 100,
      page,
      depth: 0,
      overrideAccess: true,
    });

    result.docs.forEach(doc => {
      if (doc.termID) {
        map.set(String(doc.termID).trim(), doc.id);
      }
    });

    if (!result.totalPages || page >= result.totalPages) break;
    page += 1;
  }

  return map;
}

// Claude: Upload a single image file to Payload Media
async function uploadImage(payload: Payload, imagePath: string, filename: string): Promise<string | number> {
  const fileBuffer = await fs.readFile(imagePath);

  const result = await payload.create({
    collection: 'media',
    data: {
      alt: filename.replace(/\.(png|jpg|jpeg|gif|webp)$/i, '').replace(/_/g, ' '),
    },
    file: {
      data: fileBuffer,
      mimetype: `image/${path.extname(filename).slice(1)}`,
      name: filename,
      size: fileBuffer.length,
    },
    overrideAccess: true,
  });

  console.log(`  ✓ Uploaded: ${filename}`);
  return result.id;
}

async function run() {
  const dbUrl =
    process.env.DATABASE_URL || process.env.DATABASE_URI || process.env.TURSO_DATABASE_URL;
  if (!dbUrl) {
    throw new Error(
      'Database URL env var is not set. Check payload.config.ts and ensure the matching env var is in .env.',
    );
  }

  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is not set. Add it to .env or pass it via the environment.');
  }

  const payload = await getPayload({ config });

  // Check if image folder exists
  try {
    await fs.access(IMAGE_FOLDER);
  } catch {
    console.error(`❌ Image folder not found: ${IMAGE_FOLDER}`);
    console.log('Make sure to run smart-img-rip.py first to extract images from PDFs.');
    process.exit(1);
  }

  // Check if definitions JSON exists
  let definitions: DefinitionRow[] = [];
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    definitions = JSON.parse(raw);
  } catch {
    console.error(`❌ Definitions JSON not found: ${DATA_PATH}`);
    console.log('Make sure to run cleanJSON.py first to create the definitions JSON.');
    process.exit(1);
  }

  console.log('📥 Loading existing media and definition-content records...');
  const existingMedia = await getExistingMedia(payload);
  const definitionContentMap = await getDefinitionContentMap(payload);

  console.log(`Found ${existingMedia.size} existing media files`);
  console.log(`Found ${definitionContentMap.size} definition-content records`);

  let uploadedCount = 0;
  let skippedCount = 0;
  let linkedCount = 0;

  // Process each definition that has images
  for (const def of definitions) {
    if (!def.termID || !def.image) continue;

    const imageFilenames = def.image.split(';').map(s => s.trim()).filter(Boolean);
    if (imageFilenames.length === 0) continue;

    const definitionContentId = definitionContentMap.get(def.termID.trim());
    if (!definitionContentId) {
      console.log(`⚠️  Definition-content not found for termID: ${def.termID}`);
      continue;
    }

    console.log(`\n📸 Processing images for: ${def.termID}`);
    const mediaIds: (string | number)[] = [];

    // Upload or find each image
    for (const filename of imageFilenames) {
      const imagePath = path.join(IMAGE_FOLDER, filename);

      // Check if file exists
      try {
        await fs.access(imagePath);
      } catch {
        console.log(`  ⚠️  Image file not found: ${filename}`);
        continue;
      }

      // Check if already uploaded
      let mediaId = existingMedia.get(filename);

      if (mediaId) {
        console.log(`  ↻ Already exists: ${filename}`);
        skippedCount++;
      } else {
        // Upload new image
        mediaId = await uploadImage(payload, imagePath, filename);
        existingMedia.set(filename, mediaId);
        uploadedCount++;
      }

      mediaIds.push(mediaId);
    }

    // Link images to definition-content
    if (mediaIds.length > 0) {
      await payload.update({
        collection: 'definition-content',
        id: definitionContentId,
        data: {
          images: mediaIds,
        },
        overrideAccess: true,
      });
      console.log(`  ✓ Linked ${mediaIds.length} image(s) to definition-content ${definitionContentId}`);
      linkedCount++;
    }
  }

  console.log('\n✅ Image upload complete!');
  console.log(`   📤 Uploaded: ${uploadedCount} new images`);
  console.log(`   ↻ Skipped: ${skippedCount} existing images`);
  console.log(`   🔗 Linked: ${linkedCount} definitions to images`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
