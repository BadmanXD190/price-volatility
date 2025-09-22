from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd, os, time

app = FastAPI()

# Display names for your 7 items
ITEM_MAP = {
    1: "AYAM BERSIH - STANDARD",
    2: "AYAM BERSIH - SUPER",
    55: "IKAN KEMBUNG KECIL/PELALING",
    69: "IKAN SELAR KUNING",
    1111: "TELUR AYAM GRED C",
    1556: "BAYAM HIJAU",
    1558: "SAWI HIJAU"
}

# Public URL base where predictions CSVs will live (we'll set this in Step 3)
BASE = os.getenv("PUBLIC_BLOB_BASE_URL", "").rstrip("/") + "/"
PATH_URL = BASE + "predictions_path.csv"

# Small in-function cache to avoid re-downloading too often
CACHE_TTL = int(os.getenv("CSV_CACHE_SECONDS", "60"))
_cache = {"t": 0.0, "states": None}

@app.get("/api/metadata")
def metadata():
    now = time.time()
    if _cache["states"] is None or now - _cache["t"] > CACHE_TTL:
        try:
            # Read only 'state' column to list available states
            df = pd.read_csv(PATH_URL, usecols=["state"])
            _cache["states"] = sorted(df["state"].astype(str).dropna().unique().tolist())
            _cache["t"] = now
        except Exception as e:
            raise HTTPException(500, f"Cannot read states from {PATH_URL}: {e}")
    return JSONResponse({"items": ITEM_MAP, "states": _cache["states"]})
