from fastapi import FastAPI

app = FastAPI(root_path="/api")

# Avoid automatic / -> // or /api <-> /api/ redirects
app.router.redirect_slashes = False

# Match both "" and "/" under the root_path
@app.get("")
@app.get("/")
async def read_root():
    return {"message": "Hello, Vercel!"}

@app.get("/hello")
async def read_hello():
    return {"message": "Hello endpoint from FastAPI"}
