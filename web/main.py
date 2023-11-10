import sys
sys.path.insert(0,'.')

import numpy as np
from fastapi import FastAPI,Request,File, UploadFile
from pydantic import BaseModel
from contextlib import asynccontextmanager
from keras.models import load_model
from keras.utils import image_dataset_from_directory

from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


# New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
# -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force

import PIL as Image


from handle_files.json_files import read_json

from constants import IMG_SIZE, WARD_BASE_URL
# from get_data.get_links import get_page
# from election_analysis.constants import IMG_SIZE
# from get_data.get_links import scrap_elections

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    ml_models['classification'] = load_model('./models/classification/classify_1.h5')
    yield
    # Clean up the ML models and release the resources
    ml_models.clear()


app = FastAPI(lifespan=lifespan,title='Election Analysis')
app.mount("/static/", StaticFiles(directory="web/static"), name="static")
templates = Jinja2Templates(directory="web/templates")


# @app.get("/items/{id}", response_class=HTMLResponse)
# async def read_item(request: Request, id: str):
#     return templates.TemplateResponse("index.html", {"request": request, "id": id})


@app.get("/",response_class=HTMLResponse)
async def root(request:Request):
    return templates.TemplateResponse("index.html", {"request": request,
                                                    "id": id})


@app.get("/elections")
# File:UploadFile = UploadFile(...) 
def get_election_data(action:str,local:str=None):
    data = None
    local = local.replace("%"," ") if local !=None else local
    print(local)
    if action == "first_data":
        data = read_json('first_data.json')
    if action == 'get_ward':
        mapper = read_json('mapper.json')
        *_,state = local.split('-')
        data = mapper['states'][state][local]
    
    return data


@app.get("/results/{election_type_id}/{local_govt}/{ward}")
# File:UploadFile = UploadFile(...) 
def get_results(election_type_id,local_govt,ward):
    local_govt = local_govt.replace("%"," ") 
    ward = ward.replace("%"," ") 
    mapper = read_json('mapper.json')
    lg_id = mapper['lgs'][local_govt]
    ward_id = mapper['wards'][ward]
    ward_link = f'{WARD_BASE_URL}/{election_type_id}/context/pus/lga/{lg_id}/ward/{ward_id}'
    
    return ward_link

@app.post("/classify")
# File:UploadFile = UploadFile(...) 
def predict():
    # bytes_ = 
   
    images = image_dataset_from_directory('./data/images/temp_image_store', image_size=IMG_SIZE,labels=None)
    predictions = ml_models['classification'].predict(images)
    confidence = np.max(predictions,axis=-1).tolist()
    predictions = np.argmax(predictions,axis=-1).tolist()
    pus = [path.split('\\')[1] for path in images.file_paths]
    results = []
    for i in range(len(pus)):
        results.append({
            "predictions":predictions[i],
            'confidence':confidence[i],
            'pus':pus[i] 
        })
    

    return results
