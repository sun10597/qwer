def parse_video_result(video_result: dict) -> dict:
    return {
        "shots": video_result.get("shotAnnotations", []),
        "speech": video_result.get("speechTranscriptions", []),
        "segment_labels": video_result.get("segmentLabels", []),
        "frame_labels": video_result.get("frameLabels", []),
        "objects": video_result.get("objectAnnotations", []),
        "faces": video_result.get("faceAnnotations", []),
        "logos": video_result.get("logoAnnotations", []),
    }


def parse_image_result(image_result: dict) -> dict:
    return {
        "labels": image_result.get("labels", []),
        "texts": image_result.get("texts", []),
        "objects": image_result.get("objects", []),
    }