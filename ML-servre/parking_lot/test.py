from ultralytics import YOLO
import cv2

model = YOLO("./yolov8_custom.pt")

img = cv2.imread("datasets/images/test/2012-09-18_15_10_11_jpg.rf.66a439b06d6b6f2ca9768282f075e366.jpg") 
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  
img = cv2.resize(img, (640, 640))

results = model(img, verbose=True, device='cpu')

class_counts = {}
 
for result in results:
    for box in result.boxes:
        cls = int(box.cls)
        class_counts[cls] = class_counts.get(cls, 0) + 1

# print(class_counts)

while True:
    for box in results[0].boxes:
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

        cv2.rectangle(img, (x1, y1), (x2, y2), use, 2)
        cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, use, 2)

        cv2.imshow("YOLOv8 Live Detection", img)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cv2.destroyAllWindows()

