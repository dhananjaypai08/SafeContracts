from fastapi import FastAPI, Request
import uvicorn
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests
import time 

app = FastAPI()
load_dotenv()
origins = [
    "http://localhost",
    "http://localhost:3000",
    "*"
]
chainId = 56
API_KEY = os.environ.get("REACT_APP_INCH_PVT_KEY")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.environ.get("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel(model_name='gemini-pro')

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

@app.get("/getCurrentVal")
async def getCurrentVal(walletAddress: str):
    # Calls the 1inch Network- Tokens current valueReturns the current value for supported tokens. Data is grouped by chains and addresses.
    apiUrl = f"https://api.1inch.dev/portfolio/portfolio/v4/overview/erc20/current_value?addresses={walletAddress}&chain_id={chainId}"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    response = requests.get(apiUrl, headers=headers)
    return response.json()

@app.post("/query")
async def chat(request: Request):
    body = await request.json()
    query = body["query"]
    tokens = query.split()
    if "secure" in tokens or "safe" in tokens:
        res = "The most secure smart contract is 0x057155e1e3E6b850E11f09AA18D482e3556b6CfF"
    elif "describe" in tokens or "description" in tokens or "name" in tokens:
        res = "The above smart contract is from SafeContract which is a vulnerability finder service and current contracts volume added in it is : 6."
    else:
        res = "Something went wrong. Please try again"
    time.sleep(1)
    return res 
    

if __name__ == "__main__":
    uvicorn.run("main:app", port=8000, log_level="info", reload=True)