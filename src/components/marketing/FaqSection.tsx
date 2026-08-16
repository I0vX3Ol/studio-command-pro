import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const faqs = [
  {
    q: "What does BuildFlow AI replace?",
    a: "BuildFlow AI unifies estimating, CRM, project execution, equipment tracking and financials into one platform, replacing the separate point tools most construction teams stitch together.",
  },
  {
    q: "How does AI estimating work?",
    a: "Upload a blueprint set and BuildFlow AI produces a labor, material and risk-scored estimate you can review and adjust before it becomes a bid.",
  },
  {
    q: "Does it integrate with our existing tools?",
    a: "BuildFlow AI connects to QuickBooks, Stripe, Google Calendar, Slack and the rest of your stack, so financial and scheduling data stays in sync.",
  },
  {
    q: "Is my company's data secure?",
    a: "SSO, role-based permissions and audit trails are built in from day one, and all traffic is served over HTTPS with modern TLS.",
  },
  {
    q: "Can I try it before committing?",
    a: "Yes — start a free trial from the signup page, no credit card required to explore the workspace.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="border-t border-border">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Questions, answered</h2>
        <div className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
