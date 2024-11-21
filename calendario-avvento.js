document.addEventListener("DOMContentLoaded", function () {
  console.log("Calendario avvento caricato!");

  function updateCalendar(currentDay, currentMonth) {
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
          openPopup(day);
        });
      } else if (day > currentDay && status === "future") {
        div.style.display = "block";
      } else {
        div.style.display = "none";
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

  function openPopup(day) {
    fetch('./json/calendario-contenuti.json')
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
              }
            }
          });

          const imgDesktop = document.querySelector('.popup-image-desktop');
          const imgMobile = document.querySelector('.popup-image-mobile');
          const imagePromises = [];

          if (imgDesktop && dayData.imgDesktop) {
            imgDesktop.src = dayData.imgDesktop;
            imagePromises.push(new Promise(resolve => {
              imgDesktop.onload = resolve;
              imgDesktop.onerror = resolve; // Risolve comunque per evitare blocchi
            }));
          }

          if (imgMobile && dayData.imgMobile) {
            imgMobile.src = dayData.imgMobile;
            imagePromises.push(new Promise(resolve => {
              imgMobile.onload = resolve;
              imgMobile.onerror = resolve; // Risolve comunque per evitare blocchi
            }));
          }

          Promise.all(imagePromises).then(() => {
            document.body.style.overflow = 'hidden'; // Disattiva lo scroll della pagina
            popup.style.display = 'flex';
          });
        } else {
          alert(`Nessun dato disponibile per il giorno ${day}`);
        }
      })
      .catch(error => {
        alert('Si è verificato un errore nel caricamento dei dati. Riprova più tardi.');
      });
  }

  function closePopup() {
    const popup = document.querySelector('.popup');
    if (popup) {
      popup.style.display = 'none';
      document.body.style.overflow = 'auto'; // Riattiva lo scroll della pagina
    }
  }

  // Inizio del caricamento iniziale
  fetchCurrentDate();

  // Event listener per chiudere il popup
  document.querySelector('.popup-close').addEventListener('click', closePopup);
});