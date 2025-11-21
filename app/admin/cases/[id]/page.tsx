import { use } from "react";
import CaseDetailsShell from "@/components/cases/CaseDetailsShell";

export default function CaseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);   // ✅ unwrap the async params

    return <CaseDetailsShell caseId={id} />;
}
