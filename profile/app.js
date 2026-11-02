/* ---------- أدوات ---------- */
const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeUrl = (u = "") => /^(https?:\/\/|mailto:|tel:|\/|images\/)/i.test(u) ? esc(u) : "";
const ic = (n, fb) => /^[a-z0-9-]+$/.test(n || "") ? n : fb;
const $ = id => document.getElementById(id);
const wrap = (inner, cls) => `<div class="${cls} reveal">${inner}</div>`;
const csv = s => String(s || "").split(/[,،\n]/).map(x => x.trim()).filter(Boolean);

/* ---------- الترجمة ---------- */
const UI = {
  en: {
    nav_about:"About", nav_skills:"Skills", nav_projects:"Projects", nav_experience:"Experience", nav_education:"Education",
    nav_certs:"Certifications", nav_recs:"Recommendations", nav_contact:"Contact", nav_about_title:"About Me",
    about_sub:"A quick look at who I am and what I do.", skills_sub:"The tools and strengths I work with.",
    projects_sub:"Selected work. Open any project to see the details.", exp_sub:"Where I've trained, worked, and contributed.",
    edu_sub:"My academic background.", certs_sub:"Courses, training programs, and events I've completed.",
    recs_sub:"Words from the people I've worked with.",
    hello:"Hello, I'm", hero_cta1:"Explore My Projects", hero_cta2:"Contact Me",
    certs_title:"Certifications, Training & Hackathons", recs_title:"Recommendations & Testimonials",
    contact_title:"Let's Connect", contact_side:"Contact information", featured:"Featured project",
    details:"Details", share:"Share project", copied:"Link copied!", open:"Open", view_cert:"View certificate", tech:"Built with", github:"GitHub", live:"Live demo", close:"Close",
    extra:"Additional courses & workshops", related:"Related coursework", soon:"Coming soon...",
    email:"Email", phone:"Phone", location:"Location", to_top:"Back to top", rights:"All rights reserved.",
    f_all:"All", f_شهادة:"Certificates", f_تدريب:"Training", f_هاكاثون:"Hackathons",
    t_شهادة:"Certificate", t_تدريب:"Training", t_هاكاثون:"Hackathon",
    f_name:"Your name", f_email:"Your email", f_subject:"Subject (optional)", f_msg:"Message", f_send:"Send message",
    f_req:"Please fill in this field.", f_email_bad:"Please enter a valid email address.",
    f_sending:"Sending...", f_ok:"Thank you! Your message was sent. I'll get back to you soon.",
    f_err:"Couldn't send the message. Please email me directly:"
  },
  ar: {
    nav_about:"نبذة", nav_skills:"المهارات", nav_projects:"المشاريع", nav_experience:"الخبرات", nav_education:"التعليم",
    nav_certs:"الشهادات", nav_recs:"التوصيات", nav_contact:"تواصل معي", nav_about_title:"نبذة عني",
    about_sub:"نظرة سريعة على من أكون وماذا أعمل.", skills_sub:"الأدوات ونقاط القوة اللي أشتغل بها.",
    projects_sub:"أعمال مختارة. افتحي أي مشروع لتشوفين التفاصيل.", exp_sub:"أماكن تدربت وعملت وساهمت فيها.",
    edu_sub:"خلفيتي الأكاديمية.", certs_sub:"دورات وبرامج تدريبية وفعاليات أكملتها.",
    recs_sub:"كلمات ممن عملت معهم.",
    hello:"مرحبا، أنا", hero_cta1:"استكشف مشاريعي", hero_cta2:"تواصل معي",
    certs_title:"الشهادات والتدريب والهاكاثونات", recs_title:"التوصيات والشهادات",
    contact_title:"لنتواصل", contact_side:"معلومات التواصل", featured:"المشروع الرئيسي",
    details:"تفاصيل", share:"مشاركة المشروع", copied:"تم نسخ الرابط!", open:"فتح", view_cert:"عرض الشهادة", tech:"التقنيات المستخدمة", github:"GitHub", live:"معاينة مباشرة", close:"إغلاق",
    extra:"دورات وورش إضافية", related:"المقررات ذات الصلة", soon:"قريبا...",
    email:"البريد الإلكتروني", phone:"الهاتف", location:"الموقع", to_top:"للأعلى", rights:"جميع الحقوق محفوظة.",
    f_all:"الكل", f_شهادة:"شهادات", f_تدريب:"تدريب", f_هاكاثون:"هاكاثونات",
    t_شهادة:"شهادة", t_تدريب:"تدريب", t_هاكاثون:"هاكاثون",
    f_name:"اسمك", f_email:"بريدك الإلكتروني", f_subject:"الموضوع (اختياري)", f_msg:"رسالتك", f_send:"إرسال الرسالة",
    f_req:"عبي هذا الحقل من فضلك.", f_email_bad:"اكتب بريدا إلكترونيا صحيحا.",
    f_sending:"جاري الإرسال...", f_ok:"شكرا لك! وصلتني رسالتك وبرد عليك قريبا.",
    f_err:"تعذر إرسال الرسالة. راسلني مباشرة على:"
  }
};
const TYPE_ICON = { "شهادة":"bi-patch-check", "تدريب":"bi-mortarboard", "هاكاثون":"bi-trophy" };

