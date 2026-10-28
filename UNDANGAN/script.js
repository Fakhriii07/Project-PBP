document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  const cover = $("cover"), music = $("bg-music"), btnMusic = $("btn-music");
  let playing = false;

  const to = new URLSearchParams(location.search).get("to");
  if (to) $("guest-name").textContent = to;

  $("lovebg").textContent = "Love You, I Love You. ".repeat(90);

  const setMusic = on => {
    playing = on;
    if (on) music.play().catch(() => (playing = false));
    else music.pause();
    btnMusic.classList.toggle("playing", playing);
  };
  btnMusic.addEventListener("click", () => setMusic(!playing));

  $("btn-buka").addEventListener("click", () => {
    cover.classList.add("open");
    document.body.classList.remove("locked");
    window.scrollTo(0, 0);
    setMusic(true);
    startHearts();
    setTimeout(() => (cover.style.display = "none"), 1100);
  });

  function startHearts() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cols = ["#B5473A", "#D4958B"];
    setInterval(() => {
      if (document.hidden) return;
      const el = document.createElement("span");
      el.className = "heart"; el.textContent = "♥";
      el.style.cssText = `left:${Math.random() * 100}vw;--s:${10 + Math.random() * 12}px;--c:${cols[Math.random() * 2 | 0]};--d:${6 + Math.random() * 5}s;--x:${(Math.random() - .5) * 120}px`;
      el.addEventListener("animationend", () => el.remove());
      document.body.appendChild(el);
    }, 1800);
  }

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  const target = new Date("2026-12-12T08:00:00+07:00").getTime();
  const pad = n => String(n).padStart(2, "0");
  const tick = () => {
    const d = target - Date.now();
    if (d <= 0) {
      document.querySelector(".count").innerHTML = "<p class='script red fs-4'>Acara telah berlangsung</p>";
      return clearInterval(timer);
    }
    $("days").textContent = pad(Math.floor(d / 864e5));
    $("hours").textContent = pad(Math.floor(d % 864e5 / 36e5));
    $("minutes").textContent = pad(Math.floor(d % 36e5 / 6e4));
    const sc = $("seconds"), nv = pad(Math.floor(d % 6e4 / 1e3));
    if (sc.textContent !== nv) { sc.textContent = nv; sc.classList.remove("pop"); void sc.offsetWidth; sc.classList.add("pop"); }
  };
  const timer = setInterval(tick, 1000); tick();

  $("btn-cal").href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent("Pernikahan Ahmad & Aisyah") +
    "&dates=20261212T010000Z/20261212T070000Z" +
    "&location=" + encodeURIComponent("Masjid Al-Ikhlas, Surabaya");

  const toast = msg => {
    if (!window.bootstrap) return;
    $("toast-msg").textContent = msg;
    bootstrap.Toast.getOrCreateInstance($("toast"), { delay: 2500 }).show();
  };
  $("mapModal").addEventListener("show.bs.modal", e => {
    const d = e.relatedTarget.dataset;
    $("mapTitle").textContent = d.place;
    $("mapAddr").textContent = d.addr;
    $("mapLink").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(d.place + ", " + d.addr);
  });

  $("btn-copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("rek-number").textContent.trim()); toast("Nomor rekening tersalin"); }
    catch { toast("Gagal menyalin, salin manual ya"); }
  });

  $("rsvpForm").addEventListener("submit", e => {
    e.preventDefault();
    const li = document.createElement("li");
    const b = document.createElement("b"), s = document.createElement("small"), p = document.createElement("p");
    b.textContent = $("f-name").value;
    s.textContent = " - " + document.querySelector("input[name=status]:checked").value;
    p.textContent = $("f-msg").value;
    li.append(b, s, p);
    $("wishes").prepend(li);
    e.target.reset();
    toast("Terima kasih, konfirmasi dan doa Anda terkirim");
  });
});