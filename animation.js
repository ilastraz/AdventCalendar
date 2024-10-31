// SNOW
(function () {
  var masthead = document.querySelector("body");
  var width = masthead.clientWidth;
  var height = masthead.clientHeight;
  var COUNT = Math.floor((width * height) / 15000); // Numero di fiocchi di neve proporzionale all'area del canvas  
  var masthead = document.querySelector("body");
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var width = masthead.clientWidth;
  var height = masthead.clientHeight;
  var i = 0;
  var active = false;

  function onResize() {
    width = masthead.clientWidth;
    height = masthead.clientHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = "#FFF";

    var wasActive = active;
    active = width > 600;

    if (!wasActive && active) requestAnimFrame(update);
  }

  var Snowflake = function () {
    this.x = 0;
    this.y = 0;
    this.vy = 0.3 + Math.random() * (width > 768 ? 1.5 : 1.0); // Riduci la velocità per schermi piccoli
    this.vx = 0;
    this.r = 0;

    this.reset();
  };

  Snowflake.prototype.reset = function () {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vy = 1 + Math.random() * 2; // Riduci la velocità verticale per renderla più omogenea
    this.vx = 0.5 - Math.random();
    this.r = 1 + Math.random() * 3;
    this.o = 0.5 + Math.random() * 0.5;
  };

  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.style.zIndex = "10000";
  canvas.style.pointerEvents = "none"; // Permette il click sugli elementi sottostanti

  var snowflakes = [],
    snowflake;
  for (i = 0; i < COUNT; i++) {
    snowflake = new Snowflake();
    snowflake.reset();
    snowflakes.push(snowflake);
  }

  function update() {
    ctx.clearRect(0, 0, width, height);

    if (!active) return;

    for (i = 0; i < COUNT; i++) {
      snowflake = snowflakes[i];
      snowflake.y += snowflake.vy;
      snowflake.x += snowflake.vx;

      // Se il fiocco di neve esce dai lati, riportalo dall'altro lato
      if (snowflake.x > width) {
        snowflake.x = 0;
      } else if (snowflake.x < 0) {
        snowflake.x = width;
      }

      ctx.globalAlpha = snowflake.o;
      ctx.beginPath();
      ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();

      if (snowflake.y > height) {
        snowflake.reset();
        snowflake.y = 0; // Riposiziona il fiocco di neve in cima quando raggiunge il fondo
      }
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

  onResize();
  window.addEventListener("resize", onResize, false);

  masthead.appendChild(canvas);
})();

// END SNOW




window.addEventListener("load", function () {
  // Posiziona inizialmente tutti gli elementi animati fuori dallo schermo e rendili invisibili
  gsap.set(
    [
      ".intro-fondo",
      ".intro-albero1",
      ".intro-albero4",
      ".intro-albero2",
      ".intro-albero3",
      ".intro-neve",
      ".intro-fondo-mobile",
      ".intro-alberi-mobile",
      ".intro-neve-mobile"
    ],
    { transform: "translateY(100%)", autoAlpha: 0 }
  );

  // Nascondi il testo prima che inizi l'animazione
  gsap.set("[letters-slide-up], [letters-slide-down]", { autoAlpha: 0 });

  // Creazione di una timeline per sincronizzare tutte le animazioni
  let IntroTl = gsap.timeline();

  // Anima intro-fondo, intro-albero1, intro-albero4, intro-albero2, intro-albero3, e intro-neve insieme
  IntroTl.to([
    ".intro-fondo",
    ".intro-albero1",
    ".intro-albero4",
    ".intro-albero2",
    ".intro-albero3",
    ".intro-neve"
  ], { transform: "translateY(0)", duration: 2, ease: "power4.out" }, 0);

  // Creazione di una timeline per le animazioni mobile
  let IntroMobileTl = gsap.timeline();

  // Anima intro-fondo-mobile, intro-alberi-mobile, e intro-neve-mobile insieme
  IntroMobileTl.to([
    ".intro-fondo-mobile",
    ".intro-alberi-mobile",
    ".intro-neve-mobile"
  ], { transform: "translateY(0)", duration: 2, ease: "power4.out" }, 0);

  // Al termine della IntroTl, mostra la sezione caselle dopo 1 secondo
  IntroTl.call(function () {
    document.querySelector(".caselle-section").style.display = "block";
    document.querySelector(".footer-box").style.display = "flex";
  }, [], 1);

  // Split text into spans
  let typeSplit = new SplitType("[text-split]", {
    types: "words, chars",
    tagName: "span"
  });

  // Anima lettere con slide up dopo 1 secondo
  setTimeout(function () {
    $("[letters-slide-up]").each(function (index) {
      let tl = gsap.timeline({ paused: false });
      tl.set($(this), { autoAlpha: 1 }); // Rendi visibile il testo
      tl.from($(this).find(".char"), { yPercent: 100, duration: 0.2, ease: "power1.out", stagger: { amount: 0.6 } });
    });
  }, 1000);

  // Anima lettere con slide down poco dopo slide up
  setTimeout(function () {
    $("[letters-slide-down]").each(function (index) {
      let tl = gsap.timeline({ paused: false });
      tl.set($(this), { autoAlpha: 1 }); // Rendi visibile il testo
      tl.from($(this).find(".char"), { yPercent: -120, duration: 0.3, ease: "power1.out" }, 0.1);
    });
  }, 1500);

  $("[scrub-each-word]").each(function (index) {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: $(this),
        start: "top 90%",
        end: "top center",
        scrub: true
      }
    });
    tl.from($(this).find(".word"), { opacity: 0.2, duration: 0.2, ease: "power1.out", stagger: { each: 0.4 } });
  });

  // Avoid flash of unstyled content
  gsap.set("[text-split]", { opacity: 1 });
});