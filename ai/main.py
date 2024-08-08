from fastapi import FastAPI, Request
import uvicorn
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = 'AIzaSyAQM0pVcMJ4FFcDt-RrfHCwB8-WiVjaYhI'
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-pro')

@app.get("/")
async def test():
    return {"msg": "test"}

@app.post("/getReliability")
async def getReliability(request: Request):
    body = await request.json()
    code = body["code"]
    # with open("../src/contracts/BNBBro.sol") as file:
    #     code = file.read()
        
    query = f"Provide only an integer value. This integer value should be in between 0-10 which signifies how safe and reliable the given smart contract code is: `{code}`"
    response = model.generate_content(query)
    return int(response.text)

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, log_level="info", reload=True)