from fastapi import FastAPI

app = FastAPI()

@app.get("/api")
async def read_root():
    return {"message": "Hello, Vercel!"}

@app.get("/api/hello")
async def read_hello():
    return {"message": "Hello endpoint from FastAPI"}
