import re
from collections import Counter
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="TransformAI analysis service")
STOP = set("the and for with that this from have has will can may not but which into more than also such these those their they are was were".split())

class Doc(BaseModel):
    text: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze")
def analyze(d: Doc):
    words = [w for w in re.findall(r"[a-z]{4,}", d.text.lower()) if w not in STOP]
    return {"keywords": [w for w, _ in Counter(words).most_common(8)], "wordCount": len(d.text.split())}
