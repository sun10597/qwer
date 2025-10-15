import os, json, math
from typing import List, Literal, Optional
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda, RunnablePassthrough, RunnableParallel



# ---------------------------
# Pydantic Schemas
# ---------------------------
class SceneItem(BaseModel):
    scene_id: int
    summary: str
    highlight: str

class ScenesOutput(BaseModel):
    scenes: List[SceneItem] = Field(default_factory=list)

class StoryIdeaOutput(BaseModel):
    tone: str
    opening: str
    development: str
    closing: str
    key_message: str
    opening_sec: int
    development_sec: int
    closing_sec: int
    target_subjects: List[str]        # 홍보 주 대상
    image_ratio: float                # 이미지 컷 비율 (0~1)
    video_ratio: float                # 영상 컷 비율 (0~1)

class Position(BaseModel):
    x: int
    y: int

class Size(BaseModel):
    width: int
    height: int

class TimelineItem(BaseModel):
    type: Literal["video","subtitle","image","audio"]
    filename: Optional[str] = None
    text: Optional[str] = None
    start: float
    end: float
    position: Optional[Position] = None
    size: Optional[Size] = None

class StorylineOutput(BaseModel):
    story_summary: str
    story_flow: List[str]

class TimelineOutput(BaseModel):
    story_summary: str
    timeline: List[TimelineItem]

# ---------------------------
# Helpers
# ---------------------------
def split_duration(total: int) -> dict:
    # 기본 20% / 60% / 20% 비율, 반올림 보정
    op = max(2, round(total * 0.2))
    cl = max(2, round(total * 0.2))
    dev = max(5, total - op - cl)
    # 총합 보정
    diff = total - (op + dev + cl)
    if diff != 0:
        dev += diff
    return {"opening_sec": op, "development_sec": dev, "closing_sec": cl}

def to_json(obj) -> str:
    """
    Pydantic v2 호환 JSON 직렬화.
    - BaseModel이면 model_dump() 후 json.dumps(ensure_ascii=False)
    - 그 외엔 json.dumps 시도
    """
    if hasattr(obj, "model_dump"):
        return json.dumps(obj.model_dump(), ensure_ascii=False)
    try:
        return json.dumps(obj, ensure_ascii=False)
    except TypeError:
        # 혹시 직렬화 불가 객체가 섞여 있으면 문자열로 강제
        return str(obj)

def scenes_to_json(scenes_out) -> str:
    """
    ScenesOutput -> JSON 문자열
    """
    if hasattr(scenes_out, "scenes"):
        items = []
        for s in scenes_out.scenes:
            if hasattr(s, "model_dump"):
                items.append(s.model_dump())
            else:
                items.append(s)
        return json.dumps(items, ensure_ascii=False)
    # 혹시 타입이 다르면 최대한 안전하게
    if hasattr(scenes_out, "model_dump"):
        return json.dumps(scenes_out.model_dump(), ensure_ascii=False)
    return json.dumps(scenes_out, ensure_ascii=False)

def ensure_timeline_constraints(tl: TimelineOutput, analysis_json: dict, total: int) -> TimelineOutput:
    types_present = set([item.type for item in tl.timeline])

    # 1) video 길이 보정
    for item in tl.timeline:
        if item.type == "video":
            d = item.end - item.start
            if d < 3.0:
                item.end = item.start + 3.0
            elif d > 7.0:
                item.end = item.start + 7.0

    # 2) 필수 타입 보강
    def first_image():
        imgs = analysis_json.get("images", [])
        return imgs[0]["filename"] if imgs else None

    def first_audio():
        auds = analysis_json.get("audio", [])
        return auds[0]["filename"] if auds else None

    current_end = 0.0
    if tl.timeline:
        current_end = max([it.end for it in tl.timeline])

    if "image" not in types_present:
        img = first_image()
        if img:
            tl.timeline.append(TimelineItem(
                type="image",
                filename=img,
                start=max(0.0, current_end - 3.0) if current_end else 0.0,
                end=max(3.0, current_end) if current_end else 3.0,
                position=Position(x=100, y=100),
                size=Size(width=600, height=600)
            ))

    if "audio" not in types_present:
        aud = first_audio()
        if aud:
            tl.timeline.append(TimelineItem(
                type="audio",
                filename=aud,
                start=0.0,
                end=float(total)
            ))

    # 3) 전체 길이 컷
    tl.timeline.sort(key=lambda x: (x.start, x.end))
    for it in tl.timeline:
        if it.start > total:
            it.start = float(total - 0.1)
        if it.end > total:
            it.end = float(total)

    return tl


