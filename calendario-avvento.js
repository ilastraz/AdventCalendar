document.addEventListener("DOMContentLoaded", function () {
  const workerUrl = "https://little-fog-e164.ila-strazzullo.workers.dev/"; // URL del tuo Worker

  console.log("Worker configurato correttamente!");

  function updateCalendar(currentDay, currentMonth) {
    const divs = document.querySelectorAll("div[data-day]");
  
    divs.forEach(div => {
      const day = parseInt(div.getAttribute("data-day"));
      const status = div.getAttribute("data-status");
  
      // Logica per novembre
      if (currentMonth < 11) {
        div.style.display = "block";
        div.setAttribute("data-status", "future");
      } 
      // Logica per dicembre
      else if (currentMonth === 11) {
        if (day < currentDay) {
          div.style.display = "block";
          div.setAttribute("data-status", "past");
        } else if (day === currentDay) {
          div.style.display = "block";
          div.setAttribute("data-status", "today");
          div.style.cursor = "pointer";
          div.addEventListener('click', () => {
            openPopup(day);
            trackClick(day, 'box'); // Traccia il click sulla casella
          });
        } else {
          div.style.display = "block";
          div.setAttribute("data-status", "future");
        }
      } 
      // Logica per gennaio o mesi successivi
      else {
        div.style.display = "block";
        div.setAttribute("data-status", "past");
      }
    });
  }

  // Funzione per ottenere il giorno e il mese correnti
  function fetchCurrentDate() {
    try {
      const currentDate = new Date();
      const currentDay = currentDate.getDate();
      const currentMonth = currentDate.getMonth(); // Novembre = 10, Dicembre = 11
      updateCalendar(currentDay, currentMonth);
    } catch (error) {
      console.error("Errore durante il calcolo della data:", error);
    }
  }

  // Funzione per tracciare i clic tramite il Worker
  async function trackClick(day, action) {
    try {
      const response = await fetch(workerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: day,
          action: action,
        }),
      });

      if (!response.ok) {
        throw new Error("Errore nel tracciamento");
      }

      console.log(`Tracciamento registrato: ${action} per il giorno ${day}`);
    } catch (error) {
      console.error("Errore durante il tracciamento:", error);
    }
  }

  // Funzione per aprire il popup
  function openPopup(day) {
    fetch('https://corsproxy.io/?https://gleeful-crepe-005071.netlify.app/calendario-contenuti.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const dayData = data[day.toString()];
        if (dayData) {
          const popup = document.querySelector('.popup');
          if (!popup) {
            return;
          }

          const elements = [
            { selector: '.popup-date', property: 'textContent', value: dayData.data },
            { selector: '.popup-head', property: 'textContent', value: dayData.head },
            { selector: '.popup-description', property: 'textContent', value: dayData.descrizione },
            { selector: '.popup-cta1', property: 'href', value: dayData.cta1.link },
            { selector: '.popup-cta1', property: 'textContent', value: dayData.cta1.testo },
            { selector: '.popup-cta2', property: 'href', value: dayData.cta2.link },
            { selector: '.popup-cta2', property: 'textContent', value: dayData.cta2.testo },
            { selector: '.popup-nota', property: 'textContent', value: dayData.nota }
          ];

          elements.forEach(({ selector, property, value }) => {
            const element = document.querySelector(selector);
            if (element) {
              element[property] = value;
              if (value === "" && (selector === '.popup-cta1' || selector === '.popup-cta2')) {
                element.style.display = 'none';
              } else if (selector === '.popup-cta1' || selector === '.popup-cta2') {
                element.setAttribute('target', '_blank');
                element.replaceWith(element.cloneNode(true)); // Rimuove listener duplicati
                const newElement = document.querySelector(selector);
                newElement.addEventListener('click', event => {
                  event.stopPropagation(); // Evita propagazione
                  trackClick(day, selector === '.popup-cta1' ? 'cta1' : 'cta2'); // Traccia CTA
                });
              }
            }
          });

          const imgDesktop = document.querySelector('.popup-image-desktop');
          const imgMobile = document.querySelector('.popup-image-mobile');
          const imagePromises = [];

          if (imgDesktop && dayData.imgDesktop) {
            imgDesktop.src = dayData.imgDesktop;
            imgDesktop.removeAttribute('srcset');
            imgDesktop.removeAttribute('sizes');
            imagePromises.push(new Promise(resolve => {
              imgDesktop.onload = resolve;
              imgDesktop.onerror = resolve;
            }));
          }

          if (imgMobile && dayData.imgMobile) {
            imgMobile.src = dayData.imgMobile;
            imgMobile.removeAttribute('srcset');
            imgMobile.removeAttribute('sizes');
            imagePromises.push(new Promise(resolve => {
              imgMobile.onload = resolve;
              imgMobile.onerror = resolve;
            }));
          }

          Promise.all(imagePromises).then(() => {
            document.body.style.overflow = 'hidden'; // Disattiva scroll
            popup.style.display = 'flex';
          });
        } else {
          alert(`Nessun dato disponibile per il giorno ${day}`);
        }
      })
      .catch(error => {
        alert('Si è verificato un errore nel caricamento dei dati. Riprova più tardi.');
        console.error('Errore nel caricamento del popup:', error);
      });
  }

  // Funzione per chiudere il popup
  function closePopup() {
    const popup = document.querySelector('.popup');
    if (popup) {
      popup.style.display = 'none';
      document.body.style.overflow = 'auto'; // Riattiva scroll
    }
  }

  // Avvia il caricamento iniziale
  fetchCurrentDate();

  // Imposta un timer per eseguire l'aggiornamento ogni giorno
  setInterval(fetchCurrentDate, 24 * 60 * 60 * 1000);

  // Aggiungi l'event listener per chiudere il popup
  document.querySelector('.popup-close').addEventListener('click', closePopup);
});