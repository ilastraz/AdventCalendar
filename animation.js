
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

  // Fase 1: Mostra il logo al centro
  tl.from(".intro-logo", { opacity: 0, scale: 0.5, duration: 1.5, ease: "power2.out", z: 0 })
    
    // Fase 2: Passa la slitta sopra il logo
    .to(".intro-slitta", { x: "100vw", duration: 2, ease: "power1.inOut" }, "-=0.5")
    
    // Fase 3: Poco prima che la slitta finisca, inizia a far comparire il fondo
    .from(".intro-fondo", { y: "100vh", scale: 0.8, opacity: 0, duration: 1.5, ease: "power2.out", z: -200 }, "-=1")

    // Fase 4: Fa comparire gli alberi con profondità diversa
    .from(".intro-albero4", { y: "100vh", scale: 0.9, opacity: 0, duration: 2, ease: "power2.out", z: -150 }, "-=1")
    .from(".intro-albero2", { y: "100vh", scale: 0.95, opacity: 0, duration: 2.2, ease: "power2.out", z: -100 }, "-=1.8")
    .from(".intro-albero3", { y: "100vh", scale: 1, opacity: 0, duration: 2.4, ease: "power2.out", z: -50 }, "-=2.0")
    .from(".intro-albero1", { y: "100vh", scale: 1.05, opacity: 0, duration: 2.5, ease: "power2.out", z: 0 }, "-=2.2")
    
    // Fase 5: Aggiungi l'effetto della neve che entra in scena
    .from(".intro-neve", { y: "100vh", opacity: 0, duration: 3, ease: "power2.out", z: 50 }, "-=2.5");
});
