document.addEventListener("DOMContentLoaded", function() {
  function updateCalendar(currentDay) {
    const divs = document.querySelectorAll("div[data-day]");

    divs.forEach(div => {
      const day = parseInt(div.getAttribute("data-day"));
      const status = div.getAttribute("data-status");

      if (day < currentDay && status === "past") {
        div.style.display = "block";
      } else if (day === currentDay && status === "today") {
        div.style.display = "block";
        div.style.cursor = "pointer";
        div.addEventListener('click', () => {
          console.log('Clicked on day:', day);
          openPopup(day);
        });
      } else if (day > currentDay && status === "future") {
        div.style.display = "block";
      } else {
        div.style.display = "none";
      }
    });
  }

  async function fetchCurrentDay() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const currentDate = new Date();
      const currentDay = currentDate.getDate();
      updateCalendar(currentDay);
    } catch (error) {
      console.error("Errore nel recupero della data:", error);
    }
  }

  // Funzione per aprire il popup
  function openPopup(day) {
    console.log('Opening popup for day:', day, 'Type:', typeof day);
    fetch('https://corsproxy.io/?https://gleeful-crepe-005071.netlify.app/calendario-contenuti.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Fetch response:', response);
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', JSON.stringify(data, null, 2));
        const dayData = data[day.toString()];
        console.log('Day data for', day, ':', dayData);
        if (dayData) {
          const popup = document.querySelector('.popup');
          if (!popup) {
            console.error('Elemento .popup non trovato');
            return;
          }

          const elements = [
            {selector: '.popup-date', property: 'textContent', value: dayData.data},
            {selector: '.popup-head', property: 'textContent', value: dayData.head},
            {selector: '.popup-description', property: 'textContent', value: dayData.descrizione},
            {selector: '.popup-cta1', property: 'href', value: dayData.cta1.link},
            {selector: '.popup-cta1', property: 'textContent', value: dayData.cta1.testo},
            {selector: '.popup-cta2', property: 'href', value: dayData.cta2.link},
            {selector: '.popup-cta2', property: 'textContent', value: dayData.cta2.testo},
            {selector: '.popup-nota', property: 'textContent', value: dayData.cta2.nota}
          ];

          elements.forEach(({selector, property, value}) => {
            const element = document.querySelector(selector);
            if (element) {
              element[property] = value;
            } else {
              console.error(`Elemento ${selector} non trovato`);
            }
          });

          const popupContent = document.querySelector('.popup-content');
          if (popupContent) {
            popupContent.style.backgroundImage = `url(${window.innerWidth > 768 ? dayData.bgdesktop : dayData.bgmobile})`;
          } else {
            console.error('Elemento .popup-content non trovato');
          }

          popup.style.display = 'flex';
          console.log('Popup display style:', popup.style.display);
          console.log('Computed style:', window.getComputedStyle(popup).display);
        } else {
          console.log('Available days:', Object.keys(data));
          alert(`Nessun dato disponibile per il giorno ${day}`);
        }
      })
      .catch(error => {
        console.error('Errore nel caricamento dei dati:', error);
        alert('Si è verificato un errore nel caricamento dei dati. Riprova più tardi.');
      })
      .finally(() => {
        console.log('Tentativo di apertura del popup completato');
      });
  }

  // Funzione per chiudere il popup
  function closePopup() {
    document.querySelector('.popup').style.display = 'none';
  }

  // Esegui l'aggiornamento all'avvio
  fetchCurrentDay();

  // Imposta un timer per eseguire l'aggiornamento ogni giorno
  setInterval(fetchCurrentDay, 24 * 60 * 60 * 1000);

  // Aggiungi l'event listener per chiudere il popup
  document.querySelector('.popup-close').addEventListener('click', closePopup);
});

//LOTTIE
// Controlla le animazioni Lottie con hover e tap
window.addEventListener("load", function() {
  // Seleziona tutte le animazioni Lottie con la classe ".LottieAnimation"
  let lottieAnimations = document.querySelectorAll(".LottieAnimation");

  lottieAnimations.forEach(function(animationEl) {
      let animation = lottie.loadAnimation({
          container: animationEl,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          path: animationEl.getAttribute('data-lottie-path') // Supponendo che il percorso del file JSON sia specificato in un attributo data-lottie-path
      });

      let isPlaying = false;

      // Aggiungi l'evento di hover per il desktop
      animationEl.addEventListener("mouseenter", function() {
          if (!isPlaying) {
              animation.setDirection(1); // Direzione avanti
              animation.play();
              isPlaying = true;
          }
      });

      animationEl.addEventListener("mouseleave", function() {
          if (isPlaying) {
              animation.setDirection(-1); // Direzione indietro
              animation.play();
              isPlaying = false;
          }
      });

      // Aggiungi l'evento di tap per i dispositivi mobili
      animationEl.addEventListener("click", function() {
          if (!isPlaying) {
              animation.setDirection(1); // Direzione avanti
              animation.play();
              isPlaying = true;
          } else {
              animation.setDirection(-1); // Direzione indietro
              animation.play();
              isPlaying = false;
          }
      });
  });
});
