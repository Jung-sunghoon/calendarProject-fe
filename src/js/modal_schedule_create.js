document.addEventListener("DOMContentLoaded", function () {
  /************ 모달창 닫힘 기능 구현 ************/
  const closeBtn = document.getElementById("close-btn");
  const exitBtn = document.getElementById("exit-btn"); // 일정 모달창 나가기버튼
  const modal = document.querySelector(".modal-schedule-edit");
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };
  exitBtn.onclick = function () {
    modal.style.display = "none";
  };

  /************** date-picker 구현 **************/
  const datePicker = document.getElementById("datePicker"); // 작은 달력 구현
  const calendar = document.getElementById("calendar"); // 작은 달력 날짜
  const currentMonthSpan = document.getElementById("currentMonth"); // 작은 달력의 년도.월
  const prevMonthBtn = document.getElementById("prevMonth"); // 작은 달력의 이전월
  const nextMonthBtn = document.getElementById("nextMonth"); // 작은 달력의 다음월
  const confirmBtn = document.getElementById("confirm"); // 작은 달력의 확인버튼
  const saveBtn = document.getElementById("save-btn"); // 일정 생성 및 저장버튼
  const clearBtn = document.getElementById("clear-btn"); // 일정의 삭제버튼
  const selectedDateSpan = document.getElementById("selectedDate"); // 일정의 시작날짜
  const selectedTimeSpan = document.getElementById("selectedTime"); // 일정의 시작시간
  const completeDateSpan = document.getElementById("completeDate"); // 일정의 완료날짜
  const completeTimeSpan = document.getElementById("completeTime"); // 일정의 완료시간

  let currentDate = new Date();
  let selectedDate = null;

  function updateCalendar() {
    calendar.innerHTML = "";
    currentMonthSpan.textContent = `${currentDate.getFullYear()}.${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;

    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const prevMonthLastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    for (let i = firstDay.getDay() - 1; i >= 0; i--) {
      const dayElement = createDayElement(
        new Date(
          prevMonthLastDay.getFullYear(),
          prevMonthLastDay.getMonth(),
          prevMonthLastDay.getDate() - i
        )
      );
      dayElement.classList.add("other-month");
      calendar.appendChild(dayElement);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dayElement = createDayElement(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      );
      calendar.appendChild(dayElement);
    }

    const remainingDays = 42 - calendar.children.length;
    for (let i = 1; i <= remainingDays; i++) {
      const dayElement = createDayElement(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
      );
      dayElement.classList.add("other-month");
      calendar.appendChild(dayElement);
    }
  }

  function createDayElement(date) {
    const dayElement = document.createElement("div");
    dayElement.textContent = date.getDate();
    dayElement.classList.add("day");

    if (date.getDay() === 0) dayElement.classList.add("sun");
    if (date.getDay() === 6) dayElement.classList.add("sat");

    if (date.toDateString() === new Date().toDateString()) {
      dayElement.classList.add("today");
    }

    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      dayElement.classList.add("selected");
    }

    dayElement.addEventListener("click", () => selectDate(date));
    return dayElement;
  }

  function selectDate(date) {
    selectedDate = date;
    currentDate = new Date(date);
    updateCalendar();
  }
  // 버튼 클릭시 이벤트 값 설정
  prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
  });

  nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
  });

  confirmBtn.addEventListener("click", () => {
    const timeValue = (input, length, minValue, maxValue) => {
      input.value = input.value.padStart(length, "0");
      if (input.value.length > length) {
        input.value = input.value.slice(0, length);
      } else if (input.value < minValue) {
        input.value = minValue;
      } else if (input.value > maxValue) {
        input.value = maxValue;
      }
      return input.value;
    };
    const hour = timeValue(document.getElementById("hour"), 2, 0, 23);
    const minute = timeValue(document.getElementById("minute"), 2, 0, 59);

    selectedDateSpan.textContent = `${currentDate.getFullYear()}년 ${
      currentDate.getMonth() + 1
    }월 ${currentDate.getDate()}일`;
    selectedTimeSpan.textContent = `${hour}:${minute}`;
    completeDateSpan.textContent = `${currentDate.getFullYear()}년 ${
      currentDate.getMonth() + 1
    }월 ${currentDate.getDate()}일`;
    completeTimeSpan.textContent = `${hour}:${minute}`;
    datePicker.style.display =
      datePicker.style.display == "none" ? "block" : "none";
  });

  clearBtn.style.display = "none";

  // 작은달력 위치 값 조정
  selectedDateSpan.addEventListener("click", () => {
    datePicker.style.display =
      datePicker.style.display == "none" ? "block" : "none";
    datePicker.style.display = datePicker.style.top = `${
      selectedDateSpan.getBoundingClientRect().bottom + window.scrollY
    }px`;
    datePicker.style.left = `${
      selectedDateSpan.getBoundingClientRect().left + window.scrollX
    }px`;
    updateCalendar();
  });

  selectedTimeSpan.addEventListener("click", () => {
    datePicker.style.display =
      datePicker.style.display == "none" ? "block" : "none";
    datePicker.style.top = `${
      selectedTimeSpan.getBoundingClientRect().bottom + window.scrollY
    }px`;
    datePicker.style.left = `${
      selectedTimeSpan.getBoundingClientRect().left + window.scrollX
    }px`;
    updateCalendar();
  });

  completeDateSpan.addEventListener("click", () => {
    datePicker.style.display =
      datePicker.style.display == "none" ? "block" : "none";
    datePicker.style.display = datePicker.style.top = `${
      completeDateSpan.getBoundingClientRect().bottom + window.scrollY
    }px`;
    datePicker.style.left = `${
      completeDateSpan.getBoundingClientRect().left + window.scrollX
    }px`;
    updateCalendar();
  });

  completeTimeSpan.addEventListener("click", () => {
    datePicker.style.display =
      datePicker.style.display == "none" ? "block" : "none";
    datePicker.style.top = `${
      completeTimeSpan.getBoundingClientRect().bottom + window.scrollY
    }px`;
    datePicker.style.left = `${
      completeTimeSpan.getBoundingClientRect().left + window.scrollX
    }px`;
    updateCalendar();
  });

  updateCalendar();
});
