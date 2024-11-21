document.addEventListener("DOMContentLoaded", function () {
  const workerUrl = "https://little-fog-e164.ila-strazzullo.workers.dev/"; // URL del tuo Worker

  console.log("Worker configurato correttamente!");

  function updateCalendar(currentDay, currentMonth) {
    console.log(`Aggiornamento calendario per il giorno ${currentDay} e mese ${currentMonth}`);
    const divs = document.querySelectorAll("div[data-day]");

    divs.forEach(div => {
      const day = parseInt(div.getAttribute("data-day"));
      console.log(`Valutazione casella giorno ${day}`);
      
      // Nascondi tutte le caselle per impostazione predefinita
      div.style.display = "none";

      // Logica per novembre o mesi precedenti
      if (currentMonth < 11) {
        console.log(`Mese corrente: ${currentMonth}. Imposto tutte le caselle a "future"`);
        div.style.display = "block";
        div.setAttribute("data-status", "future");
      } 
      // Logica per dicembre
      else if (currentMonth === 11) {
        if (day < currentDay) {
          console.log(`Casella ${day}: Stato impostato a "past"`);
          div.style.display = "block";
          div.setAttribute("data-status", "past");
        } else if (day === currentDay) {
          console.log(`Casella ${day}: Stato impostato a "today"`);
          div.style.display = "block";
          div.setAttribute("data-status", "today");
          div.style.cursor = "pointer";
          div.addEventListener('click', () => {
            console.log(`Cliccata casella giorno ${day}`);
            openPopup(day);
            trackClick(day, 'box'); // Traccia il click sulla casella
          });
        } else {
          console.log(`Casella ${day}: Stato impostato a "future"`);
          div.style.display = "block";
          div.setAttribute("data-status", "future");
        }
      } 
      // Logica per gennaio o mesi successivi
      else {
        console.log(`Mese corrente: ${currentMonth}. Imposto tutte le caselle a "past"`);
        div.style.display = "block";
        div.setAttribute("data-status", "past");
      }
    });
  }

  function fetchCurrentDate() {
    try {
      const currentDate = new Date();
      const currentDay = currentDate.getDate();
      const currentMonth = currentDate.getMonth(); // Novembre = 10, Dicembre = 11
      console.log(`Data corrente: Giorno ${currentDay}, Mese ${currentMonth}`);
      updateCalendar(currentDay, currentMonth);
    } catch (error) {
      console.error("Errore durante il calcolo della data:", error);
    }
  }

  // Funzione per tracciare i clic tramite il Worker
  async function trackClick(day, action) {
    console.log(`Tracciamento in corso: Giorno ${day}, Azione ${action}`);
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
    console.log(`Apertura popup per il giorno ${day}`);
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
          console.log(`Dati caricati per il giorno ${day}:`, dayData);
          const popup = document.querySelector('.popup');
          if (!popup) {
            console.error("Elemento popup non trovato");
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
              console.log(`Elemento ${selector} aggiornato`);
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
            console.log("Caricamento immagine desktop");
            imgDesktop.src = dayData.imgDesktop;
            imgDesktop.removeAttribute('srcset');
            imgDesktop.removeAttribute('sizes');
            imagePromises.push(new Promise(resolve => {
              imgDesktop.onload = resolve;
              imgDesktop.onerror = resolve;
            }));
          }

          if (imgMobile && dayData.imgMobile) {
            console.log("Caricamento immagine mobile");
            imgMobile.src = dayData.imgMobile;
            imgMobile.removeAttribute('srcset');
            imgMobile.removeAttribute('sizes');
            imagePromises.push(new Promise(resolve => {
              imgMobile.onload = resolve;
              imgMobile.onerror = resolve;
            }));
          }

          Promise.all(imagePromises).then(() => {
            console.log("Tutte le immagini sono state caricate. Mostro il popup.");
            document.body.style.overflow = 'hidden'; // Disattiva scroll
            popup.style.display = 'flex';
          });
        } else {
          console.warn(`Nessun dato disponibile per il giorno ${day}`);
        }
      })
      .catch(error => {
        alert('Si è verificato un errore nel caricamento dei dati. Riprova più tardi.');
        console.error('Errore nel caricamento del popup:', error);
      });
  }

  // Funzione per chiudere il popup
  function closePopup() {
    console.log("Chiusura popup");
    const popup = document.querySelector('.popup');
    if (popup) {
      popup.style.display = 'none';
      document.body.style.overflow = 'auto'; // Riattiva scroll
    }
  }

  // Avvia il caricamento iniziale
  console.log("Inizio aggiornamento del calendario");
  fetchCurrentDate();

  // Aggiungi l'event listener per chiudere il popup
  document.querySelector('.popup-close').addEventListener('click', closePopup);
});