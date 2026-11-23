import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

# STEP 1: Load dataset
data = pd.read_csv("../dataset/classroom_data.csv")

# You can also read an Excel file:
# data = pd.read_excel("../dataset/classroom_data.xlsx")

# STEP 2: Separate input and output
X = data[
    [
        "students",
        "lights_on",
        "fans_on",
        "power_consumption"
    ]
]

y = data["wastage"]

# STEP 3: Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# STEP 4: Create model
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=5,
    random_state=42,
    class_weight="balanced"
)

# STEP 5: Train model
model.fit(X_train, y_train)

print("AI training completed!")

# STEP 6: Test model
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("Accuracy:", accuracy)

print("\nClassification Report:")
print(classification_report(y_test, predictions))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, predictions))

# STEP 7: Save trained model
joblib.dump(model, "classroom_model.pkl")

print("\nModel saved successfully!")