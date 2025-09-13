import cv2
from ultralytics import YOLO

model = YOLO("./yolov8_custom.pt")

cap = cv2.VideoCapture('CCTV video of Robbery at an apartment complex parking lot.mp4')

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break  

    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB) 
    frame = cv2.resize(frame, (640, 640)) 

    results = model(frame, verbose=True, device="cpu")

    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0]) 
            conf = box.conf[0].item()  
            cls = int(box.cls[0].item())
            label = f"{model.names[cls]}: {conf:.2f}"

            if cls == 0:
                use = (255, 0, 0)
            elif cls == 1:
                use = (0, 255, 0)
            else:
                use = (0, 0, 255)

            cv2.rectangle(frame, (x1, y1), (x2, y2), use, 2)
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, use, 2)

    cv2.imshow("YOLOv8 Live Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
