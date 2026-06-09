"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  propertyType: string;
  propertySize: string;
  roomCount: string;
  smartHomeSetup: string[];
  productInterest: string;
  usageIntent: string;
  discoverySource: string;
  incomeRange: string;
  agreedToTerms: boolean;
}

const initialFormState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  zip: "",
  propertyType: "",
  propertySize: "",
  roomCount: "",
  smartHomeSetup: [],
  productInterest: "",
  usageIntent: "",
  discoverySource: "",
  incomeRange: "",
  agreedToTerms: false,
};

const STORAGE_KEY = "candace_application";

const inputClass =
  "bg-transparent border-b border-[#222] text-[#e8e8e8] text-sm w-full py-3 outline-none placeholder:text-[#333] focus:border-[#555] transition-colors";

function RadioCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-6 py-4 text-[10px] tracking-widest uppercase cursor-pointer transition-all ${
        selected
          ? "border-[#555] text-[#e8e8e8]"
          : "border-[#1a1a1a] text-[#555] hover:border-[#333] hover:text-[#888]"
      }`}
    >
      {label}
    </button>
  );
}

function CheckboxCard({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`border px-6 py-4 text-[10px] tracking-widest uppercase cursor-pointer transition-all text-left ${
        checked
          ? "border-[#555] text-[#e8e8e8]"
          : "border-[#1a1a1a] text-[#555] hover:border-[#333] hover:text-[#888]"
      }`}
    >
      <span className="mr-3">{checked ? "✓" : "○"}</span>
      {label}
    </button>
  );
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function AccessForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(initialFormState);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm((prev) => ({ ...prev, ...parsed }));
      } catch {
        // ignore
      }
    }
  }, []);

  function saveToStorage(data: Partial<FormState>) {
    const current = (() => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      } catch {
        return {};
      }
    })();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...data }));
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  function toggleSmartHome(device: string) {
    const current = form.smartHomeSetup;
    const updated = current.includes(device)
      ? current.filter((d) => d !== device)
      : [...current, device];
    updateField("smartHomeSetup", updated);
  }

  function validate(): boolean {
    switch (step) {
      case 1:
        if (!form.fullName.trim()) { setError("Please enter your full name."); return false; }
        break;
      case 2:
        if (!form.email.trim()) { setError("Please enter your email."); return false; }
        break;
      case 3:
        if (!form.phone.trim()) { setError("Please enter your phone number."); return false; }
        break;
      case 4:
        if (!form.streetAddress.trim()) { setError("Please enter your street address."); return false; }
        break;
      case 5:
        if (!form.city.trim() || !form.state.trim() || !form.zip.trim()) {
          setError("Please complete all location fields.");
          return false;
        }
        break;
      case 6:
        if (!form.propertyType) { setError("Please select a property type."); return false; }
        break;
      case 7:
        if (!form.propertySize) { setError("Please select a property size."); return false; }
        break;
      case 8:
        if (!form.roomCount) { setError("Please select the number of rooms."); return false; }
        break;
      case 9:
        if (form.smartHomeSetup.length === 0) { setError("Please select at least one option."); return false; }
        break;
      case 10:
        if (!form.productInterest) { setError("Please select a product."); return false; }
        break;
      case 11:
        if (!form.usageIntent.trim()) { setError("Please describe your usage intent."); return false; }
        break;
      case 12:
        if (!form.discoverySource) { setError("Please select how you heard about us."); return false; }
        break;
      case 13:
        if (!form.incomeRange) { setError("Please select an income range."); return false; }
        break;
      case 14:
        if (!form.agreedToTerms) { setError("You must agree to continue."); return false; }
        break;
    }
    return true;
  }

  async function handleContinue() {
    if (!validate()) return;

    saveToStorage(form);

    if (step === 15) {
      setSubmitting(true);
      try {
        const res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            smartHomeSetup: form.smartHomeSetup.join(", "),
          }),
        });
        const data = await res.json();
        if (data?.id) sessionStorage.setItem("applicationId", data.id);
      } catch {
        // continue regardless
      }
      setSubmitting(false);
      router.push("/access/payment");
      return;
    }

    setDirection(1);
    setStep((s) => s + 1);
    setError("");
  }

  function handleBack() {
    if (step === 1) return;
    setDirection(-1);
    setStep((s) => s - 1);
    setError("");
  }

  const stepLabel = [
    "IDENTITY",
    "CONTACT",
    "CONTACT",
    "RESIDENCE",
    "RESIDENCE",
    "PROPERTY",
    "PROPERTY",
    "PROPERTY",
    "HOME TECH",
    "INTEREST",
    "INTENT",
    "DISCOVERY",
    "QUALIFICATION",
    "AGREEMENT",
    "SHIPMENT",
  ][step - 1];

  const stepNum = String(step).padStart(2, "0");
  const totalSteps = "15";

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      {/* Nav bar */}
      <div className="flex items-center justify-between px-8 md:px-16 py-8">
        <Link
          href="/"
          className="text-[10px] tracking-widest text-[#444] uppercase hover:text-[#666] transition-colors"
        >
          CANDACE AI
        </Link>
        <span className="text-[10px] tracking-widest text-[#444]">
          {stepNum} · {totalSteps}
        </span>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-8 md:px-16">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Step label */}
              <p className="text-[10px] tracking-[0.3em] text-[#444] uppercase mb-8">
                {stepLabel}
              </p>

              {/* Step content */}
              {step === 1 && (
                <div>
                  <p className="text-[#e8e8e8] text-xl font-light mb-8">
                    What is your full name?
                  </p>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className={inputClass}
                    autoFocus
                  />
                </div>
              )}

              {step === 2 && (
                <div>
                  <p className="text-[#e8e8e8] text-xl font-light mb-8">
                    What is your email address?
                  </p>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={inputClass}
                    autoFocus
                  />
                </div>
              )}

              {step === 3 && (
                <div>
                  <p className="text-[#e8e8e8] text-xl font-light mb-8">
                    What is your phone number?
                  </p>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={inputClass}
                    autoFocus
                  />
                </div>
              )}

              {step === 4 && (
                <div>
                  <p className="text-[#e8e8e8] text-xl font-light mb-8">
                    What is your street address?
                  </p>
                  <input
                    type="text"
                    placeholder="123 Main Street"
                    value={form.streetAddress}
                    onChange={(e) => updateField("streetAddress", e.target.value)}
                    className={inputClass}
                    autoFocus
                  />
                </div>
              )}

              {step === 5 && (
                <div>
                  <p className="text-[#e8e8e8] text-xl font-light mb-8">
                    City, state, and ZIP code?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className={`${inputClass} flex-1`}
                      autoFocus
                    />
                    <input
                      type="text"
                      placeholder="ST"
                      value={form.state}
                      maxLength={2}
                      onChange={(e) =>
                        updateField("state", e.target.value.toUpperCase())
                      }
                      className={`${inputClass} sm:w-16`}
                    />
                    <input
                      type="text"
                      placeholder="ZIP"
                      value={form.zip}
                      onChange={(e) => updateField("zip", e.target.value)}
                      className={`${inputClass} sm:w-28`}
                    />
                  </div>
                </div>
              )}

              {step === 6 && (
                <div>
                  <p className="text-[#e8e8e8] text-xl font-light mb-8">
                    What type of property do you own?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {["HOUSE", "APARTMENT", "CONDO", "TOWNHOUSE"].map((opt) => (
                      <RadioCard
                        key={opt}
                        label={opt}
                        selected={form.propertyType === opt}
                        onClick={() => updateField("propertyType", opt)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {step === 7 && (
                <div>
                  <p className="text-[#e8e8e8] text-xl font-light mb-8">
                    What is your property size?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "< 1,000 sq ft",
                      "1,000–2,500 sq ft",
                      "2,500–5,000 sq ft",
                      "5,000+ sq ft",
                    ].map((opt) => (
                      <RadioCard
                        key={opt}
                        label={opt}
                        selected={form.propertySize === opt}
                        onClick={() => updateField("propertySize", opt)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {step === 8 && (
                <div>
                  <p className="text-[#e8e8e8] text-xl font-light mb-8">
                    How many rooms does your property have?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {["1–3", "4–6", "7–10", "10+"].map((opt) => (
                      <RadioCard
                        key={opt}
                        label={opt}
                        selected={form.roomCount === opt}
                        onClick={() => updateField("roomCount", opt)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {step === 9 && (
                <div>
                  <p className="text-[#e8e8e8] text-xl font-light mb-8">
                    Which smart home devices do you currently use?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Amazon Alexa",
                      "Google Home",
                      "Apple HomeKit",
                      "SmartThings",
                      "Ring/Nest",
                      "None",
                    ].map((opt) => (
                      <CheckboxCard
                        key={opt}
                        label={opt}
                        checked={form.smartHomeSetup.includes(opt)}
                        onChange={() => toggleSmartHome(opt)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {step === 10 && (
                <div>
                  <p className="text-[#e8e8e8] text-xl font-light mb-8">
                    Which product interests you most?
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      "CANDACE CORE ONE",
                      "CANDACE CORE TWO",
                      "CANDACE AI SHELL",
                      "CANDACE AI WHIRR",
                    ].map((opt) => (
                      <RadioCard
                        key={opt}
                        label={opt}
                        selected={form.productInterest === opt}
                        onClick={() => updateField("productInterest", opt)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {step === 11 && (
                <div>
                  <p className="text-[#e8e8e8] text-xl font-light mb-8">
                    How do you plan to use the system?
                  </p>
                  <textarea
                    placeholder="Describe how you plan to use the system..."
                    value={form.usageIntent}
                    onChange={(e) => updateField("usageIntent", e.target.value)}
                    rows={4}
                    className={`${inputClass} resize-none`}
                    autoFocus
                  />
                </div>
              )}

              {step === 12 && (
                <div>
                  <p className="text-[#e8e8e8] text-xl font-light mb-8">
                    How did you hear about us?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Social media",
                      "Word of mouth",
                      "Search",
                      "Press / Media",
                      "Invited",
                    ].map((opt) => (
                      <RadioCard
                        key={opt}
                        label={opt}
                        selected={form.discoverySource === opt}
                        onClick={() => updateField("discoverySource", opt)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {step === 13 && (
                <div>
                  <p className="text-[#e8e8e8] text-xl font-light mb-8">
                    What is your annual household income?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {["< $50K", "$50K–$100K", "$100K–$250K", "$250K+"].map(
                      (opt) => (
                        <RadioCard
                          key={opt}
                          label={opt}
                          selected={form.incomeRange === opt}
                          onClick={() => updateField("incomeRange", opt)}
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {step === 14 && (
                <div>
                  <p className="text-[#e8e8e8] text-xl font-light mb-8">
                    Please review and agree to our terms.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      updateField("agreedToTerms", !form.agreedToTerms)
                    }
                    className={`border px-6 py-5 text-[10px] tracking-widest uppercase cursor-pointer transition-all w-full text-left ${
                      form.agreedToTerms
                        ? "border-[#555] text-[#e8e8e8]"
                        : "border-[#1a1a1a] text-[#555] hover:border-[#333] hover:text-[#888]"
                    }`}
                  >
                    <span className="mr-3">
                      {form.agreedToTerms ? "✓" : "○"}
                    </span>
                    I agree to the Candace AI Terms of Service and Data Policy.
                  </button>
                </div>
              )}

              {step === 15 && (
                <div>
                  <p className="text-[#e8e8e8] text-xl font-light mb-4">
                    Initial shipment fee.
                  </p>
                  <p className="text-[#555] text-sm mb-6 leading-relaxed">
                    To confirm your application and reserve your unit, a
                    one-time shipment fee of{" "}
                    <span className="text-[#888]">$29.99</span> is required.
                    This covers priority handling, secure packaging, and
                    tracked delivery to your address. Your device will ship
                    within 5–7 business days of approval.
                  </p>
                  <div className="border border-[#1a1a1a] px-6 py-5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] tracking-widest text-[#444] uppercase">
                        Shipment Fee
                      </span>
                      <span className="text-[#e8e8e8] text-sm">$29.99</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <p className="text-red-800 text-[10px] tracking-wide mt-4">
                  {error}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between px-8 md:px-16 py-8">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1}
          className="text-[10px] tracking-widest uppercase text-[#333] hover:text-[#666] transition-colors disabled:opacity-0 disabled:pointer-events-none"
        >
          ← BACK
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={submitting}
          className="text-[10px] tracking-widest uppercase text-[#e8e8e8] hover:text-white transition-colors disabled:opacity-50"
        >
          {submitting
            ? "PROCESSING..."
            : step === 15
            ? "PAY $29.99 →"
            : "CONTINUE →"}
        </button>
      </div>
    </div>
  );
}
