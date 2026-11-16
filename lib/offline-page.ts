/** Address the privacy policy gives for questions and data requests. */
const CONTACT_EMAIL = "info@nesveskvienas.lt";

interface OfflineNotice {
  lang: "lt" | "en" | "uk" | "ru";
  status: string;
  thanks: string;
  contact: string;
}

const NOTICES: readonly OfflineNotice[] = [
  {
    lang: "lt",
    status: "Svetainė šiuo metu išjungta.",
    thanks: "Ačiū visiems, kurie dalyvavo.",
    contact: "Klausimai ir prašymai dėl jūsų duomenų:",
  },
  {
    lang: "en",
    status: "The site is currently offline.",
    thanks: "Thank you to everyone who took part.",
    contact: "Questions and requests about your data:",
  },
  {
    lang: "uk",
    status: "Сайт наразі вимкнено.",
    thanks: "Дякуємо всім, хто долучився.",
    contact: "Питання та запити щодо ваших даних:",
  },
  {
    lang: "ru",
    status: "Сайт сейчас отключён.",
    thanks: "Спасибо всем, кто участвовал.",
    contact: "Вопросы и запросы о ваших данных:",
  },
];

const renderNotice = ({ lang, status, thanks, contact }: OfflineNotice) =>
  `<section lang="${lang}">
<p><strong>${status}</strong> ${thanks}</p>
<p>${contact} <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>
</section>`;

/**
 * Self-contained page shown for every route while the site is offline: no
 * scripts, fonts or third-party requests, so it needs neither Clerk nor Convex.
 */
export const OFFLINE_HTML = `<!doctype html>
<html lang="lt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Nešvęsk vienas</title>
<link rel="icon" href="/favicon.ico">
<style>
:root { color-scheme: dark; }
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #0f172a;
  color: #cbd5e1;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5;
}
main { max-width: 32rem; padding: 3rem 1.5rem; }
h1 { margin: 0 0 2rem; color: #fbbf24; font-size: 2.25rem; font-weight: 600; }
section { padding: 1.25rem 0; border-top: 1px solid #334155; }
p { margin: 0 0 0.5rem; }
strong { color: #f8fafc; font-weight: 600; }
a { color: #fbbf24; }
</style>
</head>
<body>
<main>
<h1>Nešvęsk vienas</h1>
${NOTICES.map(renderNotice).join("\n")}
</main>
</body>
</html>`;

/** 503 tells browsers and search engines the site is down, not gone. */
export const offlineResponse = (): Response =>
  new Response(OFFLINE_HTML, {
    status: 503,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/html; charset=utf-8",
    },
  });
