from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello from FastAPI!", "status": "ok"}

@app.get("/ping")
def ping():
    return {"pong": True}
