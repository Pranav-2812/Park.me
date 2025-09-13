from tensorflow.keras.models import load_model
from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import numpy as np
import tensorflow as tf
from flask_cors import CORS
# import holidays
from joblib import load
import os
from flask_socketio import SocketIO
import cv2
from ultralytics import YOLO
import time
import threading

loaded_ct = load('./models/column_transformer.joblib')

server = Flask(__name__)
CORS(server)
socketio = SocketIO(server, cors_allowed_origins="*")

class_counts = {}

server.debug = True

ann = load_model('./models/model.keras')

MODEL_PATH = "./models/yolov8_custom.pt"
VIDEO_FOLDER = "./videos"

detection_data = {}

class YOLOPredictor:
    def __init__(self, model_path):
        """Load YOLO model."""
        self.model = YOLO(model_path)
        self.video_streams = {}

    def load_videos(self):
        """Load video files into OpenCV streams."""
        for video_file in os.listdir(VIDEO_FOLDER):
            if video_file.endswith((".mp4", ".avi", ".mov")):
                video_path = os.path.join(VIDEO_FOLDER, video_file)
                if video_file not in self.video_streams:
                    self.video_streams[video_file] = cv2.VideoCapture(video_path)

    def predict(self):
        while True:
            for video_name, cap in self.video_streams.items():
                ret, frame = cap.read()
                if not ret:
                    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    continue
                results = self.model(frame)

                detections = self.process_predictions(results)

                detection_data[video_name] = detections

                socketio.emit("update", detection_data)

            time.sleep(1)

    def process_predictions(self, results):
        detected_objects = []
        for result in results:
            for box in result.boxes.data:
                x1, y1, x2, y2, confidence, class_id = box.tolist()
                if confidence > 0.5:
                    detected_objects.append({
                        "class": int(class_id),
                        "confidence": float(confidence),
                        "bbox": [int(x1), int(y1), int(x2 - x1), int(y2 - y1)]
                    })
        return detected_objects


tier_I_cities = [
    "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", 
    "Kolkata", "Ahmedabad", "Pune", "Surat", "Jaipur"
]

tier_II_cities = [
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Coimbatore", 
    "Bhopal", "Visakhapatnam", "Vadodara", "Patna", "Ludhiana", 
    "Jaipur", "Chandigarh", "Kochi", "Surat", "Pune", 
    "Ahmedabad", "Hyderabad", "Chennai", "Kolkata", "Bangalore", 
    "Delhi", "Mumbai", "Agra", "Ajmer", "Aligarh", 
    "Amravati", "Amritsar", "Asansol", "Aurangabad", "Bareilly", 
    "Belgaum", "Bhavnagar", "Bhiwandi", "Bhopal", "Bhubaneswar", 
    "Bikaner", "Bilaspur", "Bokaro Steel City", "Chandigarh", 
    "Coimbatore", "Cuttack", "Dehradun", "Dhanbad", "Durgapur", 
    "Faridabad", "Firozabad", "Ghaziabad", "Gwalior", "Gurgaon", 
    "Guwahati", "Guntur", "Gwalior", "Hubli-Dharwad", "Indore", 
    "Jabalpur", "Jalandhar", "Jalgaon", "Jammu", "Jamshedpur", 
    "Jhansi", "Jodhpur", "Kakinada", "Kanpur", "Kochi", 
    "Kohima", "Kolkata", "Kolhapur", "Kozhikode", "Kurnool", 
    "Lucknow", "Ludhiana", "Madurai", "Mangalore", "Mathura", 
    "Meerut", "Moradabad", "Mysore", "Nagpur", "Nanded", 
    "Nashik", "Nellore", "Noida", "Patna", "Pondicherry", 
    "Prayagraj", "Raipur", "Rajkot", "Rajamahendravaram", 
    "Ranchi", "Rourkela", "Salem", "Sangli", "Shimla", 
    "Siliguri", "Solapur", "Srinagar", "Surat", "Thiruvananthapuram", 
    "Tiruchirappalli", "Vadodara"
]

