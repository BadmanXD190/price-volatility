from fastapi import FastAPI

# Tell FastAPI it's mounted under /api
app = FastAPI(root_path="/api")

@app.get("/")
async def read_root():
    return {"message": "Hello, Vercel!"}

@app.get("/hello")
async def read_hello():
    return {"message": "Hello endpoint from FastAPI"}
