"use client";

import Link from "next/link";

export default function DeclinedPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-8 text-center">
      {/* Icon */}
      <div className="w-12 h-12 rounded-full border border-red-900 flex items-center justify-center mb-6">
        <span className="text-red-800 text-lg leading-none">✕</span>
      </div>

      {/* Label */}
      <p className="text-[10px] tracking-[0.3em] text-red-800 uppercase">
        PAYMENT DECLINED
      </p>

      {/* Headline */}
      <h1 className="text-3xl font-light text-white mt-4 max-w-md">
        We were unable to process your payment.
      </h1>

      {/* Body */}
      <p className="text-[#555] text-sm max-w-md mt-4 leading-relaxed">
        Your application has been received and is under review. To resolve your
        payment, please contact our help desk.
      </p>

      {/* CTA */}
      <button
        onClick={() => {
          if (typeof (window as any).smartsupp === "function") {
            (window as any).smartsupp("chat:open");
          }
        }}
        className="border border-[#333] text-[#e8e8e8] text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 mt-8 inline-block cursor-pointer"
      >
        CONTACT HELP DESK →
      </button>

      {/* Home link */}
      <Link
        href="/"
        className="text-[#333] text-[10px] tracking-widest hover:text-[#555] transition-colors mt-8 inline-block"
      >
        ← Return to home
      </Link>
    </div>
  );
}
