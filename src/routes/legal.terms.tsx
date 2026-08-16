import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | BuildFlow AI" },
      {
        name: "description",
        content:
          "The terms that govern use of the BuildFlow AI platform, including acceptable use, subscriptions and data accuracy disclaimers.",
      },
      { property: "og:title", content: "BuildFlow AI Terms of Service" },
      { property: "og:description", content: "Terms governing use of the BuildFlow AI platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    heading: "Acceptable use",
    body: "You agree to use BuildFlow AI for lawful business purposes. You are responsible for the security of your account credentials and for activity performed under your account.",
  },
  {
    heading: "Subscriptions",
    body: "Paid plans renew on the billing cycle you select at signup. You may cancel at any time; cancellation takes effect at the end of the current billing period.",
  },
  {
    heading: "Data accuracy",
    body: "Estimates, forecasts and analytics are provided as decision-support tools and do not constitute a guarantee of project outcomes, costs or timelines.",
  },
  {
    heading: "Termination",
    body: "We may suspend or terminate accounts that violate these terms or misuse the platform, with notice where practicable.",
  },
  {
    heading: "Limitation of liability",
    body: "The platform is provided \"as is\" without warranties of any kind, to the maximum extent permitted by law.",
  },
  {
    heading: "Contact",
    body: "Questions about these terms can be directed to our team through the support page.",
  },
];

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold sm:text-4xl">Terms of Service</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        This summary is provided as a starting template and should be reviewed by counsel before
        launch.
      </p>
      {sections.map((s) => (
        <section key={s.heading} className="mt-10">
          <h2 className="text-xl font-semibold">{s.heading}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
        </section>
      ))}
    </div>
  );
}
