document.addEventListener('DOMContentLoaded', function () {
    let username = getParamFromUrl(0, 1)[0]
    setDateCalender()
    function setDateCalender() {

        const daysTag = document.querySelector(".days"),
            currentDate = document.querySelector(".current-date"),
            prevNextIcon = document.querySelectorAll(".icons span");

        // getting new date, current year and month
        let date = new Date(),
            currYear = date.getFullYear(),
            currMonth = date.getMonth();

        // storing full name of all months in array
        const months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];

        const renderCalendar = async () => {
            let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
                lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
                lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
                lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month

            //get leaning of month
            let data = []
            let dataDate = []
            await $.ajax({
                url: '/profile/' + username + '/learning-chain',
                method: 'GET',
                data: { currYear, currMonth: currMonth + 1 },
                success: function (response) {
                    data = response[1]
                    console.log(response[0]);
                },
                error: function (status, error) {
                    // Handle the error
                    console.error('Request failed. Status:', status, 'Error:', error);
                }
            });

            let liTag = "";

            for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
                liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
            }

            let indexLearnedDay = 0
            for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
                // adding active class to li if the current day, month, and year matched
                let isToday = i === date.getDate() && currMonth === new Date().getMonth()
                    && currYear === new Date().getFullYear() ? "active-today" : "";
                var dateObject = new Date(data[indexLearnedDay]);
                let isLearned = i === dateObject.getDate() ? "active-learned" : "";
                if(isLearned){
                    indexLearnedDay+=1
                }
                liTag += `<li class="${isLearned} ${isToday}">${i}</li>`;
            }

            for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
                liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
            }
            currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
            daysTag.innerHTML = liTag;
        }
        renderCalendar();

        prevNextIcon.forEach(icon => { // getting prev and next icons
            icon.addEventListener("click", () => { // adding click event on both icons
                // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
                currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

                if (currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
                    // creating a new date of current year & month and pass it as date value
                    date = new Date(currYear, currMonth, new Date().getDate());
                    currYear = date.getFullYear(); // updating current year with new date year
                    currMonth = date.getMonth(); // updating current month with new date month
                } else {
                    date = new Date(); // pass the current date as date value
                }
                renderCalendar(); // calling renderCalendar function
            });
        });
    }

    function getParamFromUrl(slashStart, slashEnd) {
        if (slashStart > slashEnd) return

        let url = new URL(window.location.href).pathname

        let parts = url.split("/")
        const partsWithoutEleEmpty = parts.filter(part => part !== '');
        let params = []
        for (let i = slashStart; i < slashEnd; i++) {
            params.push(partsWithoutEleEmpty[i])
        }

        return params
    }
}, false)