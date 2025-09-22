from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
import pandas as pd, os, time

app = FastAPI()

BASE = os.getenv("PUBLIC_BLOB_BASE_URL", "").rstrip("/") + "/"
URL = BASE + "predictions_multi.csv"

TTL = int(os.getenv("CSV_CACHE_SECONDS", "60"))
_cache = {"t": 0.0, "df": None}

def get_df():
    now = time.time()
    if _cache["df"] is not None and now - _cache["t"] < TTL:
        return _cache["df"]
    try:
        df = pd.read_csv(URL, parse_dates=["base_date","target_date"])
        df["item_code"] = df["item_code"].astype(int)
        df["state"] = df["state"].astype(str)
        _cache.update(t=now, df=df)
        return df
    except Exception as e:
        raise HTTPException(500, f"Read {URL} failed: {e}")

@app.get("/api/predictions/summary")
def summary(item_code: int = Query(...), state: str = Query(...)):
    df = get_df()
    out = df[(df.item_code == item_code) & (df.state == state)].sort_values("horizon")
    return JSONResponse(out.to_dict(orient="records"))