def adjust_timeline_length(tl: TimelineOutput, analysis_json: dict, duration: int, storyline: StorylineOutput, llm) -> TimelineOutput:
    # 현재 총 길이
    total_length = sum([it.end - it.start for it in tl.timeline if it.type in ["video", "image", "subtitle"]])

    if total_length < duration - 2:  # 2초 이상 모자라면
        prompt = f"""
        현재 타임라인 총 길이는 {total_length}초이지만, 목표는 {duration}초입니다.
        아래 스토리라인과 분석 JSON을 참고하여 timeline에 적절한 장면을 추가하거나 자막/이미지를 늘려 보강하세요.

        [스토리라인]
        {to_json(storyline)}

        [분석 JSON 일부]
        {json.dumps(analysis_json.get("segments", [])[:5], ensure_ascii=False)}

        반드시 TimelineOutput 스키마를 지키고, 기존 timeline 뒤에 자연스럽게 이어 붙여라.
        """
        fixer_llm = base_llm.with_structured_output(TimelineOutput)
        new_tl = fixer_llm.invoke(prompt)
        return new_tl

    elif total_length > duration + 2:  # 2초 이상 초과하면 컷
        # 기존 보정 로직 활용
        return ensure_timeline_constraints(tl, analysis_json, duration)

    return tl

# ===========================
# Fun Engagement Evaluation Schemas
# ===========================
class FunDimension(BaseModel):
    score: int                 # 0~5
    reason: str                # 짧은 이유
    suggestions: List[str]     # 개선 아이디어 1~3개 권장

class WeakSpot(BaseModel):
    start: float
    end: float
    issue: str                 # 예: "훅 약함", "정보 과다", "리듬 저하"

class FunEvaluation(BaseModel):
    overall_score: int         # 0~5
    verdict: Literal["pass","borderline","fail"]
    hook_strength: FunDimension          # 0~3초
    pacing: FunDimension
    novelty: FunDimension
    clarity: FunDimension
    emotional_impact: FunDimension
    cta_effectiveness: FunDimension
    visual_variety: FunDimension
    sound_alignment: FunDimension
    weak_spots: List[WeakSpot] = Field(default_factory=list)   # 약점 구간
    top_actions: List[str]     # 지금 당장 적용할 상위 3가지 액션

# ===========================
# Punch up (타임라인 개편)
# ===========================
def punch_up_timeline(
    tl: TimelineOutput,
    storyline: StorylineOutput,
    story_idea: StoryIdeaOutput,
    analysis_json: dict,
    duration: int,
    eval_result: FunEvaluation,
    llm
) -> TimelineOutput:
    """
    재미 평점이 낮거나 verdict가 fail/borderline이면:
    - 0~3초 훅 강화 (반전/질문/숫자/급컷)
    - pacing 개선 (짧은 클립, 불필요 자막 삭제)
    - novelty/visual_variety 보강 (슬라이드/브롤/로고/팀컷 적절 믹스)
    - CTA 명확화
    를 반영해 타임라인을 재구성.
    """
    prompt = f"""
    현재 타임라인의 재미 평가 결과(요약):
    - overall_score={eval_result.overall_score}, verdict={eval_result.verdict}
    - top_actions: {eval_result.top_actions}
    - weak_spots: {to_json([w.model_dump() for w in eval_result.weak_spots])}

    스토리라인:
    {to_json(storyline)}

    스토리 기획(톤/타겟/비율):
    {to_json(story_idea)}

    분석 JSON(일부 segments):
    {json.dumps(analysis_json.get("segments", [])[:8], ensure_ascii=False)}

    지시사항:
    1) 0~3초에 강한 훅을 만든다 (질문/숫자/반전/강조 텍스트 중 택1 이상)
    2) pacing을 개선: video는 3~6초, 지루한 구간은 과감히 컷
    3) novelty/visual_variety를 높이기 위해 slides_demo, office_broll, team_collab 소스를 균형 배치
    4) CTA(구독/더보기 등)를 마지막 1~2초에 명확히 제시 (subtitle)
    5) story_idea.image_ratio / video_ratio를 근사하게 맞춘다
    6) 반드시 TimelineOutput 스키마를 출력한다 (story_summary + timeline)

    참고(현재 타임라인):
    {to_json(tl)}

    출력: TimelineOutput JSON만
    """
    fixer_llm = llm.with_structured_output(TimelineOutput)
    improved = fixer_llm.invoke(prompt)
    return improved


