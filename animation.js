// SNOW
(function () {
  var masthead = document.querySelector("body");
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var width = window.innerWidth;
  var height = window.innerHeight;
  var COUNT = 100; // Numero fisso di fiocchi di neve
  var i = 0;
  var active = true;

  canvas.width = width;
  canvas.height = height;
  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.zIndex = "10000";
  canvas.style.pointerEvents = "none"; // Permette il click sugli elementi sottostanti

  var snowflakes = [];

  var Snowflake = function () {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vy = 1 + Math.random() * 2; // Velocità verticale
    this.vx = 0.5 - Math.random(); // Velocità orizzontale
    this.r = 1 + Math.random() * 3; // Dimensione del fiocco di neve
    this.o = 0.5 + Math.random() * 0.5; // Opacità del fiocco di neve
  };

  for (i = 0; i < COUNT; i++) {
    snowflakes.push(new Snowflake());
  }

  function update() {
    ctx.clearRect(0, 0, width, height);

    if (!active) return;

    for (i = 0; i < COUNT; i++) {
      var snowflake = snowflakes[i];
      snowflake.y += snowflake.vy;
      snowflake.x += snowflake.vx;

      // Se il fiocco di neve esce dai lati, riportalo dall'altro lato
      if (snowflake.x > width) {
        snowflake.x = 0;
      } else if (snowflake.x < 0) {
        snowflake.x = width;
      }

      // Se il fiocco di neve raggiunge il fondo, riposizionalo in alto
      if (snowflake.y > height) {
        snowflake.y = 0;
      }

      ctx.globalAlpha = snowflake.o;
      ctx.beginPath();
      ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    }

    requestAnimFrame(update);
  }

  // shim layer with setTimeout fallback
  window.requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  function onResize() {
    // Aggiorna la larghezza e altezza alla dimensione attuale della finestra
    width = window.innerWidth;
    height = window.innerHeight;

    // Aggiorna la dimensione reale del canvas senza alterare lo stile
    canvas.width = width;
    canvas.height = height;

    // Mantieni il comportamento dei fiocchi di neve già creati
    for (i = 0; i < COUNT; i++) {
      if (snowflakes[i].x > width) snowflakes[i].x = Math.random() * width;
      if (snowflakes[i].y > height) snowflakes[i].y = Math.random() * height;
    }
  }

  window.addEventListener("resize", onResize, false);
  masthead.appendChild(canvas);
  update();

})();
// END SNOW





// INTRO
// GSAP Animazioni
window.addEventListener("load", function () {
  // Posiziona inizialmente tutti gli elementi animati fuori dallo schermo e rendili invisibili, usando pixel invece di rem
  gsap.set(
    [
      ".intro-fondo",
      ".intro-albero1",
      ".intro-albero4",
      ".intro-albero2",
      ".intro-albero3",
      ".intro-neve",
    ],
    { z: "1000px", autoAlpha: 1 }
  );

  // Nascondi il testo prima che inizi l'animazione (lasciato invariato)
  gsap.set("[letters-slide-up], [letters-slide-down]", { autoAlpha: 0 });

  // Creazione di una timeline per sincronizzare tutte le animazioni
  let IntroTl = gsap.timeline();

  // Anima gli elementi con force3D abilitato e unità in pixel
  IntroTl.to(
    ".intro-fondo",
    { z: "0px", duration: 2, ease: "power4.out", force3D: true },
    0
  );
  IntroTl.to(
    [".intro-albero1", ".intro-albero4"],
    {
      z: "0px",
      scale: 1.2,
      duration: 2.1,
      ease: "expo.out",
      force3D: true,
    },
    0
  );
  IntroTl.to(
    [".intro-albero2", ".intro-albero3"],
    {
      z: "0px",
      scale: 1.2,
      duration: 2.1,
      ease: "expo.out",
      force3D: true,
    },
    0
  );
  IntroTl.to(
    ".intro-neve",
    { z: "0px", duration: 2, ease: "expo.out", force3D: true },
    0.1
  );

  // Al termine della IntroTl, mostra la sezione caselle dopo 1 secondo
  IntroTl.call(function () {
    document.querySelector(".caselle-section").style.display = "block";
    document.querySelector(".footer-box").style.display = "flex";
  });

  // Split text into spans (lasciato invariato)
  let typeSplit = new SplitType("[text-split]", {
    types: "words, chars",
    tagName: "span",
  });

  // Anima lettere con slide up dopo 1 secondo (lasciato invariato)
  setTimeout(function () {
    $("[letters-slide-up]").each(function (index) {
      let tl = gsap.timeline({ paused: false });
      tl.set($(this), { autoAlpha: 1 }); // Rendi visibile il testo
      tl.from($(this).find(".char"), {
        yPercent: 100,
        duration: 0.2,
        ease: "power1.out",
        stagger: { amount: 0.6 },
      });
    });
  }, 1000);

  // Anima lettere con slide down poco dopo slide up (lasciato invariato)
  setTimeout(function () {
    $("[letters-slide-down]").each(function (index) {
      let tl = gsap.timeline({ paused: false });
      tl.set($(this), { autoAlpha: 1 }); // Rendi visibile il testo
      tl.from($(this).find(".char"), {
        yPercent: -120,
        duration: 0.3,
        ease: "power1.out",
      }, 0.1);
    });
  }, 1500);

  $("[scrub-each-word]").each(function (index) {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: "top 90%",
        end: "top center",
        scrub: true,
      },
    });
    tl.from($(this).find(".word"), {
      opacity: 0.2,
      duration: 0.2,
      ease: "power1.out",
      stagger: { each: 0.4 },
    });
  });

  // Evita il flash di contenuto non stilizzato
  gsap.set("[text-split]", { opacity: 1 });

  // GSAP Animazioni per Mobile
  if (window.innerWidth <= 1024) {
    // Posiziona inizialmente tutti gli elementi animati fuori dallo schermo e rendili invisibili (versione mobile)
    gsap.set(
      [".intro-fondo-mobile", ".intro-alberi-mobile", ".intro-neve-mobile"],
      { y: "100%", autoAlpha: 1 }
    );

    // Creazione di una timeline per le animazioni mobile
    let IntroMobileTl = gsap.timeline();

    // Anima gli elementi mobile con force3D abilitato
    IntroMobileTl.to(
      ".intro-fondo-mobile",
      { y: "0%", duration: 2, ease: "power4.out", force3D: true },
      0
    );
    IntroMobileTl.to(
      ".intro-alberi-mobile",
      {
        y: "0%",
        scale: 1.2,
        duration: 2.1,
        ease: "expo.out",
        force3D: true,
      },
      0
    );
    IntroMobileTl.to(
      ".intro-neve-mobile",
      { y: "0%", duration: 2, ease: "expo.out", force3D: true },
      0.1
    );
  }
});