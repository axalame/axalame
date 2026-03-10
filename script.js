window.scrollTo(0, 0);

// Wait for fonts to load before showing content
document.fonts.ready.then(() => {
  document.body.classList.add("loaded");
});

// Reset form state on page load
window.addEventListener('pageshow', (event) => {
  const form = document.getElementById("rsvpForm");
  const formNote = document.getElementById("formNote");
  if (form) {
    form.reset();
    form.style.opacity = "1";
    form.style.pointerEvents = "auto";
    const formFields = form.querySelectorAll('label, fieldset, button[type="submit"]');
    formFields.forEach(field => field.style.display = "");
  }
  if (formNote) {
    formNote.classList.remove("show");
    formNote.textContent = "";
  }
});

function createPetals() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const petalsContainer = document.createElement('div');
  petalsContainer.className = 'petals';
  hero.appendChild(petalsContainer);
  
  const petalCount = 20;
  const colors = [
    'rgba(255, 220, 200, 0.7)',
    'rgba(255, 190, 170, 0.6)',
    'rgba(255, 210, 190, 0.5)',
    'rgba(255, 180, 160, 0.6)'
  ];
  
  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    
    const size = 12 + Math.random() * 16;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.background = `radial-gradient(ellipse at 30% 30%, ${colors[Math.floor(Math.random() * colors.length)]}, rgba(255, 150, 120, 0.2))`;
    petal.style.animationDuration = (8 + Math.random() * 12) + 's';
    petal.style.animationDelay = Math.random() * 15 + 's';
    petal.style.borderRadius = Math.random() > 0.5 ? '50% 0 50% 50%' : '0 50% 50% 50%';
    
    petalsContainer.appendChild(petal);
  }
}

createPetals();

const form = document.getElementById("rsvpForm");
const note = document.getElementById("formNote");
const introEnvelope = document.getElementById("introEnvelope");
const envelopeBtn = document.getElementById("envelopeBtn");

const RSVP_INTEGRATION = {
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbxOSzgQ-ZOvKJn-m-u6J-l6955Hmo_vCzVY5WNqr0bl079e4L8tKL0eMe8TlMaFzk4Y/exec",
  googleForm: {
    formActionUrl: "",
    entries: {
      name: "",
      attendance: "",
      drinks: "",
      comment: ""
    }
  },
  localBackup: true
};

if (introEnvelope && envelopeBtn) {
  let introOpened = false;

  const openInvitation = () => {
    if (introOpened) return;
    introOpened = true;
    introEnvelope.classList.add("is-opening");

    window.setTimeout(() => {
      introEnvelope.classList.add("is-hidden");
      document.body.classList.remove("intro-locked");
    }, 2000);

    window.setTimeout(() => {
      introEnvelope.remove();
    }, 2600);
  };

  envelopeBtn.addEventListener("click", openInvitation);
  envelopeBtn.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openInvitation();
    }
  });
} else {
  document.body.classList.remove("intro-locked");
}

const countdown = document.getElementById("countdown");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const DEFAULT_COUNTDOWN_DATE = "2026-06-06T00:00:00+03:00";

function pad(value) {
  return String(value).padStart(2, "0");
}

function parseCountdownDate(rawDate) {
  if (!rawDate) return null;

  const parsedIso = Date.parse(rawDate);
  if (!Number.isNaN(parsedIso)) return parsedIso;

  const dmyMatch = rawDate.match(/^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
  if (!dmyMatch) return null;

  const [, dd, mm, yyyy, hh = "00", min = "00"] = dmyMatch;
  const localDate = new Date(
    Number(yyyy),
    Number(mm) - 1,
    Number(dd),
    Number(hh),
    Number(min),
    0
  );
  return localDate.getTime();
}

const countdownTarget = countdown
  ? parseCountdownDate(DEFAULT_COUNTDOWN_DATE)
  : null;
let countdownTimerId = null;

function renderCountdown(diff) {
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
}

function tickCountdown() {
  if (!countdown || !countdownTarget) return;

  const now = Date.now();
  const diff = Math.max(0, countdownTarget - now);
  renderCountdown(diff);

  if (diff <= 0) return;

  const nextTickIn = 1000 - (now % 1000);
  countdownTimerId = window.setTimeout(tickCountdown, nextTickIn);
}

function startCountdown() {
  if (!countdown) return;

  if (countdownTimerId) {
    window.clearTimeout(countdownTimerId);
    countdownTimerId = null;
  }

  if (countdownTarget) {
    tickCountdown();
  } else {
    renderCountdown(0);
  }
}

startCountdown();

window.addEventListener("pageshow", startCountdown);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) startCountdown();
});

