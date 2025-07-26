# TweetMuse 🎭

AI-powered Tweet Generator that matches your mood. Instantly create funny, sarcastic, or motivational tweets and save your tweet history. Built with Next.js, Drizzle ORM, Neon Postgres, and Google Gemini AI.

## Features

- **Mood-Based Tweets:** Generate tweets based on moods like Funny, Motivational, or Sarcastic.
- **Instant Generation:** Tweets are crafted instantly using Google Gemini AI.
- **Save & Manage Tweets:** View, filter, and delete your tweet history.
- **Authentication:** Secure signup, login, and profile management.
- **Responsive UI:** Optimized for mobile and desktop.
- **Share & Copy:** Easily copy or share tweets to X (Twitter).

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Neon Postgres](https://neon.tech/)
- [Google Gemini AI](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [JWT Authentication](https://jwt.io/)

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/your-username/tweet-ai.git
cd tweet-ai
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

Copy `envsample` to `.env` and fill in your credentials:

```
DATABASE_URL=your_postgres_url
NODE_ENV=development
GOOGLE_API_KEY=your_google_gemini_api_key
JWT_SECRET=your_jwt_secret
```

### 4. Run database migrations

```sh
npx drizzle-kit push
```

### 5. Start the development server

```sh
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Try Now:** Go to `/pages/dashboard` to generate tweets.
- **Login/Signup:** Access `/pages/login` or `/pages/signup` for authentication.
- **Profile:** View your info at `/pages/profile`.
- **History:** Manage your tweets at `/pages/history`.

## Project Structure

- `src/app/` – Next.js app routes and pages
- `src/components/` – UI and feature components
- `src/db/` – Database schema and Drizzle ORM setup
- `src/utils/` – Utility functions and AI integration
- `drizzle/` – Migration files

## Contributing

Contributions are welcome! Please open issues or submit pull requests.

## License

MIT

---

Built with ❤️ by