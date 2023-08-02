document.addEventListener('DOMContentLoaded', function () {
    let username = getParamFromUrl(0, 1)[0]
    let folderID = getParamFromUrl(2, 3)[0]
    const NUM_OF_COLUMNS = 2
    ///////////////
    let toggleAddCard = document.getElementsByClassName("ToggleInclusionCard-toggle")
    let switchInputAdd = document.getElementsByClassName("UISwitch-input")
    let coursesContainer = document.getElementById("courses-container")
    let btnDeleteCourse = document.getElementsByClassName("delete-option")

    setToggleAddCard()
    setBtnDeleteCourse()

    ////////////////////

    function setToggleAddCard() {
        for (let i = 0; i < switchInputAdd.length; i++) {
            switchInputAdd[i].addEventListener("change", async function () {
                toggleAddCard[i].classList.toggle("ToggleInclusionCard--orange")

                let isChecked = switchInputAdd[i].checked
                let courseID = switchInputAdd[i].value

                if (isChecked) {
                    addAndRemoveClass(toggleAddCard[i], "icon-minus", "icon-plus")
                    let courses = await updateCourseToFolder(courseID)
                    updateCourseContainer(courses)
                } else {
                    addAndRemoveClass(toggleAddCard[i], "icon-plus", "icon-minus")
                    let courses = await removeCourseFromFolder(courseID)
                    updateCourseContainer(courses)
                }
            })
        }
    }

    function setBtnDeleteCourse() {
        for (let i = 0; i < btnDeleteCourse.length; i++) {
            btnDeleteCourse[i].onclick =async () => {
                let courseID = btnDeleteCourse[i].value
                let courses = await removeCourseFromFolder(courseID)
                updateCourseContainer(courses)

                const indexSwitchInputAdd = Array.from(switchInputAdd).findIndex((input) => input.value === courseID);
                toggleAddCard[indexSwitchInputAdd].classList.toggle("ToggleInclusionCard--orange")
                addAndRemoveClass(toggleAddCard[indexSwitchInputAdd], "icon-plus", "icon-minus")
            }

        }
    }


    ////////////////////////
    function addAndRemoveClass(element, addClass, removeClass) {
        element.classList.remove(removeClass)
        element.classList.add(addClass)
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

    async function updateCourseToFolder(courseID) {
        let courses = []
        await $.ajax({
            url: "/" + username + "/folders/" + folderID + "/courses/" + courseID,
            method: 'PUT',
            success: function (response) {
                courses = response[1].courses
                console.log(response);
            },
            error: function (status, error) {
                console.log('Request failed. Status:', status, ' Error: ', error);
            }
        })
        return courses
    }
    async function removeCourseFromFolder(courseID) {
        let courses = []
        await $.ajax({
            url: "/" + username + "/folders/" + folderID + "/courses/" + courseID,
            method: 'DELETE',
            success: function (response) {
                courses = response[1].courses
                console.log(response);
            },
            error: function (status, error) {
                console.log('Request failed. Status:', status, ' Error: ', error);
            }
        })
        return courses
    }
    function updateCourseContainer(courses) {
        coursesContainer.innerHTML = ``
        console.log("a", courses);
        let numOfRows = Math.ceil(courses.length / NUM_OF_COLUMNS);

        for (let i = 0; i < numOfRows; i++) {
            const rowWrap = document.createElement("div");
            rowWrap.className = "db-m__course-row row d-flex justify-content-start mt-3"
            let contentInRow = ``
            for (let j = i * 2; j < (i + 1) * 2; j++) {
                let course = courses[j]
                if (course) {
                    contentInRow += `
                    <div class="col-sm-6">
                        <div class="card setCard-content">
                            <div class="card-body setCard">
                                <div class="setCard-text">
                                    <a href="/${course.owner.username}/courses/${course._id}/flash-card">
                                        <div class="setCard-text__header">
                                            <h4 class="card-title setCard__title-course mb-2">${course.titleCourse}</h4>
                                            <div class="setCard__numOfTerms">
                                                ${course.cards.length}<span> Thuật ngữ</span>
                                            </div>
                                        </div>
                                    </a>
                                    <div class="setCard-text__footer">
                                        <div class="setCard__userAvatar">
                                            <a href="#">
                                                <img src="${course.owner.imageProfile = " " ? "https://firebasestorage.googleapis.com/v0/b/image-edu-25269.appspot.com/o/files%2F84628273_176159830277856_972693363922829312_n.jpg?alt=media&token=1e381211-c8c8-49a1-a51d-1fedc82530b0" : course.owner.imageProfile}" alt="">
                                            </a>
                                        </div>
                                        <div class="setCard__username ">
                                            <a href="">${course.owner.username}</a>
                                        </div>
                                        <div class="setCard__option">
                                            <button class="delete-option option--borderless" value="${course._id}">
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                   `
                }
            }
            rowWrap.innerHTML = contentInRow
            coursesContainer.appendChild(rowWrap)
            setBtnDeleteCourse()
        }
    }
}, false)