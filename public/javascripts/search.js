document.addEventListener('DOMContentLoaded', function () {
    const PAGE_SIZE=6 
    //////////////////////
    const paginationContainer = document.getElementById('pagination-container');
    const totalCoursesCount = paginationContainer.getAttribute('data-totalCourses');

    const searchTitle = document.getElementById('searchTitle');
    const query = searchTitle.getAttribute('data-query');

    const btnPaginationPage = document.getElementsByClassName("paginationjs-page")
    const btnPaginationPrev = document.getElementsByClassName("paginationjs-prev")
    const btnPaginationNext = document.getElementsByClassName("paginationjs-next")

    const courseContainer = document.getElementById("course-container")
    const breadcrumbPosGetCourse = document.getElementById("breadcrumb-positionGetCourse")
    //////////////////////////
    setPagination()

    ///////////////////////////
    function setPagination() {
        let dataSource = [];
        for (let i = 1; i <= totalCoursesCount; i++) {
            dataSource.push(i);
        }

        // Pagination options
        var options = {
            dataSource: dataSource,
            pageSize: 6,
            callback: function (response, pagination) {
                for (let i = 0; i < btnPaginationPage.length; i++) {
                    btnPaginationPage[i].addEventListener("click", async function () {
                        let pageNum = btnPaginationPage[i].getAttribute('data-num');
                        await handlePaginationClick(pageNum);
                    });
                }

                btnPaginationPrev[0].addEventListener("click", async function () {
                    if(!btnPaginationPrev[0].classList.contains('disabled')){
                        let pageNum = btnPaginationPrev[0].getAttribute('data-num');
                        await handlePaginationClick(pageNum);
                    }
                });

                btnPaginationNext[0].addEventListener("click", async function () {
                    if(!btnPaginationNext[0].classList.contains('disabled')){
                        let pageNum = btnPaginationNext[0].getAttribute('data-num');
                        await handlePaginationClick(pageNum);
                    }
                });
            }
        };
        // Initialize Pagination.js
        $('#pagination-container').pagination(options);
    }

    /////////////////////////////
    async function handlePaginationClick(pageNum) {
        let { courses, startGetElement, endGetElement } = await getCourses(pageNum);
    
        updateUrl(pageNum);
    
        updateSearchPage(courses, startGetElement, endGetElement);
    }
    async function getCourses(pageNum) {
        let courses = []
        let startGetElement = 0
        let endGetElement = 0
        await $.ajax({
            url: "/search?query=" + query + "&page=" + pageNum,
            method: 'GET',
            data: { isChangePage: true },
            success: function (response) {
                courses = response[1].courses
                startGetElement = response[1].startGetElement
                endGetElement = response[1].endGetElement
            },
            error: function (status, error) {
                console.log('Request failed. Status:', status, ' Error: ', error);
            }
        })
        return { courses, startGetElement, endGetElement }
    }
    function updateUrl(pageNum) {
        const newUrl = window.location.pathname + '?query=' + query + '&page=' + pageNum;
        const stateObj = { pageNum: pageNum };
        history.pushState(stateObj, '', newUrl);
    }
    function updateSearchPage(courses, startGetElement, endGetElement) {
        breadcrumbPosGetCourse.innerHTML = `
                 <li class="breadcrumb-item active" aria-current="page">
                    <b>${startGetElement + 1} – ${endGetElement} trong số ${totalCoursesCount}</b>
                 </li>
            `

        courseContainer.innerHTML = ``
        let totalPage=Math.ceil(totalCoursesCount / PAGE_SIZE);
        for (let i = 0; i < totalPage; i++) {
            const rowWrap = document.createElement("div");
            rowWrap.className = "db-m__search-row row d-flex justify-content-start mt-3"
            let contentInRow = ``
            for (let j = i * 3; j < (i + 1) * 3; j++) {
                let course = courses[j]
                if (course) {
                    contentInRow += `
                    <div class="col-sm-4">
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                   `
                }
            }
            rowWrap.innerHTML = contentInRow
            courseContainer.appendChild(rowWrap)
        }
    }
}, false)