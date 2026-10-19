# HiveOS

**Open-source sovereign newsletter infrastructure with BYOK (Bring Your Own Key) dispatch, Outlook VML compilation, RFC 8058 compliance, and real-time DNS telemetry.**

Live Deployment: [https://beehiiv-platform.pages.dev](https://beehiiv-platform.pages.dev)

---

## Overview

HiveOS is a production-grade, self-hostable open-source alternative to proprietary newsletter platforms. It provides the deliverability, rendering safety, and audience tools of platforms like Beehiiv while eliminating ongoing SaaS vendor lock-in through client-side encryption and a Bring Your Own Key (BYOK) architecture.

Anyone can deploy HiveOS to Cloudflare Pages for free and connect their own Resend, SendGrid, Postmark, Groq, or OpenAI keys.

---

## Core Pillars

- **Outlook 2016–2024 VML Engine**: Automatically compiles markdown and rich text into Microsoft Word-safe HTML with `<!--[if mso]>` tables and vector `<v:roundrect>` shapes so buttons, paddings, and background colors never break on legacy Windows Outlook clients.
- **RFC 8058 One-Click Compliance**: Injects required `List-Unsubscribe: <https://...>` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` headers for strict 2024+ Google Workspace and Yahoo Mail inbox delivery.
- **Live DNS-over-HTTPS (DoH) Auditor**: Queries Cloudflare's public `1.1.1.1` resolver in real time to verify live MX, SPF (`v=spf1`), and DMARC enforcement (`p=reject`) on any domain.
- **3-Layer Suppression Matrix**: Granular suppression isolation across **Global** (fatal bounces), **Publication** (user unsubscribes), and **Transactional** tiers.
- **Intelligent Bounce Classifier**: Distinguishes 5xx hard bounces (*"Never Again"* &rarr; auto-suppressed) from 4xx soft bounces (*"Try Again"* &rarr; exponential backoff).
- **Omnivery Bot-Click Filter**: Demonstrates and shields against corporate email security scanners (Proofpoint, Barracuda, Microsoft Defender SafeLinks) clicking links in under 85ms to protect reported click rates.
- **Bring Your Own Key (BYOK)**:
  - **Email**: Resend (free 3k/mo tier), SendGrid, Postmark, or Cloudflare Edge Simulator.
  - **AI Copilot**: Groq (ultra-fast Llama 3.3 70B), OpenAI (`gpt-4o-mini`), or local heuristics.
  - **Data Privacy**: All keys and subscriber data are stored locally in the browser's encrypted `localStorage`. Zero telemetry proxy servers.

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/canboigay/hiveos.git
cd hiveos
bun install # or npm install / pnpm install
```

### 2. Local Development

```bash
bun run dev
```

### 3. Production Build & Cloudflare Pages Deploy

```bash
bun run build
npx wrangler pages deploy dist --project-name hiveos
```

---

## Tech Stack

- **Runtime & Bundler**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS (dark mode default, Linear/Vercel palette)
- **Icons**: Lucide React
- **Hosting**: Cloudflare Pages (Global Edge CDN)
- **DNS Resolver**: Cloudflare 1.1.1.1 DNS-over-HTTPS (`https://cloudflare-dns.com/dns-query`)

---

## License

MIT License. Free to fork, modify, self-host, and commercialize.