# ---------------------------
# LLMs OUTPUT PARSER 지정
# ---------------------------
base_llm = ChatOpenAI(model="gpt-4o",
                      temperature=0,)

scene_llm = base_llm.with_structured_output(ScenesOutput)
story_llm = base_llm.with_structured_output(StoryIdeaOutput)
storyline_llm = base_llm.with_structured_output(StorylineOutput)
timeline_llm = base_llm.with_structured_output(TimelineOutput)

# ---------------------------
# Prompts
# ---------------------------


# 1단계 scene 분석
scene_prompt = ChatPromptTemplate.from_messages([
    ("system", "너는 영상 장면 분석가다. 반드시 지정된 스키마에 맞는 JSON만 출력한다."),
    ("user", """아래 분석 JSON의 segment들을 간결히 요약해서 scenes 배열로 만들어라.

입력 JSON:
{analysis_json}

필수 규칙:
- 각 segment마다 scene_id(1부터), summary, highlight를 채운다.
- JSON 이외 텍스트 금지.
- 출력 스키마: {{ "scenes": [{{"scene_id":1,"summary":"...","highlight":"..."}}] }}
""")
])


# 2단계 story idea (주 대상 판별 추가)
story_prompt = ChatPromptTemplate.from_messages([
    ("system", "너는 유튜브 쇼츠 시나리오 기획자다. 반드시 지정된 스키마에 맞는 JSON만 출력한다."),
    ("user", """아래 장면 요약을 참고해 전체 스토리 기획을 만들어라.

[장면 요약(JSON 배열)]
{scenes_json}

조건:
- 톤(tone)을 명시
- 오프닝/전개/클로징 각각 핵심을 1~2문장으로
- 핵심 메시지(key_message)를 1문장으로
- 홍보의 주요 대상(인물, 물체, 장소)을 추출해 target_subjects 배열로 추가
- 영상 총 길이: {duration}초
- 분할: opening_sec={opening_sec}, development_sec={development_sec}, closing_sec={closing_sec}
- 사진/영상 분량 비율: image_ratio=0.3, video_ratio=0.7 (합=1.0)

JSON 이외 텍스트 금지.
""")
])

# 3단계: storyline
storyline_prompt = ChatPromptTemplate.from_messages([
    ("system", "너는 시나리오 작가다. 지정된 스키마에 맞는 JSON만 출력한다."),
    ("user", """아래 정보를 바탕으로 전체 스토리 요약과 흐름을 만들어라.

[장면 요약(JSON 배열)]
{scenes_json}

[스토리 기획안(JSON)]
{story_idea_json}

출력은 story_summary(1~2문장)와 story_flow(오프닝/전개/클로징 단계 핵심 배열)만 포함.
자막은 한국어로 제작.
JSON 이외 텍스트 금지.
""")
])

