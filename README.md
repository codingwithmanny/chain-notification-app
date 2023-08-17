# Chain Notification Web App

A simple web app that allows users to track changes on chain and be notified.

---

## Requirements

- NVM or NodeJS 18.16.1
- Upstash QStash Account (upstash.com)
- Resend.com Account (resend.com)
- Ngrok

---

## Local Development

```bash
# FROM: ./

cp .env.example .env; # Add correct env vars
pnpm install;
pnpm db:generate;
pnpm db:seed;
```

Start ngrok service

```bash
# FROM path/to/ngrok binary

ngrok http 3000
```

Start local development server

```bash
# FROM: ./

pnpm dev;
```

---

## Additional Scripts

Fetch script for creating a job via http request.

```bash
# FROM: ./

pnpm create:fetch;
```

Request to create a job and add QStash

```bash
# FROM: ./

pnpm create:cron;
```

---

by [@codingwithmanny](https://x.com/codingwithmanny)

