import { useEffect, useMemo, useRef, useState } from "react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" }
];

const projectCards = [
  {
    title: "Volt Scheduler",
    description:
      "A full-stack calendar application with user authentication and event management. Features per-user event tracking, real-time updates, and a responsive modern UI.",
    impact:
      "Delivered secure, end-to-end event workflows with account-based data isolation, Dockerized deployment, and production hosting on a VPS behind Nginx with HTTPS.",
    stack: ["Java 25", "Spring Boot 3.5", "PostgreSQL", "Thymeleaf", "Docker"],
    features: [
      "User authentication with BCrypt password hashing",
      "Create, update, and delete events",
      "Spring Security integration",
      "Responsive calendar UI"
    ],
    github: "https://github.com/Low-Volt/Volt-Scheduler",
    live: "https://low-voltage.xyz/scheduler",
    lightImage: "/images/Volt-Scheduler-Light.png",
    darkImage: "/images/Volt-Scheduler-Night.png"
  },
  {
    title: "More Projects Coming Soon",
    description: "Check back for additional projects and updates.",
    impact: "Impact lines will be included for each new project.",
    stack: ["In Progress"],
    features: ["Roadmap-driven releases", "New showcase projects", "Frequent updates"],
    image: "/images/code-window.svg"
  }
];