let lang = "en", certFilter = "all", PROJECTS = [];
try { lang = localStorage.getItem("lang") === "ar" ? "ar" : "en"; } catch (e) {}
const T = k => UI[lang][k] || k;
const f = (o, k) => (o && (lang === "en" ? (o[k + "_en"] || o[k]) : (o[k] || o[k + "_en"]))) || "";

/* ---------- تحميل المحتوى ---------- */
const NAMES = ["home","about","skills","projects","experience","education","certifications","recommendations","contact","sections"];
let D = {};
async function load(name) {
  try {
    const r = await fetch(`content/${name}.json`, { cache: "no-cache" });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch (e) { console.error("load failed:", name, e); return null; }
}
const list = d => (d && Array.isArray(d.items) ? d.items : []);
function md(text = "") {
  return esc(text).split(/\n{2,}/).map(p => "<p>" + p
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\n/g, "<br>") + "</p>").join("");
}

/* ---------- الرسم ---------- */
function render() {
  const { home, about, skills, projects, experience, education, certifications, recommendations, contact } = D;
  const soon = `<p class="empty-note mb-0 text-center">${T("soon")}</p>`;

  const root = document.documentElement;
  root.lang = lang; root.dir = lang === "ar" ? "rtl" : "ltr";
  $("bsCss").href = `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap${lang === "ar" ? ".rtl" : ""}.min.css`;
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = T(el.dataset.i18n));

  /* الهيرو */
  const name = f(home, "name");
  $("brand").textContent = name;
  $("heroName").textContent = name;
  $("heroRole").innerHTML = f(home, "role").split("|").map(r => r.trim()).filter(Boolean).map(r => `<span>${esc(r)}</span>`).join("");
  $("heroTag").textContent = f(home, "tagline");
  document.title = name;
  const initials = (home && home.initials) || name.split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  $("heroPhoto").innerHTML = `<div class="photo-card"><div class="photo-in">${
    home && safeUrl(home.photo) ? `<img src="${safeUrl(home.photo)}" alt="${esc(name)}">`
    : `<div class="mono"><b>${esc(initials)}</b><small>${esc(name)}</small></div>`}</div></div>`;
  $("highlights").innerHTML = ((home && home.highlights) || []).map(h =>
    `<div class="col-6 col-lg-3"><div class="hl"><span class="ico"><i class="bi bi-${ic(h.icon, "stars")}"></i></span>${esc(f(h, "title"))}</div></div>`).join("");

  /* نبذة */
  $("aboutText").innerHTML = md(f(about, "text"));
  $("aboutPoints").innerHTML = ((about && about.points) || []).map(p =>
    wrap(`<span class="ico"><i class="bi bi-${ic(p.icon, "stars")}"></i></span><span>${esc(f(p, "text"))}</span>`, "point")).join("");

  /* المهارات */
  const sk = list(skills);
  $("skillsList").innerHTML = sk.length ? sk.map(g => wrap(`<div class="card-x sk${g.accent ? " accent" : ""}">
      <h3><span class="ico"><i class="bi bi-${ic(g.icon, "code-slash")}"></i></span>${esc(f(g, "title"))}</h3>
      <div class="chips">${csv(f(g, "list")).map(x => `<span class="chip">${esc(x)}</span>`).join("")}</div></div>`,
      g.accent ? "col-12" : "col-md-6")).join("") : `<div class="col-12">${soon}</div>`;

  /* المشاريع */
  PROJECTS = [...list(projects)].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  $("projectsList").innerHTML = PROJECTS.length ? PROJECTS.map((p, i) => {
    const title = esc(f(p, "title")), desc = esc(f(p, "description"));
    const tech = csv(p.tech).slice(0, 4).map(t => `<span class="chip">${esc(t)}</span>`).join("");
    const gh = safeUrl(p.github) ? `<a class="icon-btn" href="${safeUrl(p.github)}" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub"><i class="bi bi-github"></i></a>` : "";
    const lv = safeUrl(p.link) ? `<a class="icon-btn" href="${safeUrl(p.link)}" target="_blank" rel="noopener" aria-label="${T("live")}" title="${T("live")}"><i class="bi bi-box-arrow-up-right"></i></a>` : "";
    const actions = `<div class="proj-actions"><button class="btn-sm-x fill" type="button" data-proj="${i}"><i class="bi bi-info-circle"></i> ${T("details")}</button>${gh}${lv}</div>`;
    const cover = p.image ? `<img class="cover" src="${safeUrl(p.image)}" alt="${title}" loading="lazy">` : `<div class="cover-ph"><i class="bi bi-rocket-takeoff"></i></div>`;
    if (p.featured) return wrap(`<article class="card-x proj feat"><div class="row g-0">
      <div class="col-lg-5">${p.image ? `<img src="${safeUrl(p.image)}" alt="${title}" loading="lazy" style="width:100%;height:100%;min-height:260px;object-fit:cover">` : `<div class="cover-ph" style="height:100%;min-height:260px;aspect-ratio:auto"><i class="bi bi-rocket-takeoff"></i></div>`}</div>
      <div class="col-lg-7"><div class="body p-4 p-lg-5"><span class="pill">${T("featured")}</span><h3>${title}</h3><p>${desc}</p><div class="chips">${tech}</div>${actions}</div></div></div></article>`, "col-12");
    return wrap(`<article class="card-x proj">${cover}<div class="body"><h3>${title}</h3><p>${desc}</p><div class="chips">${tech}</div>${actions}</div></article>`, "col-md-6 col-lg-4");
  }).join("") : `<div class="col-12">${soon}</div>`;

  /* الخبرات */
  const ex = list(experience);
  $("experienceList").innerHTML = ex.length ? ex.map(x => `<div class="tl-item reveal${x.highlight ? " hi" : ""}">
      <span class="tl-node"><i class="bi bi-${ic(x.icon, "briefcase")}"></i></span>
      <div class="tl-card"><div class="tl-main">
        <div class="tl-meta">${f(x, "type") ? `<span class="tag">${esc(f(x, "type"))}</span>` : ""}
          <span class="date"><i class="bi bi-clock"></i>${esc(f(x, "period"))}</span>
          ${f(x, "badge") ? `<span class="${x.badge_dark ? "badge-d" : "badge-v"}">${esc(f(x, "badge"))}</span>` : ""}</div>
        <h3>${esc(f(x, "role"))}</h3><div class="org">${esc(f(x, "org"))}</div>
        ${f(x, "note") ? `<div class="note"><i class="bi bi-heart"></i> ${esc(f(x, "note"))}</div>` : ""}
        ${f(x, "details") ? `<p>${esc(f(x, "details"))}</p>` : ""}</div>
        ${(x.stats && x.stats.length) ? `<div class="stats">${x.stats.map(s => `<div class="stat"><b>${esc(s.num)}</b><span>${esc(f(s, "label"))}</span></div>`).join("")}</div>` : ""}
      </div></div>`).join("") : soon;

  /* التعليم */
  const ed = list(education);
  $("educationList").innerHTML = ed.length ? ed.map(e => wrap(`<article class="card-x edu"><div class="edu-top">
      <span class="ico"><i class="bi bi-mortarboard"></i></span>
      <div class="edu-info"><h3>${esc(f(e, "degree"))}</h3><div class="sub">${esc(f(e, "school"))}</div>
        ${f(e, "location") ? `<div class="note"><i class="bi bi-geo-alt"></i> ${esc(f(e, "location"))}</div>` : ""}</div>
      ${f(e, "badge") ? `<span class="badge-d">${esc(f(e, "badge"))}</span>` : ""}</div>
      ${csv(f(e, "coursework")).length ? `<div class="rel">${T("related")}</div><div class="chips">${csv(f(e, "coursework")).map(c => `<span class="chip">${esc(c)}</span>`).join("")}</div>` : ""}
    </article>`, "d-block")).join("") : soon;

  /* الشهادات + التصفية */
  const ce = list(certifications);
  const types = ["شهادة","تدريب","هاكاثون"].filter(t => ce.some(c => c.type === t));
  if (certFilter !== "all" && !types.includes(certFilter)) certFilter = "all";
  $("certFilters").innerHTML = types.length > 1 ? ["all", ...types].map(t =>
    `<button type="button" class="filt${certFilter === t ? " on" : ""}" data-filter="${t}">${T("f_" + t)}</button>`).join("") : "";
  const shown = ce.filter(c => certFilter === "all" || c.type === certFilter);
  $("certList").innerHTML = shown.length ? shown.map(c => {
    const t = esc(f(c, "title")), img = safeUrl(c.image);
    return wrap(`<article class="card-x cert">
      ${img ? `<button class="img zoom" type="button" data-zoom="${img}" data-cap="${t}" aria-label="${t}"><img src="${img}" alt="${t}" loading="lazy"></button>`
            : `<div class="img"><i class="bi ${TYPE_ICON[c.type] || "bi-award"} big"></i></div>`}
      <div class="body"><span class="type-chip">${T("t_" + c.type)}</span><h3>${t}</h3>
        ${(f(c, "issuer") || f(c, "meta")) ? `<div class="m">${[f(c, "issuer"), f(c, "meta")].filter(Boolean).map(esc).join(" · ")}</div>` : ""}
        ${f(c, "description") ? `<p>${esc(f(c, "description"))}</p>` : ""}
        ${safeUrl(c.link) ? `<a class="more" href="${safeUrl(c.link)}" target="_blank" rel="noopener">${T("view_cert")}</a>` : ""}</div></article>`, "col-md-6 col-lg-4");
  }).join("") : `<div class="col-12">${soon}</div>`;
  const xs = csv(certifications && (lang === "en" ? (certifications.extra_en || certifications.extra) : (certifications.extra || certifications.extra_en)));
  $("extraBlock").innerHTML = xs.length ? `<div class="extra-t reveal">${T("extra")}</div><div class="extra reveal">${xs.map(x => `<div><i class="bi bi-mortarboard"></i>${esc(x)}</div>`).join("")}</div>` : "";

  /* التوصيات */
  const re = list(recommendations);
  $("recList").innerHTML = re.length ? re.map(r => {
    const img = safeUrl(r.image), a = esc(f(r, "author"));
    return wrap(`<article class="card-x rec">
      ${img ? `<button class="imgbtn" type="button" data-zoom="${img}" data-cap="${a}" aria-label="${a}"><img src="${img}" alt="${a}" loading="lazy"></button>` : `<div class="ph"><i class="bi bi-chat-quote"></i></div>`}
      <div class="body">${f(r, "text") ? `<p class="q">“${esc(f(r, "text"))}”</p>` : ""}<b>${a}</b>${f(r, "title") ? `<span class="role">${esc(f(r, "title"))}</span>` : ""}</div></article>`, "col-md-8 col-lg-5");
  }).join("") : `<div class="col-12">${soon}</div>`;

  /* التواصل */
  const C = contact || {};
  $("contactIntro").textContent = f(C, "intro");
  const cards = [], foot = [];
  const item = (url, icon, label, value, ltr) => {
    const inner = `<span class="ico"><i class="bi bi-${icon}"></i></span><span class="t"><small>${esc(label)}</small><span class="v"${ltr ? ' dir="ltr"' : ""}>${esc(value)}</span></span>`;
    cards.push(url ? `<a class="cc" href="${url}"${/^https?/.test(url) ? ' target="_blank" rel="noopener"' : ""}>${inner}</a>` : `<div class="cc">${inner}</div>`);
  };
  if (C.email) { item("mailto:" + esc(C.email), "envelope", T("email"), C.email, true); foot.push(["envelope", "mailto:" + esc(C.email)]); }
  if (C.phone) { const t = "tel:" + esc(C.phone.replace(/\s/g, "")); item(t, "telephone", T("phone"), C.phone, true); foot.push(["telephone", t]); }
  if (safeUrl(C.linkedin)) { item(safeUrl(C.linkedin), "linkedin", "LinkedIn", C.linkedin_label || "LinkedIn"); foot.push(["linkedin", safeUrl(C.linkedin)]); }
  if (safeUrl(C.x)) { item(safeUrl(C.x), "twitter-x", "X", C.x_label || "X"); foot.push(["twitter-x", safeUrl(C.x)]); }
  if (safeUrl(C.github)) { item(safeUrl(C.github), "github", "GitHub", C.github_label || "GitHub"); foot.push(["github", safeUrl(C.github)]); }
  if (f(C, "location")) item("", "geo-alt", T("location"), f(C, "location"));
  $("contactList").innerHTML = cards.join("");
  window.__mail = C.email || "";

  /* الفوتر */
  $("footName").textContent = name;
  $("footTag").textContent = f(home, "footer_tag");
  $("footIcons").innerHTML = foot.map(([i, u]) => `<a href="${u}" aria-label="${i}"${/^https?/.test(u) ? ' target="_blank" rel="noopener"' : ""}><i class="bi bi-${i}"></i></a>`).join("");
  $("footerText").textContent = `© ${new Date().getFullYear()} ${name}. ${T("rights")}`;

  renderCustom();
  observe();
}