# 4단계 timeline (우선배치 추가)
timeline_prompt = ChatPromptTemplate.from_messages([
    ("system", "너는 유튜브 쇼츠 편집자다. 반드시 지정된 스키마에 맞는 JSON만 출력한다."),
    ("user", """아래 입력을 바탕으로 최종 타임라인을 만들어라.

[입력 JSON]
{analysis_json}

[스토리 요약 & 흐름(JSON)]
{storyline_json}

필수 조건:
1) 최종 영상 길이: {duration}초
2) timeline에는 video, subtitle, image, audio가 최소 1개 이상 포함
3) video segment는 3~7초 이내로 자를 것
4) 오프닝은 장소/브랜드 이미지 컷을 우선 사용
5) 전개는 인터뷰/슬라이드 등 영상 클립을 위주로 사용
6) 클로징은 팀 단체사진/로고 이미지와 핵심 메시지를 사용
7) 전체 시간에서 이미지컷은 약 {image_ratio} 비율, 영상컷은 {video_ratio} 비율이 되도록 분량 조절
8) 모든 필드는 반드시 채워라. 불필요한 경우에도 기본값을 채운다.
- position 기본값: {"x":0,"y":0}
- size 기본값: {"width":1920,"height":1080}
- filename/text는 없을 경우 빈 문자열("")로
9) JSON(스키마) 이외 텍스트 출력 금지


출력 스키마:
{{
  "story_summary": "...",
  "timeline": [
    {{
      "type": "video"|"subtitle"|"image"|"audio",
      "filename": "파일명(텍스트의 경우 생략 가능)",
      "text": "자막 텍스트(자막일 때)",
      "start": 0.0,
      "end": 3.0,
      "position": {{"x":0,"y":0}},
      "size": {{"width":1920,"height":1080}}
    }}
  ]
}}
""")
])

# ===========================
# 5단계 Fun Evaluation Prompt
# ===========================
fun_llm = base_llm.with_structured_output(FunEvaluation)

fun_prompt = ChatPromptTemplate.from_messages([
    ("system", "너는 유튜브 쇼츠 전문 심사위원이다. 반드시 지정 스키마에 맞는 JSON만 출력한다."),
    ("user", """다음 스토리라인과 타임라인을 평가하여 쇼츠로서의 재미/몰입도를 채점하라.

[스토리라인(JSON)]
{storyline_json}

[타임라인(JSON)]
{timeline_json}

평가 기준(각 0~5):
- hook_strength: 0~3초 주의끌기, 호기심/긴장/놀라움
- pacing: 리듬/컷 전환/호흡
- novelty: 참신성, 밈/반전/의외성
- clarity: 메시지의 명확성/불필요 정보 최소화
- emotional_impact: 감정 유발/공감/흥분
- cta_effectiveness: 구독/팔로우/다음 행동 유도
- visual_variety: 영상/이미지/자막의 다양성과 조합
- sound_alignment: BGM/효과음/발화와의 조화

추가로:
- weak_spots: 재미/리듬이 떨어지는 타임라인 구간(시작~끝, 이슈)
- top_actions: 즉시 적용하면 체감 개선이 큰 3가지 액션

총평:
- overall_score(0~5)와 verdict(pass|borderline|fail)

JSON만 출력하라.
""")
])


# ---------------------------
# LCEL Wiring
# ---------------------------

# === scenes ===
scenes_chain = scene_prompt | scene_llm

# 구간 분할: opening/dev/closing 초 계산
splitter = RunnableLambda(lambda inp: split_duration(int(inp["duration"])))

# === story idea 입력 맵 ===
story_inputs = RunnableParallel(
    scenes_json = scenes_chain | RunnableLambda(lambda out: scenes_to_json(out)),
    duration    = RunnableLambda(lambda inp: int(inp["duration"])),
    opening_sec = splitter | RunnableLambda(lambda d: d["opening_sec"]),
    development_sec = splitter | RunnableLambda(lambda d: d["development_sec"]),
    closing_sec = splitter | RunnableLambda(lambda d: d["closing_sec"]),
)

# story idea 체인 (입력맵 -> prompt -> llm)
story_chain = story_inputs | story_prompt | story_llm

# === storyline 입력 맵 ===
storyline_inputs = RunnableParallel(
    scenes_json     = scenes_chain | RunnableLambda(lambda out: scenes_to_json(out)),
    story_idea_json = story_chain  | RunnableLambda(lambda out: to_json(out)),
)

# storyline 체인
storyline_chain = storyline_inputs | storyline_prompt | storyline_llm



# === timeline 입력 맵 ===
timeline_inputs = RunnableParallel(
    analysis_json = RunnableLambda(
        lambda inp: json.dumps(inp["analysis_json"], ensure_ascii=False)
                    if isinstance(inp["analysis_json"], dict) else inp["analysis_json"]
    ),
    storyline_json = storyline_chain | RunnableLambda(lambda out: to_json(out)),
    duration       = RunnableLambda(lambda inp: int(inp["duration"])),
    image_ratio    = RunnableLambda(lambda inp: 0.3),   # 추가
    video_ratio    = RunnableLambda(lambda inp: 0.7),   # 추가
)