const skillGroups = [
  {
    title: "Frontend",
    items: [
      "React 18 (Hooks, JSX)",
      "Vite 5",
      "Tailwind CSS 3",
      "JavaScript (ES6+)",
      "Responsive Layout Design",
      "Light / Night Theme System"
    ]
  },
  {
    title: "UI & Motion",
    items: [
      "CSS Keyframe Animations",
      "Custom Scrollbar",
      "Google reCAPTCHA",
      "Gradient & Visual Layering",
      "SVG Illustration",
      "Accessible Markup (ARIA)"
    ]
  },
  {
    title: "Backend & APIs",
    items: [
      "Java 25",
      "Spring Boot 3.5",
      "Node.js + Express",
      "PostgreSQL",
      "REST API Design",
      "Zod Schema Validation"
    ]
  },
  {
    title: "DevOps & Infrastructure",
    items: [
      "Docker + Multi-stage Builds",
      "Dokploy VPS Deployment",
      "Nginx Reverse Proxy",
      "HTTPS / TLS",
      "DNS & Domain Management",
      "GitHub + GitHub Copilot"
    ]
  }
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
    company: ""
  });
  const [captchaToken, setCaptchaToken] = useState("");
  const [submitStatus, setSubmitStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef(null);
  const recaptchaWidgetId = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = saved || (preferredDark ? "night" : "light");
    setTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    const scrollbar = document.getElementById("customScrollbar");
    const track = document.getElementById("customScrollbarTrack");
    const thumb = document.getElementById("customScrollbarThumb");
    if (!scrollbar || !track || !thumb) return;

    let isDragging = false;
    let dragOffsetY = 0;
    let rafId = null;
    let fadeTimer = null;

    const showScrollbar = () => {
      if (scrollbar.style.display === "none") return;
      scrollbar.classList.add("is-visible");
      if (fadeTimer) clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => {
        if (!isDragging) scrollbar.classList.remove("is-visible");
      }, 900);
    };

    const updateThumb = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const viewportHeight = window.innerHeight;
      const documentHeight = doc.scrollHeight;
      const maxScroll = Math.max(documentHeight - viewportHeight, 1);
      const trackHeight = track.clientHeight;
      const thumbHeight = Math.max((viewportHeight / documentHeight) * trackHeight, 42);
      const maxThumbTop = Math.max(trackHeight - thumbHeight, 0);
      const thumbTop = (scrollTop / maxScroll) * maxThumbTop;
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.top = `${Math.max(0, Math.min(maxThumbTop, thumbTop))}px`;
      const shouldHide = documentHeight <= viewportHeight + 1;
      scrollbar.style.display = shouldHide ? "none" : "block";
      if (shouldHide) {
        scrollbar.classList.remove("is-visible");
        if (fadeTimer) { clearTimeout(fadeTimer); fadeTimer = null; }
      }
    };

    const requestThumbUpdate = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => { updateThumb(); rafId = null; });
    };

    const scrollToTrackPosition = (clientY, centerThumb) => {
      const doc = document.documentElement;
      const trackRect = track.getBoundingClientRect();
      const trackHeight = track.clientHeight;
      const thumbHeight = thumb.offsetHeight;
      const maxThumbTop = Math.max(trackHeight - thumbHeight, 0);
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 0);
      let relativeY = clientY - trackRect.top;
      if (centerThumb) relativeY -= thumbHeight / 2;
      const thumbTop = Math.max(0, Math.min(maxThumbTop, relativeY));
      const progress = maxThumbTop > 0 ? thumbTop / maxThumbTop : 0;
      window.scrollTo({ top: progress * maxScroll, behavior: "auto" });
    };

    const onThumbMouseDown = (e) => {
      isDragging = true;
      dragOffsetY = e.clientY - thumb.getBoundingClientRect().top;
      document.body.style.userSelect = "none";
      showScrollbar();
      e.preventDefault();
    };
    const onDocMouseMove = (e) => {
      if (!isDragging) return;
      scrollToTrackPosition(e.clientY - dragOffsetY + thumb.offsetHeight / 2, true);
      showScrollbar();
    };
    const onDocMouseUp = () => {
      isDragging = false;
      document.body.style.userSelect = "";
      showScrollbar();
    };
    const onTrackClick = (e) => {
      if (e.target === thumb) return;
      scrollToTrackPosition(e.clientY, true);
      showScrollbar();
    };
    const onScroll = () => { requestThumbUpdate(); showScrollbar(); };

    thumb.addEventListener("mousedown", onThumbMouseDown);
    document.addEventListener("mousemove", onDocMouseMove);
    document.addEventListener("mouseup", onDocMouseUp);
    track.addEventListener("click", onTrackClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", showScrollbar, { passive: true });
    window.addEventListener("touchmove", showScrollbar, { passive: true });
    window.addEventListener("resize", requestThumbUpdate);
    updateThumb();
    showScrollbar();

    return () => {
      thumb.removeEventListener("mousedown", onThumbMouseDown);
      document.removeEventListener("mousemove", onDocMouseMove);
      document.removeEventListener("mouseup", onDocMouseUp);
      track.removeEventListener("click", onTrackClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", showScrollbar);
      window.removeEventListener("touchmove", showScrollbar);
      window.removeEventListener("resize", requestThumbUpdate);
      if (fadeTimer) clearTimeout(fadeTimer);
    };
  }, []);

  useEffect(() => {
    const loadContactConfig = async () => {
      try {
        const response = await fetch("/api/contact-config");
        if (!response.ok) {
          return;
        }
        const json = await response.json();
        setRecaptchaSiteKey(json.recaptchaSiteKey || "");
      } catch (_error) {
        setRecaptchaSiteKey("");
      }
    };

    loadContactConfig();
  }, []);

  useEffect(() => {
    if (!recaptchaSiteKey || !recaptchaRef.current) {
      return;
    }

    const renderRecaptcha = () => {
      if (!window.grecaptcha || !recaptchaRef.current) {
        return;
      }

      if (recaptchaWidgetId.current !== null) {
        recaptchaRef.current.innerHTML = "";
        recaptchaWidgetId.current = null;
      }

      recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
        sitekey: recaptchaSiteKey,
        theme: theme === "night" ? "dark" : "light",
        callback: (token) => {
          setCaptchaToken(token);
          setSubmitStatus({ type: "idle", message: "" });
        },
        "expired-callback": () => setCaptchaToken(""),
        "error-callback": () => setCaptchaToken("")
      });
    };

    const existingScript = document.querySelector('script[src="https://www.google.com/recaptcha/api.js?render=explicit"]');
    if (existingScript) {
      if (window.grecaptcha) {
        renderRecaptcha();
      } else {
        const handleLoad = () => renderRecaptcha();
        existingScript.addEventListener("load", handleLoad, { once: true });
        return () => existingScript.removeEventListener("load", handleLoad);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = renderRecaptcha;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [recaptchaSiteKey, theme]);

  const themeLabel = useMemo(
    () => (theme === "light" ? "Switch to night mode" : "Switch to light mode"),
    [theme]
  );

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "night" : "light"));
  };

  const closeMenu = () => setMenuOpen(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((curr) => ({ ...curr, [name]: value }));
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    if (!captchaToken) {
      setSubmitStatus({ type: "error", message: "Please complete the captcha challenge." });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: "loading", message: "Sending your message..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formState,
          captchaToken
        })
      });

      if (!response.ok) {
        const json = await response.json().catch(() => ({ error: "Could not send right now." }));
        throw new Error(json.error || "Could not send right now.");
      }

      setFormState({ name: "", email: "", message: "", company: "" });
      setSubmitStatus({ type: "success", message: "Message sent successfully. Thank you!" });
      setCaptchaToken("");
      if (window.grecaptcha && recaptchaWidgetId.current !== null) {
        window.grecaptcha.reset(recaptchaWidgetId.current);
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: error.message || "Could not send right now." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-app text-slate-900 transition-colors duration-500 dark:text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="hero-ambient hero-ambient-a" />
        <div className="hero-ambient hero-ambient-b" />
        <div className="reach-light reach-light-1" />
        <div className="reach-light reach-light-2" />
        <div className="reach-light reach-light-3" />
        <div className="reach-light reach-light-4" />
        <div className="reach-light reach-light-5" />
        <div className="reach-light reach-light-6" />
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-app/90 backdrop-blur-xl dark:border-slate-700/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#home" className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Portfolio
          </a>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary Navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-semibold text-slate-700 transition hover:text-mint-600 dark:text-slate-300 dark:hover:text-mint-400">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={themeLabel}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-lg transition hover:border-mint-400 hover:text-mint-600 dark:border-slate-600 dark:bg-slate-800/80 dark:hover:text-mint-300"
            >
              {theme === "light" ? "☾" : "☀"}
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/80 md:hidden dark:border-slate-600 dark:bg-slate-800/80"
              aria-label="Toggle mobile menu"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-slate-200 bg-app/95 px-4 py-3 md:hidden dark:border-slate-700" aria-label="Mobile Navigation">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-mint-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-mint-300"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main>
        <section id="home" className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pt-24">
          <div>
            <p className="mb-5 inline-flex items-center rounded-full border border-mint-300/70 bg-mint-100/70 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-black dark:border-mint-600/60 dark:bg-mint-950/30 dark:text-black">
              Full Stack Developer
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Elijah Richter
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-300">
              Building scalable web applications with Java, Spring Boot, and modern frontend technologies.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#projects" className="rounded-xl bg-mint-500 px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-mint-600">
                View My Work
              </a>
              <a href="https://raw.githubusercontent.com/Low-Volt/Portfolio/main/document/Elijah%20Richter%20Resume%20May%202026.pdf" className="rounded-xl border border-slate-300 bg-white/80 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-mint-400 hover:text-mint-600 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:text-mint-300" target="_blank" rel="noreferrer">
                Resume
              </a>
            </div>
          </div>

          <div className="relative isolate flex items-center justify-center">
            <img src="/images/hero-dev.svg" alt="Stylized developer workspace illustration" className="w-full max-w-md rounded-3xl border border-slate-300/70 bg-white/60 p-3 shadow-2xl shadow-slate-400/20 dark:border-slate-600/70 dark:bg-slate-800/60" />
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-300/70 bg-white/70 p-8 backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-900/60">
            <h2 className="font-display text-3xl font-bold">About Me</h2>
            <div className="mt-6 grid gap-4 text-slate-700 dark:text-slate-300">
              <p>
                I&apos;m a full stack developer passionate about creating clean, efficient, and user-friendly applications. With experience in Java, Spring Boot, and modern web technologies, I love tackling complex problems and building solutions that make a real impact.
              </p>
              <p>
                I hold a <strong>B.S. in Computer Science from Lee University</strong>, where I developed a strong foundation in software engineering principles and best practices.
              </p>
              <p>
                I deploy and maintain both this portfolio and my live applications on a VPS, handling Dockerized services, Nginx reverse proxy configuration, HTTPS, DNS, and production operations.
              </p>
              <p>
                When I&apos;m not coding, you&apos;ll find me exploring new technologies, contributing to open source, and continuously improving my craft.
              </p>
            </div>
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-3xl font-bold">Featured Projects</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {projectCards.map((project) => (
              <article key={project.title} className="card-hover overflow-hidden rounded-3xl border border-slate-300/70 bg-white/75 shadow-lg shadow-slate-400/10 hover:-translate-y-1 dark:border-slate-700/70 dark:bg-slate-900/60">
                <img
                  src={project.lightImage ? (theme === "night" ? project.darkImage : project.lightImage) : project.image}
                  alt={`${project.title} showcase`}
                  className="h-44 w-full object-cover"
                />
                <div className="space-y-4 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="font-display text-2xl font-semibold">{project.title}</h3>
                    <div className="flex gap-2">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-bold uppercase tracking-wide hover:border-mint-400 hover:text-mint-600 dark:border-slate-600 dark:hover:text-mint-300">
                          GitHub
                        </a>
                      )}
                      {project.live && (
                        <a href={project.live} target="_blank" rel="noreferrer" className="rounded-lg bg-mint-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white hover:bg-mint-600">
                          Live App
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Impact: {project.impact}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span key={tech} className="rounded-full border border-mint-300/70 bg-mint-100/70 px-3 py-1 text-xs font-semibold text-mint-700 dark:border-mint-700/60 dark:bg-mint-950/40 dark:text-mint-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                    {project.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold">Skills & Technologies</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {skillGroups.map((group) => (
              <article key={group.title} className="card-hover rounded-2xl border border-slate-300/70 bg-white/70 p-5 dark:border-slate-700/70 dark:bg-slate-900/60">
                <h3 className="font-display text-xl font-semibold text-mint-600 dark:text-mint-300">{group.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {group.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
          <div className="grid items-start gap-8 rounded-3xl border border-slate-300/70 bg-white/80 p-8 dark:border-slate-700/70 dark:bg-slate-900/70 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="font-display text-3xl font-bold">Get In Touch</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-300">
                Feel free to reach out for collaborations or just a friendly hello.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="https://github.com/Low-Volt" target="_blank" rel="noreferrer" className="rounded-xl border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold hover:border-mint-400 hover:text-mint-600 dark:border-slate-600 dark:bg-slate-800/70 dark:hover:text-mint-300">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/elijah-richter-1a6830275/" target="_blank" rel="noreferrer" className="rounded-xl border border-slate-300 bg-white/70 px-4 py-2 text-sm font-semibold hover:border-mint-400 hover:text-mint-600 dark:border-slate-600 dark:bg-slate-800/70 dark:hover:text-mint-300">
                  LinkedIn
                </a>
                <a href="mailto:elirichter77@gmail.com" className="rounded-xl bg-mint-500 px-4 py-2 text-sm font-semibold text-white hover:bg-mint-600">
                  Email Directly
                </a>
              </div>

              <img src="/images/network-nodes.svg" alt="Connected network nodes representing communication" className="mt-8 w-full rounded-2xl border border-slate-300/70 bg-white/60 p-2 dark:border-slate-700/70 dark:bg-slate-800/60" />
            </div>

            <form onSubmit={handleContactSubmit} className="rounded-2xl border border-slate-300/70 bg-white/70 p-5 dark:border-slate-700/70 dark:bg-slate-800/60">
              <h3 className="font-display text-xl font-semibold">Send a Message</h3>
              <div className="mt-4 space-y-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Name
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    required
                    minLength={2}
                    maxLength={80}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-mint-300 focus:ring dark:border-slate-600 dark:bg-slate-900"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    required
                    maxLength={120}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-mint-300 focus:ring dark:border-slate-600 dark:bg-slate-900"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Message
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    required
                    minLength={10}
                    maxLength={1500}
                    rows={5}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-mint-300 focus:ring dark:border-slate-600 dark:bg-slate-900"
                  />
                </label>

                <label className="hidden" aria-hidden="true">
                  Company
                  <input type="text" name="company" value={formState.company} onChange={handleInputChange} autoComplete="off" tabIndex={-1} />
                </label>

                {recaptchaSiteKey ? (
                  <div ref={recaptchaRef} />
                ) : (
                  <p className="text-sm text-amber-600 dark:text-amber-400">Captcha is not configured yet. Add Google reCAPTCHA keys on the server.</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !recaptchaSiteKey}
                  className="w-full rounded-xl bg-mint-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-mint-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

                {submitStatus.message && (
                  <p className={`text-sm ${submitStatus.type === "error" ? "text-rose-600 dark:text-rose-400" : "text-mint-700 dark:text-mint-300"}`}>
                    {submitStatus.message}
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © 2026 Elijah Richter. All rights reserved.
      </footer>

      {/* Custom Scrollbar */}
      <div id="customScrollbar" className="custom-scrollbar" aria-hidden="true">
        <div id="customScrollbarTrack" className="custom-scrollbar-track">
          <div id="customScrollbarThumb" className="custom-scrollbar-thumb" />
        </div>
      </div>
    </div>
  );
}

export default App;
