document.addEventListener("DOMContentLoaded", function() {
  /************************ DOM 요소 불러오기 ************************/
  const $modalScheduleEdit = document.querySelector(".modal-schedule-edit");    // 일정 만드는 모달
  const closeBtn = document.getElementById("close-btn");                        // 일정 모달의 나가기버튼
  const exitBtn = document.getElementById("exit-btn");                          // 일정 모달의 취소버튼(나가기버튼과 동일함)
  const saveBtn = document.getElementById("save-btn");                          // 일정 모달의 저장버튼
  const clearBtn = document.getElementById("clear-btn");                        // 일정 모달의 삭제버튼
  const selectedDateSpan = document.getElementById("selectedDate");             // 일정 모달의 시작날짜 (ID명)
  const selectedTimeSpan = document.getElementById("selectedTime");             // 일정 모달의 시작시간 (ID명)
  const completeDateSpan = document.getElementById("completeDate");             // 일정 모달의 완료날짜 (ID명)
  const completeTimeSpan = document.getElementById("completeTime");             // 일정 모달의 완료시간 (ID명)
  const startDateInput = document.querySelector(".start-date-input");           // 일정 모달의 시작날짜 (클래스명)
  const startTimeInput = document.querySelector(".start-time-input");           // 일정 모달의 시작시간 (클래스명)
  const endDateInput = document.querySelector(".end-date-input");               // 일정 모달의 완료날짜 (클래스명)
  const endTimeInput = document.querySelector(".end-time-input");               // 일정 모달의 완료시간 (클래스명)
  const repeatText = document.querySelector(".repeat-text");                    // 일정 모달의 반복일정 타이틀
  const datePicker = document.getElementById("datePicker");                     // 작은 달력 구현
  const calendar = document.getElementById("calendar");                         // 작은 달력 날짜
  const currentMonthSpan = document.getElementById("currentMonth");             // 작은 달력의 년도,월 표시(ex. 2024.09)
  const prevMonthBtn = document.getElementById("prevMonth");                    // 작은 달력의 이전월
  const nextMonthBtn = document.getElementById("nextMonth");                    // 작은 달력의 다음월
  const startConfirmBtn = document.getElementById("start-confirm");             // 작은 달력의 확인버튼 (시작일정)
  const endConfirmBtn = document.getElementById("end-confirm");                 // 작은 달력의 확인버튼 (완료일정)


  /************************ 모달창 닫힘 기능 구현 ************************/
  
  closeBtn.onclick = function() {
    $modalScheduleEdit.style.display = "none";
  };
  exitBtn.onclick = function() {
    $modalScheduleEdit.style.display = "none";
  };
  

  /************************ 모달창 내부 삭제버튼 숨김 ************************/

  clearBtn.style.display = 'none';


  /************************ 날짜 기능 구현 함수 ************************/
  
  let currentDate = new Date();
  let selectedDate = null;

  function updateCalendar() {
    calendar.innerHTML = '';
    currentMonthSpan.textContent = `${currentDate.getFullYear()}.${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    for (let i = firstDay.getDay() - 1; i >= 0; i--) {
      const dayElement = createDayElement(new Date(prevMonthLastDay.getFullYear(), prevMonthLastDay.getMonth(), prevMonthLastDay.getDate() - i));
      dayElement.classList.add('other-month');
      calendar.appendChild(dayElement);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dayElement = createDayElement(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
      calendar.appendChild(dayElement);
    }

    const remainingDays = 42 - calendar.children.length;
    for (let i = 1; i <= remainingDays; i++) {
      const dayElement = createDayElement(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i));
      dayElement.classList.add('other-month');
      calendar.appendChild(dayElement);
    }
  }

  function createDayElement(date) {
    const dayElement = document.createElement('div');
    dayElement.textContent = date.getDate();
    dayElement.classList.add('day');
    
    if (date.getDay() === 0) dayElement.classList.add('sun');
    if (date.getDay() === 6) dayElement.classList.add('sat');
    
    if (date.toDateString() === new Date().toDateString()) {
      dayElement.classList.add('today');
    }
    
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      dayElement.classList.add('selected');
    }
    
    dayElement.addEventListener('click', () => selectDate(date));
    return dayElement;
  }

  function selectDate(date) {
    selectedDate = date;
    currentDate = new Date(date);
    updateCalendar();
  }

  /************************ 버튼 클릭시 실행될 이벤트값 설정 ************************/

  /******** 작은달력 Month 부분 이동버튼 ********/
  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
  });

  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
  });

  /******** 작은달력 날짜, 시간 확인버튼 ********/
  startConfirmBtn.addEventListener('click', () => {
    const timeValue = (input, length, minValue, maxValue) => {
      const value = input.value.padStart(2, '0')
      if(value.length > length){
        value = value.slice(0, length);
      } else if(value < minValue){
        value = minValue;
      } else if (value > maxValue){
        value = maxValue;
      }
      return input.value;
    };
    const startHour = timeValue(document.getElementById("start-hour"), 2, 0, 23);
    const startMinute = timeValue(document.getElementById("start-minute"), 2, 0, 59);
    selectedDateSpan.textContent = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;
    selectedTimeSpan.textContent = `${startHour}:${startMinute}`;
    datePicker.style.display = datePicker.style.display == 'none' ? 'block': 'none';
  });

  endConfirmBtn.addEventListener('click', () => {
    const timeValue = (input, length, minValue, maxValue) => {
      const value = input.value.padStart(2, '0')
      if(value.length > length){
        value = value.slice(0, length);
      } else if(value < minValue){
        value = minValue;
      } else if (value > maxValue){
        value = maxValue;
      }
      return input.value;
    };
    const endHour = timeValue(document.getElementById("end-hour"), 2, 0, 23);
    const endMinute = timeValue(document.getElementById("end-minute"), 2, 0, 59);
    completeDateSpan.textContent = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;
    completeTimeSpan.textContent = `${endHour}:${endMinute}`;
    datePicker.style.display = datePicker.style.display == 'none' ? 'block': 'none';
  });

  /******** 작은달력 날짜, 시간 입력input ********/
  startDateInput.addEventListener('click', () => {
    const isStarting = document.querySelector(".start-time");
    const isEnding = document.querySelector(".end-time");
    isEnding.style.display = "none";
    isStarting.style.display = "block";
  })

  startTimeInput.addEventListener('click', () => {
    const isStarting = document.querySelector(".start-time");
    const isEnding = document.querySelector(".end-time");
    isEnding.style.display = "none";
    isStarting.style.display = "block";
  })

  endDateInput.addEventListener('click', () => {
    const isStarting = document.querySelector(".start-time");
    const isEnding = document.querySelector(".end-time");
    isStarting.style.display = "none";
    isEnding.style.display = "block";
  })

  endTimeInput.addEventListener('click', () => {
    const isStarting = document.querySelector(".start-time");
    const isEnding = document.querySelector(".end-time");
    isStarting.style.display = "none";
    isEnding.style.display = "block";
  })

  /******** 반복일정 횟수 및 주기 설정버튼 ********/
  repeatText.addEventListener('click', () => {
    const repeatList = document.querySelector('.repeat-list');
    const repeatNum = document.getElementById('repeat-num');
    const noRepeat = document.querySelector('.no-repeat');
    const dayRepeat = document.querySelector('.day-repeat');
    const weakRepeat = document.querySelector('.weak-repeat');
    const monthRepeat = document.querySelector('.month-repeat');
    const yearRepeat = document.querySelector('.year-repeat');

    noRepeat.addEventListener("click", () => {
      repeatNum.disabled = true;
      repeatNum.style.color = "#ccc";
      repeatText.innerText = noRepeat.textContent;
      repeatList.style.display = "block" ? "none" : "block";
    });
    dayRepeat.addEventListener("click", () => {
      repeatNum.disabled = false;
      repeatNum.style.color = "#000";
      repeatText.innerText = dayRepeat.textContent;
      repeatList.style.display = "block" ? "none" : "block";
    });
    weakRepeat.addEventListener("click", () => {
      repeatNum.disabled = false;
      repeatNum.style.color = "#000";
      repeatText.innerText = weakRepeat.textContent;
      repeatList.style.display = "block" ? "none" : "block";
    });
    monthRepeat.addEventListener("click", () => {
      repeatNum.disabled = false;
      repeatNum.style.color = "#000";
      repeatText.innerText = monthRepeat.textContent;
      repeatList.style.display = "block" ? "none" : "block";
    });
    yearRepeat.addEventListener("click", () => {
      repeatNum.disabled = false;
      repeatNum.style.color = "#000";
      repeatText.innerText = yearRepeat.textContent;
      repeatList.style.display = "block" ? "none" : "block";
    });

    repeatList.style.display = repeatList.style.display == "none" ? "block" : "none";
  });

  /******** 일정 모달을 벗어난 다른 곳 클릭시 ********/
  window.addEventListener("click", function (event) {
    const closeModal = () => {
      $modalScheduleEdit.style.display = "none";
      datePicker.style.display = "none";
    };
    if (event.target === $modalScheduleEdit || event.target === datePicker) {
      closeModal();
    }
    const repeatValue = (input, length, minValue, maxValue) => {
      input.value = input.value.padStart(length, "0")
      if(input.value.length > length){
        input.value = input.value.slice(0, length);
      } else if(input.value < minValue){
        input.value = minValue;
      } else if (input.value > maxValue){
        input.value = maxValue;
      }
      return input.value;
    };
    const repeat = repeatValue(document.getElementById("repeat-num"), 3, 0 ,998);
  });


  /************************ 작은달력 위치 값 조정 ************************/

  selectedDateSpan.addEventListener('click', () => {
    datePicker.style.display = datePicker.style.display == 'none' ? 'block': 'none';
    datePicker.style.display = datePicker.style.top = `${selectedDateSpan.getBoundingClientRect().bottom + window.scrollY}px`;
    datePicker.style.left = `${selectedDateSpan.getBoundingClientRect().left + window.scrollX}px`;
    updateCalendar();
  });

  selectedTimeSpan.addEventListener('click', () => {
    datePicker.style.display = datePicker.style.display == 'none' ? 'block': 'none';
    datePicker.style.top = `${selectedTimeSpan.getBoundingClientRect().bottom + window.scrollY}px`;
    datePicker.style.left = `${selectedTimeSpan.getBoundingClientRect().left + window.scrollX}px`;
    updateCalendar();
  });

  completeDateSpan.addEventListener('click', () => {
    datePicker.style.display = datePicker.style.display == 'none' ? 'block': 'none';
    datePicker.style.display = datePicker.style.top = `${completeDateSpan.getBoundingClientRect().bottom + window.scrollY}px`;
    datePicker.style.left = `${completeDateSpan.getBoundingClientRect().left + window.scrollX}px`;
    updateCalendar();
  });

  completeTimeSpan.addEventListener('click', () => {
    datePicker.style.display = datePicker.style.display == 'none' ? 'block': 'none';
    datePicker.style.top = `${completeTimeSpan.getBoundingClientRect().bottom + window.scrollY}px`;
    datePicker.style.left = `${completeTimeSpan.getBoundingClientRect().left + window.scrollX}px`;
    updateCalendar();
  });

  updateCalendar();
});
//