# timeline 체인
timeline_chain = timeline_inputs | timeline_prompt | timeline_llm




# fun evalutation chain: storyline + timeline를 입력으로 받아 평가
fun_chain = (RunnableParallel(
    storyline_json = storyline_chain | RunnableLambda(lambda out: to_json(out)),
    timeline_json  = timeline_chain  | RunnableLambda(lambda out: to_json(out)),
) | fun_prompt | fun_llm)


# ===========================
# 전체 파이프라인
# ===========================
FUN_THRESHOLD = 4           # overall_score 4 미만이면 재시도
ALLOWED_VERDICTS = {"pass"} # pass가 아니면 재시도

overall = RunnableParallel(
    scenes       = scenes_chain,
    story_idea   = story_chain,
    storyline    = storyline_chain,
    timeline_raw = timeline_chain,
    fun_eval     = fun_chain,  # 평가 결과를 병렬로
    _analysis    = RunnableLambda(lambda inp: inp["analysis_json"]),
    _duration    = RunnableLambda(lambda inp: int(inp["duration"])),
) | RunnableLambda(
    lambda outs: (lambda _outs=outs: (
        # 1) 기본 보정
        (lambda _tl:
            # 재미 평가 확인 후 재시도 필요하면 적용
            (lambda _maybe_punched:
                # 3) 길이/타입 최종 보정
                {
                    "scenes": _outs["scenes"],
                    "story_idea": _outs["story_idea"],
                    "storyline": _outs["storyline"],
                    "fun_evaluation": _outs["fun_eval"],
                    "timeline": adjust_timeline_length(
                        tl = ensure_timeline_constraints(_maybe_punched,
                              _outs["_analysis"] if isinstance(_outs["_analysis"], dict) else json.loads(_outs["_analysis"]),
                              _outs["_duration"]),
                        analysis_json = _outs["_analysis"] if isinstance(_outs["_analysis"], dict) else json.loads(_outs["_analysis"]),
                        duration = _outs["_duration"],
                        storyline = _outs["storyline"],
                        llm = base_llm
                    )
                }
            )(
                punch_up_timeline(
                    tl=_tl,
                    storyline=_outs["storyline"],
                    story_idea=_outs["story_idea"],
                    analysis_json=_outs["_analysis"] if isinstance(_outs["_analysis"], dict) else json.loads(_outs["_analysis"]),
                    duration=_outs["_duration"],
                    eval_result=_outs["fun_eval"],
                    llm=base_llm
                ) if (
                    _outs["fun_eval"].overall_score < FUN_THRESHOLD or
                    _outs["fun_eval"].verdict not in ALLOWED_VERDICTS
                ) else _tl
            )
        )(
            ensure_timeline_constraints(
                _outs["timeline_raw"],
                _outs["_analysis"] if isinstance(_outs["_analysis"], dict) else json.loads(_outs["_analysis"]),
                _outs["_duration"]
            )
        )
    ))()
)



# ---------------------------
# Demo / Test
# ---------------------------
if __name__ == "__main__":
    # 샘플 analysis_json
    with open("analysis.json", "r", encoding="utf-8") as f:
        analysis_json = json.load(f)


    payload = {
        "analysis_json": analysis_json,  # dict 혹은 JSON 문자열 모두 가능
        "duration": 30,
        "instruction": "밝고 감동적인 학과 소개 쇼츠로 만들어줘. 메시지는 '한국 폴리텍대학 AI융합소프트웨어과 홍보 영상'."

    }
    result = overall.invoke(payload)

    print("\n=== Scenes ===")
    print(scenes_to_json(result["scenes"]))
    print("\n=== Story Idea ===")
    print(to_json(result["story_idea"]))
    print("\n=== Storyline ===")
    print(to_json(result["storyline"]))
    print("\n=== Timeline (final) ===")
    print(to_json(result["timeline"]))
    print("\n=== Fun Evaluation ===")

    print(to_json(result["fun_evaluation"]))    

