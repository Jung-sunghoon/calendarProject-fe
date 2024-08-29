document.addEventListener("DOMContentLoaded", function () {
  const $modalScheduleView = document.querySelector(".modal-schedule-view");
  const $modalScheduleEdit = document.querySelector(".modal-schedule-edit");
  const $closeBtn = document.querySelector(".view-close-button");
  const $addBtn = document.querySelector(".view-add-button");
  const calendarMonthElement = document.querySelector(".calendar-month");
  const calendarYearElement = document.querySelector(".calendar-year");
  const API_URL = "http://localhost:8080";

  document.body.addEventListener("click", async function (event) {
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
      targetDate.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정

      // 현재 날짜 업데이트
      window.currentDate = new Date(targetDate);

      // calendar.js의 updateCalendar 함수 호출
      if (typeof window.updateCalendar === 'function') {
        window.updateCalendar();
      }

      // 모달 표시
      $modalScheduleView.style.display = "block";

      console.log("Selected date: ", targetDate.toISOString());
      await fetchScheduleData(targetDate);
    }
  });

  $addBtn.addEventListener("click", function() {
    $modalScheduleEdit.style.display = "block"
  })
  const closeModal = () => {
    $modalScheduleView.style.display = "none";
  };

  window.addEventListener("click", function (event) {
    if (event.target === $modalScheduleView || event.target === $closeBtn) {
      closeModal();
    }
  });

  async function fetchScheduleData(date) {
    const $modalDateElement = $modalScheduleView.querySelector(".modal-view-date");
    const $modalViewCont = $modalScheduleView.querySelector(".modal-view-cont");
    
    if ($modalDateElement) {
      $modalDateElement.innerHTML = `
        <p class="view-year">${date.getFullYear()}</p>
        <p class="view-month">${String(date.getMonth() + 1).padStart(2, "0")}</p>
        <span class="view-separator">/</span>
        <p class="view-day">${String(date.getDate()).padStart(2, "0")}</p>
      `;
    }

    try {
      const response = await fetch(`${API_URL}/api/schedules`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const scheduleData = await response.json();
      console.log("All schedules:", scheduleData);

      if ($modalViewCont) {
        const filteredSchedules = scheduleData.filter(schedule => {
          const startDate = new Date(schedule.schedule_start);
          const endDate = new Date(schedule.schedule_end);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);

          console.log("Comparing dates:", {
            date: date.toISOString(),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            isWithinRange: date >= startDate && date <= endDate
          });

          return date >= startDate && date <= endDate;
        });

        console.log("Filtered schedules:", filteredSchedules);

        if (filteredSchedules.length > 0) {
          $modalViewCont.innerHTML = filteredSchedules.map(schedule => `
            <div class="schedule-item">
              <h3 class="modal-view-tit">${schedule.schedule_title}</h3>
              <div class="modal-view-time">
                <span class="view-time-start">${formatTime(schedule.schedule_start)}</span>
                <span class="view-time-separator">~</span>
                <span class="view-time-end">${formatTime(schedule.schedule_end)}</span>
              </div>
              <p class="modal-view-content">${schedule.schedule_content || ''}</p>
            </div>
          `).join('');
        } else {
          $modalViewCont.innerHTML = '<p>No schedules for this date.</p>';
        }
      }
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      if ($modalViewCont) {
        $modalViewCont.innerHTML = '<p>Failed to load schedules.</p>';
      }
    }
  }

  function formatTime(timeString) {
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'Invalid Date';
    }
  }
});