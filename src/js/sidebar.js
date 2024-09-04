document.addEventListener("DOMContentLoaded", function () {
    const scheduleList = document.querySelector(".sidebar-schedule-list");
    const addButton = document.querySelector(".sidebar-schedule-add");
    const newItem = document.querySelector(".sidebar-new-item");
    const scheduleInput = newItem.querySelector(".sidebar-schedule-input");
    const deleteModal = document.querySelector(".modal-schedule-delete");
    const deleteConfirmBtn = deleteModal.querySelector(".delete-confirmation-btn");
    const deleteCancelBtn = deleteModal.querySelector(".delete-cancel-btn");
    const viewModal = document.querySelector(".modal-schedule-view");
    const closeModalBtn = viewModal.querySelector(".view-close-button");
    const sidebarWeatherText = document.querySelector(".sidebar-weather-text");
    const sidebarWeatherTemp = document.querySelector(".sidebar-weather-temp");
    const sidebarWeatherIcon = document.querySelector(".sidebar-weather-icon");
  
    let itemToDelete = null;
    let scheduleIdToDelete = null;
    let isAddingItem = false;
    let allSchedules = [];
    let todaySchedules = [];

    // 초기화 함수
    function init() {
        fetchData();
    }

    // 일정 데이터 가져오기
    async function fetchData() {
        try {
            const res = await fetch("http://localhost:8080/api/schedules");
            if (!res.ok) {
                throw new Error("Failed to fetch schedules");
            }
            allSchedules = await res.json();
            updateTodaySchedules();
            updateSidebarSchedules();
        } catch (error) {
            console.error("Error fetching schedules:", error);
        }
    }

    // 오늘 일정 업데이트
    function updateTodaySchedules() {
        const today = new Date();
        todaySchedules = allSchedules.filter(schedule =>
            isSameDay(new Date(schedule.schedule_start), today)
        );
    }

    // 사이드바 일정 업데이트
    function updateSidebarSchedules() {
        scheduleList.innerHTML = '';
        todaySchedules.forEach(addScheduleToUI);
    }

    // ******* 일정 추가 *******
    // 일정 입력 필드 표시
    addButton.addEventListener("click", () => {
        newItem.style.display = "block";
        scheduleInput.focus();
    });
    
    // Enter -> 일정 추가 or 줄 변경 막기
    scheduleInput.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (!isAddingItem) {
                await addNewItem();
            }
        }
    });
  
    // 일정 추가
    async function addNewItem() {
        if (isAddingItem) return;
        isAddingItem = true;

        try {
            const scheduleTitle = scheduleInput.value.trim();
            if (!scheduleTitle) {
                return;
            }
  
            const res = await fetch("http://localhost:8080/api/schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                throw new Error("Failed to add new schedule");
            }
    
            const newSchedule = await res.json();
            scheduleInput.value = "";
            addScheduleToUI(newSchedule);
            updateTodaySchedules();
            newItem.style.display = "none";

            location.reload();

            if(typeof window.updateCalendar === 'function') {
                window.updateCalendar();
            }
            await fetchData();
        } catch (error) {
            console.error("일정 추가 중 오류 발생:", error);
        } finally {
            isAddingItem = false;
        }
    }
  
    // UI 일정 추가
    function addScheduleToUI(schedule) {
        const li = document.createElement("li");
        li.innerHTML = `
            <a href="#">
                <div class="sidebar-list-box" data-id="${schedule.schedule_id}">
                    <div class="sidebar-list-cont">
                        <img src="./src/assets/img/list-circle.svg" alt="" />
                        <span>${schedule.schedule_title || ''}</span>
                    </div>
                    <div class="sidebar-list-close">
                        <img src="./src/assets/img/close-btn.svg" alt="" />
                    </div>
                </div>
            </a>
        `;
        scheduleList.appendChild(li);
    }

    // ******* 일정 삭제 *******
    async function deleteSchedule(scheduleId) {
        try {
            const res = await fetch(`http://localhost:8080/api/schedule/${scheduleId}`, {
                method: "DELETE",
            });
    
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
            }
  
            itemToDelete.remove();
            closeDeleteModal();
            location.reload();
        } catch (error) {
            console.error("Error deleting schedule:", error);
            alert(`서버 통신 실패: ${error.message}`);
        }
    }
  
    // 일정 목록 클릭 이벤트 (삭제 또는 조회)
    scheduleList.addEventListener("click", (e) => {
        const closeBtn = e.target.closest(".sidebar-list-close");
        if (closeBtn) {
            e.preventDefault();
            const scheduleBox = closeBtn.closest(".sidebar-list-box");
            if (scheduleBox) {
                itemToDelete = scheduleBox.closest("li");
                scheduleIdToDelete = scheduleBox.dataset.id;
                const scheduleTitle = scheduleBox.querySelector("span").textContent;
                showDeleteModal(scheduleTitle);
            }
        } else if (e.target.closest(".sidebar-list-box")) {
            e.preventDefault();
            openViewModal();
        }
    });
  
    // 삭제 모달 표시
    function showDeleteModal(scheduleTitle) {
        deleteModal.querySelector(".delete-txt strong").textContent = scheduleTitle;
        deleteModal.style.display = "block";
        document.addEventListener("keydown", handleDeleteModalKeydown);
    }

    // 삭제 모달 키보드 이벤트 처리
    function handleDeleteModalKeydown(e) {
        if (e.key === "Enter" && deleteModal.style.display === "block") {
            e.preventDefault();
            if (itemToDelete && scheduleIdToDelete) {
                deleteSchedule(scheduleIdToDelete);
            }
        } else if (e.key === "Escape" && deleteModal.style.display === "block") {
            e.preventDefault();
            closeDeleteModal();
        }
    }

    // 삭제 모달 닫기
    function closeDeleteModal() {
        itemToDelete = null;
        scheduleIdToDelete = null;
        deleteModal.style.display = "none";
        document.removeEventListener("keydown", handleDeleteModalKeydown);
    }
  
    // 삭제 확인 버튼
    deleteConfirmBtn.addEventListener("click", () => {
        if (itemToDelete && scheduleIdToDelete) {
            deleteSchedule(scheduleIdToDelete);
          } else {
            console.error("Invalid delete attempt: itemToDelete or scheduleIdToDelete is null");
            alert("삭제할 일정을 선택해주세요.");
          }
    });
  
    // 삭제 취소 버튼
    deleteCancelBtn.addEventListener("click", closeDeleteModal);

    // ******* 일정 조회 모달 *******
    async function openViewModal() {
        try {
            const today = new Date();
            updateModalContent(today);
            viewModal.style.display = "block";
        } catch (error) {
            console.error("Error fetching schedule details:", error);
            alert(`일정 정보를 가져오는데 실패했습니다: ${error.message}`);
        }
    }

    // 모달 내용 업데이트
    function updateModalContent(date) {
        updateElement('.view-year', date.getFullYear());
        updateElement('.view-month', String(date.getMonth() + 1).padStart(2, "0"));
        updateElement('.view-day', String(date.getDate()).padStart(2, "0"));
      
        const modalViewCont = viewModal.querySelector('.modal-view-cont');
        modalViewCont.innerHTML = '';
        
        if (todaySchedules.length === 0) {
            modalViewCont.innerHTML = '<p>오늘은 일정이 없습니다.</p>';
        } else {
            todaySchedules.forEach(schedule => {
                const articleHtml = `
                    <article class="modal-view-box">
                        <h3 class="modal-view-title">${schedule.schedule_title}</h3>
                        <div class="modal-view-time">
                            <span class="view-time-start">${formatDateTime(schedule.schedule_start)}</span>
                            <span class="view-time-separator">~</span>
                            <span class="view-time-end">${formatDateTime(schedule.schedule_end)}</span>
                        </div>
                        <p class="view-description">${schedule.schedule_description || ''}</p>
                    </article>
                `;
                modalViewCont.innerHTML += articleHtml;
            });
        }
    }

    // 조회 모달 닫기 버튼
    closeModalBtn?.addEventListener("click", () => {
            viewModal.style.display = "none";
        }
    );

    // ******* 유틸리티 *******
    // 요소 내용 업데이트
    function updateElement(selector, content) {
        const element = viewModal.querySelector(selector);
        if (element) {
            element.textContent = content;
        }
    }

    // 날짜 형식화
    function formatDateTime(dateString) {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");
        return `${month}월 ${day}일 ${hour}:${minute}`;
    }

    // 같은 날짜인지 확인
    function isSameDay(date1, date2) {
        return date1.toDateString() === date2.toDateString();
    }
    
    init();
  

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
