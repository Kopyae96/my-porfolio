# Pyae Thi La — Portfolio

A personal portfolio website for Pyae Thi La, an Equipment Technician based in Singapore. The experience uses a white editorial design system, with a career timeline, capabilities, LinkedIn contact path, and an evolving portfolio section.

## Built with

- Next.js 15
- React 19
- TypeScript
- CSS

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm run start
```

## Digital Twin chat

The floating **Ask the Digital Twin** assistant answers questions about Pyae's verified professional background. It uses OpenRouter server-side with `openai/gpt-oss-120b`.

Set this environment variable locally and in Netlify:

```bash
OPENROUTER_API_KEY=your_openrouter_key
```

The key is used only by `app/api/digital-twin/route.ts` and is never exposed to the browser.

## Deploy to Netlify

1. Create a new Netlify project and import this GitHub repository.
2. Netlify detects Next.js automatically.
3. Use `npm run build` as the build command.
4. Leave the base and publish-directory fields blank.
5. Under **Project configuration → Environment variables**, add `OPENROUTER_API_KEY` with your OpenRouter key for the production deploy.
6. Deploy. Future pushes to `main` will automatically update the live site.

## Content updates

- Page content: `app/page.tsx`
- Design and responsive styling: `app/globals.css`
- Profile image and favicon: `public/`

## License

All rights reserved © Pyae Thi La.
