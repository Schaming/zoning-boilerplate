import os
import sys
import subprocess

# --- RUN ALL DEFINITION SCRIPTS IN ORDER ---
# This script runs the complete pipeline:
# 1. import2JSON.py - Convert PDF to raw JSON
# 2. smart-img-rip.py - Extract images from PDF
# 3. cleanJSON.py - Clean JSON and link images

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def run_script(script_name, description):
    """Run a Python script and handle errors"""
    print(f"\n{'='*60}")
    print(f"STEP: {description}")
    print(f"{'='*60}\n")

    script_path = os.path.join(SCRIPT_DIR, script_name)

    try:
        result = subprocess.run(
            [sys.executable, script_path],
            cwd=SCRIPT_DIR,
            check=True,
            capture_output=False
        )
        print(f"\n✅ {script_name} completed successfully!\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error running {script_name}")
        print(f"Error: {e}\n")
        return False

def main():
    print("\n" + "="*60)
    print("DEFINITION IMPORT PIPELINE")
    print("="*60)

    scripts = [
        ("import2JSON.py", "Converting PDF to Raw JSON"),
        ("smart-img-rip.py", "Extracting Images from PDF"),
        ("cleanJSON.py", "Cleaning JSON and Linking Images")
    ]

    for script_name, description in scripts:
        success = run_script(script_name, description)
        if not success:
            print(f"\n❌ Pipeline stopped due to error in {script_name}")
            sys.exit(1)

    print("\n" + "="*60)
    print("✅ ALL STEPS COMPLETED SUCCESSFULLY!")
    print("="*60)
    print("\nYour definitions are ready in: scripts/JSON/final/")
    print("Next step: Run import-definitions.ts to upload to database\n")

if __name__ == "__main__":
    main()
