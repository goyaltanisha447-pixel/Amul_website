import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("scroll-canvas");
const context = canvas.getContext("2d");

canvas.width = 1920;
canvas.height = 1080;

const frameCount = 240;
const currentFrame = (index) =>
  `./frames/ezgif-frame-${index.toString().padStart(3, "0")}.jpg`;

const images = [];
const airbnb = {
  frame: 0,
};

// Preload images
let loadedCount = 0;
const loader = document.getElementById("loader");
const progressBar = document.getElementById("progress");
const progressText = document.getElementById("progress-text");

function preloadImages() {
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
      loadedCount++;
      const progress = Math.round((loadedCount / frameCount) * 100);
      progressBar.style.width = `${progress}%`;
      progressText.innerText = `${progress}%`;

      if (loadedCount === frameCount) {
        initAnimation();
      }
    };
    images.push(img);
  }
}

function initAnimation() {
  // Hide loader
  gsap.to(loader, {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      loader.style.display = "none";
    },
  });

  // GSAP animation for frames
  gsap.to(airbnb, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "+=500%",
      scrub: 0.5,
      pin: true,
    },
    onUpdate: render,
  });

  // Fade out hero brand heading at 30% of scroll animation
  gsap.to("#hero-brand", {
    opacity: 0,
    y: -40,
    ease: "power2.in",
    scrollTrigger: {
      trigger: "#hero",
      start: "20% top",
      end: "30% top",
      scrub: 1,
    },
  });

  // Initial render
  images[0].onload = render;
  render();
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (images[airbnb.frame] && images[airbnb.frame].complete) {
    context.drawImage(images[airbnb.frame], 0, 0, canvas.width, canvas.height);
  }
}

// Start preloading
preloadImages();

// Handle Resize
window.addEventListener("resize", () => {
  render();
});

// Navbar: add 'scrolled' class once user is past animation section
const siteNav = document.getElementById("site-nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > window.innerHeight * 0.1) {
    siteNav.classList.add("scrolled");
  } else {
    siteNav.classList.remove("scrolled");
  }
}, { passive: true });

// Scroll Reveal for new sections
const observerOptions = {
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');

            // Trigger card animations
            if (entry.target.id === 'section-experience') {
                triggerExperienceAnimations();
            } else if (entry.target.id === 'section-benefits') {
                triggerBenefitsAnimations();
            }
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    if (section.id !== 'hero') {
        section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
        observer.observe(section);
    }
});

// Staggered card animations triggered via native Intersection Observer
let experienceAnimated = false;
function triggerExperienceAnimations() {
  if (experienceAnimated) return;
  experienceAnimated = true;

  // Staggered header fade and slide up
  gsap.from("#section-experience h2, #section-experience p", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
  });

  // Left column cards slide in from the left
  gsap.from("#section-experience .grid > div:first-child .experience-card", {
    x: -60,
    opacity: 0,
    duration: 0.9,
    stagger: 0.2,
    ease: "power2.out"
  });

  // Right column cards slide in from the right
  gsap.from("#section-experience .space-y-6 > .experience-card", {
    x: 60,
    opacity: 0,
    duration: 0.9,
    stagger: 0.2,
    ease: "power2.out"
  });

  // Scale and rotate springy icons inside experience cards
  gsap.from(".experience-card .material-symbols-outlined", {
    scale: 0,
    rotation: -45,
    duration: 1,
    stagger: 0.1,
    ease: "back.out(1.7)"
  });
}

let benefitsAnimated = false;
function triggerBenefitsAnimations() {
  if (benefitsAnimated) return;
  benefitsAnimated = true;

  // Tri-directional slide-in for benefits cards
  // Left card (Energy Boost) slides from left-bottom
  gsap.from(".benefit-card:nth-child(1)", {
    x: -50,
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  });

  // Center card (Natural Ingredients) slides straight up
  gsap.from(".benefit-card:nth-child(2)", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  });

  // Right card (Royal Flavor) slides from right-bottom
  gsap.from(".benefit-card:nth-child(3)", {
    x: 50,
    y: 30,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  });

  // Scale and rotate springy icons inside benefits cards
  gsap.from(".benefit-card .material-symbols-outlined", {
    scale: 0,
    rotation: -45,
    duration: 1.2,
    stagger: 0.12,
    ease: "back.out(1.7)"
  });
}
