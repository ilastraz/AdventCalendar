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

  function fetchCurrentDay() {
    try {
      const currentDate = new Date();
      console.log('Data corrente dal browser:', currentDate);
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
            {selector: '.popup-nota', property: 'textContent', value: dayData.nota}
          ];

          elements.forEach(({selector, property, value}) => {
            const element = document.querySelector(selector);
            if (element) {
              element[property] = value;
              if (value === "" && (selector === '.popup-cta1' || selector === '.popup-cta2')) {
                element.style.display = 'none';
              } else if (selector === '.popup-cta1' || selector === '.popup-cta2') {
                element.setAttribute('target', '_blank');
                element.addEventListener('click', event => {
                  event.stopPropagation(); // Evita che il click si propaghi e interferisca
                });
              }
            } else {
              console.error(`Elemento ${selector} non trovato`);
            }
          });

          // Aggiorna le immagini popup-image-desktop e popup-image-mobile
          const imgDesktop = document.querySelector('.popup-image-desktop');
          const imgMobile = document.querySelector('.popup-image-mobile');
          const imagePromises = [];

          if (imgDesktop && dayData.imgDesktop) {
            imgDesktop.src = dayData.imgDesktop;
            imgDesktop.removeAttribute('srcset');
            imgDesktop.removeAttribute('sizes');
            imagePromises.push(new Promise((resolve) => {
              imgDesktop.onload = resolve;
              imgDesktop.onerror = resolve; // Risolve comunque per evitare blocchi
            }));
          } else if (!imgDesktop) {
            console.error('Elemento .popup-image-desktop non trovato');
          }

          if (imgMobile && dayData.imgMobile) {
            imgMobile.src = dayData.imgMobile;
            imgMobile.removeAttribute('srcset');
            imgMobile.removeAttribute('sizes');
            imagePromises.push(new Promise((resolve) => {
              imgMobile.onload = resolve;
              imgMobile.onerror = resolve; // Risolve comunque per evitare blocchi
            }));
          } else if (!imgMobile) {
            console.error('Elemento .popup-image-mobile non trovato');
          }

          // Mostra il popup solo quando tutte le immagini sono caricate
          Promise.all(imagePromises).then(() => {
            // Disattiva lo scroll della pagina
            document.body.style.overflow = 'hidden';

            popup.style.display = 'flex';
            console.log('Popup display style:', popup.style.display);
            console.log('Computed style:', window.getComputedStyle(popup).display);
          });
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
    // Riattiva lo scroll della pagina
    document.body.style.overflow = 'auto';
  }

  // Esegui l'aggiornamento all'avvio
  fetchCurrentDay();

  // Imposta un timer per eseguire l'aggiornamento ogni giorno
  setInterval(fetchCurrentDay, 24 * 60 * 60 * 1000);

  // Aggiungi l'event listener per chiudere il popup
  document.querySelector('.popup-close').addEventListener('click', closePopup);
});