const revealItems = document.querySelectorAll("[data-animate]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));

const nav = document.querySelector(".top-nav");
window.addEventListener("scroll", () => {
  if (!nav) return;
  nav.classList.toggle("is-scrolled", window.scrollY > 24);
});

const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (backToTop) {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  }
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
const isMobile = window.matchMedia("(max-width: 1024px)").matches;

if (!prefersReducedMotion && isDesktop) {
  const parallaxNodes = document.querySelectorAll("[data-parallax]");
  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.scrollY;
    parallaxNodes.forEach((node) => {
      const speed = Number(node.dataset.parallax) || 0.08;
      const y = Math.round(scrollY * speed * 100) / 100;
      node.style.transform = `translate3d(0, ${y}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();
}

if (isMobile) {
  const timelineSteps = Array.from(document.querySelectorAll(".timeline-step"));
  const timelineSection = document.getElementById("timeline");

  if (timelineSteps.length && timelineSection) {
    document.body.classList.add("timeline-mobile-seq");

    if (prefersReducedMotion) {
      timelineSteps.forEach((step) => step.classList.add("is-visible"));
    } else {
      let started = false;

      const revealSequentially = () => {
        timelineSteps.forEach((step, index) => {
          window.setTimeout(() => {
            step.classList.add("is-visible");
          }, index * 220);
        });
      };

      const timelineSectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !started) {
              started = true;
              revealSequentially();
              timelineSectionObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.35, rootMargin: "0px 0px -8% 0px" }
      );

      timelineSectionObserver.observe(timelineSection);
    }
  }
}

if (form) {
  const formLoading = document.getElementById("formLoading");
  const submitBtn = form.querySelector('button[type="submit"]');
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.drinks = formData.getAll("drinks");
    
    if (formLoading) formLoading.classList.add("active");
    if (submitBtn) submitBtn.disabled = true;
    note.textContent = "";
    note.style.color = "";

    let sentToGoogle = false;

    if (RSVP_INTEGRATION.appsScriptUrl) {
      try {
        await fetch(RSVP_INTEGRATION.appsScriptUrl, {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify({
            ...payload,
            createdAt: new Date().toISOString()
          })
        });
        // In no-cors mode the response is opaque, so treat successful fetch call as sent.
        sentToGoogle = true;
      } catch (_error) {
      }
    }

    if (!sentToGoogle && RSVP_INTEGRATION.googleForm.formActionUrl) {
      const { formActionUrl, entries } = RSVP_INTEGRATION.googleForm;
      if (entries.name && entries.attendance && entries.drinks && entries.comment) {
        try {
          const params = new URLSearchParams();
          params.append(entries.name, payload.name || "");
          params.append(entries.attendance, payload.attendance || "");
          params.append(entries.drinks, (payload.drinks || []).join(", "));
          params.append(entries.comment, payload.comment || "");

          await fetch(formActionUrl, {
            method: "POST",
            mode: "no-cors",
            body: params
          });

          sentToGoogle = true;
        } catch (_error) {
        }
      }
    }

    if (RSVP_INTEGRATION.localBackup) {
      const current = JSON.parse(localStorage.getItem("wedding-rsvp-list") || "[]");
      current.push({
        ...payload,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("wedding-rsvp-list", JSON.stringify(current));
    }

    if (sentToGoogle) {
      note.textContent = "Спасибо! Ответ отправлен.";
      note.style.color = "#2f7a4b";
    } else if (RSVP_INTEGRATION.localBackup) {
      note.textContent = "Спасибо! Ответ сохранен локально.";
      note.style.color = "#8a5c3e";
    } else {
      note.textContent = "Не удалось отправить ответ. Проверьте настройки.";
      note.style.color = "#b64545";
    }

    note.classList.add("show");
    if (formLoading) formLoading.classList.remove("active");
    if (submitBtn) submitBtn.disabled = false;
    
    // Hide form fields and show thank you
    const formFields = form.querySelectorAll('label, fieldset, button[type="submit"]');
    formFields.forEach(field => field.style.display = "none");
    
    // Reset on next submit would require showing fields again, so we'll hide the form container instead
    form.style.opacity = "0.3";
    form.style.pointerEvents = "none";
  });
}
