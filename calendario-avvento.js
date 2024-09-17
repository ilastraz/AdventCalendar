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
        div.addEventListener('click', () => openPopup(day));
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
    fetch('https://corsproxy.io/?https://raw.githubusercontent.com/ilastraz/AdventCalendar/main/calendario-contenuti.json')
      .then(response => response.json())
      .then(data => {
        const dayData = data[day.toString()];
        if (dayData) {
          document.querySelector('.popup-date').textContent = dayData.data;
          document.querySelector('.popup-head').textContent = dayData.head;
          document.querySelector('.popup-description').textContent = dayData.descrizione;
          document.querySelector('.popup-cta1').href = dayData.cta1.link;
          document.querySelector('.popup-cta1').textContent = dayData.cta1.testo;
          document.querySelector('.popup-cta2').href = dayData.cta2.link;
          document.querySelector('.popup-cta2').textContent = dayData.cta2.testo;
          
          const popupContent = document.querySelector('.popup-content');
          if (window.innerWidth > 768) {
            popupContent.style.backgroundImage = `url(${dayData.bgdesktop})`;
          } else {
            popupContent.style.backgroundImage = `url(${dayData.bgmobile})`;
          }

          document.querySelector('.popup').style.display = 'flex';
        }
      })
      .catch(error => console.error('Errore nel caricamento dei dati:', error));
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

