// 🐝 Tawon hidup: mengikuti kursor/sentuhan dengan fisika pegas, melayang, sayap mengepak
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var svg = '<svg viewBox="0 0 100 80" width="64" height="52" xmlns="http://www.w3.org/2000/svg"><defs>' +
    '<clipPath id="bc"><ellipse cx="38" cy="47" rx="21" ry="14"/></clipPath>' +
    '<radialGradient id="bg" cx="40%" cy="30%"><stop offset="0" stop-color="#FFD84A"/><stop offset="1" stop-color="#E69A00"/></radialGradient>' +
    '<radialGradient id="th" cx="40%" cy="35%"><stop offset="0" stop-color="#8a6200"/><stop offset="1" stop-color="#3b2800"/></radialGradient></defs>' +
    '<g class="bw bw2"><ellipse cx="46" cy="22" rx="10" ry="19" transform="rotate(-18 46 22)" fill="#dff1ff" fill-opacity=".55" stroke="#fff" stroke-opacity=".9"/></g>' +
    '<g class="bw bw1"><ellipse cx="58" cy="20" rx="9" ry="18" transform="rotate(14 58 20)" fill="#eaf6ff" fill-opacity=".65" stroke="#fff" stroke-opacity=".9"/></g>' +
    '<g stroke="#2b1d00" stroke-width="1.8" stroke-linecap="round"><path d="M30 58l-4 9M40 60l-1 10M52 57l4 9"/></g>' +
    '<path d="M17 47l-9 3 9 3z" fill="#2b1d00"/>' +
    '<ellipse cx="38" cy="47" rx="21" ry="14" fill="url(#bg)"/>' +
    '<g clip-path="url(#bc)" fill="#241800"><rect x="24" y="30" width="6" height="34"/><rect x="36" y="30" width="6" height="34"/><rect x="48" y="30" width="6" height="34"/></g>' +
    '<circle cx="58" cy="43" r="12" fill="url(#th)"/><circle cx="58" cy="43" r="12" fill="none" stroke="#a87a00" stroke-width="1.6" stroke-dasharray="1.5 2.5"/>' +
    '<circle cx="75" cy="44" r="9.5" fill="#2b1d00"/>' +
    '<ellipse cx="79" cy="41" rx="4.2" ry="5" fill="#fff"/><circle cx="80.4" cy="41.6" r="2.4" fill="#111"/><circle cx="81" cy="40.6" r=".9" fill="#fff"/>' +
    '<path d="M80 49q3 2 5 0" stroke="#e8b400" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
    '<path d="M76 36q2-9 9-11M71 36q-1-9 4-13" stroke="#2b1d00" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="85" cy="25" r="1.8" fill="#2b1d00"/><circle cx="75" cy="23" r="1.8" fill="#2b1d00"/></svg>';
  var css = document.createElement('style');
  css.textContent = '#bee{position:fixed;left:0;top:0;z-index:9999;pointer-events:none;will-change:transform;filter:drop-shadow(0 8px 6px rgba(11,25,66,.25))}' +
    '#bee .in{transition:opacity .3s}body.exam #bee .in{opacity:.35}' +
    '.bw{transform-box:fill-box;transform-origin:50% 100%;animation:flap .055s linear infinite alternate}.bw2{animation-delay:-.02s}' +
    '@keyframes flap{from{transform:rotate(-24deg) scaleY(1)}to{transform:rotate(16deg) scaleY(.55)}}' +
    '@media (prefers-reduced-motion:reduce){.bw{animation-duration:.25s}}';
  document.head.appendChild(css);
  var el = document.createElement('div'); el.id = 'bee'; el.innerHTML = '<div class="in">' + svg + '</div>'; document.body.appendChild(el);
  var tx = innerWidth * .6, ty = innerHeight * .4, x = tx, y = ty, vx = 0, vy = 0, face = 1, t = 0, last = performance.now(), idleT = 0;
  function mv(e) { tx = e.clientX; ty = e.clientY; idleT = 0; }
  addEventListener('pointermove', mv, { passive: true }); addEventListener('pointerdown', mv, { passive: true });
  addEventListener('touchmove', function (e) { if (e.touches[0]) mv(e.touches[0]); }, { passive: true });
  function loop(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now; t += dt; idleT += dt;
    var amp = reduce ? .3 : 1, wob = idleT > 1.2 ? 1.8 : 1;                       // diam → melayang lebih lebar (angka delapan)
    var ox = (Math.cos(t * 2.3) * 14 + Math.sin(t * 5.3) * 3) * amp * wob, oy = (Math.sin(t * 4.6) * 9 + Math.cos(t * 7.1) * 3) * amp * wob;
    var gx = tx + (face > 0 ? -48 : 48) + ox, gy = ty - 26 + oy, k = 36, c = 8.5;     // pegas teredam
    vx += ((gx - x) * k - vx * c) * dt; vy += ((gy - y) * k - vy * c) * dt; x += vx * dt; y += vy * dt;
    if (vx > 55) face = 1; else if (vx < -55) face = -1;
    var tilt = Math.max(-28, Math.min(28, vy * .06)) * face + Math.sin(t * 9) * 2 * amp;
    el.style.transform = 'translate(' + (x - 32).toFixed(1) + 'px,' + (y - 26).toFixed(1) + 'px) scaleX(' + face + ') rotate(' + tilt.toFixed(1) + 'deg)';
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
