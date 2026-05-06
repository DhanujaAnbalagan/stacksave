"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "Which AI tools does StackSave support?",
    answer:
      "StackSave currently supports ChatGPT (OpenAI), Claude (Anthropic), Cursor, GitHub Copilot, Google Gemini, and the OpenAI API. We're constantly adding new integrations — submit a request and we'll prioritize it.",
  },
  {
    id: "faq-2",
    question: "How does the free audit work?",
    answer:
      "Connect your billing accounts or paste in your invoices. StackSave runs a full analysis — usage patterns, idle seats, tier mismatches — and produces a prioritized savings report within minutes. No credit card required.",
  },
  {
    id: "faq-3",
    question: "Is my billing data secure?",
    answer:
      "Yes. We use read-only OAuth connections where available and never store raw invoices or credentials. All data is encrypted at rest and in transit. We're SOC 2 Type II compliant.",
  },
  {
    id: "faq-4",
    question: "Do I need to be technical to use StackSave?",
    answer:
      "Not at all. StackSave is built for founders, CTOs, engineering managers, and finance teams alike. Onboarding takes under 5 minutes and every recommendation comes with plain-English explanations.",
  },
  {
    id: "faq-5",
    question: "How much does StackSave cost after the free audit?",
    answer:
      "Paid plans start at $49/month for teams up to 25 seats with no per-seat pricing. We also offer a pay-as-you-save tier where you only pay a small percentage of verified realized savings.",
  },
  {
    id: "faq-6",
    question: "What if we use custom enterprise agreements?",
    answer:
      "We support custom enterprise pricing inputs. Upload your contract details and StackSave will factor in your negotiated rates when calculating savings and making recommendations.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Everything you need to know before running your first audit.
          </p>
        </div>

        <Accordion className="space-y-2">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              value={index}
              className="border border-border rounded-xl px-5 bg-card card-glow"
            >
              <AccordionTrigger className="text-sm font-medium text-foreground hover:text-primary transition-colors py-5 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

