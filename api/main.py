from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello, Vercel!"}

@app.get("/hello")
async def read_hello():
    return {"message": "Hello endpoint from FastAPI"}
