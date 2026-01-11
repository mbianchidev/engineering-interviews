# Engineering Interview Practice - Next.js Website

A modern, minimalist web application for practicing engineering interview questions. This website transforms the engineering-interviews repository into an interactive study platform.

## Features

- 📚 **Browse by Topic**: Explore 210+ questions organized by categories including DevOps, Backend, Frontend, and more
- 🎯 **Practice Mode**: Get random questions with a built-in timer to simulate real interview conditions
- ⏱️ **Timer**: Track how long you spend on each question
- ➡️ **Skip Functionality**: Move to the next question whenever you're ready
- 📊 **Progress Tracking**: See how many questions you've viewed
- 🌗 **Dark Mode**: Automatic dark mode support for comfortable studying
- 📱 **Responsive Design**: Works great on desktop, tablet, and mobile devices
- 🎨 **Clean UI**: Minimalist design focused on the content, no clutter
- 🔐 **Authentication**: Sign in with Google or GitHub to track your progress
- 💳 **Premium Subscription**: Subscribe via Stripe to access expert-crafted sample answers

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mbianchidev/engineering-interviews.git
cd engineering-interviews
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure the environment variables (see [Environment Configuration](#environment-configuration) below)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Configuration

Create a `.env.local` file based on `.env.example` with the following variables:

#### NextAuth.js Configuration
```bash
# Generate a secret using: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

#### Google OAuth Provider
Get credentials from [Google Cloud Console](https://console.developers.google.com/):
1. Create a new project or select existing
2. Enable the Google+ API
3. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
4. Set authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### GitHub OAuth Provider
Get credentials from [GitHub Developer Settings](https://github.com/settings/developers):
1. Go to Settings → Developer settings → OAuth Apps → New OAuth App
2. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`

```bash
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

#### Stripe Configuration
Get keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys):

```bash
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

Create a subscription product in Stripe:
1. Go to Products → Add Product
2. Create a recurring price (e.g., $9.99/month)
3. Copy the Price ID

```bash
STRIPE_MONTHLY_PRICE_ID=price_your-monthly-price-id
```

For webhook handling in production:
1. Go to Developers → Webhooks → Add endpoint
2. Set endpoint URL to: `https://your-domain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

```bash
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### Testing Stripe Integration

When Stripe is in test mode, use these test card numbers during checkout:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0025 0000 3155` | 3D Secure required |

Use any future expiry date and any 3-digit CVC.

### Building for Production

```bash
npm run build
```

**Note**: For full functionality (authentication and payments), deploy to a platform that supports Next.js API routes like Vercel or Netlify.

### Building for Static Export (GitHub Pages)

For GitHub Pages deployment (without auth/payment features):

```bash
DEPLOY_ENV=github-pages npm run build
```

The static files will be generated in the `out/` directory.

## Deployment

### Vercel (Recommended for Full Features)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy

### GitHub Pages (Static Export Only)

This repository includes a GitHub Actions workflow that automatically deploys the website to GitHub Pages when changes are pushed to the `main` branch.

**Note**: GitHub Pages deployment exports a static version without authentication or payment features.

**Setup Steps:**

1. Go to your repository's Settings → Pages
2. Under "Build and deployment", select "GitHub Actions" as the source
3. Push to the `main` branch to trigger the deployment

The site will be available at: `https://<username>.github.io/engineering-interviews/`

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (Google, GitHub OAuth)
- **Payments**: Stripe (subscriptions)
- **Deployment**: Vercel-ready

## Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Pages deployment workflow
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/ # NextAuth.js API routes
│   │   └── stripe/            # Stripe API routes (checkout, webhook, portal)
│   ├── auth/                  # Authentication pages (signin, error)
│   ├── subscription/          # Subscription pages (pricing, success, cancel)
│   ├── practice/              # Practice mode page
│   ├── topics/                # Topic browsing pages
│   │   └── [categoryId]/      # Dynamic category pages
│   ├── layout.tsx             # Root layout with AuthProvider
│   └── page.tsx               # Homepage
├── components/
│   ├── AuthProvider.tsx       # NextAuth.js session provider
│   ├── AuthStatus.tsx         # User authentication status display
│   └── Header.tsx             # Navigation header with auth
├── lib/
│   ├── auth/
│   │   └── options.ts         # NextAuth.js configuration
│   ├── stripe/
│   │   ├── config.ts          # Stripe server configuration
│   │   └── client.ts          # Stripe client-side utilities
│   ├── parseQuestions.ts      # Question parsing logic
│   └── questionsData.ts       # Client-side questions data
├── scripts/
│   └── generate-questions.ts  # Build-time question JSON generator
├── public/
│   └── questions.json         # Generated questions data
├── .env.example               # Environment variables template
├── README.md                  # Original interview questions
└── SETUP.md                   # This file
```

## How It Works

The application parses the `README.md` file at build time to extract:
- Question categories (General, DevOps, Software Engineering)
- Subcategories (Git, Network, React, etc.)
- Individual questions

The build process:
1. Runs `generate-questions.ts` to parse README.md and create `public/questions.json`
2. Generates static pages for each topic category via SSG
3. API routes handle authentication and payment processing
4. The practice mode loads questions from the JSON file client-side

### Authentication Flow

1. User clicks "Sign In" → Redirected to OAuth provider (Google/GitHub)
2. After successful auth → Redirected back with session token
3. Session stored as JWT → User can access protected features

### Subscription Flow

1. User clicks "Subscribe" → Redirected to Stripe Checkout
2. Completes payment → Stripe sends webhook notification
3. Webhook updates subscription status → User gains premium access
4. User can manage subscription via Stripe Customer Portal

## License

See the main README.md for project information and guidelines.

## Contributing

Contributions are welcome! Please refer to the main README.md for contribution guidelines.
