document.addEventListener("DOMContentLoaded", function () {
  const $modalScheduleView = document.querySelector(".modal-schedule-view");
  const $modalScheduleEdit = document.querySelector(".modal-schedule-edit");
  const $closeBtn = document.querySelector(".view-close-button");
  const $addBtn = document.querySelector(".view-add-button");
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
      if (typeof window.updateCalendar === "function") {
        window.updateCalendar();
      }

      // 모달 표시
      $modalScheduleView.style.display = "block";

      console.log("Selected date: ", targetDate.toDateString());
      updateModalContent(targetDate);
      fetchScheduleData(targetDate);
    }
  });

  $addBtn.addEventListener("click", function () {
    $modalScheduleEdit.style.display = "block"
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
    const $modalDateElement =
      $modalScheduleView.querySelector(".modal-view-date");
    if ($modalDateElement) {
      $modalDateElement.innerHTML = `
          <p class="view-year">${date.getFullYear()}</p>
          <p class="view-month">${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}</p>
          <span class="view-separator">/</span>
          <p class="view-day">${String(date.getDate()).padStart(2, "0")}</p>
        `;
    }
  }

  async function fetchScheduleData(date) {
    const $modalViewCont = $modalScheduleView.querySelector(".modal-view-cont");
    if (!$modalViewCont) return;
  
    try {
      const response = await fetch(`http://localhost:8080/api/schedules`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Fetched data:", data);  // 데이터 로깅
  
      const filteredData = data.filter(schedule => {
        const scheduleStart = new Date(schedule.schedule_start);
        
        // 기본 일정(반복 없음)
        if (scheduleStart.toDateString() === date.toDateString()) {
          return true;
        }
  
        // 반복 일정 처리
        if (schedule.schedule_recurring && schedule.recurring_pattern) {
          const pattern = schedule.recurring_pattern;
          const startsOn = new Date(pattern.starts_on);
          const endsOn = new Date(pattern.ends_on);
  
          if (date >= startsOn && date <= endsOn) {
            switch (pattern.repeat_type) {
              case "daily":
                return ((date - startsOn) / (1000 * 60 * 60 * 24)) % pattern.repeat_interval === 0;
              case "weekly":
                const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
                return pattern.repeat_on.includes(dayOfWeek);
              case "monthly":
                return date.getDate() === startsOn.getDate();
              case "yearly":
                return date.getMonth() === startsOn.getMonth() && date.getDate() === startsOn.getDate();
              default:
                return false;
            }
          }
        }
        return false;
      });
  
      if (filteredData.length > 0) {
        $modalViewCont.innerHTML = filteredData
          .map(
            (schedule) => `
            <div class="modal-view-box">
              <h3 class="modal-view-tit">${schedule.schedule_title}</h3>
              <div class="modal-view-time">
                <span class="view-time-start">${formatTime(schedule.schedule_start)}</span>
                <span class="view-time-separator">~</span>
                <span class="view-time-end">${formatTime(schedule.schedule_end)}</span>
              </div>
              <p class="modal-view-content">${schedule.schedule_content || ''}</p>
            </div>
          `
          )
          .join("");
      } else {
        $modalViewCont.innerHTML = "<p>조회 가능한 일정이 없습니다</p>";
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      $modalViewCont.innerHTML = `<p>일정을 불러오는 중 오류가 발생했습니다: ${error.message}</p>`;
    }
  }
  
  function formatTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  function formatTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
});