import AgentChat from "@/components/agent-chat";
export default function ChatPage({ params }: { params: { agentId: string } }) {
  return <AgentChat agentId={params.agentId} />;
}
