import joblib

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Create application
app = FastAPI()

# Allow React to communicate with Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5177", "http://127.0.0.1:5177"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("classroom_model.pkl")


# Define incoming data format
class ClassroomData(BaseModel):
    students: int
    lights_on: int
    fans_on: int
    power_consumption: float


@app.get("/")
def home():
    return {"message": "AI backend is running!"}


@app.post("/predict")
def predict(data: ClassroomData):

    # Convert incoming data into model input
    input_data = [[
        data.students,
        data.lights_on,
        data.fans_on,
        data.power_consumption
    ]]

    # Make prediction
    prediction = int(model.predict(input_data)[0])

    return {
        "wastage_detected": bool(prediction),
        "message": (
            "Electricity wastage detected"
            if prediction == 1
            else "No electricity wastage detected"
        )
    }