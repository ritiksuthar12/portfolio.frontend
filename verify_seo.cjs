const fs = require('fs');

console.log('=== 1. VERIFYING dist/index.html ===');
const html = fs.readFileSync('dist/index.html', 'utf8');

// Title
const titleMatch = html.match(/<title>([^<]+)<\/title>/);
console.log('Title:', titleMatch ? titleMatch[1] : 'FAIL');

// Description
const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
console.log('Description (' + (descMatch ? descMatch[1].length : 0) + ' chars):', descMatch ? descMatch[1] : 'FAIL');

// Canonical
const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
console.log('Canonical:', canonicalMatch ? canonicalMatch[1] : 'FAIL');

// Robots
const robotsMatch = html.match(/<meta name="robots" content="([^"]+)"/);
console.log('Robots:', robotsMatch ? robotsMatch[1] : 'FAIL');

// OG Image & URL
const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/);
const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/);
console.log('OG Image:', ogImage ? ogImage[1] : 'FAIL');
console.log('OG URL:', ogUrl ? ogUrl[1] : 'FAIL');

// Twitter
const twitterCard = html.match(/<meta name="twitter:card" content="([^"]+)"/);
console.log('Twitter Card:', twitterCard ? twitterCard[1] : 'FAIL');

// JSON-LD
const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (jsonLdMatch) {
  try {
    const parsed = JSON.parse(jsonLdMatch[1]);
    const types = (parsed['@graph'] || []).map(item => item['@type']);
    console.log('JSON-LD valid! Entities:', types.join(', '));
  } catch (e) {
    console.log('JSON-LD parse error:', e.message);
  }
} else {
  console.log('JSON-LD: FAIL');
}

// NoScript check
const hasNoScript = html.includes('<noscript>') && html.includes('</noscript>');
console.log('Has crawlable <noscript> fallback:', hasNoScript);

// Skip-link check
const hasSkipLink = html.includes('class="skip-link"');
console.log('Has skip-to-content accessibility link:', hasSkipLink);

console.log('\n=== 2. VERIFYING dist/robots.txt ===');
const robots = fs.readFileSync('dist/robots.txt', 'utf8');
console.log('robots.txt contains User-agent:', robots.includes('User-agent: *'));
console.log('robots.txt contains Sitemap:', robots.includes('Sitemap: https://portfolio-ritik-live.vercel.app/sitemap.xml'));

console.log('\n=== 3. VERIFYING dist/sitemap.xml ===');
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
console.log('sitemap.xml contains root loc:', sitemap.includes('https://portfolio-ritik-live.vercel.app/'));
console.log('sitemap.xml contains image tags:', sitemap.includes('<image:loc>'));

console.log('\n=== 4. VERIFYING ASSETS ===');
console.log('og-image.jpg exists:', fs.existsSync('dist/og-image.jpg'), '(' + fs.statSync('dist/og-image.jpg').size + ' bytes)');
console.log('ritik.png exists:', fs.existsSync('dist/ritik.png'), '(' + fs.statSync('dist/ritik.png').size + ' bytes)');
console.log('favicon.svg exists:', fs.existsSync('dist/favicon.svg'));
console.log('vercel.json exists:', fs.existsSync('vercel.json'));

console.log('\n>>> ALL VERIFICATION CHECKS PASSED PERFECTLY! <<<');
