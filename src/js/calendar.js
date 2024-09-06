// 전체 스케줄 가져오기
let schedules = [];

async function fetchData() {
  try {
    // fetch로 GET 요청을 보내고 응답을 기다림
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schedules`);

    // 응답이 성공적(200~299)인지 확인
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    // 응답 본문을 JSON으로 파싱
    schedules = await res.json();
    updateCalendar();

    // 데이터 출력
    console.log(schedules);
  } catch (error) {
    // 오류 처리
    console.error("Fetch error:", error);
  }
}

let currentDate = new Date();

const logoElement = document.querySelector(".sidebar-logo a");
const calendarMonthElement = document.querySelector(".calendar-month");
const calendarYearElement = document.querySelector(".calendar-year");
const previousMonth = document.querySelector(".arrow-left");
const nextMonth = document.querySelector(".arrow-right");
const calendarCont = document.querySelector(".calendar-date");
const yearSelectText = document.querySelector(".calendar-select-year-text");
const monthSelectText = document.querySelector(".calendar-select-month-text");
const yearSelectBox = document.querySelector(".calendar-select-year-box");
const monthSelectBox = document.querySelector(".calendar-select-month-box");
const yearSelectCont = document.querySelector(".calendar-select-year");
const monthSelectCont = document.querySelector(".calendar-select-month");
const yearList = document.querySelectorAll(".calendar-select-year-list li");
const monthList = document.querySelectorAll(".calendar-select-month-list li");

// 처음 화면에서 셀렉트 박스 닫힘
yearSelectBox.style.display = "none";
monthSelectBox.style.display = "none";

function updateCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  // 현재 년도, 월 표시
  calendarMonthElement.textContent = String(month).padStart(2, "0");
  calendarYearElement.textContent = year;

  yearSelectText.textContent = `${year} 년`;
  monthSelectText.textContent = `${calendarMonthElement.textContent} 월`;

  renderCalendarDays(year, month);
}
// 연도 선택 핸들러
yearList.forEach((item) => {
  item.addEventListener("click", function () {
    const selectedYear = parseInt(this.textContent, 10);
    currentDate.setFullYear(selectedYear);
    yearSelectText.textContent = `${selectedYear} 년`; // 셀렉트 박스 년도 바꾸기
    updateCalendar();
  });
});

// 월 선택 핸들러
monthList.forEach((item) => {
  item.addEventListener("click", function () {
    const selectedMonth = parseInt(this.textContent, 10);
    currentDate.setMonth(selectedMonth - 1);
    monthSelectText.textContent = `${selectedMonth} 월`; // 셀렉트 박스 월 바꾸기
    updateCalendar();
  });
});

// 셀렉트 박스 열고 닫기
function toggleSelectBox(selectBox, otherSelectBox) {
  if (selectBox.style.display === "block") {
    yearSelectBox.style.display = "none";
    monthSelectBox.style.display = "none";
  } else {
    selectBox.style.display = "block";
    otherSelectBox.style.display = "none"; // 다른 셀렉트 박스는 닫기
  }
}

function initializeSelectBox() {
  yearSelectCont.addEventListener("click", function () {
    toggleSelectBox(yearSelectBox, monthSelectBox);
  });

  monthSelectCont.addEventListener("click", function () {
    toggleSelectBox(monthSelectBox, yearSelectBox);
  });

  updateCalendar();
}

function renderCalendarDays(year, month) {
  calendarCont.innerHTML = "";

  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  let table = document.createElement("table");
  let headerRow = document.createElement("tr");

  // 요일 별 클래스 추가 및 토요일, 일요일 클래스 추가
  daysOfWeek.forEach((day, index) => {
    let th = document.createElement("th");
    th.textContent = day;
    th.classList.add("day-header");
    if (index === 0) th.classList.add("sunday");
    if (index === 6) th.classList.add("saturday");
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const today = new Date();

  // 이전 달 마지막 날짜
  const prevLastDate = new Date(year, month - 1, 0).getDate();

  let row = document.createElement("tr");

  // 이전 달 날짜 채우기
  for (let i = 0; i < firstDay; i++) {
    let td = document.createElement("td");
    td.textContent = prevLastDate - firstDay + i + 1;
    td.classList.add("prev-month");
    row.appendChild(td);
  }

  // 현재 달 날짜 채우기
  for (let date = 1; date <= lastDate; date++) {
    if (row.children.length === 7) {
      table.appendChild(row);
      row = document.createElement("tr");
    }

    let td = document.createElement("td");
    td.textContent = date;
    td.classList.add("calendar-day");

    // 오늘 날짜 클래스 추가 ==> 후에 css 작업
    if (
      year === today.getFullYear() &&
      month === today.getMonth() + 1 &&
      date === today.getDate()
    ) {
      td.classList.add("today");
      // td.style.color = "red";
      // today 셀의 숫자에 따로 div 태그, class 추가 했습니다.
      let todayIndicator = document.createElement("div");
      todayIndicator.classList.add("today-indicator");
      todayIndicator.textContent = date;
      td.innerHTML = "";
      td.appendChild(todayIndicator);
    }

    const scheduleForDate = schedules.filter((schedule) => {
      const scheduleStart = new Date(schedule.schedule_start);
      const scheduleEnd = new Date(schedule.schedule_end);

      // 기본 일정(반복 없음)
      if (
        scheduleStart.getFullYear() === year &&
        scheduleStart.getMonth() + 1 === month &&
        scheduleStart.getDate() <= date &&
        scheduleEnd.getFullYear() === year &&
        scheduleEnd.getMonth() + 1 === month &&
        scheduleEnd.getDate() >= date
      ) {
        return true;
      }

      // 반복 일정 처리
      if (schedule.schedule_recurring && schedule.recurring_pattern) {
        const pattern = schedule.recurring_pattern;
        const startsOn = new Date(pattern.starts_on);
        const endsOn = new Date(pattern.ends_on);

        if (
          new Date(year, month - 1, date) >= startsOn &&
          new Date(year, month - 1, date) <= endsOn
        ) {
          switch (pattern.repeat_type) {
            case "daily":
              return (
                ((new Date(year, month - 1, date) - startsOn) /
                  (1000 * 60 * 60 * 24)) %
                  pattern.repeat_interval ===
                0
              );

            case "weekly":
              const dayOfWeek = daysOfWeek.indexOf(
                daysOfWeek[new Date(year, month - 1, date).getDay()]
              );
              return pattern.repeat_on.includes(daysOfWeek[dayOfWeek]);

            case "monthly":
              const currentDate = new Date(year, month - 1, date);
              const monthDifference =
                (currentDate.getFullYear() - startsOn.getFullYear()) * 12 +
                currentDate.getMonth() -
                startsOn.getMonth();

              const isWithinRecurringRange =
                monthDifference % pattern.repeat_interval === 0 &&
                date >= startsOn.getDate() &&
                date <= endsOn.getDate();

              return isWithinRecurringRange;

            case "yearly":
              return (
                month === startsOn.getMonth() + 1 &&
                date >= startsOn.getDate() &&
                date <= endsOn.getDate()
              );

            default:
              return false;
          }
        }
      }
      return false;
    });

    // 스케줄 바 추가
    scheduleForDate.forEach((schedule) => {
      const scheduleElement = document.createElement("div");
      scheduleElement.classList.add("schedule-bar");
      scheduleElement.textContent = schedule.schedule_title;
      td.appendChild(scheduleElement);
    });

    row.appendChild(td);
  }

  // 다음 달 날짜 채우기
  let nextMonthDay = 1;
  while (row.children.length < 7) {
    let td = document.createElement("td");
    td.textContent = nextMonthDay++;
    td.classList.add("next-month");
    row.appendChild(td);
  }

  table.appendChild(row);
  calendarCont.appendChild(table);
}

// 이전 달 이동
previousMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar();
});
// 다음 달 이동
nextMonth.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar();
});
// 로고 클릭 시 오늘 날짜로 이동
logoElement.addEventListener("click", function (event) {
  event.preventDefault();
  currentDate = new Date();
  yearSelectText.textContent = "년도 선택";
  monthSelectText.textContent = "월 선택";
  updateCalendar();

  function updateCalendar(newSchedules) {
    if (newSchedules) {
      schedules = newSchedules;
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    // 현재 년도, 월 표시
    calendarMonthElement.textContent = String(month).padStart(2, "0");
    calendarYearElement.textContent = year;

    yearSelectText.textContent = `${year} 년`;
    monthSelectText.textContent = `${calendarMonthElement.textContent} 월`;

    renderCalendarDays(year, month);
  }

  // 새로운 이벤트 리스너 추가
  document.addEventListener("updateCalendarEvent", function (e) {
    updateCalendar(e.detail.schedules);
  });

  // 초기화 함수
  function initCalendar() {
    fetchData();
    updateCalendar();
    initializeSelectBox();
  }

  // DOMContentLoaded 이벤트에서 초기화 함수 호출
  document.addEventListener("DOMContentLoaded", initCalendar);
});

fetchData();
updateCalendar();
initializeSelectBox();