def extract_date_info(time_str):
    try:
        dt = datetime.fromisoformat(time_str)
    except ValueError:
        print(f"Invalid datetime string: {time_str}")
        return {}

    day = dt.strftime("%A")
    
    # in_india = holidays.IN()
    # is_holiday = dt.date() in in_india

    # upcoming_festivals = [
    #     (datetime(dt.year, 10, 27), "Diwali")
    # ]
    # upcoming_festival = None
    # for festival_date, festival_name in upcoming_festivals:
    #     if festival_date - dt >= timedelta(days=0) and festival_date - dt <= timedelta(days=7):
    #         upcoming_festival = festival_name
    #         break

    start_time = dt.replace(minute=0, second=0, microsecond=0)
    end_time = start_time + timedelta(hours=24)
    time_slots = []
    current_time = start_time
    while current_time < end_time:
        time_slots.append(current_time.strftime("%H:%M"))
        current_time += timedelta(minutes=30)

    # return {
    #     "day": day,
    #     "is_holiday": is_holiday,
    #     "upcoming_festival": upcoming_festival,
    #     "time_slots": time_slots,
    # }

    return {
        "day": day,
        "time_slots": time_slots[0]
    }

yolo = YOLOPredictor(MODEL_PATH)
yolo.load_videos()
# threading.Thread(target=yolo.predict, daemon=True).start()

@server.route('/demand/ratio', methods=['POST'])
def demand_ratio():
    data = request.get_json()

    try:
        date = data['date']
        date_data = extract_date_info(date)
        day = date_data['day']
        # time_slot = date_data['time_slots']
        time_slot = '21:30-22:00'
        is_festival = 'No'
        # is_holiday = date_data['is_holiday']
        is_holiday = 'No'
        location_type = data['location_type']
        city_name = data['city']
        if city_name in tier_I_cities :
            city_type = 'Tier I'
        elif city_name in tier_II_cities:
            city_type = 'Tier II'
        else :
            city_type = 'Tier III'
        near_by = data['near_by']
        # is_festival_around = date_data['upcoming_festival']
        is_festival_around = 'No'

        input_data = [[day, time_slot, is_festival, is_holiday, location_type, city_type, near_by, is_festival_around]]
   
        input_data = loaded_ct.transform(input_data)
 
        prediction = ann.predict(input_data)

        return jsonify({"prediction" : int(prediction[0][0] * 100)}), 200

    except (ValueError, TypeError) as e:
        return jsonify({"error": str(e)}), 400 
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred."}), 500
    

@server.route('/land/classifier', methods=['POST'])
def land_classifier():
    try : 
        file =  request.files['file']

        path = os.path.join('./uploads', file.filename)

        file.save(path)

        relative_path = os.path.relpath(path, start=os.getcwd())

        if file :
            cnn = tf.keras.models.load_model('./model-land.keras')

            test_image = tf.keras.preprocessing.image.load_img(
                relative_path,
                target_size = (224, 224)
            )

            test_image = tf.keras.preprocessing.image.img_to_array(test_image)

            test_image = np.expand_dims(test_image, axis = 0)

            result = cnn.predict(test_image)

            if result[0][0] == 0:
                prediction = 'Barren Land Image'
            elif result[0][0] == 1:
                prediction = 'fabricated_data_imgs'
            elif result[0][0] == 2:
                prediction = 'road side'
            elif result[0][0] == 3:
                prediction = 'stoone land'
            else :
                prediction = 'None'

            return jsonify({"prediction" : prediction})

    except (ValueError, TypeError) as e:
        return jsonify({"error": str(e)}), 400 
    except Exception as e:
        return jsonify({"error": "An unexpected  occurred."}), 500


@socketio.on("connect")
def handle_connect():
    socketio.start_background_task(target=yolo.predict)
    socketio.emit("update", detection_data)

if __name__ == "__main__" :
    socketio.run(server, host='0.0.0.0', port=8080, debug=True)