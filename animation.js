// SNOW
(function () {
  var masthead = document.querySelector("body");
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var width = window.innerWidth;
  var height = window.innerHeight;
  var COUNT = calculateSnowflakeCount(); // Numero di fiocchi di neve calcolato in base all'area del viewport
  var snowflakes = [];
  var i = 0;
  var active = true;

  canvas.width = width;
  canvas.height = height;
  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.zIndex = "10000";
  canvas.style.pointerEvents = "none"; // Permette il click sugli elementi sottostanti

  // Funzione costruttrice per il fiocco di neve
  var Snowflake = function () {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vy = width > 768 ? (1 + Math.random() * 2) : (0.5 + Math.random() * 1); // Velocità verticale ridotta per dispositivi mobili e tablet
    this.vx = 0.5 - Math.random(); // Velocità orizzontale
    this.r = 1 + Math.random() * 3; // Dimensione del fiocco di neve
    this.o = 0.5 + Math.random() * 0.5; // Opacità del fiocco di neve
  };

  // Inizializzazione dei fiocchi di neve
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

      // Se il fiocco di neve raggiunge il fondo, riposizionalo in alto in modo casuale
      if (snowflake.y > height) {
        snowflake.y = 0;
        snowflake.x = Math.random() * width;
      }

      ctx.fillStyle = "#FFF"; // Imposta il colore bianco per ogni fiocco di neve
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

  function calculateSnowflakeCount() {
    // Calcola un numero di fiocchi di neve in base all'area del viewport
    var area = width * height;
    var baseCount = Math.floor(area / 15000); // Numero base proporzionale all'area

    // Riduci ulteriormente per tablet e dispositivi mobili
    if (/iPad|Android/i.test(window.navigator.userAgent) || width <= 1024) {
      return Math.max(10, Math.floor(baseCount / 3));
    } else if (width <= 768) {
      return Math.max(5, Math.floor(baseCount / 5));
    }
    
    return baseCount;
  }

  function onResize() {
    // Aggiorna la larghezza e altezza alla dimensione attuale della finestra
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;

    // Evita il "pazzo comportamento" mantenendo proporzioni coerenti e riposizionando i fiocchi senza resettarli completamente
    if (newWidth !== width || newHeight !== height) {
      // Aggiorna dimensioni canvas
      width = newWidth;
      height = newHeight;
      canvas.width = width;
      canvas.height = height;

      // Mantieni i fiocchi di neve, aggiornando le loro posizioni rispetto alle nuove dimensioni
      snowflakes.forEach(function (snowflake) {
        snowflake.x = (snowflake.x / width) * newWidth;
        snowflake.y = (snowflake.y / height) * newHeight;
      });
    }
  }

  window.addEventListener("resize", onResize, false);
  masthead.appendChild(canvas);
  update();

})();


// INTRO
// Funzione per rilevare se il browser è Safari o se il dispositivo è iOS
function isSafariOrIOS() {
  var ua = navigator.userAgent.toLowerCase();
  var isSafari = false;
  var isIOS = false;

  // Controlla se è un dispositivo iOS
  if (/iphone|ipad|ipod/.test(ua)) {
    isIOS = true;
  }

  // Controlla se è Safari
  if (/safari/.test(ua) && !/chrome/.test(ua)) {
    isSafari = true;
  }

  return isSafari || isIOS;
}

