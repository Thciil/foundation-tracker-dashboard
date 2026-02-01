import Link from "next/link";
import { getFoundation } from "@/lib/queries";

export const dynamic = "force-dynamic";
import { FoundationSummary } from "@/components/FoundationSummary";
import { StatusUpdateForm } from "@/components/StatusUpdateForm";
import { OutreachGenerator } from "@/components/OutreachGenerator";

export default function FoundationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const foundation = getFoundation(Number(params.id));

  if (!foundation) {
    return (
      <main className="min-h-screen px-4 py-8">
        <p className="text-slate-500">Foundation not found.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 lg:px-12">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Back to dashboard
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <FoundationSummary foundation={foundation} />
        <StatusUpdateForm foundation={foundation} />
      </div>

      <div className="mt-6">
        <OutreachGenerator foundationId={foundation.id} />
      </div>
    </main>
  );
}
