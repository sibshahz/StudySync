import {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from "express";
import "dotenv/config";
import { prisma } from "@repo/database";
import { clientElevenLabs } from "@/utils/elevenlabs";
import { Readable } from "stream";

export const debugTTS: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Testing ElevenLabs connection...");

    // Test with simple text
    const testText = "Hello, this is a test.";

    console.log("ElevenLabs client:", !!clientElevenLabs);
    console.log("Test text:", testText);

    const audioResponse = await clientElevenLabs.textToSpeech.convert(
      "JBFqnCBsd6RMkjVDRZzb", // Try a different voice ID if this doesn't work
      {
        outputFormat: "mp3_44100_128",
        text: testText,
        modelId: "eleven_multilingual_v2",
      }
    );

    console.log("Success! Audio response received");
    res.json({ success: true, message: "TTS API is working" });
  } catch (error) {
    console.error("Debug TTS Error:", error);
    res.status(500).json({
      error: "Debug TTS failed",
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
    });
  }
};

export const httpGetTextToSpeech: RequestHandler = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/onwK4e9ZLuTAKqWW03F9?output_format=mp3_44100_128",
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVEN_LABS_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `ElevenLabs TTS failed: ${response.status} ${response.statusText}`
      );
    }

    const buffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(buffer);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", audioBuffer.length);
    return res.send(audioBuffer);
  } catch (err) {
    console.error("TTS error:", err);
    res.status(500).json({
      error: "Failed to convert text to speech",
      details: err instanceof Error ? err.message : err,
    });
  }
};

export const httpCreateAgent: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, first_message, prompt } = req.body;
  try {
    const createdAgent = await clientElevenLabs.conversationalAi.agents.create({
      name,
      conversationConfig: {
        conversation: {
          textOnly: true, // Assuming you want text-only conversations
          clientEvents: ["agent_response", "user_transcript", "ping"],
        },
        agent: {
          firstMessage: first_message || "Hello! How can I assist you today?",
          prompt: {
            prompt: prompt || "You are a helpful assistant.",
            maxTokens: 100, // Adjust as needed
          },
        },
      },
    });
    const agent = await prisma.agent.create({
      data: {
        name,
        description,
        first_message,
        prompt,
        agent_id: createdAgent.agentId,
        createdAt: new Date(),
        userId: req.user.id, // Assuming req.user is set by authentication middleware
      },
    });
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create agent",
      details: error instanceof Error ? error.message : "Unknown error",
    });
    return;
  }
};

export const httpListAgents: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const agentsList = await clientElevenLabs.conversationalAi.agents.list();
    const agentsList = await prisma.agent.findMany({
      where: {
        userId: req.user.id, // Assuming req.user is set by authentication middleware
      },
      orderBy: {
        createdAt: "asc", // Order by creation date ascending
      },
    });
    res.status(200).json(agentsList);
    // res.status(200).json({ agentsList: agentsList.agents });
    return;
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve agents",
    });
    return;
  }
};

export const httpGetAgentById: RequestHandler = async (req, res, next) => {
  const id = req.params?.id;
  if (!id) {
    res.status(400).json({ error: "Agent ID is required" });
    return;
  }
  try {
    // const agent = await clientElevenLabs.conversationalAi.agents.get(id);
    const agent = await prisma.agent.findUnique({
      where: {
        id: id,
      },
    });
    if (!agent) {
      res.status(404).json({ error: "Agent not found" });
      return;
    }

    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve agent",
    });
  }
};

export const httpDeleteAgentById: RequestHandler = async (req, res, next) => {
  const id = req.params?.id;
  if (!id) {
    res.status(400).json({ error: "Agent ID is required" });
    return;
  }
  try {
    const agentExists = await prisma.agent.findUnique({
      where: {
        id: id,
      },
    });
    if (agentExists === null) {
      res.status(404).json({ error: "Agent not found" });
      return;
    }
    await clientElevenLabs.conversationalAi.agents.delete(agentExists.agent_id);

    await prisma.agent.delete({
      where: {
        id: id,
      },
    });
    res.status(204).json({ message: "Agent deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error:
        "Failed to delete agent" +
        (error instanceof Error ? error.message : ""),
    });
  }
};

export const httpGetAgentLink: RequestHandler = async (req, res, next) => {
  const id = req.params?.id;
  if (!id) {
    res.status(400).json({ error: "Agent ID is required" });
    return;
  }
  try {
    const signedUrl =
      await clientElevenLabs.conversationalAi.conversations.getSignedUrl({
        agentId: id,
      });
    res.status(200).json({ url: signedUrl });
    return;
  } catch (error) {
    res.status(500).json({
      error: "Failed to get agent link",
    });
    return;
  }
};
