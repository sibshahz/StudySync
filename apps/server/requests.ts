async function createAgentRequest() {
  // Create agent (POST /v1/convai/agents/create)
  const response = await fetch(
    "https://api.elevenlabs.io/v1/convai/agents/create",
    {
      method: "POST",
      headers: {
        "xi-api-key": "xi-api-key",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation_config: {
          agent: {
            prompt: {},
          },
        },
        name: "",
      }),
    }
  );

  const body = await response.json();
  console.log(body);
}
