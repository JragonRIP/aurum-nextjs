export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-zinc-100">
      <section className="w-full max-w-xl rounded-3xl border border-[rgba(201,168,76,0.35)] bg-zinc-950/70 p-8 text-center shadow-[0_0_40px_rgba(0,0,0,0.85)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[rgba(201,168,76,0.9)]">
          Request Sent
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50">
          Thank you for reaching out.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-300">
          Your detailing request was submitted successfully. We will review your message
          and contact you soon to confirm scheduling and final pricing.
        </p>
        <a
          href="/"
          className="mt-7 inline-flex items-center justify-center rounded-full bg-[rgba(201,168,76,0.96)] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_30px_rgba(201,168,76,0.45)] transition hover:bg-[#d1b35a]"
        >
          Back to Home
        </a>
      </section>
    </main>
  );
}
