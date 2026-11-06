
import sys
from pathlib import Path
from dotenv import load_dotenv

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
load_dotenv(BACKEND_DIR / ".env")

import asyncio
from database import projects_collection

async def clean_duplicates():
    """Remove the old duplicate projects"""
    
    # Delete the old projects without proper demo URLs
    old_slugs = ["social-media-manager", "analytics-dashboard"]
    
    for slug in old_slugs:
        result = await projects_collection.delete_one({"slug": slug})
        if result.deleted_count > 0:
            print(f"✅ Deleted old project: {slug}")
        else:
            print(f"ℹ️  Project not found: {slug}")
    
    print("\n🎉 Cleanup completed!")

if __name__ == "__main__":
    asyncio.run(clean_duplicates())
