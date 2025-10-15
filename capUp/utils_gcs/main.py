import json
from file_utils import check_file_type, extract_audio
from whisper_utils import transcribe_whisper
from gcs_upload import upload_to_gcs
from video import analyze_video
from vision import analyze_image
from parsing import parse_video_result, parse_image_result

BUCKET_NAME = ""  # GCS 버킷 이름으로 변경

def process_file(local_path: str):

    # 확장자 판별
    file_type = check_file_type(local_path)

    # 파일 업로드
    gcs_uri = upload_to_gcs(local_path, BUCKET_NAME, "test")

    if file_type == "video":

        #오디오 추출
        audio_path = extract_audio(local_path, "temp.wav")

        raw_result = analyze_video(gcs_uri)

        # whisper로 STT 추출
        whisper_stt = transcribe_whisper(audio_path, language=None, model_size="medium")
        raw_result["speechTranscriptions"] = whisper_stt

        parsed_result = parse_video_result(raw_result)

    elif file_type == "image":
        raw_result = analyze_image(gcs_uri)
        parsed_result = parse_image_result(raw_result)

    else:
        raise ValueError("지원하지 않는 파일 형식")

    with open("raw_result.json", "w", encoding="utf-8") as f:
        json.dump(raw_result, f, ensure_ascii=False, indent=2)

    with open("parsed_result.json", "w", encoding="utf-8") as f:
        json.dump(parsed_result, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    local_file = ""  # 로컬 파일 경로 지정
    process_file(local_file)