/* ---------- نافذة تفاصيل المشروع ---------- */
function openProject(i) {
  const p = PROJECTS[i]; if (!p) return;
  const title = f(p, "title");
  $("pmTitle").textContent = title;
  const body = f(p, "details") || f(p, "description");
  const tech = csv(p.tech);
  $("pmBody").innerHTML =
    (p.image ? `<img class="pm-img" src="${safeUrl(p.image)}" alt="${esc(title)}">` : "") +
    `<div class="pm-text">${md(body)}</div>` +
    (tech.length ? `<h3 class="fs-6 mt-3">${T("tech")}</h3><div class="chips">${tech.map(t => `<span class="chip">${esc(t)}</span>`).join("")}</div>` : "");
  const shareUrl = safeUrl(p.share_link) || safeUrl(p.link) || safeUrl(p.github);
  $("pmFoot").innerHTML =
    (shareUrl ? `<button type="button" class="btn-sm-x" data-share="${shareUrl}" data-title="${esc(title)}"><i class="bi bi-share"></i> <span>${T("share")}</span></button>` : "") +
    (safeUrl(p.github) ? `<a class="btn-sm-x fill" href="${safeUrl(p.github)}" target="_blank" rel="noopener"><i class="bi bi-github"></i> ${T("github")}</a>` : "") +
    (safeUrl(p.link) ? `<a class="btn-sm-x" href="${safeUrl(p.link)}" target="_blank" rel="noopener"><i class="bi bi-box-arrow-up-right"></i> ${T("live")}</a>` : "") +
    `<button type="button" class="btn-sm-x ms-auto" data-bs-dismiss="modal">${T("close")}</button>`;
  bootstrap.Modal.getOrCreateInstance($("projModal")).show();
}

