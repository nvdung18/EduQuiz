document.addEventListener('DOMContentLoaded', function () {

    const ORIGINAL_ORDER = 0
    const ALPHABET_ORDER = 1
    let username = getParamFromUrl(0, 1)[0]
    let courseID = getParamFromUrl(2, 3)[0]

    let speech = new SpeechSynthesisUtterance()
    let listCard = document.getElementsByClassName("card")
    let carouselCardInner = document.getElementById("carousel-card-inner");
    let btnRollCard = document.getElementById("btn-rollCard")
    let btnMixCard = document.getElementById("btn-mixCard")
    let btnSpeaks = document.getElementsByClassName("btn-speak")
    let btnEditCards = document.getElementsByClassName("btn-edit-card")
    let carousel = $('#carouselCards');
    let termCards = document.getElementsByClassName("term-text")
    let definitionCards = document.getElementsByClassName("definition")
    let imgCards = document.getElementsByClassName("explain-term__image")
    let termListInner = document.getElementById("term-list-inner")
    let itemArrangeBtn = document.getElementsByClassName("dropdown-item-arrange")
    var dropdownArrangeBtn = document.getElementById("dropdownArrangeBtn");
    var btnEditCourse = document.getElementsByClassName("btn-edit-course")
    let btnDeleteCourse = document.getElementById("btn-delete-course");

    let isRolling = false;
    let intervalId = null;
    let isMixCard = false
    let isEditCard = false
    //-1 mean didn't have any card edit button enabled before, !=-1 mean there was a certain card enabled before
    let prevPositionEditCardTurnOn = -1


    setSpeakCard()
    setEditCard()
    setArrangeCards()
    setEditCourse()
    setLightBoxForImg()

    document.getElementById("btn-setting").addEventListener("focusin", () => {
        console.log(1);
    })
    $('#carouselCards').on('slide.bs.carousel', function () {
        if (!isRolling) {
            $('#carouselCards').carousel('pause')
        }
    })

    $('#carouselCards').on('slid.bs.carousel', function (event) {
        if (!isRolling) {
            var currentIndex = event.from;
            listCard[currentIndex].classList.remove("flipped")
        }
    })

    btnRollCard.onclick = async function () {
        if (!isRolling) {
            btnRollCard.classList.add("btn-interact-card--bgWhite")
            btnRollCard.innerHTML = `<i class="fa-solid fa-pause"></i>`
            btnRollCard.setAttribute('title', "Dừng")

            isRolling = true;
            let isFlipped = false

            let indexOfCard = carousel.find('.active').index()

            smallNotification("success", "Tự động cuộn thẻ đang bật")

            if (jQuery(listCard[indexOfCard]).hasClass('flipped')) {
                isFlipped = true
            }

            if (isFlipped) {
                $('#carouselCards').carousel('next')
                listCard[indexOfCard].classList.remove("flipped")
            }

            setFlippedActiveCard()
            intervalId = setInterval(async function () {
                $('#carouselCards').carousel('next')
                if (isRolling) {
                    listCard[indexOfCard].classList.remove("flipped")
                }
                setFlippedActiveCard()
            }, 8000);
        } else {
            btnRollCard.classList.remove("btn-interact-card--bgWhite")
            btnRollCard.innerHTML = `<i class="fa-solid fa-play"></i>`
            btnRollCard.setAttribute('title', "Bắt đầu")

            isRolling = false;

            smallNotification("success", "Tự động cuộn thẻ đã tắt")

            clearInterval(intervalId);
            $('#carouselCards').carousel('pause')
        }
    };

    btnMixCard.onclick = async () => {
        isMixCard = !isMixCard
        if (isMixCard) {
            btnMixCard.classList.add("btn-interact-card--bgWhite")
            let mixCards = await getMixCards(username, courseID)

            showCarouselCard(mixCards)

            smallNotification("success", "Trộn thẻ đang bật")
        } else {
            btnMixCard.classList.remove("btn-interact-card--bgWhite")

            let cards = await getCards(username, courseID)

            showCarouselCard(cards)

            smallNotification("success", "Trộn thẻ đang tắt")
        }
    }

    function setSpeakCard() {
        for (let i = 0; i < btnSpeaks.length; i++) {
            btnSpeaks[i].onclick = () => {
                if (termCards[i] != undefined) {
                    speech.text = termCards[i].innerHTML
                    window.speechSynthesis.speak(speech)
                }
                if (definitionCards[i] != undefined) {
                    speech.text = definitionCards[i].innerHTML
                    window.speechSynthesis.speak(speech)
                }
            }
        }
    }

    function setEditCard() {
        for (let i = 0; i < btnEditCards.length; i++) {
            btnEditCards[i].onclick = async () => {
                checkClickAnotherCardAndUpdate(i)

                if (!isEditCard) {
                    toggleDisableText(i, false)

                    prevPositionEditCardTurnOn = i

                    toggleEditCard(i)
                } else {
                    toggleDisableText(i, true)

                    let card = getDataCard(i)

                    let dataToUpdate = validDataToUpdate(card)
                    if (dataToUpdate) {
                        updateCard(username, courseID, dataToUpdate)
                    }

                    toggleEditCard(i)
                }
            }
        }
    }

    function setArrangeCards() {
        for (let i = 0; i < itemArrangeBtn.length; i++) {
            itemArrangeBtn[i].onclick = async () => {
                if (itemArrangeBtn[i].value == ORIGINAL_ORDER) {
                    let cards = await getCards(username, courseID)
                    showAllCard(cards)
                } else if (itemArrangeBtn[i].value == ALPHABET_ORDER) {
                    let cards = await getCardByAlphabetOrder(username, courseID)
                    showAllCard(cards)
                }
                dropdownArrangeBtn.innerHTML = itemArrangeBtn[i].innerHTML
            }
        }
    }

    function setEditCourse() {
        for (let i = 0; i < btnEditCourse.length; i++) {
            btnEditCourse[i].onclick = () => {
                let editUrl = getUrlEditCourse()

                window.location.assign(editUrl)
            }
        }
    }

    btnDeleteCourse.onclick = async () => {
        await deleteCourse()

        let urlAllCourses = getUrlAllCourses()
        window.location.assign(urlAllCourses)
    }

    function setLightBoxForImg() {
        const lightbox = document.createElement('div')
        lightbox.id = 'lightbox'
        document.body.appendChild(lightbox)

        const images = document.querySelectorAll('.lightBoxImg')
        images.forEach(image => {
            image.addEventListener('click', e => {
                lightbox.classList.add('active')
                const img = document.createElement('img')
                img.src = image.src
                while (lightbox.firstChild) {
                    lightbox.removeChild(lightbox.firstChild)
                }
                lightbox.appendChild(img)
            })
        })

        lightbox.addEventListener('click', e => {
            if (e.target !== e.currentTarget) return
            lightbox.classList.remove('active')
        })
    }






    // -----------------------------------------------------------------------------------------------------------------
    function getIndexOfActiveCard() {
        let indexOfCard = carousel.find('.active').index()
        return indexOfCard
    }
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function setFlippedActiveCard() {
        setTimeout(() => {
            if (isRolling) {
                indexOfCard = carousel.find('.active').index()
                listCard[indexOfCard].classList.add("flipped")
            }
        }, 4000)
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

    function showCarouselCard(cards) {
        let indexActiveCard = getIndexOfActiveCard()
        let carouselItems = ``
        cards.forEach(function (card, index) {
            carouselItems +=
                `
            <div class="carousel-item ${index == indexActiveCard ? "active" : ""}">
                <div class="card" onclick="this.classList.toggle('flipped')">
                    <div class="card-inner">
                        <div class="card-front">
                            <h2>${card.term == " " ? "..." : card.term}</h2>
                        </div>
                        <div class="card-back">
                            <div class="card-back__containText">
                                <p class="card-back__define">${card.define == " " ? "..." : card.define}</p>
                            </div>
                        ${card.image != " " ?
                    `<div class="card-back__containImg">
                            <img src="${card.image}" class="card-back__image" alt="">
                        </div>`:
                    ``}
                        </div>
                    </div>
                </div>
            </div>
            `
        })
        carouselCardInner.innerHTML = carouselItems
    }

    function smallNotification(icon, title) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-start',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,

            customClass: {
                title: 'toast-title'
            }
        })

        Toast.fire({
            icon: icon,
            title: title
        })
    }

    async function getMixCards(username, courseID) {
        var mixCards = []
        await $.ajax({
            url: '/' + username + '/courses/' + courseID + '/mix-cards',
            method: 'GET',
            success: function (response) {
                mixCards = response[1].mixCards
                console.log(mixCards);

                console.log(response[0]);

            },
            error: function (status, error) {
                console.log('Request failed. Status:', status, ' Error: ', error);
            }
        })
        return mixCards
    }

    async function getCards(username, courseID) {
        let cards = []
        await $.ajax({
            url: '/' + username + '/courses/' + courseID + '/cards',
            method: 'GET',
            success: function (response) {
                cards = response[1].cards

                console.log(response[0]);

            },
            error: function (status, error) {
                console.log('Request failed. Status:', status, ' Error: ', error);
            }
        })
        return cards
    }

    function isAnyCardTurnOn(prevPositionEditCardTurnOn) {
        if (prevPositionEditCardTurnOn != -1 && isEditCard) {
            return true
        }
        return false
    }
    function isClickToAnotherCard(prevPositionEditCardTurnOn, nowPositionEditCardTurnOn) {
        if (prevPositionEditCardTurnOn != nowPositionEditCardTurnOn) {
            return true
        }
        return false
    }
    function toggleEditCard(positionToToggle) {
        termCards[positionToToggle].classList.toggle("term-edit")
        termCards[positionToToggle].classList.toggle("term__none-border")

        definitionCards[positionToToggle].classList.toggle("definition-edit")
        definitionCards[positionToToggle].classList.toggle("definition__none-border")

        btnEditCards[positionToToggle].classList.toggle("btn-edit-card-turnOn")
        isEditCard = !isEditCard
    }
    function toggleDisableText(positionToToggle, statusDisable) {
        termCards[positionToToggle].disabled = statusDisable
        definitionCards[positionToToggle].disabled = statusDisable
    }
    function updateCard(username, courseID, dataToUpdate) {
        $.ajax({
            url: '/' + username + '/courses/' + courseID + '/edit-card',
            method: 'PUT',
            data: dataToUpdate,
            success: function (response) {
                console.log(response)
            },
            error: function (status, error) {
                console.log('Request failed. Status:', status, ' Error: ', error);
            }
        })
    }
    function getDataCard(positionCard) {
        return {
            term: termCards[positionCard].value,
            define: definitionCards[positionCard].value,
            image: imgCards[positionCard],
            positionToUpdate: positionCard
        }
    }
    function validDataToUpdate(card) {
        let term = card.term == '' ? ' ' : card.term
        let define = card.define == '' ? ' ' : card.define
        let image = card.image == undefined ? " " : card.image.src

        if (!checkAtLeastOneDataInCard(term, define, image)) {
            resetCardOriginalData()
            return false
        }
        return {
            term: term,
            define: define,
            image: image,
            positionToUpdate: card.positionToUpdate
        }
    }
    function checkAtLeastOneDataInCard(term, define, image) {
        if (term == ' ' && define == ' ' && image == ' ') {
            Swal.fire({
                icon: 'error',
                title: 'Wrong data',
                text: 'It must have at least one non-empty field in the card',
            })
            return false
        }
        return true
    }
    async function resetCardOriginalData() {
        let cards = await getCards(username, courseID)
        showAllCard(cards)
    }
    function checkClickAnotherCardAndUpdate(nowClickPositionCard) {
        if (isClickToAnotherCard(prevPositionEditCardTurnOn, nowClickPositionCard) && isAnyCardTurnOn(prevPositionEditCardTurnOn)) {

            let card = getDataCard(prevPositionEditCardTurnOn)

            let dataToUpdate = validDataToUpdate(card)
            if (dataToUpdate) {
                toggleEditCard(prevPositionEditCardTurnOn)

                toggleDisableText(prevPositionEditCardTurnOn, true)
                updateCard(username, courseID, dataToUpdate)
            }
        }
    }

    async function getCardByAlphabetOrder(username, courseID) {
        let cards = []
        await $.ajax({
            url: '/' + username + '/courses/' + courseID + '/alphabet-order-card',
            method: 'GET',
            success: function (response) {
                cards = response[1].cardOrder

                console.log(response[0]);

            },
            error: function (status, error) {
                console.log('Request failed. Status:', status, ' Error: ', error);
            }
        })
        return cards
    }
    function showAllCard(cards) {
        let allCards = ``
        cards.forEach(function (card) {
            allCards +=
                `
                <div class="SetPageTerms-card">
                <div class="term">
                    <textarea name="" id="" disabled="true" class="term-text term__none-border">${card.term == " " ? "" : card.term}</textarea>
                </div>
                <div class="explain-term">
                    <div class="explain-term__containDefine">
                        <textarea class="definition mr-3 definition__none-border" disabled="true">${card.define == " " ? "" : card.define}</textarea>
                    </div>
                    ${card.image != " " ?
                    `<div class="explain-term__containImg">
                        <img class="explain-term__image" src="${card.image}" alt="Hình ảnh">
                    </div>`: ``}                             
                </div>

                <div class="SetPageTerms-setPageOption d-flex">
                    <div class="setPageOption__btn-option pointer-btn btn-speak">
                        <i class="fa-solid fa-volume-high"></i>
                    </div>
                    <div class="setPageOption__btn-option pointer-btn btn-edit-card">
                        <i class="fa-solid fa-pencil"></i>
                    </div>
                </div>
            </div>
            `
        })
        termListInner.innerHTML = allCards
        setSpeakCard()
        setEditCard()
    }

    function getUrlEditCourse() {
        let url = new URL(window.location.href).href

        let lastIndexUrl = url.lastIndexOf("/")
        let substringFromLastIndex = url.substring(lastIndexUrl + 1)

        let editUrl = url.replace(substringFromLastIndex, "edit-course")

        return editUrl
    }

    function getUrlAllCourses() {
        let url = new URL(window.location.href).href

        let allCourseUrl = url.match(/^(.*\/courses)/)[1];

        return allCourseUrl
    }
    async function deleteCourse() {
        await $.ajax({
            url: '/' + username + '/courses/' + courseID + '/delete-course',
            method: 'DELETE',
            success: function (response) {
                console.log(response);
            },
            error: function (status, error) {
                console.log('Request failed. Status:', status, ' Error: ', error);
            }
        })
    }
}, false)