from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)

import mysql.connector
import joblib
import pandas as pd
import os

from dotenv import load_dotenv
from groq import Groq


# =========================================================
# Load Environment Variables
# =========================================================

load_dotenv()


# =========================================================
# Flask App Configuration
# =========================================================

app = Flask(__name__)

# Authentication configuration
bcrypt = Bcrypt(app)

app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY",
    "eduai-super-secret-key-change-this"
)

jwt = JWTManager(app)

CORS(app)


# =========================================================
# MySQL Database Connection
# =========================================================

def get_db_connection():

    return mysql.connector.connect(
        host=os.getenv(
            "DB_HOST",
            "localhost"
        ),

        user=os.getenv(
            "DB_USER",
            "root"
        ),

        password=os.getenv(
            "DB_PASSWORD",
            ""
        ),

        database=os.getenv(
            "DB_NAME",
            "eduai"
        )
    )


# =========================================================
# User Registration
# =========================================================

@app.route(
    "/register",
    methods=["POST"]
)
def register():

    conn = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "message": "No data received"
            }), 400

        name = data.get(
            "name",
            ""
        ).strip()

        email = data.get(
            "email",
            ""
        ).strip().lower()

        password = data.get(
            "password",
            ""
        )

        # -------------------------------------------------
        # Validate Input
        # -------------------------------------------------

        if not name or not email or not password:

            return jsonify({
                "message":
                    "Name, email and password are required"
            }), 400

        if len(password) < 6:

            return jsonify({
                "message":
                    "Password must be at least 6 characters"
            }), 400

        # -------------------------------------------------
        # Database Connection
        # -------------------------------------------------

        conn = get_db_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        # -------------------------------------------------
        # Check Existing User
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:

            return jsonify({
                "message":
                    "Email already registered"
            }), 409

        # -------------------------------------------------
        # Hash Password
        # -------------------------------------------------

        password_hash = (
            bcrypt
            .generate_password_hash(password)
            .decode("utf-8")
        )

        # -------------------------------------------------
        # Insert User
        # -------------------------------------------------

        cursor.execute(
            """
            INSERT INTO users
            (
                name,
                email,
                password_hash,
                role
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s
            )
            """,
            (
                name,
                email,
                password_hash,
                "Administrator"
            )
        )

        conn.commit()

        return jsonify({
            "message":
                "Registration successful"
        }), 201

    except mysql.connector.Error as e:

        print(
            "Database registration error:",
            str(e)
        )

        return jsonify({
            "message":
                "Database error",
            "error":
                str(e)
        }), 500

    except Exception as e:

        print(
            "Registration error:",
            str(e)
        )

        return jsonify({
            "message":
                "Registration failed",
            "error":
                str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# =========================================================
# User Login
# =========================================================

@app.route(
    "/login",
    methods=["POST"]
)
def login():

    conn = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "message":
                    "No data received"
            }), 400

        email = data.get(
            "email",
            ""
        ).strip().lower()

        password = data.get(
            "password",
            ""
        )

        # -------------------------------------------------
        # Validate Input
        # -------------------------------------------------

        if not email or not password:

            return jsonify({
                "message":
                    "Email and password are required"
            }), 400

        # -------------------------------------------------
        # Database Connection
        # -------------------------------------------------

        conn = get_db_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        # -------------------------------------------------
        # Find User
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT
                id,
                name,
                email,
                password_hash,
                role
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        user = cursor.fetchone()

        # -------------------------------------------------
        # Check User
        # -------------------------------------------------

        if not user:

            return jsonify({
                "message":
                    "Invalid email or password"
            }), 401

        # -------------------------------------------------
        # Check Password
        # -------------------------------------------------

        password_correct = (
            bcrypt
            .check_password_hash(
                user["password_hash"],
                password
            )
        )

        if not password_correct:

            return jsonify({
                "message":
                    "Invalid email or password"
            }), 401

        # -------------------------------------------------
        # Create JWT Token
        # -------------------------------------------------

        access_token = create_access_token(
            identity=str(user["id"])
        )

        # -------------------------------------------------
        # Return User Information
        # -------------------------------------------------

        return jsonify({

            "message":
                "Login successful",

            "access_token":
                access_token,

            "user": {

                "id":
                    user["id"],

                "name":
                    user["name"],

                "email":
                    user["email"],

                "role":
                    user["role"]

            }

        }), 200

    except mysql.connector.Error as e:

        print(
            "Database login error:",
            str(e)
        )

        return jsonify({
            "message":
                "Database error",
            "error":
                str(e)
        }), 500

    except Exception as e:

        print(
            "Login error:",
            str(e)
        )

        return jsonify({
            "message":
                "Login failed",
            "error":
                str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# =========================================================
# Verify Authentication
# =========================================================

@app.route(
    "/verify-token",
    methods=["GET"]
)
@jwt_required()
def verify_token():

    try:

        user_id = get_jwt_identity()

        conn = get_db_connection()

        cursor = conn.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT
                id,
                name,
                email,
                role
            FROM users
            WHERE id = %s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if not user:

            return jsonify({
                "message":
                    "User not found"
            }), 404

        return jsonify({

            "authenticated":
                True,

            "user":
                user

        }), 200

    except Exception as e:

        print(
            "Token verification error:",
            str(e)
        )

        return jsonify({
            "message":
                "Invalid token",
            "error":
                str(e)
        }), 401


# =========================================================
# Home Route
# =========================================================

@app.route("/")
def home():

    return jsonify({

        "message":
            "EduAI ML API is running!",

        "model_loaded":
            True,

        "features":
            len(feature_columns),

        "groq_loaded":
            bool(GROQ_API_KEY)

    })


# =========================================================
# Groq API Configuration
# =========================================================

GROQ_API_KEY = os.getenv(
    "GROQ_API_KEY"
)

print(
    "Groq API key loaded:",
    bool(GROQ_API_KEY)
)


# =========================================================
# Groq Client
# =========================================================

groq_client = Groq(
    api_key=GROQ_API_KEY
)


# =========================================================
# Load ML Model
# =========================================================

model = joblib.load(
    "model.pkl"
)

feature_columns = joblib.load(
    "feature_columns.pkl"
)


# =========================================================
# Load Model Evaluation Metrics
# =========================================================

model_metrics = joblib.load(
    "model_metrics.pkl"
)


# =========================================================
# Feature Importance
# =========================================================

feature_importance = {}

if hasattr(
    model,
    "feature_importances_"
):

    feature_importance = {

        feature:
            round(
                float(importance),
                4
            )

        for feature, importance
        in zip(
            feature_columns,
            model.feature_importances_
        )

    }


# =========================================================
# ML MODEL INFORMATION
# =========================================================

@app.route(
    "/model-info",
    methods=["GET"]
)
def model_info():

    try:

        return jsonify({

            "model_loaded":
                True,

            "model_type":
                type(model).__name__,

            "number_of_features":
                len(feature_columns),

            "features":
                feature_columns,

            "metrics":
                model_metrics,

            "feature_importance":
                feature_importance

        })

    except Exception as e:

        print(
            "Model information error:",
            str(e)
        )

        return jsonify({

            "error":
                str(e)

        }), 500


# =========================================================
# Individual Student Prediction
# =========================================================

@app.route(
    "/predict",
    methods=["POST"]
)
def predict():

    try:

        # -------------------------------------------------
        # Get JSON Data
        # -------------------------------------------------

        data = request.get_json()

        if not data:

            return jsonify({

                "error":
                    "No data received"

            }), 400

        # -------------------------------------------------
        # Convert Input Into DataFrame
        # -------------------------------------------------

        input_df = pd.DataFrame(
            [data]
        )

        # -------------------------------------------------
        # Encode Categorical Values
        # -------------------------------------------------

        input_df = pd.get_dummies(
            input_df,
            drop_first=True
        )

        # -------------------------------------------------
        # Add Missing Columns
        # -------------------------------------------------

        for column in feature_columns:

            if column not in input_df.columns:

                input_df[column] = 0

        # -------------------------------------------------
        # Keep Same Feature Order
        # -------------------------------------------------

        input_df = input_df[
            feature_columns
        ]

        # -------------------------------------------------
        # Make Prediction
        # -------------------------------------------------

        prediction = model.predict(
            input_df
        )[0]

        predicted_score = round(
            float(prediction),
            2
        )

        # -------------------------------------------------
        # Return Prediction
        # -------------------------------------------------

        return jsonify({

            "predicted_score":
                predicted_score

        })

    except Exception as e:

        print(
            "Prediction error:",
            str(e)
        )

        return jsonify({

            "error":
                str(e)

        }), 400


# =========================================================
# Bulk CSV Prediction
# =========================================================

@app.route(
    "/predict-bulk",
    methods=["POST"]
)
def predict_bulk():

    try:

        # -------------------------------------------------
        # Check File
        # -------------------------------------------------

        if "file" not in request.files:

            return jsonify({

                "error":
                    "No file uploaded"

            }), 400

        file = request.files["file"]

        # -------------------------------------------------
        # Check Filename
        # -------------------------------------------------

        if file.filename == "":

            return jsonify({

                "error":
                    "No file selected"

            }), 400

        # -------------------------------------------------
        # Only CSV Supported
        # -------------------------------------------------

        if not file.filename.lower().endswith(
            ".csv"
        ):

            return jsonify({

                "error":
                    "Only CSV files are supported"

            }), 400

        # -------------------------------------------------
        # Read CSV
        # -------------------------------------------------

        df = pd.read_csv(
            file
        )

        if df.empty:

            return jsonify({

                "error":
                    "The uploaded CSV file is empty"

            }), 400

        results = []

        # -------------------------------------------------
        # Process Every Student
        # -------------------------------------------------

        for index, row in df.iterrows():

            student_data = row.to_dict()

            # -------------------------------------------------
            # Student Name
            # -------------------------------------------------

            student_name = student_data.get(
                "name",
                f"Student {index + 1}"
            )

            # -------------------------------------------------
            # Remove Name Before Prediction
            # -------------------------------------------------

            student_data.pop(
                "name",
                None
            )

            # -------------------------------------------------
            # Create DataFrame
            # -------------------------------------------------

            input_df = pd.DataFrame(
                [student_data]
            )

            # -------------------------------------------------
            # Encode Categorical Values
            # -------------------------------------------------

            input_df = pd.get_dummies(
                input_df,
                drop_first=True
            )

            # -------------------------------------------------
            # Add Missing Columns
            # -------------------------------------------------

            for column in feature_columns:

                if column not in input_df.columns:

                    input_df[column] = 0

            # -------------------------------------------------
            # Keep Correct Feature Order
            # -------------------------------------------------

            input_df = input_df[
                feature_columns
            ]

            # -------------------------------------------------
            # Make Prediction
            # -------------------------------------------------

            prediction = model.predict(
                input_df
            )[0]

            predicted_score = round(
                float(prediction),
                2
            )

            # -------------------------------------------------
            # Performance Classification
            # -------------------------------------------------

            if predicted_score >= 16:

                performance = "Excellent"

            elif predicted_score >= 12:

                performance = "Good"

            elif predicted_score >= 10:

                performance = "Average"

            else:

                performance = "At Risk"

            # -------------------------------------------------
            # Risk Classification
            # -------------------------------------------------

            if predicted_score >= 12:

                risk_level = "Low Risk"

            elif predicted_score >= 10:

                risk_level = "Moderate Risk"

            else:

                risk_level = "High Risk"

            # -------------------------------------------------
            # Recommendation
            # -------------------------------------------------

            if predicted_score >= 16:

                recommendation = (
                    "Maintain the current study routine, "
                    "continue regular revision, and focus "
                    "on advanced learning activities."
                )

            elif predicted_score >= 12:

                recommendation = (
                    "Maintain consistent study habits, "
                    "revise regularly, and practice weaker "
                    "subjects."
                )

            elif predicted_score >= 10:

                recommendation = (
                    "Increase study time, reduce unnecessary "
                    "absences, revise previous topics, and "
                    "provide additional academic support."
                )

            else:

                recommendation = (
                    "Immediate academic attention is recommended. "
                    "Consider a personalized study plan, tutoring, "
                    "regular monitoring, and focused intervention."
                )

            # -------------------------------------------------
            # Store Result
            # -------------------------------------------------

            results.append({

                "name":
                    student_name,

                "predicted_score":
                    predicted_score,

                "performance":
                    performance,

                "risk_level":
                    risk_level,

                "recommendation":
                    recommendation

            })

        # -------------------------------------------------
        # Return Bulk Results
        # -------------------------------------------------

        return jsonify({

            "message":
                "Bulk prediction successful",

            "total_students":
                len(results),

            "results":
                results

        })

    except Exception as e:

        print(
            "Bulk prediction error:",
            str(e)
        )

        return jsonify({

            "error":
                str(e)

        }), 400


# =========================================================
# AI CHAT - GROQ + SMART STUDENT CONTEXT
# + CONVERSATION MEMORY
# =========================================================

@app.route(
    "/chat",
    methods=["POST"]
)
def chat():

    try:

        # -------------------------------------------------
        # Get JSON Data
        # -------------------------------------------------

        data = request.get_json()

        if not data:

            return jsonify({

                "error":
                    "No data received"

            }), 400

        # -------------------------------------------------
        # Get User Message
        # -------------------------------------------------

        message = data.get(
            "message",
            ""
        ).strip()

        # -------------------------------------------------
        # Get Student Prediction Data
        # -------------------------------------------------

        prediction_data = data.get(
            "predictionData",
            []
        )

        # -------------------------------------------------
        # Get Conversation History
        # -------------------------------------------------

        conversation_history = data.get(
            "conversationHistory",
            []
        )

        # -------------------------------------------------
        # Validate Message
        # -------------------------------------------------

        if not message:

            return jsonify({

                "error":
                    "Message is required"

            }), 400

        # -------------------------------------------------
        # Validate Prediction Data
        # -------------------------------------------------

        if not isinstance(
            prediction_data,
            list
        ):

            prediction_data = []

        # -------------------------------------------------
        # Validate Conversation History
        # -------------------------------------------------

        if not isinstance(
            conversation_history,
            list
        ):

            conversation_history = []

        # -------------------------------------------------
        # Calculate Overall Statistics
        # -------------------------------------------------

        total_students = len(
            prediction_data
        )

        total_score = 0

        high_risk_students = []
        moderate_risk_students = []
        low_risk_students = []

        excellent_students = []
        good_students = []
        average_students = []
        at_risk_students = []

        # -------------------------------------------------
        # Process Student Data
        # -------------------------------------------------

        for student in prediction_data:

            try:

                score = float(
                    student.get(
                        "predicted_score",
                        0
                    ) or 0
                )

            except (
                ValueError,
                TypeError
            ):

                score = 0

            total_score += score

            risk = str(
                student.get(
                    "risk_level",
                    ""
                )
            )

            performance = str(
                student.get(
                    "performance",
                    ""
                )
            )

            # -------------------------------------------------
            # Risk Groups
            # -------------------------------------------------

            if risk == "High Risk":

                high_risk_students.append(
                    student
                )

            elif risk == "Moderate Risk":

                moderate_risk_students.append(
                    student
                )

            elif risk == "Low Risk":

                low_risk_students.append(
                    student
                )

            # -------------------------------------------------
            # Performance Groups
            # -------------------------------------------------

            if performance == "Excellent":

                excellent_students.append(
                    student
                )

            elif performance == "Good":

                good_students.append(
                    student
                )

            elif performance == "Average":

                average_students.append(
                    student
                )

            elif performance == "At Risk":

                at_risk_students.append(
                    student
                )

        # -------------------------------------------------
        # Calculate Average
        # -------------------------------------------------

        if total_students > 0:

            average_score = (
                total_score /
                total_students
            )

            average_performance = (
                average_score / 20
            ) * 100

        else:

            average_score = 0
            average_performance = 0

        # -------------------------------------------------
        # Current User Message
        # -------------------------------------------------

        lower_message = message.lower()

        # -------------------------------------------------
        # Detect Specific Student Name
        # -------------------------------------------------

        matching_students = []

        for student in prediction_data:

            student_name = str(
                student.get(
                    "name",
                    ""
                )
            ).strip()

            if not student_name:
                continue

            name_lower = student_name.lower()

            if name_lower in lower_message:

                matching_students.append(
                    student
                )

        # -------------------------------------------------
        # Detect User Intent
        # -------------------------------------------------

        asks_high_risk = (

            "high risk" in lower_message

            or "high-risk" in lower_message

            or "danger" in lower_message

            or "critical" in lower_message

            or "most risky" in lower_message

        )

        asks_moderate_risk = (

            "moderate risk" in lower_message

            or "moderate-risk" in lower_message

            or "medium risk" in lower_message

        )

        asks_low_risk = (

            "low risk" in lower_message

            or "safe students" in lower_message

        )

        asks_top_performers = (

            "top performer" in lower_message

            or "top performers" in lower_message

            or "best student" in lower_message

            or "best students" in lower_message

            or "highest score" in lower_message

            or "highest scores" in lower_message

            or "excellent student" in lower_message

            or "excellent students" in lower_message

        )

        asks_attention = (

            "need attention" in lower_message

            or "needs attention" in lower_message

            or "struggling" in lower_message

            or "struggling students" in lower_message

            or "weak students" in lower_message

            or "weak student" in lower_message

            or "students at risk" in lower_message

            or "at risk" in lower_message

            or "poor performance" in lower_message

        )

        asks_recommendation = (

            "recommendation" in lower_message

            or "recommendations" in lower_message

            or "what should i do" in lower_message

            or "what can i do" in lower_message

            or "how can i improve" in lower_message

            or "how to improve" in lower_message

            or "improvement" in lower_message

            or "study plan" in lower_message

            or "what should" in lower_message

        )

        asks_overall = (

            "overall performance" in lower_message

            or "average performance" in lower_message

            or "average score" in lower_message

            or "total students" in lower_message

            or "how many students" in lower_message

            or "class performance" in lower_message

            or "dataset summary" in lower_message

            or "summary" in lower_message

        )

        # -------------------------------------------------
        # Detect Follow-Up Questions
        # -------------------------------------------------

        asks_follow_up = (

            "them" in lower_message

            or "those students" in lower_message

            or "that student" in lower_message

            or "these students" in lower_message

            or "this student" in lower_message

            or "he " in lower_message

            or "she " in lower_message

            or "his " in lower_message

            or "her " in lower_message

            or "their " in lower_message

            or "they " in lower_message

        )

        # -------------------------------------------------
        # Build Basic Summary
        # -------------------------------------------------

        student_context = (

            "EDUAI STUDENT PERFORMANCE SUMMARY:\n"

            f"Total Students: "
            f"{total_students}\n"

            f"Average Score: "
            f"{average_score:.2f}/20\n"

            f"Average Performance: "
            f"{average_performance:.1f}%\n"

            f"High Risk Students: "
            f"{len(high_risk_students)}\n"

            f"Moderate Risk Students: "
            f"{len(moderate_risk_students)}\n"

            f"Low Risk Students: "
            f"{len(low_risk_students)}\n"

            f"Excellent Students: "
            f"{len(excellent_students)}\n"

            f"Good Students: "
            f"{len(good_students)}\n"

            f"Average Students: "
            f"{len(average_students)}\n"

            f"At Risk Students: "
            f"{len(at_risk_students)}\n"

        )

        # -------------------------------------------------
        # Select Relevant Students
        # -------------------------------------------------

        relevant_students = []

        if matching_students:

            relevant_students = (
                matching_students[:5]
            )

        elif asks_high_risk:

            relevant_students = (
                high_risk_students[:20]
            )

        elif asks_moderate_risk:

            relevant_students = (
                moderate_risk_students[:20]
            )

        elif asks_low_risk:

            relevant_students = (
                low_risk_students[:20]
            )

        elif asks_top_performers:

            relevant_students = (
                excellent_students[:20]
            )

        elif asks_attention:

            relevant_students = (

                high_risk_students[:10]

                +

                moderate_risk_students[:10]

            )

        elif asks_recommendation:

            relevant_students = (

                at_risk_students[:10]

                +

                average_students[:10]

                +

                moderate_risk_students[:10]

            )

        elif not asks_overall:

            relevant_students = (
                prediction_data[:20]
            )

        # -------------------------------------------------
        # Add Relevant Student Information
        # -------------------------------------------------

        if relevant_students:

            student_context += (
                "\nRELEVANT STUDENT INFORMATION:\n"
            )

            for index, student in enumerate(
                relevant_students
            ):

                name = student.get(
                    "name",
                    f"Student {index + 1}"
                )

                score = student.get(
                    "predicted_score",
                    "N/A"
                )

                performance = student.get(
                    "performance",
                    "N/A"
                )

                risk = student.get(
                    "risk_level",
                    "N/A"
                )

                recommendation = student.get(
                    "recommendation",
                    "N/A"
                )

                student_context += (

                    f"- Name: {name}\n"

                    f"  Score: {score}/20\n"

                    f"  Performance: "
                    f"{performance}\n"

                    f"  Risk: {risk}\n"

                    f"  Recommendation: "
                    f"{recommendation}\n"

                )

        # -------------------------------------------------
        # Add Conversation History
        # -------------------------------------------------

        history_text = ""

        if conversation_history:

            recent_history = (
                conversation_history[-10:]
            )

            history_text = (
                "\n\nRECENT CONVERSATION:\n"
            )

            for history_message in recent_history:

                role = history_message.get(
                    "role",
                    "user"
                )

                content = history_message.get(
                    "content",
                    ""
                )

                if not content:
                    continue

                content = str(content)[:1500]

                if role == "assistant":

                    history_text += (
                        f"EduAI: {content}\n"
                    )

                else:

                    history_text += (
                        f"User: {content}\n"
                    )

        # -------------------------------------------------
        # Follow-Up Context
        # -------------------------------------------------

        if (
            asks_follow_up
            and conversation_history
        ):

            student_context += (

                "\n\nIMPORTANT FOLLOW-UP CONTEXT:\n"

                "The user's current question may refer "
                "to students mentioned in the previous "
                "conversation. Use the recent conversation "
                "to resolve references such as 'them', "
                "'those students', 'that student', "
                "'these students', 'he', 'she', 'they', "
                "'his', 'her', or 'their'.\n"

            )

        # -------------------------------------------------
        # Combine Context
        # -------------------------------------------------

        full_context = (
            student_context +
            history_text
        )

        # -------------------------------------------------
        # Hard Context Limit
        # -------------------------------------------------

        MAX_CONTEXT_LENGTH = 18000

        if len(full_context) > MAX_CONTEXT_LENGTH:

            full_context = (

                full_context[
                    :MAX_CONTEXT_LENGTH
                ]

                +

                "\n[Some older context was "
                "omitted to keep the request small.]\n"

            )

        # -------------------------------------------------
        # No Data Message
        # -------------------------------------------------

        if total_students == 0:

            full_context += (

                "\nNo student prediction data "
                "is currently available.\n"

            )

        # -------------------------------------------------
        # System Instructions
        # -------------------------------------------------

        system_prompt = f"""

You are EduAI Assistant, an AI assistant
for a Student Performance Prediction System.

Your job is to help users understand
student performance data and provide
academic guidance.

IMPORTANT RULES:

1. Use ONLY the student information
   provided in the EduAI context.

2. Never invent student names, scores,
   statistics, performance levels,
   or risk levels.

3. When asked for counts, use the
   summary statistics provided.

4. When asked about high-risk students,
   use the provided high-risk student list.

5. When asked about moderate-risk students,
   use the provided moderate-risk student list.

6. When asked about low-risk students,
   use the provided low-risk student list.

7. When asked about top performers,
   use the provided excellent student list.

8. When asked about students needing
   attention, focus on High Risk and
   Moderate Risk students.

9. When asked about a specific student,
   only discuss that student if their
   information exists in the context.

10. When asked for recommendations,
    use the recommendations provided
    by the EduAI prediction system.

11. Do not invent a new ML prediction.

12. Do not change the student's predicted score.

13. Use the recent conversation to
    understand follow-up questions.

14. A user may refer to previously
    mentioned students using words such
    as "them", "those students",
    "these students", "that student",
    "this student", "they", "he", "she",
    "his", "her", or "their".

15. Resolve these references using
    the recent conversation whenever
    the meaning is clear.

16. Example:

    User:
    "Which students are at high risk?"

    Then:

    User:
    "What should I do for them?"

    In this case, "them" refers to the
    high-risk students mentioned in the
    previous conversation.

17. If the previous conversation does
    not provide enough information to
    resolve a reference, clearly say
    that you need the student name or
    more information.

18. Do not invent information that is
    not present in the context.

19. Keep answers simple, clear,
    and student-friendly.

20. You may calculate simple statistics
    from the provided data when needed.

21. Give practical academic guidance,
    but distinguish guidance from the
    actual ML prediction.

22. Do not claim to perform a new ML
    prediction inside the chat.

23. Prediction scores are generated
    by the EduAI ML model.

24. Do not repeat the entire dataset
    unless the user specifically asks
    for it.

Here is the current EduAI context:

{full_context}

"""

        # -------------------------------------------------
        # Send Request To Groq
        # -------------------------------------------------

        completion = (
            groq_client
            .chat
            .completions
            .create(

                model="openai/gpt-oss-120b",

                messages=[

                    {
                        "role":
                            "system",

                        "content":
                            system_prompt
                    },

                    {
                        "role":
                            "user",

                        "content":
                            message
                    }

                ],

                temperature=0.3,

                max_tokens=1000

            )
        )

        # -------------------------------------------------
        # Get AI Response
        # -------------------------------------------------

        response = (
            completion
            .choices[0]
            .message
            .content
        )

        # -------------------------------------------------
        # Return Response
        # -------------------------------------------------

        return jsonify({

            "response":
                response

        })

    except Exception as e:

        print(
            "AI Chat Error:",
            str(e)
        )

        return jsonify({

            "error":
                str(e)

        }), 500


# =========================================================
# Run Flask Server
# =========================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )
