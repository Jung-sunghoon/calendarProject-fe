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
      // 날짜를 'YYYY-MM-DD' 형식으로 변환
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      // API 엔드포인트 (실제 주소로 변경 필요)
      const response = await fetch(`http://localhost:8080/api/schedule`);

      if (!response.ok) {
        throw new Error("네트워크 통신 에러");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        // 데이터가 있으면 모달 내용 업데이트
        $modalViewCont.innerHTML = data
          .map(
            (schedule) => `
            <div class="modal-view-item">
              <h3 class="modal-view-tit">${schedule.title}</h3>
              <div class="modal-view-time">
                <span class="view-time-start">${schedule.startTime}</span>
                <span class="view-time-separator">~</span>
                <span class="view-time-end">${schedule.endTime}</span>
              </div>
              <p>${schedule.description}</p>
            </div>
          `
          )
          .join("");
      } else {
        // 데이터가 없으면 빈 상태로 표시
        $modalViewCont.innerHTML = "<p>조회 가능한 일정이 없습니다</p>";
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      $modalViewCont.innerHTML = "<p>뭔가 잘못됬어</p>";
    }
  }
});
