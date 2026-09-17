/* ДОЖИМ — эфирная механика: один оркестрованный выход, дальше только скролл и часы */

const ru = new Intl.NumberFormat('ru-RU');
const $ = (s) => document.querySelector(s);
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

$('#year').textContent = new Date().getFullYear();

/* ─── Часы эфира: телемагазин не заканчивается никогда ─── */
(() => {
  const el = $('#clock');
  let left = 14 * 60 + 59;
  const tick = () => {
    if (left-- <= 0) left = 14 * 60 + 59;          // эфир продлевается сам
    const m = String(Math.floor(left / 60)).padStart(2, '0');
    el.textContent = `${m}:${String(left % 60).padStart(2, '0')}`;
  };
  tick();
  setInterval(tick, 1000);
})();

/* ─── Остаток партии тает сам по себе ─── */
(() => {
  const el = $('#ostatok').querySelector('b');
  let n = 7;
  setInterval(() => { if (n > 2) el.textContent = --n; }, 47000);
})();

if (!calm) {
  gsap.registerPlugin(ScrollTrigger);

  /* ─── 1. Выход в эфир ─── */
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.onair',        { y: -20, opacity: 0, duration: .5 })
    .from('.wordmark',     { clipPath: 'inset(0 100% 0 0)', duration: .9, ease: 'power4.inOut' }, '-=.2')
    .from('.hero__lead',   { y: 16, opacity: 0, duration: .6 }, '-=.45')
    .from('.hero__host',   { opacity: 0, duration: .7 }, '-=.6')
    .from('.hero__product',{ x: -60, y: 40, opacity: 0, duration: .8, ease: 'back.out(1.5)' }, '-=.45')
    .from('.pricetag',     { scale: .4, rotate: -22, opacity: 0, duration: .55, ease: 'back.out(2.4)' }, '-=.3')
    .from('.hero__buy .btn',   { y: 14, opacity: 0, duration: .45 }, '-=.35')
    .from('.hero__scarcity',   { opacity: 0, duration: .45 }, '-=.2')
    .to('.spark', { opacity: 1, scale: 2.1, duration: .12, ease: 'none' }, '-=.55')
    .to('.spark', { opacity: 0, duration: .45 });

  /* Разряд повторяется — редко, чтобы не мельтешить */
  gsap.timeline({ repeat: -1, repeatDelay: 8, delay: 6 })
    .to('.spark', { opacity: .9, scale: 1.8, duration: .09 })
    .to('.spark', { opacity: 0, scale: 1, duration: .4 });

  /* ─── 2. Плашка выезжает, когда эфир ушёл за экран ─── */
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'bottom 85%',
    onEnter:     () => gsap.to('#lower', { yPercent: 0,   duration: .45, ease: 'power3.out' }),
    onLeaveBack: () => gsap.to('#lower', { yPercent: 105, duration: .35, ease: 'power3.in' })
  });

  /* ─── 3. Счётчик сгоревшего — скрабом по скроллу ─── */
  const burn = { v: 0 };
  gsap.to(burn, {
    v: 812_470_000_000,
    ease: 'none',
    onUpdate: () => { $('#burncount').textContent = ru.format(Math.round(burn.v)); },
    scrollTrigger: { trigger: '#burn', start: 'top 80%', end: 'bottom 70%', scrub: .4 }
  });

  /* ─── 4. Ошейник затягивается по мере чтения ─── */
  gsap.fromTo('#collar',
    { scale: 1.14, rotate: -7 },
    { scale: .93, rotate: 4, ease: 'none',
      scrollTrigger: { trigger: '.b2b', start: 'top bottom', end: 'bottom top', scrub: .6 } });

  /* ─── 5. Полоса сбора: доезжает ровно до восьми процентов ─── */
  gsap.from('#fundbar', {
    width: 0, duration: 1.6, ease: 'power2.out',
    scrollTrigger: { trigger: '.fund__meter', start: 'top 78%', once: true }
  });

  /* ─── 6. Товар в эфире слегка плывёт при скролле ─── */
  gsap.to('.hero__product', {
    yPercent: -14, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 }
  });

  addEventListener('load', () => ScrollTrigger.refresh());
}
