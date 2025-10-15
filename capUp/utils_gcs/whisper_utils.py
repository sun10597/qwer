# whisper_utils.py
from typing import List, Dict, Any, Optional
from faster_whisper import WhisperModel

def transcribe_whisper(
    audio_path: str,
    language: Optional[str] = None,
    model_size: str = "medium",
    device: str = "auto",          
    compute_type: str = "int8",      # GPU면 "float16", CPU면 "int8"
    vad_filter: bool = True,
) -> List[Dict[str, Any]]:
    model = WhisperModel(model_size, device=device, compute_type=compute_type)

    segments, info = model.transcribe(
        audio_path,
        language=language,
        vad_filter=vad_filter,
        word_timestamps=True,
    )

    words = []
    texts = []
    for seg in segments:
        if seg.text:
            texts.append(seg.text.strip())
        for w in seg.words or []:
            words.append({
                "word": w.word,
                "start": round(float(w.start), 3) if w.start is not None else None,
                "end":   round(float(w.end),   3) if w.end   is not None else None,
            })

    return [{
        "alternatives": [{
            "transcript": " ".join(texts).strip(),
            "confidence": None, 
            "words": words,
        }]
    }]