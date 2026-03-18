from fastapi import FastAPI

app = FastAPI(title="AegisStream AI Service")

@app.get("/health")
def health():
    return {"status": "ok"}
