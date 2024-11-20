document.addEventListener("DOMContentLoaded", function() {
  // Configura Supabase
  const supabaseUrl = "https://ofsgnkwqwaigpvkjthxl.supabase.co"; // Sostituisci con il tuo URL Supabase
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mc2dua3dxd2FpZ3B2a2p0aHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMzY1NDUsImV4cCI6MjA0NzcxMjU0NX0.BbWNgnvdTWXs_2kpFDooT9KNPAPnfPRH5rH7FiRH9Zo"; // Sostituisci con la tua anon key
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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
          openPopup(day);
          trackClick(day, 'box'); // Traccia il click sulla casella
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
      const currentDay = currentDate.getDate();
      updateCalendar(currentDay);
    } catch (error) {
      console.error('Errore durante il calcolo della data:', error);
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
                  trackClick(day, selector === '.popup-cta1' ? 'cta1' : 'cta2'); // Traccia il click sulle CTA
                });
              }
            }
          });

          // Aggiorna le immagini popup-image-desktop e popup-image-mobile
          const imgDesktop = document.querySelector('.popup-image-desktop');
          const imgMobile = document.querySelector('.popup-image-mobile');
          const imagePromises = [];

          if (imgDesktop && dayData.imgDesktop) {
            imgDesktop.src = dayData.imgDesktop;
            imagePromises.push(new Promise((resolve) => {
              imgDesktop.onload = resolve;
              imgDesktop.onerror = resolve; // Risolve comunque per evitare blocchi
            }));
          }

          if (imgMobile && dayData.imgMobile) {
            imgMobile.src = dayData.imgMobile;
            imagePromises.push(new Promise((resolve) => {
              imgMobile.onload = resolve;
              imgMobile.onerror = resolve; // Risolve comunque per evitare blocchi
            }));
          }

          // Mostra il popup solo quando tutte le immagini sono caricate
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
        console.error('Errore nel caricamento del popup:', error);
      });
  }

  // Funzione per chiudere il popup
  function closePopup() {
    document.querySelector('.popup').style.display = 'none';
    document.body.style.overflow = 'auto'; // Riattiva lo scroll della pagina
  }

  // Funzione per tracciare i clic su Supabase
  async function trackClick(day, action) {
    try {
      const { data, error } = await supabase
        .from('clicks')
        .insert([
          { day: day, action: action, timestamp: new Date().toISOString() }
        ]);

      if (error) {
        console.error('Errore nel tracciamento:', error);
      } else {
        console.log('Tracciamento registrato:', data);
      }
    } catch (error) {
      console.error('Errore durante il tracciamento:', error);
    }
  }

  // Esegui l'aggiornamento all'avvio
  fetchCurrentDay();

  // Imposta un timer per eseguire l'aggiornamento ogni giorno
  setInterval(fetchCurrentDay, 24 * 60 * 60 * 1000);

  // Aggiungi l'event listener per chiudere il popup
  document.querySelector('.popup-close').addEventListener('click', closePopup);
});