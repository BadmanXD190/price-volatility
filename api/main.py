from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from dateutil import parser as dtp
import csv, os
from typing import List

app = FastAPI(root_path="/api")
app.router.redirect_slashes = False

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "predictions.csv")

ITEM_MAP = {
    1: "AYAM BERSIH - STANDARD",
    2: "AYAM BERSIH - SUPER",
    55: "IKAN KEMBUNG KECIL/PELALING",
    69: "IKAN SELAR KUNING",
    1111: "TELUR AYAM GRED C",
    1556: "BAYAM HIJAU",
    1558: "SAWI HIJAU",
}

# --- utilities ---
def load_rows():
    out = []
    with open(DATA_PATH, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            r["item_code"] = int(r["item_code"])
            r["horizon"] = int(r["horizon"])
            r["variance"] = float(r["variance"])
            r["date"] = dtp.parse(r["date"]).date().isoformat()
            out.append(r)
    return out

# --- basic health & hello ---
@app.get("")
@app.get("/")
async def root():
    return {"message": "Hello, Vercel!"}

@app.get("/hello")
async def read_hello():
    return {"message": "Hello endpoint from FastAPI"}

# --- metadata for UI ---
@app.get("/items")
async def items():
    rows = load_rows()
    states = sorted({r["state"] for r in rows})
    items = [{"code": c, "name": n} for c, n in ITEM_MAP.items()]
    return {"items": items, "states": states}

# --- predictions: returns time series for a selection ---
@app.get("/predict")
async def predict(
    item_code: int = Query(..., description="One of the 7 item codes"),
    state: str = Query(..., description="State name"),
    horizon: int = Query(1, description="1, 7, or 30"),
):
    if item_code not in ITEM_MAP:
        raise HTTPException(status_code=400, detail="Unknown item_code")
    if horizon not in {1, 7, 30}:
        raise HTTPException(status_code=400, detail="horizon must be 1, 7, or 30")
    rows = load_rows()
    sel = [r for r in rows if r["item_code"] == item_code and r["state"] == state and r["horizon"] == horizon]
    sel = sorted(sel, key=lambda r: r["date"])
    return {
        "item_code": item_code,
        "item_name": ITEM_MAP[item_code],
        "state": state,
        "horizon": horizon,
        "series": [{"date": r["date"], "variance": r["variance"]} for r in sel],
    }