/* ---------- مشاركة رابط المشروع ---------- */
async function shareProject(btn) {
  const url = btn.dataset.share.replace(/&amp;/g, "&"), title = btn.dataset.title;
  const label = btn.querySelector("span");
  const done = () => { const old = label.textContent; label.textContent = T("copied"); setTimeout(() => label.textContent = T("share"), 2000); };
  if (navigator.share) { try { await navigator.share({ title, url }); return; } catch (err) { if (err && err.name === "AbortError") return; } }
  try { await navigator.clipboard.writeText(url); done(); }
  catch (err) {
    const ta = document.createElement("textarea"); ta.value = url; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); done(); } catch (e2) {} ta.remove();
  }
}

/* ---------- أقسام إضافية تضيفينها من الأدمن ---------- */
const BUILTIN = ["about","skills","projects","experience","education","certifications","recommendations"];
function renderCustom() {
  document.querySelectorAll("[data-custom]").forEach(e => e.remove());
  const secAnchor = {}, liAnchor = {};
  list(D.sections).forEach((s, i) => {
    const title = f(s, "title"); if (!title) return;
    const after = BUILTIN.includes(s.after) ? s.after : "recommendations";
    const id = "x-" + (/^[a-z0-9-]+$/.test(s.slug || "") ? s.slug : (i + 1));
    let body = "";
    if (f(s, "text")) body += `<div class="row justify-content-center mb-4"><div class="col-lg-9 reveal"><div class="about-card">${md(f(s, "text"))}</div></div></div>`;
    const layout = s.layout || "cards";
    if (layout === "chips") {
      const cs = csv(f(s, "chips"));
      if (cs.length) body += `<div class="extra reveal">${cs.map(c => `<div>${esc(c)}</div>`).join("")}</div>`;
    } else if (layout === "cards") {
      const cards = Array.isArray(s.cards) ? s.cards : [];
      if (cards.length) body += `<div class="row g-4 justify-content-center">${cards.map(c => {
        const link = safeUrl(c.link), t = esc(f(c, "title"));
        return wrap(`<article class="card-x proj">
          ${safeUrl(c.image) ? `<img class="cover" src="${safeUrl(c.image)}" alt="${t}" loading="lazy">` : `<div class="cover-ph"><i class="bi bi-${ic(c.icon, "stars")}"></i></div>`}
          <div class="body"><h3>${t}</h3>${f(c, "description") ? `<p>${esc(f(c, "description"))}</p>` : ""}
          ${link ? `<div class="proj-actions"><a class="btn-sm-x fill" href="${link}" target="_blank" rel="noopener">${T("open")} <i class="bi bi-box-arrow-up-right"></i></a></div>` : ""}</div></article>`, "col-md-6 col-lg-4");
      }).join("")}</div>`;
    }
    const el = document.createElement("section");
    el.id = id; el.dataset.custom = "1"; el.className = "sec" + (s.tint ? " sec-alt" : "");
    el.innerHTML = `<div class="container"><div class="sec-head reveal">
      ${s.icon ? `<span class="ico" style="margin:0 auto 1rem"><i class="bi bi-${ic(s.icon, "stars")}"></i></span>` : ""}
      <h2>${esc(title)}</h2>${f(s, "subtitle") ? `<p>${esc(f(s, "subtitle"))}</p>` : ""}</div>${body}</div>`;
    const ref = secAnchor[after] || $(after);
    if (!ref) return;
    ref.insertAdjacentElement("afterend", el); secAnchor[after] = el;

    const navRef = liAnchor[after] || (document.querySelector(`#navMenu .navbar-nav a[href="#${after}"]`) || {}).parentElement;
    if (navRef) {
      const li = document.createElement("li"); li.className = "nav-item"; li.dataset.custom = "1";
      li.innerHTML = `<a class="nav-link" href="#${id}">${esc(title)}</a>`;
      navRef.insertAdjacentElement("afterend", li); liAnchor[after] = li;
    }
  });
  try { bootstrap.ScrollSpy.getOrCreateInstance(document.body, { target: "#mainNav", rootMargin: "-110px 0px -60% 0px" }).refresh(); } catch (e) {}
}

