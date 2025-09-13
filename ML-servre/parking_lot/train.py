from ultralytics import YOLO
import shutil

model = YOLO("yolov8n.pt")

model.train(data="./datasets/data.yaml", epochs=1, imgsz=640, batch=4, device='cpu')

shutil.copy("runs/detect/train/weights/best.pt", "yolov8_custom.pt")

results = model("./datasets/images/test/2012-09-13_12_40_23_jpg.rf.e2e788b7bb9853a92ca3b55dae7a17cd.jpg")
# results.show()
# results.save("./output.jpg")

