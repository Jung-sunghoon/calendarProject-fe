document.addEventListener("DOMContentLoaded", function () {
  const scheduleList = document.querySelector(".sidebar-schedule-list");
  const addButton = document.querySelector(".sidebar-schedule-add");
  const newItem = document.querySelector(".sidebar-new-item");
  const scheduleInput = newItem.querySelector(".sidebar-schedule-input");
  const deleteModal = document.querySelector(".modal-schedule-delete");
  const deleteConfirmBtn = deleteModal.querySelector(
    ".delete-confirmation-btn"
  );
  const deleteCancelBtn = deleteModal.querySelector(".delete-cancel-btn");
  const viewModal = document.querySelector(".modal-schedule-view");
  const closeModalBtn = viewModal.querySelector(".view-close-button");
  const sidebarWeatherText = document.querySelector(".sidebar-weather-text");
  const sidebarWeatherTemp = document.querySelector(".sidebar-weather-temp");
  const sidebarWeatherIcon = document.querySelector(".sidebar-weather-icon");

  let itemToDelete = null;

  // ******* 일정 추가 *******
  async function addNewItem() {
    try {
      const res = await fetch("http://localhost:8080/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schedule_title: scheduleInput.value,
          schedule_description: "",
          schedule_start: new Date(),
          schedule_end: new Date(),
          schedule_notification: false,
          schedule_recurring: false,
        }),
      });

      if (!res.ok) {
        throw new Error("");
      }

      const data = await res.json();
      scheduleInput.value = "";
      addScheduleToUI(data);
      newItem.style.display = "none";
      return data;
    } catch (error) {
      console.error("Error", error);
    }
  }

  // 일정 추가
  function addScheduleToUI(schedule) {
    const scheduleDate = new Date(schedule.schedule_start);
    const today = new Date();

    if (isSameDay(scheduleDate, today)) {
        const li = document.createElement("li");
        li.innerHTML = `
                <a href="#">
                    <div class="sidebar-list-box" data-id="${schedule.id}">
                        <div class="sidebar-list-cont">
                            <img src="./src/assets/img/list-circle.svg" alt="" />
                            <span>${schedule.schedule_title}</span>
                        </div>
                        <div class="sidebar-list-close">
                            <img src="./src/assets/img/close-btn.svg" alt="" />
                        </div>
                    </div>
                </a>
            `;
        scheduleList.appendChild(li);
      }
  }

  // 같은 날짜인지 확인하는 함수
  function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  // 새 일정 입력 필드 표시
  addButton.addEventListener("click", () => {
    newItem.style.display = "block";
    scheduleInput.focus();
  });

  // Enter -> 일정 추가 or 줄 변경 막기
  scheduleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewItem();
    }
  });

  // ******* 일정 삭제 *******
  // 일정 삭제
  async function deleteSchedule(scheduleId) {
    try {
      const res = await fetch(`http://localhost:8080/api/schedule/${scheduleId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      itemToDelete.remove();
      itemToDelete = null;
      deleteModal.style.display = "none";
    } catch (error) {
      console.error("Error deleting schedule:", error);
      alert(`서버 통신 실패: ${error.message}`);
      deleteModal.style.display = "none";
    }
  }

  scheduleList.addEventListener("click", (e) => {
    if (e.target.closest(".sidebar-list-close")) {
      e.preventDefault();
      const listItem = e.target.closest("li");
      const scheduleTitle = listItem.querySelector(
        ".sidebar-list-cont span"
      ).textContent;
      itemToDelete = listItem;
      showModal(scheduleTitle);
    }
  });

  function showModal(scheduleTitle) {
    deleteModal.querySelector(".delete-txt strong").textContent = scheduleTitle;
    deleteModal.style.display = "block";
  }

  // 삭제 모달창 확인 버튼
  deleteConfirmBtn.addEventListener("click", () => {
    if (itemToDelete) {
        const scheduleId = itemToDelete.querySelector(".sidebar-list-box").dataset.id;
        deleteSchedule(scheduleId);
  }
});

  // 삭제 모달창 취소 버튼
  deleteCancelBtn.addEventListener("click", () => {
    itemToDelete = null;
    deleteModal.style.display = "none";
  });

  // ******* 일정 조회 모달 *******
  function openViewModal() {
    const [viewYear, viewMonth, viewDay] = [
      ".view-year",
      ".view-month",
      ".view-day",
    ].map((selector) => viewModal.querySelector(selector));
    const today = new Date();
    [viewYear.textContent, viewMonth.textContent, viewDay.textContent] = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ];
    viewModal.style.display = "block";
  }

  scheduleList.addEventListener("click", function (e) {
    if (
      e.target.closest(".sidebar-list-box") &&
      !e.target.closest(".sidebar-list-close")
    ) {
      e.preventDefault();
      openViewModal();
    }
  });

  closeModalBtn?.addEventListener(
    "click",
    () => (viewModal.style.display = "none")
  );

  // 초기 데이터 로드 (당일 일정만)
  async function fetchData() {
    try {
      const res = await fetch("http://localhost:8080/api/schedules");
      if (!res.ok) {
        throw new Error("Failed to fetch schedules");
      }
      const schedules = await res.json();
      schedules.forEach(addScheduleToUI);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  }

  fetchData();

  // ******* 날씨 정보 가져오기 *******
  const weatherTranslations = {
    200: "천둥번개와 가벼운 비",
    201: "천둥번개와 비",
    202: "천둥번개와 폭우",
    210: "가벼운 천둥번개",
    211: "천둥번개",
    212: "강한 천둥번개",
    221: "불규칙한 천둥번개",
    230: "천둥번개와 가벼운 이슬비",
    231: "천둥번개와 이슬비",
    232: "천둥번개와 강한 이슬비",
    300: "약한 이슬비",
    301: "이슬비",
    302: "강한 이슬비",
    310: "약한 이슬비와 비",
    311: "이슬비와 비",
    312: "강한 이슬비와 비",
    313: "소나기와 이슬비",
    314: "강한 소나기와 이슬비",
    321: "소나기 이슬비",
    500: "가벼운 비",
    501: "보통 비",
    502: "강한 비",
    503: "매우 강한 비",
    504: "극심한 비",
    511: "어는 비",
    520: "가벼운 소나기 비",
    521: "소나기 비",
    522: "강한 소나기 비",
    531: "불규칙한 소나기 비",
    600: "가벼운 눈",
    601: "눈",
    602: "강한 눈",
    611: "진눈깨비",
    612: "가벼운 진눈깨비 소나기",
    613: "진눈깨비 소나기",
    615: "가벼운 비와 눈",
    616: "비와 눈",
    620: "가벼운 눈 소나기",
    621: "눈 소나기",
    622: "강한 눈 소나기",
    701: "엷은 안개",
    711: "연기",
    721: "연무",
    731: "모래/먼지 소용돌이",
    741: "안개",
    751: "모래",
    761: "먼지",
    762: "화산재",
    771: "돌풍",
    781: "토네이도",
    800: "맑은 하늘",
    801: "구름 조금",
    802: "드문드문 구름",
    803: "흐린 구름",
    804: "구름 많음",
  };

  function translateWeatherDescription(id) {
    return weatherTranslations[id] || id;
  }

  async function fetchWeatherData() {
    try {
      const res = await fetch(`${API_URL}/api/weather?city=seoul`);
      if (!res.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await res.json();
      console.log(data);

      sidebarWeatherText.innerText = translateWeatherDescription(
        data.weather[0].id
      );
      sidebarWeatherTemp.innerText = `${Math.round(data.main.temp)}º`;
      sidebarWeatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    } catch (error) {
      console.error(error);
    }
  }
  fetchWeatherData();
});
