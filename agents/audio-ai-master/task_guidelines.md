# Task Guidelines: audio-ai-master

When orchestrating or delegating tasks to the `audio-ai-master` agent, follow these guidelines to ensure optimal performance and safety on Apple Silicon.

## 1. How to Prompt
- **Be Specific about the Pipeline**: State whether you need a full Voice-to-Voice loop (STT -> LLM -> TTS), a pure STT transcriber, or a real-time audio censoring system.
- **Mention the Target Audio Source**: Clarify if the audio source is a local `.wav` file, a microphone, or system audio intercepted via BlackHole.
- **Specify Constraints**: If latency is the absolute priority over quality, mention it so the agent can select faster, smaller models (e.g. `whisper-tiny` instead of `whisper-large-v3`).

## 2. What NOT to Ask
- Do not ask the agent to install `faster-whisper` for optimal Apple Silicon performance; the agent knows `mlx-whisper` is superior for this hardware.
- Do not ask the agent to magically enable audio directly inside the LM Studio desktop UI. It will build a Python middle-layer script instead.
- Do not ask for cloud-based fallback solutions (like OpenAI's Whisper API) unless explicitly intended, as this agent defaults to local, privacy-first inference.

## 3. Best Practices for Orchestrators
- **Virtual Environment**: Always instruct the agent to set up its dependencies inside a local `.venv`.
- **PortAudio Dependency**: Remind the user to run `brew install portaudio` before the agent runs its `pip install sounddevice` scripts.
- **Microphone Permissions**: Ensure the terminal or IDE running the agent has macOS Microphone and Accessibility permissions.
- **Graceful Testing**: When asking the agent to test a censoring pipeline, ask it to build a "dry run" mode using a static audio file first before engaging live system routing with BlackHole, to prevent dangerous audio feedback loops.

