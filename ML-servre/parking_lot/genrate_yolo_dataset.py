import os
import json
from tqdm import tqdm

def convert_coco_to_yolo(coco_json_path, images_dir, output_labels_dir):

    os.makedirs(output_labels_dir, exist_ok=True)

    with open(coco_json_path, "r") as f:
        coco = json.load(f)

    category_map = {cat["id"]: i for i, cat in enumerate(coco["categories"])}

    for img in tqdm(coco["images"], desc=f"Converting {coco_json_path}"):
        img_id = img["id"]
        img_name = img["file_name"]
        img_width = img["width"]
        img_height = img["height"]

        label_file = os.path.join(output_labels_dir, f"{os.path.splitext(img_name)[0]}.txt")

        with open(label_file, "w") as lf:
            for ann in coco["annotations"]:
                if ann["image_id"] == img_id:
                    x, y, w, h = ann["bbox"]
                    x_center = (x + w / 2) / img_width
                    y_center = (y + h / 2) / img_height
                    w /= img_width
                    h /= img_height
                    class_id = category_map[ann["category_id"]]
                    lf.write(f"{class_id} {x_center} {y_center} {w} {h}\n")


dataset_root = "./datasets"

splits = ["train", "val", "test"]

for split in splits:
    coco_json_path = os.path.join(dataset_root, "images", split, "_annotations.coco.json")
    images_dir = os.path.join(dataset_root, "images", split)
    labels_dir = os.path.join(dataset_root, "labels", split)
    
    convert_coco_to_yolo(coco_json_path, images_dir, labels_dir)