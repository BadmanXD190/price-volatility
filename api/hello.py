from fastapi import FastAPI

# Zero-config Python Serverless Function on Vercel
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI on Vercel!", "status": "ok"}
