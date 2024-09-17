document.addEventListener("DOMContentLoaded", function() {
  let currentDay;

  function updateCalendar(currentDay) {
    const divs = document.querySelectorAll("div[data-day]");
    
    divs.forEach(div => {
      const day = parseInt(div.getAttribute("data-day") || "0");
      const status = div.getAttribute("data-status");
      
      if (day < currentDay && status === "past") {
        div.style.display = "block";
        div.classList.add("clickable");
      } else if (day === currentDay && status === "today") {
        div.style.display = "block";
        div.classList.add("clickable");
      } else if (day > currentDay && status === "future") {
        div.style.display = "block";
        div.classList.remove("clickable");
      } else {
        div.style.display = "none";
        div.classList.remove("clickable");
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
      currentDay = currentDate.getDate();
      updateCalendar(currentDay);
      setupEventListeners();
    } catch (error) {
      console.error("Errore nel recupero della data:", error);
    }
  }

  fetchCurrentDay();
  setInterval(fetchCurrentDay, 24 * 60 * 60 * 1000);

  async function loadPopupContent(day) {
    try {
      const response = await fetch('https://corsproxy.io/?https://raw.githubusercontent.com/ilastraz/AdventCalendar/main/calendario-contenuti.json');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const dayContent = data[day];
      
      if (dayContent) {
        const popup = document.getElementById('popup');
        popup.innerHTML = `
          <div class="popup-content" data-day="${day}">
            <div class="popup-date">${dayContent.data}</div>
            <h2 class="popup-head">${dayContent.head}</h2>
            <p class="popup-description">${dayContent.descrizione}</p>
            <a href="${dayContent.cta1.link}" class="popup-cta1">${dayContent.cta1.testo}</a>
            ${dayContent.cta2.testo ? `<a href="${dayContent.cta2.link}" class="popup-cta2">${dayContent.cta2.testo}</a>` : ''}
          </div>
        `;
        popup.style.display = 'block';
        
        // Imposta lo sfondo in base alla dimensione dello schermo
        const bgImage = window.innerWidth > 768 ? dayContent.bgdesktop : dayContent.bgmobile;
        popup.style.backgroundImage = `url('${bgImage}')`;
      }
    } catch (error) {
      console.error("Errore nel caricamento del contenuto del popup:", error);
    }
  }

  function setupEventListeners() {
    document.querySelectorAll("div[data-day]").forEach(div => {
      div.removeEventListener('click', clickHandler); // Rimuove eventuali listener precedenti
      div.addEventListener('click', clickHandler);
    });
  }

  function clickHandler(event) {
    const div = event.currentTarget;
    const day = parseInt(div.getAttribute('data-day'));
    const status = div.getAttribute('data-status');

    if ((day <= currentDay && status === "past") || (day === currentDay && status === "today")) {
      loadPopupContent(day.toString());
    }
  }

  // Chiudi il popup quando si clicca fuori da esso
  document.addEventListener('click', function(event) {
    const popup = document.getElementById('popup');
    if (event.target !== popup && !popup.contains(event.target)) {
      popup.style.display = 'none';
    }
  });
});