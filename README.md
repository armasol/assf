# Twitch × Pons Launchpad

A Vercel-ready Next.js front-end inspired by the supplied reference site, rebuilt for Twitch creators and Pons on Robinhood Chain.

## Included
- Home, Explore, Payments, Analytics, Launch, Get paid, and Docs routes
- Black / white / `#8956fb` visual system
- Responsive sidebar and mobile navigation
- Search modal, filters, sorting controls, demo wallet state
- Interactive launch form with creator selection and image preview
- Scroll reveal and hover motion
- Creator-facing page and mock analytics/receipts
- No backend or chain calls are hardcoded in this pass

## Run locally
```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel
Import the folder/repository into Vercel. No environment variables are required for this front-end-only pass.

## Logo
The current `P` brand tile is a placeholder. Replace the `brand-mark` in `components/AppShell.tsx` with your uploaded logo later.

## Next integration pass
Wire the header wallet state to an EVM wallet connector, replace mock data with real reads, and connect the Launch submit action to Pons once the exact Pons transaction/API interface is confirmed.
