document.addEventListener("DOMContentLoaded", function() {
    let currentDate = new Date();

    const $calendarContainer = document.querySelector(".calendar-date");
    const $modalScheduleView = document.querySelector(".modal-schedule-view");
    const $closeBtn = document.querySelector(".view-close-button");
    const $viewYear = document.querySelector(".view-year");

    

    document.body.addEventListener("click", function(event) {
        const clickedDay = event.target.closest('td');
        if (clickedDay && (clickedDay.classList.contains('calendar-day') || clickedDay.classList.contains('prev-month') || clickedDay.classList.contains('next-month'))) {
            let targetDate = new Date(currentDate);
            let monthChanged = false;

            if(clickedDay.classList.contains('prev-month')) {
                targetDate.setMonth(targetDate.getMonth() - 1);
                monthChanged = true;
            } else if (clickedDay.classList.contains('next-month')) {
                targetDate.setMonth(targetDate.getMonth() + 1);
                monthChanged = true;
            }

            targetDate.setDate(parseInt(clickedDay.textContent));

            currentDate = new Date(targetDate);
            
            if (monthChanged && updateCalendar) {
                updateCalendar();
            }

            $modalScheduleView.style.display = 'block';
            
            console.log('Selected date: ', targetDate.toDateString());
            updateModalContent(targetDate);
        }
    });

    const closeModal = () => {
        $modalScheduleView.style.display = 'none';
    };

    window.addEventListener("click", function(event) {
        if(event.target === $modalScheduleView || event.target === $closeBtn) {
            closeModal();
        }
    });

    function updateModalContent(date) {
        const $modalDateElement = $modalScheduleView.querySelector(".modal-view-date");
        if($modalDateElement) {
            $modalDateElement.innerHTML = `
            <p class="view-year">${date.getFullYear()}</p>
            <p class="view-month">${String(date.getMonth() + 1).padStart(2, '0')}</p>
            <span class="view-separator">/</span>
            <p class="view-day">${String(date.getDate()).padStart(2, '0')}</p>
            `;
        }
    }
});