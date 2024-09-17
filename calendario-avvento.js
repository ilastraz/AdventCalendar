document.addEventListener("DOMContentLoaded", function() {
  let currentDay;

  function updateCalendar(currentDay) {
    console.log("Aggiornamento calendario per il giorno:", currentDay);
    const divs = document.querySelectorAll("div[data-day]");
    
    divs.forEach(div => {
      const day = parseInt(div.getAttribute("data-day") || "0");
      const status = div.getAttribute("data-status");
      
      console.log(`Elemento giorno ${day}, status: ${status}`);
      
      if (day === currentDay && status === "today") {
        div.style.display = "block";
        div.classList.add("clickable");
        div.style.cursor = "pointer";
        console.log(`Giorno ${day} è cliccabile`);
      } else {
        div.style.display = "block";
        div.classList.remove("clickable");
        div.style.cursor = "default";
      }
    });
  }

  async function fetchCurrentDay() {
    try {
      // Per scopi di test, impostiamo manualmente il giorno corrente
      currentDay = new Date().getDate();
      console.log("Giorno corrente impostato a:", currentDay);
      updateCalendar(currentDay);
      setupEventListeners();
    } catch (error) {
      console.error("Errore nel recupero della data:", error);
    }
  }

  fetchCurrentDay();

  async function loadPopupContent(day) {
    console.log("Caricamento contenuto popup per il giorno:", day);
    try {
      // Per scopi di test, usiamo dati di esempio invece di fare una richiesta fetch
      const dayContent = {
        data: `${day} Dicembre`,
        head: `Titolo del Giorno ${day}`,
        descrizione: `Descrizione per il giorno ${day}`,
        cta1: { testo: "CTA 1", link: "#" },
        cta2: { testo: "CTA 2", link: "#" },
        bgdesktop: "url_immagine_desktop",
        bgmobile: "url_immagine_mobile"
      };
      
      if (dayContent) {
        const popup = document.getElementById('popup');
        if (!popup) {
          console.error("Elemento popup non trovato!");
          return;
        }
        popup.innerHTML = `
          <div class="popup-content" data-day="${day}">
            <button id="closePopup" class="close-popup-btn">&times;</button>
            <div class="popup-date">${dayContent.data}</div>
            <h2 class="popup-head">${dayContent.head}</h2>
            <p class="popup-description">${dayContent.descrizione}</p>
            <a href="${dayContent.cta1.link}" class="popup-cta1">${dayContent.cta1.testo}</a>
            ${dayContent.cta2.testo ? `<a href="${dayContent.cta2.link}" class="popup-cta2">${dayContent.cta2.testo}</a>` : ''}
          </div>
        `;
        popup.style.display = 'block';
        
        const bgImage = window.innerWidth > 768 ? dayContent.bgdesktop : dayContent.bgmobile;
        popup.style.backgroundImage = `url('${bgImage}')`;
        
        document.getElementById('closePopup').addEventListener('click', closePopup);
        console.log("Popup caricato e visualizzato");
      }
    } catch (error) {
      console.error("Errore nel caricamento del contenuto del popup:", error);
    }
  }

  function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
      popup.style.display = 'none';
      console.log("Popup chiuso");
    }
  }

  function setupEventListeners() {
    console.log("Impostazione event listeners");
    document.querySelectorAll("div[data-day]").forEach(div => {
      div.removeEventListener('click', clickHandler);
      div.addEventListener('click', clickHandler);
    });
  }

  function clickHandler(event) {
    const div = event.currentTarget;
    const day = parseInt(div.getAttribute('data-day'));
    const status = div.getAttribute('data-status');

    console.log(`Clic su giorno ${day}, status: ${status}`);

    if (day === currentDay && status === "today") {
      loadPopupContent(day.toString());
    }
  }

  document.addEventListener('click', function(event) {
    const popup = document.getElementById('popup');
    if (popup && event.target === popup) {
      closePopup();
    }
  });

  console.log("Script calendario avvento caricato");
});