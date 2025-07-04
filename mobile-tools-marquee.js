// Mobile Tools Marquee Logic (≤768px)
// Only runs on mobile. Desktop grid remains unchanged.
// Adds two marquee rows for tool cards with opposite scroll directions.

document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth > 768) return;
  const grid = document.querySelector('.tools-unique-grid');
  if (!grid) return;
  // Mark grid as replaced
  grid.classList.add('marquee-enabled');
  // Collect tool cards
  const cards = Array.from(grid.children).filter(el => el.classList.contains('tool-card'));
  if (cards.length < 2) return;
  // Split cards into two rows
  const mid = Math.ceil(cards.length / 2);
  const row1 = cards.slice(0, mid);
  const row2 = cards.slice(mid);
  // Create marquee rows
  const marquee1 = document.createElement('div');
  marquee1.className = 'marquee-row marquee-row-1';
  row1.forEach(card => marquee1.appendChild(card.cloneNode(true)));
  // Duplicate for infinite effect
  row1.forEach(card => marquee1.appendChild(card.cloneNode(true)));
  const marquee2 = document.createElement('div');
  marquee2.className = 'marquee-row marquee-row-2';
  row2.forEach(card => marquee2.appendChild(card.cloneNode(true)));
  row2.forEach(card => marquee2.appendChild(card.cloneNode(true)));
  // Insert marquee rows after grid
  grid.parentNode.insertBefore(marquee1, grid.nextSibling);
  grid.parentNode.insertBefore(marquee2, marquee1.nextSibling);
});
