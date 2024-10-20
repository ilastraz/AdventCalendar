
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
// Timeline principale
const tl = gsap.timeline();

// Inizialmente mostriamo solo il logo
// Settiamo tutti gli altri elementi con visibilità nascosta
gsap.set(".intro-logo", { autoAlpha: 1 });
gsap.set([".intro-slitta", ".intro-albero1", ".intro-albero2", ".intro-albero3", ".intro-albero4", ".intro-neve", ".intro-fondo"], { autoAlpha: 0 });

// Mostra la slitta che passa
// La slitta appare senza muoversi nello spazio, ma mantenendo la propria animazione interna
tl.to(".intro-slitta", {
  autoAlpha: 1,
  duration: 5,
  ease: "power2.inOut",
  onStart: function () {
    // Nasconde il logo quando la slitta inizia a muoversi
    gsap.to(".intro-logo", { autoAlpha: 0, duration: 1 });
  }
});

// Spostamento della "camera" e rivelazione del fondo e degli alberi
// Quando la slitta è quasi alla fine, muoviamo la camera e mostriamo gli altri elementi
tl.to(".intro-section", {
  x: "-30%", // Simula un movimento della camera
  duration: 3,
  ease: "power2.inOut"
}, "-=2"); // L'animazione inizia leggermente prima che la slitta finisca

// Appaiono il fondo, gli alberi e la neve
// I vari elementi compaiono in sequenza per creare l'effetto parallax
tl.to([".intro-fondo", ".intro-albero1", ".intro-albero2", ".intro-albero3", ".intro-albero4", ".intro-neve"], {
  autoAlpha: 1,
  stagger: 0.5, // Mostra gli elementi uno dopo l'altro con un leggero ritardo
  duration: 2,
  ease: "power1.out"
});
