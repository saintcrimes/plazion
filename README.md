# PLazion

A responsive website for PLazion, an electrostatic air purification project by **Behzod Ergashev**. Built with React, Vite, TypeScript components and Tailwind CSS. Prepared for GitHub and Cloudflare Pages.

**Contact:** [behzodergasov5@gmail.com](mailto:behzodergasov5@gmail.com)

## Run locally

Install [Node.js](https://nodejs.org/) 24 LTS, then run:

```bash
git clone https://github.com/saintcrimes/plazion.git
cd plazion
npm ci
npm run dev
```

Open the local address printed by Vite, normally **http://localhost:5173**. The development server updates when you save changes.

On Windows PowerShell, use `npm.cmd` instead of `npm` if PowerShell blocks the `npm.ps1` script.

## Production build

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

Vite writes the production website to `dist/`. The preview command serves it at **http://localhost:4173**. Use a web server instead of opening `index.html` directly from the filesystem.

## Deploy to Cloudflare Pages

To publish this local folder to the existing GitHub repository from Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\publish.ps1
```

The script uses your normal GitHub authentication, clones the repository into a temporary folder, copies only project source, commits the changes and pushes to `main`. It handles an empty repository, an existing `main` branch, or a differently named default branch. It preserves remote history and never force-pushes. The checkout is retained if you need to inspect it. You can validate the source list without contacting GitHub by adding `-CheckOnly`.

The script does not use the source folder's `.git` directory. If direct Git commands in the original project folder report **dubious ownership**, trust only this project folder from your normal terminal:

```powershell
git config --global --add safe.directory C:/Users/Arslan_default/Desktop/Behzod
```

1. Push the project to [saintcrimes/plazion](https://github.com/saintcrimes/plazion) on the `main` branch.
2. In the Cloudflare dashboard, open **Workers & Pages → Create application → Pages → Import an existing Git repository**. Connect GitHub and select `saintcrimes/plazion`.
3. Use these build settings:

| Setting | Value |
| --- | --- |
| Framework preset | React (Vite), or None with the settings below |
| Production branch | `main` |
| Root directory | Repository root; leave blank |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `24`, selected by `.node-version` |

4. Select **Save and Deploy**. Cloudflare provides your public `*.pages.dev` address after the build completes. The final address is chosen in Cloudflare; this repository does not assume a particular subdomain.

If your build environment requires an explicit version, set the Cloudflare environment variable `NODE_VERSION` to `24`. No API keys, database, backend or other environment variables are needed.

Cloudflare's Git integration builds new production deployments from `main` and can provide preview deployments for other branches. The included GitHub Actions workflow runs translation/content checks and a production build; Cloudflare handles hosting.

See the official [Cloudflare React deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/) and [build configuration guide](https://developers.cloudflare.com/pages/configuration/build-configuration/).

## Website features

- Russian by default, with complete English and Uzbek translations.
- Light and dark themes. First visit follows the operating system theme; explicit choices are saved in browser storage.
- Original animated vector equipment illustrations, air-flow effects and scroll transitions.
- Animation pause control and support for the operating system's reduced-motion setting.
- Keyboard-accessible filtration stages, equipment category filters and product detail dialogs.
- On-demand YouTube demonstration, with an external link as a fallback.
- Technical specifications downloadable as a UTF-8 `.txt` file in the selected language.
- Clickable author email, team details, project partners and a map link.
- An annual B2B subscription at **US$25/year**, with an email inquiry link.
- Responsive navigation, visible keyboard focus and a skip-to-content link.

## Edit content and design

| File | Purpose |
| --- | --- |
| `src/content.js` | All Russian, English and Uzbek text, prices and specifications |
| `src/project.js` | Author name and email, shared by the contact section and downloads |
| `src/App.jsx` | Page sections and interactive behavior |
| `src/EquipmentArt.jsx` | Original SVG concept illustrations |
| `src/styles.css` | Layout, responsive rules, theme variables and animations |
| `index.html` | Default metadata and early preference loading |
| `public/favicon.svg` | PLazion favicon |
| `public/images/plazion.png` | Supplied PLazion brand image used in the header and footer |
| `public/_headers` | Cloudflare response headers and asset caching |
| `tests/content.test.js` | Translation completeness and source-data checks |

When editing text, update the same keys in `ru`, `en` and `uz`. `npm test` checks that their content structures match. Edit theme colors in `:root` and `:root[data-theme="dark"]` in `src/styles.css`.

The supplied `plazion_ru.html` is retained as an original reference. The live website starts at `index.html` and uses the React source in `src/`.

## Content and assets

Specifications, partners and the demonstration video come from the supplied Russian project page. Author attribution, equipment prices (30,000,000 / 6,000,000 / 10,000,000 UZS) and the US$25 annual B2B subscription reflect the owner's updated instructions. The B2B button opens an email inquiry; it does not process payments or create a customer account. Product graphics are concept illustrations, labelled accordingly, rather than photographs of the actual equipment. Confirm product claims and prices when updating the website.

Golos Text is hosted locally with its OFL license, with system fonts as a fallback. The demonstration contacts YouTube only after the visitor opens it. The map opens Google Maps. Email links open the visitor's mail application; no messages are sent automatically.

Icons are from [Lucide](https://lucide.dev/) (ISC license). React and Vite are distributed under the MIT license. No project license is assumed; the repository owner can add one if desired.


## TypeScript, Tailwind and shadcn components

The existing Vite app now supports TypeScript incrementally: existing JSX stays in `src/`, and new typed components live in `/components/ui`. The `@/` alias resolves to the repository root in both TypeScript and Vite. Creating `/components/ui` gives shared UI components one predictable import path and lets the shadcn CLI place new components consistently without mixing them with page content.

- UI components: `components/ui/`
- shadcn configuration: `components.json`
- Shared class-name utility: `lib/utils.ts`
- Tailwind v4 entry and shadcn theme mappings: `src/tailwind.css`
- Existing site styles: `src/styles.css` and `src/design.css`
- Local fonts: `src/fonts.css` and `src/assets/fonts/`

Setup is already present in the working source; after `npm ci`, run `npm run typecheck` and `npm run dev` with the supported Node version. Tailwind uses `@tailwindcss/vite`; its Preflight reset is deliberately omitted to preserve the existing page styles.

To add another shadcn component using the configured paths:

```bash
npx shadcn@latest add button
```

For a separate new Vite project, the initial setup is `npx shadcn@latest init --template vite`. Existing projects can follow the official [shadcn Vite setup](https://ui.shadcn.com/docs/installation/vite) and [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite). Do not reinitialize this configured project just to use the included components.

### PLAZION interactive components

`components/ui/agentic-factory-3d.tsx` adapts the supplied Agentic Factory interaction pattern to the actual PLAZION prototype. It includes assembled, cutaway, separated-station and fresh-air views, five camera presets, station selection, a GPU particle plume and a real-prototype fallback. It is mounted in the main hero.

`components/ui/liquid-sculpture-hero.tsx` adapts the supplied liquid-particle idea into a dirty-air-to-clean-air section. GPU vertex shaders animate the particles; pointer movement stirs them and they settle as the wake fades. It uses procedural airflow rather than the reference component's remote sculpture images. This is a conceptual visualization, not a measured fluid simulation. The two source examples were adapted for PLAZION rather than copied as unrelated video-production and sculpture demos.

Both components support Russian, English and Uzbek, pause controls, reduced motion, offscreen suspension, WebGL fallback, responsive sizing and resource cleanup. `components/ui/demo.tsx` exports standalone examples. The page uses React lazy imports so Three.js is loaded separately.

```tsx
import AgenticFactory3D from '@/components/ui/agentic-factory-3d'
import SculptureHero from '@/components/ui/liquid-sculpture-hero'

<AgenticFactory3D height={640} language="en" />
<SculptureHero height={550} language="en" />
```
