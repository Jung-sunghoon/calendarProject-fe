document.addEventListener('DOMContentLoaded', function() {
    const scheduleList = document.querySelector('.sidebar-schedule-list');
    const deleteModal = document.querySelector('.modal-schedule-delete');
    const deleteConfirmBtn = deleteModal.querySelector('.delete-confirmation-btn');
    const deleteCancelBtn = deleteModal.querySelector('.delete-cancel-btn');
    const addButton = document.querySelector('.sidebar-schedule-add');
    const newItem = document.querySelector('.sidebar-new-item');
    const scheduleInput = newItem.querySelector('.sidebar-schedule-input');
    let itemToDelete = null;


    function showModal(itemText) {
        deleteModal.style.display = 'block';
        deleteModal.querySelector('.delete-txt strong').textContent = itemText;
    }

    function hideModal() {
        deleteModal.style.display = 'none';
    }

    // 일정 삭제
    scheduleList.addEventListener('click', function(e) {
        if (e.target.closest('.sidebar-list-close')) {
            e.preventDefault();
            const listItem = e.target.closest('li');
            const itemText = listItem.querySelector('.sidebar-list-cont span').textContent;
            itemToDelete = listItem;
            showModal(itemText);
        }
    });

    // 삭제 모달창 확인 버튼
    deleteConfirmBtn.addEventListener('click', function() {
        if (itemToDelete) {
            itemToDelete.remove();
            itemToDelete = null;
        }
        hideModal();
    });

    // 삭제 모달창 취소 버튼
    deleteCancelBtn.addEventListener('click', hideModal);

    
    // 새 일정 입력 필드 표시
    addButton.addEventListener('click', function() {
        newItem.style.display = 'block';
        scheduleInput.focus();
        scheduleInput.textContent = '';
    });

    // 일정 입력 가능하게
    scheduleInput.setAttribute('contenteditable', 'true');

    // 일정 추가
    function addNewItem() {
        const newItemText = scheduleInput.textContent.trim();
        if (newItemText && newItemText !== '') {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="#">
                    <div class="sidebar-list-box">
                        <div class="sidebar-list-cont">
                            <img src="./src/assets/img/list-circle.svg" alt="" />
                            <span>${newItemText}</span>
                        </div>
                        <div class="sidebar-list-close">
                            <img src="./src/assets/img/close-btn.svg" alt="" />
                        </div>
                    </div>
                </a>
            `;
            scheduleList.appendChild(li);
        }
        newItem.style.display = 'none';
        scheduleInput.textContent = '';
    }

    // Enter -> 일정 추가 or 줄 변경 막기
    scheduleInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addNewItem();
        }
    });

    // 포커스를 잃으면 입력 필드 사라지게
    scheduleInput.addEventListener('blur', addNewItem);

});

