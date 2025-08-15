import { Metadata } from "next";
import FYPGroupRulesPage from "@/components/dashboard/fyp/group-rules-page";

export const metadata: Metadata = {
  title: "FYP Group Rules",
  description: "Manage Final Year Project group rules and member limits",
};

export default function FYPGroupRulesRoute() {
  return <FYPGroupRulesPage />;
}
