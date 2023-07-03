'use strict';

function init() {
    // ----------------Const----------------------------
    let NUM_TERM_DEFAULT = 2
    //-----------------Variables------------------------
    let bodyCreateCourse = document.getElementById("bodyCreateCourse")
    let loader = document.getElementById("load-animation")
    let termToolBarCounter = document.getElementsByClassName("TermToolbar-counter")
    let listInputTermImg = document.getElementsByClassName("inputTermImage")
    let listShowImageTermSelected = document.getElementsByClassName("imageTermSelected")
    var listBtnDeleteTerm = document.getElementsByClassName("TermToolbar-option__delete")
    var listImgTerm = document.getElementsByClassName("imgTermUpload")
    var listBtnDeleteImgOfTerm = document.getElementsByClassName("TermImage-option__delete")
    // var ONLY_ME = 0
    // var EVERYONE = 1
    var isCourseChanged = false
    var originContentCourse = getContentCourse()
    setAllEventTermForAllTerm()
    deleteAutosaveCourse()

    //  -------------------------------------------Event----------------------------------------------------
    bodyCreateCourse.addEventListener("focusout", function checkToCreateOrUpdateCourse() {
        if (isCourseChanged) {
            let course = getContentCourse()
            if (!_.isEqual(originContentCourse, course)) {
                if (checkExistAutosaveCourse()=="false") {
                    createAutosaveCourse(course)
                } else {
                    updateAutoSaveCourse(course)
                }
                isCourseChanged = false
                originContentCourse = course
            }
        }
    })

    document.getElementById("bodyCreateCourse").addEventListener("input", function inputChanged() {
        isCourseChanged = true
    })

    function setEventOpenTermImg(positionToSetOpen) {

        removeAllListenersFromPosition(positionToSetOpen)

        setOpenEventEachElement(positionToSetOpen)
    }

    function setEventUploadTermImg(positionToSetUpload) {
        for (let i = positionToSetUpload; i < listInputTermImg.length; i++) {
            listInputTermImg[i].addEventListener('change', function (event) {
                var selectedFile = event.target.files[0];
                var formData = setFormDataSelectedFile(selectedFile)
                setLoader()

                let positionShowImgSelected = i
                uploadFileAndShowImgSelected(formData, positionShowImgSelected)

            })
        }
    }

    function setEventDeleteTerm(positionToSetDelete) {
        for (let i = positionToSetDelete; i < listBtnDeleteTerm.length; i++) {
            listBtnDeleteTerm[i].addEventListener('click', function () {
                if (checkNumOfTerms() > NUM_TERM_DEFAULT) {
                    let positionDelete = i
                    executeDeleteTerm(this, positionDelete)
                } else {
                    //notification fail
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'The number of terms must be greater than 2',
                    })
                }
            })
        }
    }

    function setEventDeleteImgOfTerm(positionToSetDelete) {
        for (let i = positionToSetDelete; i < listBtnDeleteImgOfTerm.length; i++) {
            listBtnDeleteImgOfTerm[i].addEventListener('click', function () {
                let imageTermSelected = document.getElementsByClassName("imageTermSelected")[i]
                let srcImg = imageTermSelected.getAttribute("src")
                let inputFileSelected = document.getElementsByClassName("inputTermImage")[i]

                if (srcImg != "") {
                    executeDeleteImg(imageTermSelected, inputFileSelected)
                } else {
                    //notification fail
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No pictures to delete',
                    })
                }
            })
        }
    }

    document.getElementById("btnAddTerm").addEventListener("click", function addTerm() {
        var defaultTotalTerms = parseInt(document.getElementById('defaultTotalTerms').value);
        document.getElementById('defaultTotalTerms').setAttribute('value', defaultTotalTerms += 1)

        let orderOfNewTerm = defaultTotalTerms
        let newTerm = createNewTerm(orderOfNewTerm)

        const allTermWrap = document.getElementById("allTermWrap");
        allTermWrap.appendChild(newTerm);

        setAllEventTermForAllTerm()
    })

    $('#permissionModalCenter').on('shown.bs.modal', function offAutoAndSetEventClick() {
        $('#btn-SavePermission').off('click');

        $('#btn-SavePermission').on('click', function () {
            $('#permissionModalCenter').modal('toggle')
        });
    });

    function deleteAutosaveCourse() {
        if (document.getElementById("CreateSetHeader-btn-deleteCourse") != undefined) {
            let btnDelete = document.getElementById("CreateSetHeader-btn-deleteCourse")
            btnDelete.addEventListener("click", function () {
                executeDeleteAutosaveCourse()
            })
        }
    }

    // -------------------------------------------------------------------------------------------------------------------------
    function checkExistAutosaveCourse() {
        let isAutoSave = bodyCreateCourse.dataset.isautosave
        return isAutoSave
    }
    function createAutosaveCourse(course) {
        $.ajax({
            url: '/create-course/autosave',
            method: 'POST',
            data: course,
            success: function (response) {
                bodyCreateCourse.setAttribute('data-isAutoSave', 'true');
                console.log(response);
            },
            error: function (status, error) {
                // Handle the error
                console.error('Request failed. Status:', status, 'Error:', error);
            }
        });
    }
    function updateAutoSaveCourse(course) {
        $.ajax({
            url: '/create-course/autosave',
            method: 'PUT',
            data: course,
            success: function (response) {
                console.log(response);
            },
            error: function (status, error) {
                // Handle the error
                console.error('Request failed. Status:', status, 'Error:', error);
            }
        });
    }

    function getContentCourse() {
        let course = {}

        let valueCourseTitle = document.getElementById("inputCourseTitle").value;
        let valueCourseDescription = document.getElementById("inputCourseDescription").value;
        if (valueCourseTitle != "") {
            course.titleCourse = valueCourseTitle
        }
        if (valueCourseDescription != "") {
            course.description = valueCourseDescription
        }

        let listInputTerms = document.getElementsByClassName("inputTerm")
        let listInputDefine = document.getElementsByClassName("inputDefine")
        let listInputTermImgs = document.getElementsByClassName("imageTermSelected")
        let listCards = []
        for (let i = 0; i < listInputTerms.length && i < listInputDefine.length; i++) {
            let termValue = listInputTerms[i].value
            let defineValue = listInputDefine[i].value
            let srcTermImg = listInputTermImgs[i].getAttribute("src")
            if (termValue || defineValue || srcTermImg) {
                termValue = termValue == "" ? " " : termValue
                defineValue = defineValue == "" ? " " : defineValue
                srcTermImg = srcTermImg == "" ? " " : srcTermImg
                listCards.push({
                    term: termValue,
                    define: defineValue,
                    image: srcTermImg
                })
            }
        }
        if (listCards) {
            course.cards = listCards
        }


        let selectViewPermission = parseInt(document.getElementById("selectViewPermission").value)
        let selectEditPermission = parseInt(document.getElementById("selectEditPermission").value)
        course.permissionView = selectViewPermission
        course.permissionEdit = selectEditPermission

        return course
    }

    function removeAllListenersFromPosition(positionToSetOpen) {
        for (let i = positionToSetOpen; i < listImgTerm.length; i++) {
            let element = listImgTerm[i];
            let clonedElement = element.cloneNode(true);
            element.parentNode.replaceChild(clonedElement, element);
        }
    }
    function setOpenEventEachElement(positionToSetOpen) {
        for (let i = positionToSetOpen; i < listImgTerm.length; i++) {
            listImgTerm[i].addEventListener('click', function () {
                let termImage = document.getElementsByClassName("ImgForTerm")[i]
                termImage.classList.toggle("TermImage-inner")
                termImage.classList.toggle("TermImageShow-inner")

            })
        }
    }

    function setFormDataSelectedFile(selectedFile) {
        var formData = new FormData();
        formData.append("filename", selectedFile);
        return formData
    }
    function uploadFileAndShowImgSelected(formData, positionShowImgSelected) {
        $.ajax({
            url: '/create-course/upload-image',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: async function (response) {
                var res = response
                listShowImageTermSelected[positionShowImgSelected].src = await res[1] //show img selected
                loader.innerHTML = ``
            },
            error: function (status, error) {
                // Handle the error
                console.error('Request failed. Status:', status, 'Error:', error);
            }
        });
    }

    function checkNumOfTerms() {
        return listBtnDeleteTerm.length
    }
    function executeDeleteTerm(event, positionDelete) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                var termRowWrap = event.closest('.CreateSetPage-termRowWrap');
                termRowWrap.remove(); //delete term from course

                setEventOpenTermImg(positionDelete)

                setOrderNumOfTerm(positionDelete)

                isCourseChanged = true

                //notification successful
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    }
    function setOrderNumOfTerm(positionDelete) {
        for (let j = positionDelete; j < termToolBarCounter.length; j++) {
            termToolBarCounter[j].innerText = j + 1
        }
    }

    function executeDeleteImg(imageTermSelected, inputFileSelected) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                imageTermSelected.setAttribute('src', "")
                inputFileSelected.value = ""

                isCourseChanged = true

                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
    }

    function createNewTerm(orderOfNewTerm) {
        // Tạo phần tử cha mới
        const termRowWrap = document.createElement("div");
        termRowWrap.className = "CreateSetPage-termRowWrap";

        // Tạo nội dung HTML của phần tử con
        const termContent = `<div class="TermToolbar mb-3">
                        <span class="TermToolbar-counter">
                            ${orderOfNewTerm}
                        </span>
                        <div class="TermToolbar-option">
                            <div class="TermToolbar-option__dragToggle mr-3 ">
                                <i class="fa-solid fa-grip-lines"></i>
                            </div>
                            <div class="TermToolbar-option__delete pointer-btn">
                                <i class="fa-solid fa-trash"></i>
                            </div>
                        </div>
                    </div>
                    <div class="TermContent-inner">
                        <div class="TermContent-inner-word">
                            <div class="mb-0">
                                <input type="textarea" tabindex="6"
                                    class="form-control AutoExpandTextarea-textarea inputTerm"
                                    id="formGroupExampleInput" placeholder="">
                                <label for="formGroupExampleInput"
                                    class="form-label mt-2 lable-bottom-AutoExpandTextarea">THUẬT
                                    NGỮ</label>
                            </div>
                        </div>
                        <div class="TermContent-inner-definition">
                            <div class="DefinitionSide">
                                <div class="DefinitionSide-text">
                                    <div class="mb-0">
                                        <input type="textarea" tabindex="6"
                                            class="form-control AutoExpandTextarea-textarea inputDefine"
                                            id="formGroupExampleInput" placeholder="">
                                        <label for="formGroupExampleInput"
                                            class="form-label mt-2 lable-bottom-AutoExpandTextarea">ĐỊNH
                                            NGHĨA</label>
                                    </div>
                                </div>
                                <div class="DefinitionSide-image">
                                    <div class="ImageUploadComponent">
                                        <div class="imgUploadIcon pointer-btn imgTermUpload">
                                            <i class="fa-solid fa-image"></i>
                                        </div>
                                        <span class="imgUploadContext">HÌNH ẢNH</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="TermImage-inner mt-2 ImgForTerm " data-abc="">
                        <div class="TermImage-wrap">
                            <input type="file" name="filename" class="inputTermImage mt-3">
                            <img src="" alt="" class="imageTermSelected" id="imageTermSelectedID">
                        </div>
                        <div class="TermImage-option__delete pointer-btn mt-2">
                            <i class="fa-solid fa-trash"></i>
                        </div>
                    </div>`

        // Gán nội dung HTML vào phần tử cha
        termRowWrap.innerHTML = termContent;
        return termRowWrap
    }

    function executeDeleteAutosaveCourse() {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                var url = new URL(window.location.href).href;

                let courseID = getCourseIDFromUrl(url)

                let urlWithoutAutosave = getUrlCreateCourse(url)

                $.ajax({
                    url: '/create-course/autosave',
                    method: 'DELETE',
                    data: { _id: courseID },
                    success: function (response) {
                        console.log(response);
                        window.location.assign(urlWithoutAutosave)
                    },
                    error: function (status, error) {
                        // Handle the error
                        console.error('Request failed. Status:', status, 'Error:', error);
                    }
                });
            }
        })
    }
    function getCourseIDFromUrl(url) {
        var lastIndexUrl = url.lastIndexOf("/"); // Tìm vị trí của ký tự "/" cuối cùng
        var param = url.substring(lastIndexUrl + 1); // Trích xuất chuỗi con sau ký tự "/" cuối cùng
        return param
    }
    function getUrlCreateCourse(url) {
        var indexOfUrl = url.indexOf("autosave")
        var urlWithoutAutosave = url.substring(0, indexOfUrl - 1)
        return urlWithoutAutosave
    }

    function setAllEventTermForAllTerm() {
        setEventOpenTermImg(0)
        setEventUploadTermImg(0)
        setEventDeleteTerm(0)
        setEventDeleteImgOfTerm(0)
    }

    function setLoader() {
        loader.innerHTML = `<div class="overlay"></div>
                            <div class="loader"></div>`
    }
}