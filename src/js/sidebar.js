document.addEventListener('DOMContentLoaded', function() {
    const scheduleList = document.querySelector('.sidebar-schedule-list');
    const addButton = document.querySelector('.sidebar-schedule-add');
    const newItem = document.querySelector('.sidebar-new-item');
    const scheduleInput = newItem.querySelector('.sidebar-schedule-input');
    const deleteModal = document.querySelector('.modal-schedule-delete');
    const deleteConfirmBtn = deleteModal.querySelector('.delete-confirmation-btn');
    const deleteCancelBtn = deleteModal.querySelector('.delete-cancel-btn');
    let itemToDelete = null;
    let isAddingItem = false;

    // ******* 일정 추가 *******
    async function addSchedule(scheduleData) {
        try {
            const res = await fetch('http://localhost:8080/api/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scheduleData),
            });

            if (!res.ok) {
                throw new Error('');
            }

            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error', error);
            throw error;
        }
    }

    async function addNewItem() {
        if (isAddingItem) return;
        isAddingItem = true;

        const newItemText = scheduleInput.textContent.trim();
        if (newItemText) {
            const currentDate = new Date();
            const scheduleData = {
                schedule_title: newItemText,
                schedule_description: "",
                formattedStart: currentDate.toISOString(),
                formattedEnd: new Date(currentDate.getTime() + 60 * 60 * 1000).toISOString(),
                schedule_notification: false,
                schedule_recurring: false,
            };

            try {
                const newSchedule = await addSchedule(scheduleData);
                addScheduleToUI(newSchedule);
            } catch (error) {
                console.error('Error:', error);
                alert('서버 통신 실패');
                addScheduleToUI({ ...scheduleData, id: Date.now() });
            }

            scheduleInput.textContent = '';
            newItem.style.display = 'none';
        }
        isAddingItem = false;
    }

    // 일정 추가
    function addScheduleToUI(schedule) {
        const li = document.createElement('li');
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

    // 새 일정 입력 필드 표시
    addButton.addEventListener('click', () => {
        newItem.style.display = 'block';
        scheduleInput.focus();
    });

    // 일정 입력 가능하게
    scheduleInput.setAttribute('contenteditable', 'true');

    // Enter -> 일정 추가 or 줄 변경 막기
    scheduleInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addNewItem();
        }
    });

    // 포커스를 잃으면 입력 필드 사라지게
    scheduleInput.addEventListener('blur', () => {
        if (scheduleInput.textContent.trim()) {
            addNewItem();
        } else {
            newItem.style.display = 'none';
        }
    });


    // ******* 일정 삭제 *******
    // 일정 삭제
    scheduleList.addEventListener('click', e => {
        if (e.target.closest('.sidebar-list-close')) {
            e.preventDefault();
            const listItem = e.target.closest('li');
            const scheduleTitle = listItem.querySelector('.sidebar-list-cont span').textContent;
            itemToDelete = listItem;
            showModal(scheduleTitle);
        }
    });

    function showModal(scheduleTitle) {
        deleteModal.querySelector('.delete-txt strong').textContent = scheduleTitle;
        deleteModal.style.display = 'block';
    }

    // 삭제 모달창 확인 버튼
    deleteConfirmBtn.addEventListener('click', () => {
        if (itemToDelete) {
            const scheduleId = itemToDelete.querySelector('.sidebar-list-box').dataset.id;
            deleteSchedule(scheduleId);
        }
    });

    // 삭제 모달창 취소 버튼
    deleteCancelBtn.addEventListener('click', () => {
        itemToDelete = null;
        deleteModal.style.display = 'none';
    });

    async function deleteSchedule() {
        try {
            const res = await fetch('http://localhost:8080/api/schedule/:id', {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('');
            }

            itemToDelete.remove();
            itemToDelete = null;
            deleteModal.style.display = 'none';
        } catch (error) {
            console.error('Error', error);
            alert('서버 통신 실패');
            itemToDelete.remove();
            itemToDelete = null;
            deleteModal.style.display = 'none';
        }
    }

});

