import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: "t1",
    quote:
      "We were paying for five AI tools and actively using two. StackSave surfaced that in the first audit and we cut $1,800/month — without dropping a single workflow.",
    author: "Priya Mehta",
    role: "CTO, Parcel Labs",
    avatar: "PM",
    avatarColor: "from-violet-500 to-blue-500",
  },
  {
    id: "t2",
    quote:
      "I was skeptical that another SaaS tool would save us money. Thirty minutes after connecting our accounts, StackSave showed us three GitHub Copilot seats that hadn't been touched in 90 days.",
    author: "Marcus Chen",
    role: "Engineering Lead, Volta AI",
    avatar: "MC",
    avatarColor: "from-blue-500 to-cyan-500",
  },
  {
    id: "t3",
    quote:
      "The annual savings report made our budget review meeting actually enjoyable. Our CFO asked us to roll it out to the whole company the next day.",
    author: "Laila Osei",
    role: "Founder, Gridline Studio",
    avatar: "LO",
    avatarColor: "from-emerald-500 to-teal-500",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Founders and engineers{" "}
            <span className="text-gradient">trust StackSave</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              id={`testimonial-${t.id}`}
              className="card-glow rounded-2xl bg-card border border-border p-6 flex flex-col gap-5"
            >
              <Quote className="w-6 h-6 text-primary/40 shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {t.quote}
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white text-xs font-semibold shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t.author}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

