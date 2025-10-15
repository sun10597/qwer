import os, json
from langchain_story import scenes_chain, story_chain, storyline_chain, timeline_chain, fun_chain
from langchain_story import scenes_to_json, to_json, ensure_timeline_constraints, split_duration

def safe_invoke(chain, payload, max_retry=2):
    for attempt in range(max_retry):
        try:
            return chain.invoke(payload)
        except Exception as e:
            print(f"[Retry {attempt+1}] JSON 파싱 실패: {e}")
    raise RuntimeError("LLM 호출 실패 (최대 재시도 초과)")

def run_pipeline(analysis_json: dict, duration: int = 30):
    scenes = safe_invoke(scenes_chain, {"analysis_json": json.dumps(analysis_json, ensure_ascii=False)})
    scenes_json = scenes_to_json(scenes)

    split = split_duration(duration)
    story_idea = safe_invoke(story_chain, {"analysis_json": analysis_json, "duration": duration, **split})
    story_idea_json = to_json(story_idea)

    storyline = safe_invoke(storyline_chain, {"analysis_json": analysis_json, "duration": duration})
    timeline = safe_invoke(timeline_chain, {"analysis_json": analysis_json, "duration": duration})
    timeline = ensure_timeline_constraints(timeline, analysis_json, duration)

    fun_eval = safe_invoke(fun_chain, {"analysis_json": analysis_json, "duration": duration})

    return {"scenes": scenes, "story_idea": story_idea, "storyline": storyline, "timeline": timeline, "fun_eval": fun_eval}

if __name__ == "__main__":
    # 샘플 입력 JSON
    with open("analysis.json", "r", encoding="utf-8") as f:
        analysis_json = json.load(f)


    result = run_pipeline(analysis_json, duration=30)

    print("\n=== Scenes ===")
    print(scenes_to_json(result["scenes"]))
    print("\n=== Story Idea ===")
    print(to_json(result["story_idea"]))
    print("\n=== Storyline ===")
    print(to_json(result["storyline"]))
    print("\n=== Timeline (final) ===")
    print(to_json(result["timeline"]))
    print("\n=== Fun Evaluation ===")
    print(to_json(result["fun_eval"]))
