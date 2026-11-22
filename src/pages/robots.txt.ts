// robots.txt is generated, not a static file, so the Sitemap line always
// uses the site URL from astro.config.mjs — the one place the domain lives.
// Change the domain there and this updates itself.
export function GET({ site }) {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const body = `User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
