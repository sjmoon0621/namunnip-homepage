(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 헤더: 히어로를 지나면 불투명 */
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  new IntersectionObserver(([e]) => header.classList.toggle("is-solid", !e.isIntersecting),
    { rootMargin: `-${header.offsetHeight}px 0px 0px 0px` }).observe(hero);

  /* 모바일 메뉴 */
  const btn = document.getElementById("menuBtn");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  btn.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  document.querySelectorAll("#nav a").forEach(a => a.addEventListener("click", () => setMenu(false)));

  /* 스크롤 등장 */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  /* 히어로: 심볼 조각들이 깔린 들판에서, 잎이 하나씩 초록으로 자라난다 */
  const field = document.getElementById("field");
  const VIEW = ["627 324.8 144 144", "782.4 324.8 144 144", "627 480 144 144", "782.4 480 144 144"]; // ㄴ ㅁ ㅇ 잎
  let tiles = [], leaves = [];

  function build() {
    const w = field.clientWidth, h = field.clientHeight;
    const cell = w < 760 ? 72 : w < 1200 ? 100 : 124;
    const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
    field.style.setProperty("--cols", cols);
    field.style.setProperty("--cell", `${cell}px`);
    field.innerHTML = "";
    tiles = [];
    for (let i = 0; i < cols * rows; i++) {
      const t = document.createElement("div");
      const k = (i * 7 + Math.floor(i / cols) * 3) % 4;
      t.className = "tile";
      t.dataset.k = k;
      t.innerHTML = `<svg viewBox="${VIEW[k]}"><use href="#nm-symbol" x="627" y="324.8" width="299.2" height="299.1"/></svg>`;
      field.appendChild(t);
      tiles.push(t);
    }
    // 잎 조각만 자란다. 처음부터 몇 장은 자라 있는 상태 (오른쪽 위에 몰리게)
    leaves = tiles.filter(t => t.dataset.k === "3");
    leaves.forEach(t => {
      const i = tiles.indexOf(t);
      const x = (i % cols) / cols, y = Math.floor(i / cols) / rows;
      if (Math.random() < 0.9 * x * (1 - y)) grow(t);
    });
  }

  function grow(t) {
    const r = Math.random();
    t.classList.add("is-grown");
    t.classList.toggle("is-deep", r < 0.3);
    t.classList.toggle("is-light", r > 0.8);
  }

  build();
  let rt;
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 200); });

  if (!reduce) {
    setInterval(() => {
      if (!leaves.length || document.hidden) return;
      const t = leaves[Math.floor(Math.random() * leaves.length)];
      if (t.classList.contains("is-grown") && Math.random() < 0.45) t.classList.remove("is-grown");
      else grow(t);
    }, 700);
  }
})();
