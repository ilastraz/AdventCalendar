// INZIO TEXT SPLIT

window.addEventListener("DOMContentLoaded", (event) => {
  // Split text into spans
  let typeSplit = new SplitType("[text-split]", {
    types: "words, chars",
    tagName: "span"
  });

  // Creazione della timeline principale
  let mainTimeline = gsap.timeline();

  // Animazione per [words-slide-up]
  $("[words-slide-up]").each(function (index) {
    mainTimeline.from($(this).find(".word"), {
      opacity: 0,
      yPercent: 100,
      duration: 0.3,
      ease: "back.out(2)",
      stagger: { amount: 0.3 }
    }, index * 0.5); // Aggiungiamo un ritardo tra ogni elemento
  });

  // Animazione per [scrub-each-word]
  $("[scrub-each-word]").each(function (index) {
    mainTimeline.from($(this).find(".word"), {
      opacity: 0.2,
      duration: 0.2,
      ease: "power1.out",
      stagger: { each: 0.4 }
    }, "-=0.2"); // Sovrapponiamo leggermente con l'animazione precedente
  });

  // Animazione per .intro-p
  mainTimeline.from(".intro-p", {
    duration: 0.4,
    ease: 'sine.out',
    y: '-100%',
    opacity: 0,
    stagger: { each: 0.13 }
  }, "-=0.3"); // Sovrapponiamo leggermente con l'animazione precedente

  // Avoid flash of unstyled content
  gsap.set("[text-split]", { opacity: 1 });

  // Creazione di un singolo ScrollTrigger per l'intera timeline
  ScrollTrigger.create({
    trigger: "body", // Puoi modificare questo selettore in base alle tue esigenze
    start: "top top",
    end: "bottom bottom",
    animation: mainTimeline,
    scrub: 1, // Regola questo valore per controllare la velocità di scrubbing
    // markers: true, // Utile per il debug, rimuovi in produzione
  });
});

// FINE TEXT SPLIT
