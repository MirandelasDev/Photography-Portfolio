const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const reveals = document.querySelectorAll(".reveal");
const portfolioItems = document.querySelectorAll(".portfolio-item");

const modal = document.getElementById("portfolio-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalClosers = document.querySelectorAll("[data-close-modal]");
const modalPrev = document.querySelector(".modal-prev");
const modalNext = document.querySelector(".modal-next");
const videoTriggers = document.querySelectorAll(".video-trigger");
const videoModal = document.getElementById("video-modal");
const expandedVideo = document.getElementById("expanded-video");
const expandedVideoCompany = document.getElementById("expanded-video-company");
const closeVideoModalButtons = document.querySelectorAll("[data-close-video-modal]");

const yearNode = document.getElementById("year");

let galleryItems = [];
let galleryIndex = 0;

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    nav.classList.toggle("open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

reveals.forEach((item) => observer.observe(item));

const updateModalMedia = () => {
  const current = galleryItems[galleryIndex] || "";
  if (current) {
    modalImage.src = current;
  }

  if (modalPrev) modalPrev.disabled = galleryItems.length <= 1;
  if (modalNext) modalNext.disabled = galleryItems.length <= 1;
};

const openModal = (item) => {
  const title = item.dataset.title || "";
  const description = item.dataset.description || "";
  const media = item.dataset.media || "";
  const gallery = (item.dataset.gallery || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  modalTitle.textContent = title;
  modalDescription.textContent = description;
  galleryItems = gallery.length ? gallery : media ? [media] : [];
  galleryIndex = 0;
  updateModalMedia();
  modalImage.alt = title;
  modal.classList.add("is-open");
  modal.classList.toggle("is-gallery", galleryItems.length > 1);
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.classList.remove("is-gallery");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  modalImage.src = "";
  galleryItems = [];
  galleryIndex = 0;
};

const openVideoModal = (trigger) => {
  const source = trigger.dataset.video || "";
  const company = trigger.dataset.company || "";

  if (!source || !videoModal || !expandedVideo) return;

  expandedVideo.src = source;
  expandedVideoCompany.textContent = company;
  videoModal.classList.add("is-open");
  videoModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const playPromise = expandedVideo.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {});
  }
};

const closeVideoModal = () => {
  if (!videoModal || !expandedVideo) return;
  videoModal.classList.remove("is-open");
  videoModal.setAttribute("aria-hidden", "true");
  expandedVideo.pause();
  expandedVideo.removeAttribute("src");
  expandedVideo.load();
  expandedVideoCompany.textContent = "";
  document.body.style.overflow = "";
};

portfolioItems.forEach((item) => {
  item.addEventListener("click", () => openModal(item));
});

modalClosers.forEach((closer) => {
  closer.addEventListener("click", closeModal);
});

modalPrev?.addEventListener("click", () => {
  if (galleryItems.length <= 1) return;
  galleryIndex = (galleryIndex - 1 + galleryItems.length) % galleryItems.length;
  updateModalMedia();
});

modalNext?.addEventListener("click", () => {
  if (galleryItems.length <= 1) return;
  galleryIndex = (galleryIndex + 1) % galleryItems.length;
  updateModalMedia();
});

videoTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openVideoModal(trigger));
});

closeVideoModalButtons.forEach((button) => {
  button.addEventListener("click", closeVideoModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
  if (event.key === "Escape" && videoModal?.classList.contains("is-open")) {
    closeVideoModal();
  }
  if (modal.classList.contains("is-open") && modal.classList.contains("is-gallery")) {
    if (event.key === "ArrowLeft") modalPrev?.click();
    if (event.key === "ArrowRight") modalNext?.click();
  }
});

document.querySelectorAll('a[href="#contact-form"]').forEach((link) => {
  link.addEventListener("click", () => {
    window.setTimeout(() => {
      document.getElementById("name")?.focus({ preventScroll: true });
    }, 550);
  });
});

const contactForm = document.getElementById("contactForm");
const contactSubmitBtn = document.getElementById("contactSubmitBtn");
const contactFeedback = document.getElementById("contactFeedback");

if (contactForm && contactFeedback) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const originalButtonText = contactSubmitBtn?.textContent || "Enviar mensagem";
    if (contactSubmitBtn) {
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.textContent = "Enviando...";
    }

    contactFeedback.textContent = "";
    contactFeedback.classList.remove("success", "error");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Falha no envio");
      }

      contactFeedback.textContent = "Mensagem enviada com sucesso. Em breve entrarei em contato.";
      contactFeedback.classList.add("success");
      contactForm.reset();
    } catch (error) {
      contactFeedback.textContent =
        "Nao foi possivel enviar sua mensagem agora. Verifique os dados e tente novamente.";
      contactFeedback.classList.add("error");
    } finally {
      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.textContent = originalButtonText;
      }
    }
  });
}
