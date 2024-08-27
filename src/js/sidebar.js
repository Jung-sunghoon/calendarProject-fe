document.addEventListener('DOMContentLoaded', function() {
    const scheduleList = document.querySelector('.sidebar-schedule-list');
    const deleteModal = document.querySelector('.modal-schedule-delete');
    const deleteConfirmBtn = deleteModal.querySelector('.delete-confirmation-btn');
    const deleteCancelBtn = deleteModal.querySelector('.delete-cancel-btn');
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

});

