# SafeClick AI

**Pause. Check. Click safely.**

SafeClick AI is a free, mobile-friendly, browser-based early-warning tool for people in India. It helps users review common warning signs in suspicious messages, job offers and website links.

Live website: https://sudharsansenthil504-dev.github.io/safeclick-ai-/

## Current tools

- **Scam Message Checker** — looks for common clues such as requests for OTPs or passwords, payment demands, account-blocking threats, urgency, unexpected rewards and suspicious links.
- **Fake Job Checker** — looks for recruitment fees, requests for money, unrealistic selection promises and other common job-offer warning signs.
- **Suspicious Link Checker** — examines the URL text for clues such as non-HTTPS links, URL credentials, raw IP addresses, shortened links, unusual subdomains and misleading hostname patterns. It does not visit the destination website.
- **Mobile Number & SIM guidance** — links users to official Government of India services to check SIM connections issued in their own name and report suspicious communications. It does not identify another person's SIM owner.
- **Emergency cyber-fraud guidance** — provides a direct 1930 call link and the National Cyber Crime Reporting Portal for reporting financial cyber fraud.

## Privacy approach

- Checker analysis runs locally in the user's browser.
- The message, job-offer text and URL entered into the checkers are not sent to a SafeClick AI server.
- The site does not ask users to create an account or submit a phone number.
- Links to official external services are clearly separate from the local checkers.

## Languages

The interface supports English, Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi and Urdu.

**Important limitation:** translated interface text does not mean every detection rule understands every language. Detection is heuristic and includes selected native-script warning phrases for common Indian-language scam wording. It will not identify every scam, and it can miss suspicious content or flag harmless content.

## Safety notice

SafeClick AI is an early-warning aid, not a fraud-verification service and not a guarantee. A low-risk result does not prove that a message, job, phone number or website is genuine. Never share OTPs, UPI PINs, passwords or remote-access permissions. Verify independently through an organisation's official website or contact channel.

If money has been lost to financial cyber fraud in India, report it immediately through **1930** and the official [National Cyber Crime Reporting Portal](https://www.cybercrime.gov.in/).

## Technology

- Static HTML, CSS and JavaScript
- No application backend or database
- Hosted using GitHub Pages

## Local development

Open `index.html` in a browser, or serve the repository root with any basic static web server.

## Official links used by the site

- [TAFCOP — Know Your Mobile Connections](https://tafcop.sancharsaathi.gov.in/telecomUser/)
- [Sanchar Saathi — Chakshu](https://sancharsaathi.gov.in/sfc/)
- [National Cyber Crime Reporting Portal](https://www.cybercrime.gov.in/)
## Automated smoke tests

The repository includes a dependency-free browser-flow smoke test that checks script initialization, message/job/link result rendering, a Tamil warning clue, safe text rendering, empty-input handling, complete visible UI and input-placeholder translations across all 11 interface languages, Urdu right-to-left layout, emergency-help translations, and reduced-motion accessibility.

Run locally with Node.js 20 or newer:

```bash
node tests/smoke-test.mjs
```

GitHub Actions runs this test automatically on pushes and pull requests targeting `main`.
