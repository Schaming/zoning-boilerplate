# BASIC WORKFLOW SUMMARY 
1. Put Definitions PDFS in PDFS folder (You can consolidate PDFs if there are multiple or you can consolidate at the cleaned JSON step)
2. PROCESS 1: Steps 1-3 OR PROCESS 2: Step 1  
3. Fix any errors in cleaned JSON Manually 
4. Upload cleaned JSON to CMS with import-definitions.ts (you may need to rename the import file to make this work)
5. Manually add extracted images to database (we can work on automating this later)

# CivicZone: Definition Import Pipeline

This repository contains the three-stage pipeline used to convert raw PDF zoning bylaw definitions into structured, cross-linked definitions within the Payload CMS.
---
PROCESS 1
**NOTE run-all.py can do the first 3 steps**
1. **PDF Source** -> [input2JSON.py] 
2. **Import Images** -> [smart-img-rip.py]
3. **Clean up the Imported JSON** -> [cleanJSON.py] 
4. **Upload the clean JSON to the database** -> [import-definitions.ts] 
5. **Payload CMS (Live)**

PROCESS 2
**Steps if you want to use run-all.py**
1. **PDF Source -> Import Images - > Clean up JSON** -> [run-all.py]
2. **Upload the clean JSON to the database** -> [import-definitions.ts] 
3. **Payload CMS (Live)**


---
## Things to install
make sure you have python installed and up to date
"pip install hf_xet" in the command line
AND "pip install pymupdf"

## 📂 Script Breakdown
1. **PDF Source** -> [input2JSON.py] 
Converts PDF to JSON
2. **Import Images** -> [smart-img-rip.py]
Extracts images from PDFs and labels according to definitions
2. **Docling JSON** -> [cleanJSON.py] 
Cleans JSON files and adds image labels to JSON
3. **Standardized JSON** -> [import-definitions.ts] 
Uploads cleaned JSON to CMS

## 🚀 How to Run

1. **Place PDFs** in the `scripts/pdfs` folder.
2. **Run input2JSON.py:**
   python input2JSON.py
   this will put your PDF definitions into a folder scripts/JSON in raw JSON format
3. **Import Images** 
   python smart-image-rip.py
   This will extract images from the PDF and label them according to the definition they came immediately after, if there are multiple it should lable them as such. 
4A **Run Cleaner**
   cleanJSON.py 
   The output will be scripts/JSON/final 
    for each converted file you will need to clean the data, this is a good point to do quality checks for errors
4B **Combine files**
    If there are multiple definition files you can combine them here or you can import then go back to the cleaning stage for each one. 
5. **Run Import**
    npx tsx import-defintions.ts