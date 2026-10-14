import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)


# =========================================================
# Load Dataset
# =========================================================

df = pd.read_csv(
    "data/raw/student-por.csv"
)


# =========================================================
# Selected Features
# These match our prediction form
# =========================================================

selected_features = [
    "age",
    "Gender",
    "Medu",
    "Fedu",
    "studytime",
    "failures",
    "absences",
    "G1",
    "G2",
    "famsup",
    "internet",
    "higher"
]


# =========================================================
# Input Features
# =========================================================

X = df[
    selected_features
]


# =========================================================
# Target
# =========================================================

y = df[
    "G3"
]


# =========================================================
# Convert Categorical Columns Into Numbers
# =========================================================

X = pd.get_dummies(
    X,
    drop_first=True
)


# =========================================================
# Save Feature Columns
# =========================================================

feature_columns = X.columns.tolist()


# =========================================================
# Train-Test Split
# =========================================================

X_train, X_test, y_train, y_test = train_test_split(

    X,
    y,

    test_size=0.2,

    random_state=42

)


# =========================================================
# Create Random Forest Model
# =========================================================

model = RandomForestRegressor(

    n_estimators=100,

    random_state=42

)


# =========================================================
# Train Model
# =========================================================

model.fit(
    X_train,
    y_train
)


# =========================================================
# Make Predictions
# =========================================================

y_pred = model.predict(
    X_test
)


# =========================================================
# Calculate Evaluation Metrics
# =========================================================

mae = mean_absolute_error(
    y_test,
    y_pred
)


mse = mean_squared_error(
    y_test,
    y_pred
)


rmse = np.sqrt(
    mse
)


r2 = r2_score(
    y_test,
    y_pred
)


# =========================================================
# Display Model Evaluation
# =========================================================

print()
print("==============================================")
print("     EduAI Student Performance Model")
print("==============================================")

print()

print(
    "Total records:",
    len(df)
)

print(
    "Training records:",
    len(X_train)
)

print(
    "Testing records:",
    len(X_test)
)

print()

print("------------- Model Evaluation --------------")

print(
    "MAE:",
    round(mae, 4)
)

print(
    "MSE:",
    round(mse, 4)
)

print(
    "RMSE:",
    round(rmse, 4)
)

print(
    "R2 Score:",
    round(r2, 4)
)

print()

print(
    "Features used:",
    len(feature_columns)
)

print()

print("------------- Feature Names -----------------")

for feature in feature_columns:

    print(
        feature
    )

print()


# =========================================================
# Save Model Evaluation Metrics
# =========================================================

model_metrics = {

    "mae": round(
        float(mae),
        4
    ),

    "mse": round(
        float(mse),
        4
    ),

    "rmse": round(
        float(rmse),
        4
    ),

    "r2_score": round(
        float(r2),
        4
    ),

    "total_records": int(
        len(df)
    ),

    "training_records": int(
        len(X_train)
    ),

    "testing_records": int(
        len(X_test)
    ),

    "number_of_features": int(
        len(feature_columns)
    ),

    "model_type":
        type(model).__name__

}


# =========================================================
# Save Model
# =========================================================

joblib.dump(
    model,
    "model.pkl"
)


# =========================================================
# Save Feature Columns
# =========================================================

joblib.dump(
    feature_columns,
    "feature_columns.pkl"
)


# =========================================================
# Save Evaluation Metrics
# =========================================================

joblib.dump(
    model_metrics,
    "model_metrics.pkl"
)


# =========================================================
# Success Message
# =========================================================

print("==============================================")
print("Model saved successfully!")
print("==============================================")

print()

print(
    "model.pkl"
)

print(
    "feature_columns.pkl"
)

print(
    "model_metrics.pkl"
)

print()

print("==============================================")
