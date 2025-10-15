from google.cloud import vision

def analyze_image(gcs_uri: str) -> dict:
    client = vision.ImageAnnotatorClient()
    image = vision.Image()
    image.source.image_uri = gcs_uri

    response = {}

    # 라벨 감지
    labels = client.label_detection(image=image).label_annotations
    response["labels"] = [
        {"description": l.description, "score": l.score}
        for l in labels
    ]

    # 텍스트 감지
    texts = client.text_detection(image=image).text_annotations
    response["texts"] = [t.description for t in texts]

    # 객체 감지
    objects = client.object_localization(image=image).localized_object_annotations
    response["objects"] = [
        {
            "name": o.name,
            "score": o.score,
            "bbox": [
                {"x": v.x, "y": v.y}
                for v in o.bounding_poly.normalized_vertices
            ]
        }
        for o in objects
    ]

    return response