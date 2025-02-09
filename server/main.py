import asyncio
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, JobProcess, cli, llm, metrics
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.plugins import deepgram, openai, cartesia, silero, turn_detector

load_dotenv()
logger = logging.getLogger("voice-agent")

app = FastAPI()
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:19000",  # Expo development server
        "http://localhost:19006",  # Expo web
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello from FastAPI"}


@app.get("/test")
async def test():
    return {"status": "OK", "data": "API is working!"}


def pre_warm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    initial_ctx = llm.JobContext().append(
        role="system",
        text=(
            "You are a helpful voice assistant constructed by LiveKit. You must be giving user interface in the form of voice."
            "You must be polite and helpful. You must be concise and to the point. Avoid unpronounced words and phrases."
        )
    )

    logger.info("Connecting to a room {ctx.room_name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    participant = await ctx.wait_for_participant()
    logger.info(f"Participant {participant.identity} connected")

    agent = VoicePipelineAgent(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=cartesia.TTS(voice="en-US-Wavenet-D"),
        turn_detector=turn_detector.EOUModel(),
        min_endpointing_delay=0.5,
        max_endpointing_delay=5.0,
        initial_context=initial_ctx,
    )

    usage_collector = metrics.UsageCollector()

    @agent.on("metrics_collected")
    def on_metrics_collected(agent_metrics: metrics.AgentMetrics):
        metrics.log_metrics(agent_metrics)
        usage_collector.collect(agent_metrics)

    agent.start(ctx.room, participant)
    agent.say("Hello, how can I help you today?", wait_for_response=True, allow_interruptions=True)

if __name__ == "__main__":
    cli.run(
        app=app,
        worker_options=WorkerOptions(
            prewarm_fnc=pre_warm,
            entrypoint=entrypoint,
            max_concurrent_jobs=1,
            max_concurrent_requests=1,
        ),
    )
