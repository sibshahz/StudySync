import express from "express";
import {
  httpCreateAgent,
  httpDeleteAgentById,
  httpGetAgentById,
  httpGetAgentLink,
  httpGetTextToSpeech,
  httpListAgents,
} from "./agents.controller";
const agentRouter = express.Router();

agentRouter.post("/create", httpCreateAgent);
agentRouter.get("/list", httpListAgents);
agentRouter.get("/list/:id", httpGetAgentById);
agentRouter.get("/link/:id", httpGetAgentLink);
// agentRouter.put("/update/:id", httpUpdateAgentById);
agentRouter.delete("/delete/:id", httpDeleteAgentById);
agentRouter.post("/audio", httpGetTextToSpeech);
agentRouter.post("/test", httpGetTextToSpeech);

export default agentRouter;
