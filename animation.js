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



// INTRO
window.addEventListener("load", function () {
  // Funzione per verificare se il dispositivo è un tablet
  function isTablet() {
    const userAgent = navigator.userAgent.toLowerCase();
    return (
      /ipad|android(?!.*mobile)|tablet|playbook|silk/.test(userAgent) &&
      window.innerWidth > 768 &&
      window.innerWidth <= 1024
    );
  }

  // GSAP Animazioni - Desktop
  if (window.innerWidth > 1024 || (!isTablet() && window.innerWidth > 768)) {
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

    let IntroTl = gsap.timeline();

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

    IntroTl.call(function () {
      document.querySelector(".caselle-section").style.display = "block";
      document.querySelector(".footer-box").style.display = "flex";
    });
  }
  // GSAP Animazioni - Tablet
  else if (isTablet()) {
    gsap.set(
      [
        ".intro-fondo",
        ".intro-albero1",
        ".intro-albero4",
        ".intro-albero2",
        ".intro-albero3",
        ".intro-neve",
      ],
      { y: "100%", autoAlpha: 1 }
    );

    let IntroTabletTl = gsap.timeline();

    IntroTabletTl.to(
      ".intro-fondo",
      { y: "0%", duration: 2, ease: "power4.out", force3D: true },
      0
    );
    IntroTabletTl.to(
      [".intro-albero1", ".intro-albero4"],
      {
        y: "0%",
        scale: 1.1,
        duration: 2.1,
        ease: "expo.out",
        force3D: true,
      },
      0
    );
    IntroTabletTl.to(
      [".intro-albero2", ".intro-albero3"],
      {
        y: "0%",
        scale: 1.1,
        duration: 2.1,
        ease: "expo.out",
        force3D: true,
      },
      0
    );
    IntroTabletTl.to(
      ".intro-neve",
      { y: "0%", duration: 2, ease: "expo.out", force3D: true },
      0.1
    );

    IntroTabletTl.call(function () {
      document.querySelector(".caselle-section").style.display = "block";
      document.querySelector(".footer-box").style.display = "flex";
    });
  }
  // GSAP Animazioni - Mobile
  else {
    gsap.set(
      [".intro-fondo-mobile", ".intro-alberi-mobile", ".intro-neve-mobile"],
      { y: "100%", autoAlpha: 1 }
    );

    let IntroMobileTl = gsap.timeline();

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

