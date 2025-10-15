import json
import os
from moviepy.editor import (
    VideoFileClip, AudioFileClip, ImageClip, TextClip,
    CompositeVideoClip, CompositeAudioClip, vfx
)


def render_shorts_from_timeline(
    timeline_json: dict,
    output_path: str = "output.mp4",
    resolution=(1080, 1920),
    fps: int = 30,
    font: str = "NanumGothic",   # 시스템에 설치된 한글 폰트
    instruction: str = None,
):
    """
    Timeline JSON을 받아 최종 쇼츠 mp4 영상으로 합성
    - 영상/이미지 해상도 통일 (기본: 1080x1920)
    - 오디오 여러 개면 CompositeAudioClip으로 믹싱
    - 자막 반투명 배경 포함 + 한국어 폰트 지정
    - 타임라인 정렬로 안정적 처리
    - 메모리 해제 고려
    """

    
    

    clips = []
    audio_tracks = []

    # 타임라인 정렬 (시작시간 기준)
    sorted_items = sorted(timeline_json["timeline"], key=lambda x: float(x["start"]))

    for item in sorted_items:
        t = item["type"]
        start, end = float(item["start"]), float(item["end"])
        duration = max(0.1, end - start)  # duration 최소값 보장

        # --- Video ---
        if t == "video" and item.get("filename"):
            clip = VideoFileClip(item["filename"]).subclip(start, end)
            clip = clip.resize(resolution)
            clip = clip.set_start(start).crossfadein(0.2)  # 전환 효과
            clips.append(clip)

        # --- Image ---
        elif t == "image" and item.get("filename"):
            img = ImageClip(item["filename"], duration=duration).resize(resolution)
            pos = (item.get("position", {}).get("x", "center"),
                   item.get("position", {}).get("y", "center"))
            img = img.set_start(start).set_pos(pos).crossfadein(0.3)
            clips.append(img)

        # --- Subtitle ---
        elif t == "subtitle" and item.get("text"):
            txt = TextClip(
                item["text"],
                fontsize=48,
                font=font,
                color="white",
                size=(800, 120),
                method="caption"
            )
            # 반투명 배경 추가
            txt = txt.on_color(
                size=(820, 140), color=(0, 0, 0), col_opacity=0.6
            )

            pos = (item.get("position", {}).get("x", "center"),
                   item.get("position", {}).get("y", "bottom"))

            txt_clip = txt.set_duration(duration).set_start(start).set_pos(pos).crossfadein(0.3)
            clips.append(txt_clip)

        # --- Audio ---
        elif t == "audio" and item.get("filename"):
            aud = AudioFileClip(item["filename"]).subclip(start, end)
            audio_tracks.append(aud.set_start(start))

    # 영상 합치기
    if clips:
        video = CompositeVideoClip(clips, size=resolution)
    else:
        raise ValueError("타임라인에 video/image/subtitle이 없음")

    # 오디오 합치기
    if audio_tracks:
        final_audio = CompositeAudioClip(audio_tracks)
        video = video.set_audio(final_audio)

    #  최종 출력 (속도 최적화 preset 포함)
    video.write_videofile(
        output_path,
        codec="libx264",
        audio_codec="aac",
        fps=fps,
        preset="fast",
        threads=4
    )

    #  자원 해제
    for c in clips:
        c.close()
    if audio_tracks:
        for a in audio_tracks:
            a.close()
    video.close()


# movie.py 직접 실행 시 데모
if __name__ == "__main__":
    with open("timeline.json", "r", encoding="utf-8") as f:
        timeline_json = json.load(f)

    render_shorts_from_timeline(timeline_json, "final_shorts.mp4")


