# Complete Definition Import & Linking Workflow

## 🎯 Overview
This guide explains the complete workflow for importing definitions with images and linking them to bylaw content.

---

## 📋 Prerequisites

1. **Python packages installed:**
   ```bash
   pip install hf_xet
   pip install pymupdf
   ```

2. **Environment variables set in `.env`:**
   - `DATABASE_URL` (or `TURSO_DATABASE_URL`)
   - `PAYLOAD_SECRET`

3. **PDF files placed in:** `scripts/pdfs/`

---

## 🚀 Step-by-Step Workflow

### Step 1: Extract Definitions & Images from PDFs

**Option A: Run all 3 scripts at once (Recommended)**
```bash
cd scripts/definitions
python run-all.py
```

**Option B: Run scripts individually**
```bash
# 1. Convert PDF to JSON
python import2JSON.py

# 2. Extract and label images
python smart-img-rip.py

# 3. Clean JSON and add image references
python cleanJSON.py
```

**Output:**
- `scripts/JSON/final/definitions.json` - Clean definitions with image references
- `scripts/JSON/images/` - Extracted images (e.g., `Deck_Ground_Level_img1.png`)

---

### Step 2: Manual Quality Check

**Review and fix:** `scripts/JSON/final/definitions.json`

Check for:
- Incorrect term parsing
- Missing text
- Formatting issues
- If you have multiple PDFs, you can combine the JSON files here

---

### Step 3: Upload Definitions to Payload CMS

```bash
cd scripts/definitions
npx tsx import-definitions.ts
```

**This script:**
- Creates `definition-content` records
- Creates `definitions` records linked to content
- Adds cross-reference links between definitions

**⚠️ Note:** This does NOT upload images yet!

---

### Step 4: Upload Images to Payload CMS

```bash
cd scripts/definitions
npx tsx upload-definition-images.ts
```

**This script:**
- Uploads images from `scripts/JSON/images/` to Payload Media collection
- Links uploaded media IDs to corresponding `definition-content` records
- Skips already-uploaded images (safe to re-run)

**Output example:**
```
📸 Processing images for: Deck_Ground_Level
  ✓ Uploaded: Deck_Ground_Level_img1.png
  ✓ Uploaded: Deck_Ground_Level_img2.png
  ✓ Linked 2 image(s) to definition-content 123

✅ Image upload complete!
   📤 Uploaded: 45 new images
   ↻ Skipped: 3 existing images
   🔗 Linked: 42 definitions to images
```

---

### Step 5: Link Definitions to Bylaw Content

**Run BOTH scripts in this order:**

#### 5a. Link definitions within definition text (self-referencing)
```bash
cd scripts
npx tsx add-lookup-links-to-definition-content.ts
```

**This script:**
- Finds definition terms mentioned in other definitions
- Wraps them in clickable links with `actionKey="lookupDefinition"`
- Prevents self-linking (a definition won't link to itself)

#### 5b. Link definitions in bylaw subsections
```bash
cd scripts
npx tsx add-lookup-definition-links.ts
```

**This script:**
- Scans all `bylawSubsections` content
- Finds definition terms in bylaw text
- Wraps them in clickable links with `actionKey="lookupDefinition"`
- Handles plurals (e.g., "dwelling" matches "dwellings")

---

## 📂 File Structure

```
scripts/
├── definitions/
│   ├── import2JSON.py              # Step 1a: PDF → JSON
│   ├── smart-img-rip.py            # Step 1b: Extract images
│   ├── cleanJSON.py                # Step 1c: Clean JSON
│   ├── run-all.py                  # Step 1: Run all 3 above
│   ├── import-definitions.ts       # Step 3: Upload definitions
│   ├── upload-definition-images.ts # Step 4: Upload images (NEW!)
│   └── README-How to Import Definitions.md
├── add-lookup-links-to-definition-content.ts  # Step 5a
├── add-lookup-definition-links.ts             # Step 5b
└── JSON/
    ├── images/                     # Extracted images
    └── final/                      # Clean JSON files
```

---

## ✅ Complete Workflow Summary

```bash
# 1. Extract everything from PDFs
cd scripts/definitions
python run-all.py

# 2. Manual review (open scripts/JSON/final/definitions.json and check)

# 3. Upload definitions to CMS
npx tsx import-definitions.ts

# 4. Upload images to CMS (NEW STEP!)
npx tsx upload-definition-images.ts

# 5. Link definitions to bylaws
cd ..
npx tsx add-lookup-links-to-definition-content.ts
npx tsx add-lookup-definition-links.ts
```

---

## 🖼️ Frontend Display

**Modified files (by Claude):**
- `src/app/(frontend)/components/ReferenceSidebarContext.tsx`
- `src/app/(frontend)/components/ReferenceSidebar.tsx`
- `src/app/(frontend)/components/ReferenceDrawer.tsx`

**What they do:**
- Fetch images from Payload along with definition text
- Display images below definition text in both desktop and mobile views
- Support multiple images per definition

---

## 🔄 Re-running Scripts

**Safe to re-run:**
- ✅ `upload-definition-images.ts` - Skips existing images
- ✅ `import-definitions.ts` - Updates existing definitions
- ✅ `add-lookup-*.ts` scripts - Updates links

**Not safe to re-run without cleanup:**
- ❌ Multiple runs may create duplicate definitions if not handled

---

## 🐛 Troubleshooting

### Images not showing up on frontend
1. Check if images were uploaded: Visit Payload Admin → Media
2. Check if images are linked: Visit Payload Admin → Definition Content → [Your Definition] → Images field should be populated
3. Clear browser cache and reload

### "Definition-content not found" error
- Make sure you ran `import-definitions.ts` (Step 3) before `upload-definition-images.ts` (Step 4)

### Images uploaded but not linked
- The `termID` in your JSON must match the slugified term name
- Example: "**Deck, Ground Level**" → termID should be "Deck_Ground_Level"

---

## 📞 Need Help?

If something isn't working, check:
1. `.env` file has correct database credentials
2. Payload CMS is running
3. All prerequisite packages are installed
4. Run scripts from correct directory
