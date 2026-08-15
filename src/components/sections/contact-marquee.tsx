const COPIES = 4;

export function ContactMarquee({ text }: { text: string }) {
  if (!text) return null;

  const sequence = (group: number) => (
    <div key={group} className="flex shrink-0 items-center" aria-hidden={group > 0}>
      {Array.from({ length: COPIES }, (_, i) => (
        <span
          key={`${group}-${i}`}
          className="shrink-0 whitespace-nowrap pr-[0.45em] font-display text-[60px] font-medium uppercase leading-[0.8] tracking-[-0.01em] text-[var(--color-ink)] md:text-[157px]"
        >
          {text}
        </span>
      ))}
    </div>
  );

  return (
    <section aria-hidden className="bg-[var(--color-bg)] pb-[140px] pt-[50px]">
      <div className="relative h-[132px] overflow-hidden">
        <div className="contact-marquee-track absolute inset-y-0 left-0 flex w-max items-center">
          {sequence(0)}
          {sequence(1)}
        </div>
      </div>
    </section>
  );
}