// Funzione per inizializzare le animazioni
function initAnimations() {
  // Verifica se il browser è Safari o se il dispositivo è iOS
  if (isSafariOrIOS()) {
    // Applica le animazioni mobili agli elementi desktop

    // Ripristina gli elementi desktop al loro stato iniziale (usando proprietà mobile)
    gsap.set(
      [
        ".intro-fondo",
        ".intro-albero1",
        ".intro-albero2",
        ".intro-albero3",
        ".intro-albero4",
        ".intro-neve",
      ],
      { y: "100%", autoAlpha: 1 }
    );

    // Creazione di una timeline per le animazioni (versione mobile adattata)
    let IntroMobileAdaptedTl = gsap.timeline();

    // Anima gli elementi desktop con le animazioni mobili
    IntroMobileAdaptedTl.to(
      ".intro-fondo",
      { y: "0%", duration: 2, ease: "power4.out" },
      0
    );
    IntroMobileAdaptedTl.to(
      [
        ".intro-albero1",
        ".intro-albero2",
        ".intro-albero3",
        ".intro-albero4",
      ],
      {
        y: "0%",
        scale: 1.2,
        duration: 2.1,
        ease: "expo.out",
      },
      0
    );
    IntroMobileAdaptedTl.to(
      ".intro-neve",
      { y: "0%", duration: 2, ease: "expo.out" },
      0.1
    );

    // Al termine della timeline, mostra le sezioni necessarie
    IntroMobileAdaptedTl.call(function () {
      document.querySelector(".caselle-section").style.display = "block";
      document.querySelector(".footer-box").style.display = "flex";
    });
  } else {
    // Mantieni le animazioni originali per gli altri browser

    // Ripristina gli elementi al loro stato iniziale
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

    // Creazione di una timeline per sincronizzare tutte le animazioni
    let IntroTl = gsap.timeline();

    // Anima gli elementi con le animazioni originali
    IntroTl.to(
      ".intro-fondo",
      { z: "0px", duration: 2, ease: "power4.out" },
      0
    );
    IntroTl.to(
      [".intro-albero1", ".intro-albero4"],
      {
        z: "0px",
        scale: 1.2,
        duration: 2.1,
        ease: "expo.out",
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
      },
      0
    );
    IntroTl.to(
      ".intro-neve",
      { z: "0px", duration: 2, ease: "expo.out" },
      0.1
    );

    // Al termine della timeline, mostra le sezioni necessarie
    IntroTl.call(function () {
      document.querySelector(".caselle-section").style.display = "block";
      document.querySelector(".footer-box").style.display = "flex";
    });
  }

  // Nascondi il testo prima che inizi l'animazione
  gsap.set("[letters-slide-up], [letters-slide-down]", { autoAlpha: 0 });

  // Split text into spans
  let typeSplit = new SplitType("[text-split]", {
    types: "words, chars",
    tagName: "span",
  });

  // Anima lettere con slide up dopo 1 secondo
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

  // Anima lettere con slide down poco dopo slide up
  setTimeout(function () {
    $("[letters-slide-down]").each(function (index) {
      let tl = gsap.timeline({ paused: false });
      tl.set($(this), { autoAlpha: 1 }); // Rendi visibile il testo
      tl.from(
        $(this).find(".char"),
        {
          yPercent: -120,
          duration: 0.3,
          ease: "power1.out",
        },
        0.1
      );
    });
  }, 1500);

  // Animazioni con ScrollTrigger
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
    // Ripristina gli elementi al loro stato iniziale (versione mobile)
    gsap.set(
      [".intro-fondo-mobile", ".intro-alberi-mobile", ".intro-neve-mobile"],
      { y: "100%", autoAlpha: 1 }
    );

    // Creazione di una timeline per le animazioni mobile
    let IntroMobileTl = gsap.timeline();

    // Anima gli elementi mobile
    IntroMobileTl.to(
      ".intro-fondo-mobile",
      { y: "0%", duration: 2, ease: "power4.out" },
      0
    );
    IntroMobileTl.to(
      ".intro-alberi-mobile",
      {
        y: "0%",
        scale: 1.2,
        duration: 2.1,
        ease: "expo.out",
      },
      0
    );
    IntroMobileTl.to(
      ".intro-neve-mobile",
      { y: "0%", duration: 2, ease: "expo.out" },
      0.1
    );
  }
}

// Funzione per distruggere le animazioni
function destroyAnimations() {
  gsap.killTweensOf("*");
  gsap.set("*", { clearProps: "all" });
}

// Ascolta gli eventi 'pageshow' e 'pagehide'
window.addEventListener("pageshow", function (event) {
  destroyAnimations();
  initAnimations();
});

window.addEventListener("pagehide", function (event) {
  destroyAnimations();
});
