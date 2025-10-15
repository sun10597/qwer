from google.cloud import videointelligence_v1 as vi


# 응답의 시간 타입 통일
def _to_seconds(ts) -> float | None:
    if ts is None:
        return None
    if hasattr(ts, "total_seconds"):
        return ts.total_seconds()
    sec = getattr(ts, "seconds", None)
    nanos = getattr(ts, "nanos", None)
    if sec is None and nanos is None:
        return None
    return (sec or 0) + (nanos or 0) / 1e9

def analyze_video(gcs_uri: str ) -> dict:
    # 클라이언트 호출
    client = vi.VideoIntelligenceServiceClient()

    # 분석할 features 구성
    features = [
        vi.Feature.LABEL_DETECTION,     # 라벨 탐지
        vi.Feature.SHOT_CHANGE_DETECTION,   # 샷 전환
        vi.Feature.OBJECT_TRACKING,     # 객체추적
    ]

    label_config = vi.LabelDetectionConfig(
        label_detection_mode=vi.LabelDetectionMode.SHOT_AND_FRAME_MODE,
        stationary_camera=False,    # 카메라 고정 시점 시 True
    )

    video_context = vi.VideoContext(
        label_detection_config=label_config,
    )

    # 비동기 처리
    op = client.annotate_video(
        request={"features": features, "input_uri": gcs_uri, "video_context": video_context}
    )

    result = op.result(timeout=1200)  # 넉넉히
    response: dict = {
        "shotAnnotations": [],
        "speechTranscriptions": [],
        "segmentLabels": [],
        "frameLabels": [],
        "objectAnnotations": [],
    }

    for ar in result.annotation_results:    # 분석을 초 단위로 변환
        shots = []
        for s in ar.shot_annotations:
            st = _to_seconds(s.start_time_offset) or 0.0
            et = _to_seconds(s.end_time_offset) or st
            shots.append({"start": round(st, 3), "end": round(et, 3)})
        response["shotAnnotations"].extend(shots)

        # 세그먼트 단위 라벨
        for label in ar.segment_label_annotations:
            for seg in label.segments:
                st = _to_seconds(seg.segment.start_time_offset) or 0.0
                et = _to_seconds(seg.segment.end_time_offset) or st
                response["segmentLabels"].append({
                    "description": label.entity.description,
                    "confidence": seg.confidence if seg.confidence is not None else None,
                    "start": round(st, 3),
                    "end": round(et, 3),
                })

        # 프레임 단위 라벨
        for label in ar.frame_label_annotations:
            for fr in label.frames:
                t = _to_seconds(fr.time_offset)
                response["frameLabels"].append({
                    "description": label.entity.description,
                    "confidence": fr.confidence if fr.confidence is not None else None,
                    "time": round(t, 3) if t is not None else None,
                })

        # 객체 추적 (1초당 1개의 객체 추적)
        for obj in ar.object_annotations:
            st = _to_seconds(obj.segment.start_time_offset) or 0.0
            et = _to_seconds(obj.segment.end_time_offset) or st
            frames_summarized = []

            for i, f in enumerate(obj.frames):
                if i % 30 != 0:
                    continue
                t = _to_seconds(f.time_offset)
                bb = f.normalized_bounding_box
                frames_summarized.append({
                    "time": round(t, 3) if t is not None else None,
                    "box": {"left": bb.left, "top": bb.top, "right": bb.right, "bottom": bb.bottom},
                })

            response["objectAnnotations"].append({
                "description": obj.entity.description,
                "confidence": obj.confidence if obj.confidence is not None else None,
                "segment": {"start": round(st, 3), "end": round(et, 3)},
                "frames_sampled": frames_summarized,
            })

    return response