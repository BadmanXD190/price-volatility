from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello from FastAPI (index)!", "status": "ok"}

@app.get("/hello")
def hello():
    return {"message": "Hello endpoint", "status": "ok"}
