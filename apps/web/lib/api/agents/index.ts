import { axios_default } from "../axios-core";

export type AgentCreateData = {
  name: string;
  description: string;
  first_message: string;
  prompt: string;
};

export const postCreateAgent = async (data: AgentCreateData) => {
  try {
    const response = await axios_default.post(`agents/create`, data);
    return response;
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return error;
  }
};

export const getAgentList = async () => {
  try {
    const response = await axios_default.get(`agents/list`);
    return response;
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return error;
  }
};

export const getSingleAgent = async (id: string) => {
  try {
    const response = await axios_default.get(`agents/list/${id}`);
    return response;
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return error;
  }
};

export const deleteAgentById = async (id: string) => {
  try {
    const response = await axios_default.delete(`agents/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return error;
  }
};

export const getAgentLink = async (id: string) => {
  try {
    const response = await axios_default.get(`agents/link/${id}`);
    return response;
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return error;
  }
};

export const postGetTextToSpeech = async (text: string) => {
  try {
    // const test = await axios_default.post(`agents/test`, { text });
    // console.log("Test response:", test);
    const response = await axios_default.post(
      `agents/audio`,
      { text },
      {
        responseType: "blob", // Ensure the response is treated as a blob
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return error;
  }
};
