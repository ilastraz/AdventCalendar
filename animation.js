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

  // Avvia la timeline immediatamente
  mainTimeline.play();
});

// FINE TEXT SPLIT


// SNOW

// Snow from https://codepen.io/radum/pen/xICAB

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
  
    Snowflake.prototype.reset = function() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.vy = 1 + Math.random() * 3;
      this.vx = 0.5 - Math.random();
      this.r = 1 + Math.random() * 2;
      this.o = 0.5 + Math.random() * 0.5;
    }
  
    canvas.style.position = 'absolute';
    canvas.style.left = canvas.style.top = '0';
  
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
  
        ctx.globalAlpha = snowflake.o;
        ctx.beginPath();
        ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
  
        if (snowflake.y > height) {
          snowflake.reset();
        }
      }
  
      requestAnimFrame(update);
    }
  
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  
    onResize();
    window.addEventListener('resize', onResize, false);
  
    masthead.appendChild(canvas);
  })();