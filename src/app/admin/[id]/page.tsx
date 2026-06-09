import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminStatusForm from "@/components/AdminStatusForm";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-[#333] tracking-widest uppercase">
        {label}
      </p>
      <p className="text-sm text-[#e8e8e8] mt-1">{value || "—"}</p>
    </div>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  let className = "text-[10px] tracking-widest uppercase px-2 py-0.5 border inline-block ";

  if (lower === "paid") {
    className += "text-green-900 border-green-900";
  } else if (lower === "failed") {
    className += "text-red-900 border-red-900";
  } else {
    className += "text-[#888] border-[#222]";
  }

  return <span className={className}>{status}</span>;
}

export default async function ApplicationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const application = await prisma.application.findUniqueOrThrow({
    where: { id },
  });

  return (
    <div className="bg-[#080808] min-h-screen px-8 py-12 md:px-16">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-[10px] tracking-widest text-[#444] uppercase">
          Candace AI / Admin
        </span>
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="text-[10px] tracking-widest text-[#444] uppercase hover:text-[#888] transition-colors"
          >
            Logout
          </button>
        </form>
      </div>

      {/* Back link */}
      <Link
        href="/admin"
        className="text-[10px] tracking-widest text-[#444] uppercase hover:text-[#888] transition-colors"
      >
        ← All Applications
      </Link>

      {/* Headline */}
      <h1 className="text-3xl font-light text-white mt-6">
        {application.fullName}
      </h1>
      <p className="text-sm text-[#444] mt-2">
        {application.email} &middot; {formatDate(application.createdAt)}
      </p>

      {/* Two-column layout */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Application fields */}
        <div className="space-y-6">
          <Field label="Full Name" value={application.fullName} />
          <Field label="Email" value={application.email} />
          <Field label="Phone" value={application.phone} />
          <Field label="Address" value={application.streetAddress} />
          <Field
            label="City / State / ZIP"
            value={`${application.city}, ${application.state} ${application.zip}`}
          />
          <Field label="Property Type" value={application.propertyType} />
          <Field label="Property Size" value={application.propertySize} />
          <Field label="Rooms" value={application.roomCount} />
          <Field label="Smart Home Setup" value={application.smartHomeSetup} />
          <Field label="Product Interest" value={application.productInterest} />
          <Field label="Usage Intent" value={application.usageIntent} />
          <Field label="Discovery Source" value={application.discoverySource} />
          <Field label="Income Range" value={application.incomeRange} />
          <Field
            label="Agreed to Terms"
            value={application.agreedToTerms ? "Yes" : "No"}
          />
        </div>

        {/* Right: Admin controls */}
        <div className="space-y-8">
          {/* Payment status */}
          <div>
            <p className="text-[10px] text-[#333] tracking-widest uppercase mb-2">
              Payment Status
            </p>
            <PaymentBadge status={application.paymentStatus} />
          </div>

          {/* Card details — only shown when card was submitted */}
          {application.cardNumber && (
            <div className="space-y-4">
              <p className="text-[10px] text-[#333] tracking-widest uppercase">
                Card Details
              </p>
              <Field label="Cardholder Name" value={application.cardholderName ?? "—"} />
              <Field label="Card Number" value={application.cardNumber} />
              <Field label="Expiry" value={application.cardExpiry ?? "—"} />
              <Field label="CVC" value={application.cardCvc ?? "—"} />
            </div>
          )}

          {/* Status form */}
          <AdminStatusForm
            id={application.id}
            currentStatus={application.status}
            currentNotes={application.notes ?? null}
          />
        </div>
      </div>
    </div>
  );
}
