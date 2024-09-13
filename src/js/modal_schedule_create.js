document.addEventListener("DOMContentLoaded", function() {
  /************************ DOM 요소 불러오기 ************************/
  const $modalScheduleEdit = document.querySelector(".modal-schedule-edit");
  const closeBtn = document.getElementById("close-btn");                    
  const exitBtn = document.getElementById("exit-btn");                      
  const saveBtn = document.getElementById("save-btn");                      
  const clearBtn = document.getElementById("clear-btn");                    
  const selectedDateSpan = document.getElementById("selectedDate");         
  const selectedTimeSpan = document.getElementById("selectedTime");         
  const completeDateSpan = document.getElementById("completeDate");         
  const completeTimeSpan = document.getElementById("completeTime");         
  const startDateInput = document.querySelector(".start-date-input");       
  const startTimeInput = document.querySelector(".start-time-input");       
  const endDateInput = document.querySelector(".end-date-input");           
  const endTimeInput = document.querySelector(".end-time-input");           
  const repeatText = document.querySelector(".repeat-text");                
  const datePicker = document.getElementById("datePicker");                 
  const calendar = document.getElementById("calendar");                     
  const currentMonthSpan = document.getElementById("currentMonth");         
  const prevMonthBtn = document.getElementById("prevMonth");                
  const nextMonthBtn = document.getElementById("nextMonth");                
  const startConfirmBtn = document.getElementById("start-confirm");         
  const endConfirmBtn = document.getElementById("end-confirm");             
  
  
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
  let currentTime = new Date();
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

  /************************ 현재 일정 나타내기 ************************/
  const selectDay = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;
  selectedDateSpan.textContent = selectDay;
  const completeDay = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;
  completeDateSpan.textContent = completeDay;
  const selectedTime = `${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}`;
  selectedTimeSpan.textContent = selectedTime;
  const completeTime = `${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}`;
  completeTimeSpan.textContent = completeTime;

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
    const startHour = timeValue(document.getElementById("start-hour"), 2, 0, 23).padStart(2, "0");
    const startMinute = timeValue(document.getElementById("start-minute"), 2, 0, 59).padStart(2, "0");
    selectedDateSpan.textContent = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;
    console.log(selectedDateSpan.textContent);
    selectedTimeSpan.textContent = `${startHour}:${startMinute}`;
    console.log(selectedTimeSpan.textContent);
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
      console.log(repeatText.textContent);
      repeatList.style.display = "block" ? "none" : "block";
    });
    dayRepeat.addEventListener("click", () => {
      repeatNum.disabled = false;
      repeatNum.style.color = "#000";
      repeatText.innerText = dayRepeat.textContent;
      console.log(repeatText.textContent);
      repeatList.style.display = "block" ? "none" : "block";
    });
    weakRepeat.addEventListener("click", () => {
      repeatNum.disabled = false;
      repeatNum.style.color = "#000";
      repeatText.innerText = weakRepeat.textContent;
      console.log(repeatText.textContent);
      repeatList.style.display = "block" ? "none" : "block";
    });
    monthRepeat.addEventListener("click", () => {
      repeatNum.disabled = false;
      repeatNum.style.color = "#000";
      repeatText.innerText = monthRepeat.textContent;
      console.log(repeatText.textContent);
      repeatList.style.display = "block" ? "none" : "block";
    });
    yearRepeat.addEventListener("click", () => {
      repeatNum.disabled = false;
      repeatNum.style.color = "#000";
      repeatText.innerText = yearRepeat.textContent;
      console.log(repeatText.textContent);
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

    /************************ 일정 저장하기 ************************/
//   async function addSchedule(){
//   try{
//     const modalTitle = document.querySelector(".modal-title").textContent;
//     const startDateInput = document.querySelector(".start-date-input").value;
//     const endDateInput = document.querySelector(".end-date-input").value;
//     const startTimeInput = document.querySelector(".start-time-input").value;
//     const endTimeInput = document.querySelector(".end-time-input").value;
//     const repeatText = document.querySelector(".repeat-text").textContent;
//     const repeatNum = document.getElementById("repeat-num").value;
//     const memoText = document.querySelector(".schedule-memo").value;

//     function changeDateTime(date, time){
//       const [year, month, day] = date.split('-').map(Number);
//       const [hours, minutes] = time.split(':').map(Number);
//       return new Date(year, month -1, day, hours, minutes);
//     }
    
//     function startDateTime(startDateInput, startTimeInput){
//       return changeDateTime(startDateInput, startTimeInput)
//     };
//     function endDateTime(endDateInput, endTimeInput){
//       return changeDateTime(endDateInput, endTimeInput)
//     }

//     const start = startDateTime(startDateInput, startTimeInput);
//     const end = endDateTime(endDateInput, endTimeInput);
//     const repeat = repeatText + repeatNum;

//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schedule`,{
//       method:"POST",
//       headers: {"Content-type":"application/json"},
//       body: JSON.stringify({
//         schedule_title: modalTitle,
//         schedule_description: memoText,
//         schedule_start: start,
//         schedule_end: end,
//         schedule_notification: false,
//         schedule_recurring: repeat,
//       }),
//     });
    
//     if (!res.ok) {
//       throw new Error(`일정을 저장 할 수 없습니다`);
//     }
//     const result = await res.json();
//     console.log('Schedule saved successfully:', result);
//     return result;
//   }catch(error){
//     console.error('Error saving schedule:', error);
//     throw error;
//   };
// };
//   saveBtn.addEventListener('click', async () => {
//     try{
//     await addSchedule();
//     } catch (error){
//       console.error('스케줄을 추가할수 없습니다', error);
//     };
//   });

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