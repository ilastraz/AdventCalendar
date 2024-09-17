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
    fetch('https://corsproxy.io/?https://raw.githubusercontent.com/ilastraz/AdventCalendar/main/calendario-contenuti.json')
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
          try {
            // Popola il contenuto del popup
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

            // Mostra il popup
            const popup = document.querySelector('.popup');
            if (popup) {
              popup.style.display = 'flex';
              console.log('Popup display style:', popup.style.display);
            } else {
              console.error('Elemento .popup non trovato');
            }
          } catch (error) {
            console.error('Errore durante l\'assegnazione dei dati al popup:', error);
          }
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

