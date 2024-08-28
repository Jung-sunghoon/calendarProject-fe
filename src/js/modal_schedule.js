document.addEventListener("DOMContentLoaded", function () {
    const $modalScheduleView = document.querySelector(".modal-schedule-view");
    const $closeBtn = document.querySelector(".view-close-button");
    const calendarMonthElement = document.querySelector(".calendar-month");
    const calendarYearElement = document.querySelector(".calendar-year");
  
    document.body.addEventListener("click", function (event) {
      const clickedDay = event.target.closest("td");
      if (
        clickedDay &&
        (clickedDay.classList.contains("calendar-day") ||
          clickedDay.classList.contains("prev-month") ||
          clickedDay.classList.contains("next-month"))
      ) {
        let currentYear = parseInt(calendarYearElement.textContent);
        let currentMonth = parseInt(calendarMonthElement.textContent) - 1; // 0-based month
        let clickedDate = parseInt(clickedDay.textContent);
  
        if (clickedDay.classList.contains("prev-month")) {
          if (currentMonth === 0) {
            currentYear--;
            currentMonth = 11;
          } else {
            currentMonth--;
          }
        } else if (clickedDay.classList.contains("next-month")) {
          if (currentMonth === 11) {
            currentYear++;
            currentMonth = 0;
          } else {
            currentMonth++;
          }
        }
  
        let targetDate = new Date(currentYear, currentMonth, clickedDate);
  
        // 현재 날짜 업데이트
        window.currentDate = new Date(targetDate);
  
        // calendar.js의 updateCalendar 함수 호출
        if (typeof window.updateCalendar === 'function') {
          window.updateCalendar();
        }
  
        // 모달 표시
        $modalScheduleView.style.display = "block";
  
        console.log("Selected date: ", targetDate.toDateString());
        updateModalContent(targetDate);
      }
    });
  
    const closeModal = () => {
      $modalScheduleView.style.display = "none";
    };
  
    window.addEventListener("click", function (event) {
      if (event.target === $modalScheduleView || event.target === $closeBtn) {
        closeModal();
      }
    });
  
    function updateModalContent(date) {
      const $modalDateElement = $modalScheduleView.querySelector(".modal-view-date");
      if ($modalDateElement) {
        $modalDateElement.innerHTML = `
          <p class="view-year">${date.getFullYear()}</p>
          <p class="view-month">${String(date.getMonth() + 1).padStart(2, "0")}</p>
          <span class="view-separator">/</span>
          <p class="view-day">${String(date.getDate()).padStart(2, "0")}</p>
        `;
      }
    }
  });