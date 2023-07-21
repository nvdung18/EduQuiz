document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("btn-logout").addEventListener("click", function () {

        fetch('/logout', {
            method: 'DELETE',
            body: {}
        })
            .then(response => {
                let url = response.url
                var indexOfUrl = url.indexOf("logout")
                var urlLogin = url.substring(0, indexOfUrl - 1)
                window.location.assign(urlLogin)
                // console.log('Phản hồi từ máy chủ:', response);
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    })
}, false)