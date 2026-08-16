# BuildFlow AI Dashboard

Connect this Lovable project to my existing GitHub repository:

Repository: I0vX3Ol/buildflow-ai-dashboard
Branch: main

I want you to continue working on the existing application in that repository, not create a new application and not rebuild the website from scratch.

First, inspect the existing repository and understand the current codebase, including:

Existing React/TypeScript architecture

Components and pages

Routing

Styling and design system

Dependencies

Existing functionality

API integrations

Environment variable requirements

Existing database/backend integrations

Current project structure

Preserve all existing functionality and design unless I specifically instruct you to change something.

Use the GitHub repository as the source of truth for the project. Any changes you make should be applied to the existing codebase and synchronized with the repository.

Do not replace the existing project with a new starter template.

If this Lovable account cannot directly connect to or access I0vX3Ol/buildflow-ai-dashboard, tell me exactly what GitHub permission or connection is required rather than creating a new project. You are an award-winning team of product designers from Linear, Stripe, Notion, Vercel, Apple, and Airbnb.

Design and build a premium SaaS web application called BuildFlow AI.

This is NOT a marketing website.

This is a complete production-ready SaaS dashboard.

The design should feel like a $100 million startup.

The UI quality should exceed Buildertrend, Jobber, Monday.com, Procore, and ServiceTitan.

Use modern minimalism.

No gradients.

Large spacing.

Rounded corners.

Premium shadows.

Glass effects only where appropriate.

Perfect typography hierarchy.

Every page must feel intentionally designed.

Use React.

TanStack Router.

Tailwind CSS.

Radix UI.

Lucide Icons.

Responsive design.

Dark mode.

Light mode.

Keyboard shortcuts.

Command palette.

Animated page transitions.

Loading skeletons.

Toast notifications.

Beautiful empty states.

Professional charts.

Accessibility compliant (WCAG AA).

Authentication

Landing page

Login

Signup

Forgot Password

Two-factor authentication

Magic link login

Profile settings

Organization settings

Subscription page

Billing page

Notification preferences

API keys

Dashboard

Display:

Revenue this month

Open estimates

Projects in progress

Jobs completed

Invoices overdue

Upcoming inspections

Weather widget

Employee status

Equipment utilization

Interactive revenue graph

Project completion graph

Recent customer activity

Recent AI activity

Upcoming deadlines

CRM

Customer profiles

Lead pipeline

Notes

Tasks

Call history

Email history

Files

Photo uploads

Timeline

Map integration

AI-generated customer summaries

AI Estimating

Upload blueprints

Upload PDFs

Upload photos

Generate labor estimate

Generate material estimate

Estimate risk score

Profit calculator

Markup calculator

Generate branded proposal

Export PDF

Email customer

Revision history

AI recommendations

Project Management

Kanban board

Calendar

Timeline

Gantt chart

Daily logs

Jobsite photos

Progress tracking

Milestones

Dependencies

Subcontractor management

Change orders

Punch lists

Equipment

Equipment inventory

Maintenance schedule

GPS placeholder

Service history

Fuel tracking

Inspection reminders

Rental tracking

QR code lookup

Employee Management

Employee directory

Roles

Permissions

Time tracking

Vacation requests

Payroll placeholder

Training certifications

OSHA certifications

Performance dashboard

Financials

Invoices

Payments

Expenses

Purchase orders

Budget tracking

Profit reports

Tax reports

Accounts receivable

Accounts payable

Cash flow dashboard

AI Assistant

Persistent AI chat panel.

It knows everything about the company.

Users can ask:

Show overdue invoices.

Summarize Project Alpha.

Generate a proposal.

Estimate this blueprint.

Create tomorrow's schedule.

Write customer follow-up email.

Analyze profit margins.

Find missing documents.

Predict project delays.

Client Portal

Clients can:

View estimates

Approve proposals

Pay invoices

Upload files

View project progress

Message project manager

Download documents

Schedule meetings

Analytics

Revenue

Win rate

Average project value

Lead conversion

Employee productivity

Equipment usage

Profit margins

Customer satisfaction

Forecasting

Integrations

QuickBooks

Stripe

Google Calendar

Outlook

Microsoft Teams

Slack

Dropbox

Google Drive

OneDrive

Twilio

SendGrid

OpenAI

Anthropic

Design Requirements

Use lots of whitespace.

Every card should have a purpose.

Avoid clutter.

Create a premium experience similar to:

Linear

Notion

Stripe Dashboard

Vercel Dashboard

Apple Business

The interface should immediately communicate professionalism and trust.

Every button, modal, table, chart, and form should look polished.

Animations should be subtle and smooth.

The product should feel like software that sells for $299–999 per month.

Generate all pages, components, routing, mock data, navigation, responsive layouts, and polished UI so the application is immediately usable as a production-quality MVP.

Today at 12:13 PM

Build unsuccessful

Lovable can fix this without using additional credits.

I had to stop partway through — here's where things stand.

Done so far

Premium design system in src/styles.css: modern-minimal token set (no gradients), light + dark themes, soft/lift shadow tokens, glass and surface utilities, mono numerics, rise animation, reduced-motion support.

Theme provider with persistence + ⌘\ toggle (src/lib/theme.tsx).

Full mock dataset for the whole product (src/lib/mock-data.ts): customers, pipeline, projects, kanban, equipment, employees, invoices, expenses, estimates, activity, deadlines, integrations, analytics, AI answers.

Shared components: PageHeader, StatCard, Section, EmptyState, nav config.

Command palette (⌘K) with navigation + actions, and the persistent AI assistant panel (⌘J) with suggested prompts, skeleton "thinking" state, and contextual answers.

App shell src/routes/app.tsx: sidebar with grouped nav, glass sticky topbar, search trigger, notifications, avatar menu, mobile drawer, skip link, animated page transitions.

Dashboard src/routes/app.index.tsx: revenue vs. forecast area chart, completion line chart, KPI cards, weather widget, crew status, equipment utilization, recent activity, upcoming deadlines.

Remaining (currently the build will fail until these exist)

Child routes referenced by nav/palette: /app/crm, /app/estimating, /app/projects, /app/equipment, /app/team, /app/financials, /app/analytics, /app/portal, /app/integrations, /app/settings.

Auth surface: landing page at / (still the template placeholder), /login, /signup, /forgot-password, 2FA + magic link.

Wiring in __root.tsx: font <link> tags, theme init script, ThemeProvider, and the sonner <Toaster />.

When you have credits again, tell me to continue and I'll finish those in the next pass.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/72ed5f1e-3f75-4018-aeb6-a4df244b64fd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