/* ---------- أحداث عامة ---------- */
document.addEventListener("click", e => {
  const sh = e.target.closest("[data-share]"); if (sh) return shareProject(sh);
  const pj = e.target.closest("[data-proj]"); if (pj) return openProject(+pj.dataset.proj);
  const z = e.target.closest("[data-zoom]");
  if (z) { $("imgBig").src = z.dataset.zoom; $("imgBig").alt = z.dataset.cap; $("imgCap").textContent = z.dataset.cap;
    bootstrap.Modal.getOrCreateInstance($("imgModal")).show(); return; }
  const fl = e.target.closest("[data-filter]");
  if (fl) { certFilter = fl.dataset.filter; render(); }
});

$("langBtn").addEventListener("click", () => {
  lang = lang === "ar" ? "en" : "ar";
  try { localStorage.setItem("lang", lang); } catch (e) {}
  render();
});

/* ---------- نموذج التواصل (Netlify Forms) ---------- */
$("contactForm").addEventListener("submit", async e => {
  e.preventDefault();
  const form = e.target, st = $("fStatus"), btn = $("fBtn");
  form.classList.add("was-validated");
  if (!form.checkValidity()) return;
  btn.disabled = true; st.className = "form-status"; st.textContent = T("f_sending");
  try {
    const body = new URLSearchParams(new FormData(form)).toString();
    const r = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
    if (!r.ok) throw new Error(r.status);
    st.className = "form-status ok"; st.textContent = T("f_ok");
    form.reset(); form.classList.remove("was-validated");
  } catch (err) {
    st.className = "form-status err";
    const m = window.__mail;
    st.innerHTML = esc(T("f_err")) + (m ? ` <a href="mailto:${esc(m)}" dir="ltr">${esc(m)}</a>` : "");
  } finally { btn.disabled = false; }
});

/* ---------- ظهور تدريجي + شريط التنقل + زر الأعلى ---------- */
const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}), { threshold: .1 }) : null;
const observe = () => document.querySelectorAll(".reveal:not(.in)").forEach(el => io ? io.observe(el) : el.classList.add("in"));
const onScroll = () => { $("mainNav").classList.toggle("scrolled", scrollY > 40); $("fab").classList.toggle("show", scrollY > 700); };
addEventListener("scroll", onScroll, { passive: true }); onScroll();

/* ---------- تشغيل ---------- */
(async () => {
  const res = await Promise.all(NAMES.map(load));
  NAMES.forEach((n, i) => D[n] = res[i]);
  render();
})();
