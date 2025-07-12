import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";

if (!process.env.ELEVEN_LABS_KEY) {
  throw new Error("Missing ELEVEN_LABS_KEY in environment variables");
}

const clientElevenLabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_KEY,
});

export { clientElevenLabs };
