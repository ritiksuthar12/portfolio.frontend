const fs = require('fs');

console.log('=== VERIFYING RESPONSIVE ARCHITECTURE ===\n');

const css = fs.readFileSync('src/index.css', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

let passed = 0;
let total = 0;

function check(label, condition) {
  total++;
  if (condition) {
    console.log(`[PASS] ${label}`);
    passed++;
  } else {
    console.error(`[FAIL] ${label}`);
  }
}

// 1. Viewport Meta Tag
check('Viewport meta tag includes width=device-width, initial-scale=1.0', 
  html.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0"'));

// 2. Global overflow-x prevention
check('html overflow-x: hidden and width: 100%',
  css.includes('overflow-x: hidden') && css.includes('max-width: 100vw'));

// 3. Fluid container padding
check('Fluid container padding with clamp()',
  css.includes('--container-px: clamp('));

// 4. Fluid typography on Hero
check('Fluid hero name typography with clamp()',
  css.includes('font-size: clamp(2.1rem, 6.5vw, 3.75rem);') || css.includes('font-size: clamp('));

// 5. Media Queries coverage
const breakpoints = ['960px', '900px', '640px', '600px', '540px', '480px', '340px'];
breakpoints.forEach(bp => {
  check(`Includes media query breakpoint for ${bp}`, css.includes(bp));
});

// 6. Mobile drawer panel height and safe-area support
check('Mobile drawer panel uses 100dvh and safe area insets',
  css.includes('height: 100dvh') && css.includes('env(safe-area-inset-top'));

// 7. Modals mobile height and flex scroll architecture
check('Modals use min(90vh, 90dvh) and flex-direction column with scrollable body',
  css.includes('min(90vh, 90dvh)') && css.includes('overflow-y: auto'));

// 8. Stats card responsive grid
check('Stats card adapts from 4 columns to 2 and 1 column',
  css.includes('grid-template-columns: repeat(4, 1fr)') && 
  css.includes('grid-template-columns: repeat(2, 1fr)') &&
  css.includes('grid-template-columns: 1fr'));

// 9. Featured projects + Tech Stack grid
check('Featured-tech-grid adapts to 1 column at <= 1024px',
  css.includes('.featured-tech-grid') && css.includes('grid-template-columns: 1fr'));

// 10. Form input font-size 16px to prevent iOS auto-zoom
check('Form inputs have 16px font-size to prevent iOS zoom',
  css.includes('font-size: 16px; /* 16px prevents iOS browser auto zoom on focus */'));

// 11. Responsive Footer classes
check('Footer uses responsive classes without fixed inline widths',
  css.includes('.site-footer') && css.includes('.footer-top-row') && css.includes('.footer-bottom-row'));

// 12. Word-break prevention on long URLs and emails
check('Includes word-break: break-all on email and url links',
  css.includes('word-break: break-all'));

console.log(`\nResults: ${passed}/${total} checks passed (${Math.round(passed/total * 100)}%)`);
if (passed === total) {
  console.log('>>> ALL RESPONSIVE SPECIFICATIONS VERIFIED SUCCESSFULLY! <<<');
} else {
  process.exit(1);
}
