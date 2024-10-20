
// SNOW
(function () {
    var COUNT = 300;
    var masthead = document.querySelector('body');
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var width = masthead.clientWidth;
    var height = masthead.clientHeight;
    var i = 0;
    var active = false;

    function onResize() {
        width = masthead.clientWidth;
        height = masthead.clientHeight;
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = '#FFF';

        var wasActive = active;
        active = width > 600;

        if (!wasActive && active)
            requestAnimFrame(update);
    }

    var Snowflake = function () {
        this.x = 0;
        this.y = 0;
        this.vy = 0;
        this.vx = 0;
        this.r = 0;

        this.reset();
    }

    Snowflake.prototype.reset = function () {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vy = 0.5 + Math.random() * 1.5; // Riduci la velocità verticale per renderla più omogenea
        this.vx = 0.5 - Math.random();
        this.r = 1 + Math.random() * 2;
        this.o = 0.5 + Math.random() * 0.5;
    }

    canvas.style.position = 'absolute';
    canvas.style.left = canvas.style.top = '0';
    canvas.style.pointerEvents = 'none'; // Permette il click sugli elementi sottostanti

    var snowflakes = [], snowflake;
    for (i = 0; i < COUNT; i++) {
        snowflake = new Snowflake();
        snowflake.reset();
        snowflakes.push(snowflake);
    }

    function update() {
        ctx.clearRect(0, 0, width, height);

        if (!active)
            return;

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
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    onResize();
    window.addEventListener('resize', onResize, false);

    masthead.appendChild(canvas);
})();

// END SNOW


// INTRO
window.addEventListener("load", function() {
    let tl = gsap.timeline();
  
    // Fase 1: Mostra il logo al centro (si ingrandisce)
    tl.from(".intro-logo", { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out", z: 0 })
  
      // Fase 2: Passa la slitta (velocemente, per dare l'effetto di movimento in primo piano)
      .to(".intro-slitta", { x: "100vw", duration: 2, ease: "power1.inOut" }, "-=0.5")
  
      // Fase 3: Poco prima che la slitta finisca, inizia a far comparire il fondo dal basso con un effetto "da dietro lo schermo" (asse z)
      .from(".intro-fondo", { opacity: 0, z: -1000, scale: 0.8, duration: 1.5, ease: "power2.out" }, "-=1.5")
  
      // Fase 4: Fa scomparire il logo mentre il fondo compare
      .to(".intro-logo", { opacity: 0, scale: 0.5, duration: 0.8, ease: "power2.in" }, "-=1")
  
      // Fase 5: Fa comparire velocemente gli alberi, dando l'impressione che vengano da lontano (asse z) verso lo schermo
      .from(".intro-albero4", { opacity: 0, z: -800, scale: 0.9, duration: 1, ease: "power2.out" }, "-=1")
      .from(".intro-albero2", { opacity: 0, z: -600, scale: 0.95, duration: 1, ease: "power2.out" }, "-=0.8")
      .from(".intro-albero3", { opacity: 0, z: -400, scale: 1, duration: 1, ease: "power2.out" }, "-=0.6")
      .from(".intro-albero1", { opacity: 0, z: -200, scale: 1.05, duration: 1, ease: "power2.out" }, "-=0.4")
  
      // Fase 6: Fa entrare la neve, anche lei come se venisse da dietro lo schermo
      .from(".intro-neve", { opacity: 0, z: -500, duration: 1.2, ease: "power2.out" }, "-=0.5");
  });
