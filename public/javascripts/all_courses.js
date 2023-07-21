document.addEventListener('DOMContentLoaded', function () {
    const username = getParamFromUrl(0, 1)[0]
    const BE_CREATED = "created"
    const ACCESSED = "accessed"

    /////////////////////////
    let dropdownItemFilterByTime = document.getElementsByClassName("dropdown-item-filterByTime")
    let btnFilterByTime = document.getElementById("btn-filterByTime")
    let wrapAllFeed=document.getElementById("DashboardAllCourse-activityFeed-wrap")
    let wrapFeed=document.getElementsByClassName("DashboardAllCourse-wrapFeed")
    let feedAllCourse = document.getElementById("activityFeed-allCourse")

    setFilterByTime()

    ///////////////////////////////////////
    function setFilterByTime() {
        for (let i = 0; i < dropdownItemFilterByTime.length; i++) {
            dropdownItemFilterByTime[i].onclick = async () => {
                btnFilterByTime.innerText = dropdownItemFilterByTime[i].innerText

                let typeFilter = dropdownItemFilterByTime[i].value
                let dataFilter = await getAllCourseFilter(typeFilter)

                if (typeFilter == BE_CREATED) {
                    setDataCourseBeCreated(dataFilter)
                } else if (typeFilter == ACCESSED) {
                    setDataCourseAccessed(dataFilter)
                }
            }
        }
    }



    /////////////////////////////////////////////////
    async function getAllCourseFilter(typeFilter) {
        let dataFilter = []
        await $.ajax({
            url: '/' + username + '/courses/filter/' + typeFilter,
            method: 'GET',
            success: function (response) {
                dataFilter = response[1].dataFilter
                console.log(response[0]);
            },
            error: function (status, error) {
                console.log('Request failed. Status:', status, ' Error: ', error);
            }
        })
        return dataFilter
    }
    function setDataCourseBeCreated(allCourses) {
        let content = ``
        allCourses.forEach((course) => {
            content += `
                    <div class="activityFeed-course pointer-btn">
                        <div class="activityFeed-course__info ">
                            <span class="activityFeed__info-numsOfTerms">${course.cards != null ? course.cards.length : 0} Thuật ngữ</span>
                            <div class="activityFeed__info-createdBy d-flex">
                                <div class="setPageHeader-avatar">
                                    <img style="border-radius: 50%; width: 20px;" class="setPageHeader-avatar--circle mr-1"
                                        src="${course.owner.imageProfile != " " ? course.owner.imageProfile : "/images/84628273_176159830277856_972693363922829312_n.jpg"}" alt="">
                                </div>
                                <div class="info__createdBy-author">
                                    ${course.owner.username}
                                </div>
                            </div>
                        </div>
                        <div class="activityFeed-course__nameCourse">
                            <a href="/${course.owner.username + "/courses/" + course._id}/flash-card"  style="text-decoration: none;">${course.titleCourse}</a>
                        </div>
                    </div>
                    `
        })
        feedAllCourse.innerHTML = content
    }
    function setDataCourseAccessed(coursesAccessed) {
        let allCourseContent=``
        coursesAccessed.forEach((accessed) => {
            accessed.courses.reverse().forEach((course) => {
                allCourseContent += `
                        <div class="activityFeed-course pointer-btn">
                            <div class="activityFeed-course__info ">
                                <span class="activityFeed__info-numsOfTerms">${course.cards != null ? course.cards.length : 0} Thuật ngữ</span>
                                <div class="activityFeed__info-createdBy d-flex">
                                    <div class="setPageHeader-avatar">
                                        <img style="border-radius: 50%; width: 20px;" class="setPageHeader-avatar--circle mr-1"
                                            src="${course.owner.imageProfile != " " ? course.owner.imageProfile : "/images/84628273_176159830277856_972693363922829312_n.jpg"}" alt="">
                                    </div>
                                    <div class="info__createdBy-author">
                                        ${course.owner.username}
                                    </div>
                                </div>
                            </div>
                            <div class="activityFeed-course__nameCourse">
                                <a href="/${course.owner.username + "/courses/" + course._id}/flash-card"  style="text-decoration: none;">${course.titleCourse}</a>
                            </div>
                        </div>
                        `
            })
            // console.log(wrapFeed)
            // console.log(accessed);
        })
        
        feedAllCourse.innerHTML = allCourseContent
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