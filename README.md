# CodeMtaani Music Lab

AI-powered music-generation web app built with React, Vite, Express, and Google's Gemini API.

## Deploy to Render

This repository includes a `render.yaml` Blueprint.

1. Push the repository to GitHub.
2. In Render, choose **New + → Blueprint**.
3. Connect `ederstoneCorp/Music-lab` and select the `main` branch.
4. Render reads `render.yaml` and creates the `codemtaani-music-lab` web service.
5. When prompted, provide `GEMINI_API_KEY` as a secret environment variable.
6. Apply the Blueprint and wait for the first deployment to finish.

The service uses Node.js 22, runs `npm install && npm run build`, and starts with `npm start`. The Express server serves the built Vite application and exposes `/api/health` for Render health checks.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes, for AI generation | Google AI API key. Set it in Render's environment settings; do not commit it. |
| `NODE_ENV` | Set by Blueprint | Set to `production` on Render. |
| `PORT` | Supplied by Render | Express listens on this port automatically. |

## Local development

```bash
npm install
npm run dev
```

Create a local `.env` file and add your `GEMINI_API_KEY` to enable generation.

## Build

```bash
npm run build
npm start
```

## Notes

- The Blueprint creates one web service and no database because the current application does not require persistent database storage.
- The free Render web-service plan may spin down after inactivity; the first request after idle time can take longer.
- Lyria model access, quotas, and billing are controlled by the Google AI API key and Google account.
