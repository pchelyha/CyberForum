let NewsItems = document.querySelectorAll('.table-row');
let NewsLike = document.querySelectorAll('.like-like');
let NewsWindowDelete = document.querySelector('.delete-window');


let updateNewsJSON = {
    id: null,
    title: null,
    text: null
}

for (let i = 0; i < NewsLike.length; i++) {

    NewsLike[i].children[1].addEventListener('click', () => {
        let UpdateNewsLikeDataArr = [];
        let UpdateNewsLikeDataJson;

        NewsLike[i].children[1].style.color = "#de4040";

        if (NewsLike[i].children[1].children[0].classList.contains("bx-like")) {
            NewsLike[i].children[1].children[0].classList.replace("bx-like", "bxs-like");
            NewsLike[i].children[2].value = Number(NewsLike[i].children[2].value) + 1;
        }
        else {
            NewsLike[i].children[1].children[0].classList.replace("bxs-like", "bx-like");
            NewsLike[i].children[2].value = Number(NewsLike[i].children[2].value) - 1;
            NewsLike[i].children[1].style.color = "";
        }
        let IdNrews = NewsLike[i].children[0].innerHTML;
        let IdNumberLike = NewsLike[i].children[2].value;

        UpdateNewsLikeDataArr.push(IdNrews);
        UpdateNewsLikeDataArr.push(IdNumberLike);

        UpdateNewsLikeDataJson = JSON.stringify(UpdateNewsLikeDataArr);
        console.log(UpdateNewsLikeDataJson);

        fetch('/addLike', {
            method: 'POST',
            body: UpdateNewsLikeDataJson,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then((res) => {
            if (res.status == 404) {
                window.location.href = '/reg'
            }
        })
    })
}

for (let i = 0; i < NewsItems.length; i++) {

    if(NewsItems[i].children[4].children[0].children[0].children[3]){
    NewsItems[i].children[4].children[0].children[0].children[3].children[1].children[0].addEventListener('click', () => {
        let UpdateTextDataJson;

        if (NewsItems[i].children[4].children[0].children[0].children[3].children[1].children[0].classList.contains("active")) {
            NewsItems[i].children[4].children[0].children[0].children[3].children[1].children[0].classList.replace("bxs-save", "bx-edit-alt");
            NewsItems[i].children[2].children[0].children[0].children[1].readOnly = true;
            NewsItems[i].children[2].children[0].children[0].children[2].readOnly = true;
            NewsItems[i].children[2].children[0].children[0].children[1].style.fontWeight = 'bold'
            NewsItems[i].children[2].children[0].children[0].children[2].style.fontWeight = 'normal'
            NewsItems[i].children[4].children[0].children[0].children[3].children[1].children[0].classList.remove("active");

            let IdNewsEdit = NewsItems[i].children[0].children[0].innerHTML;
            let IdNewsEditTitle = NewsItems[i].children[2].children[0].children[0].children[1].value;
            let IdNewsEditText = NewsItems[i].children[2].children[0].children[0].children[2].value;

            updateNewsJSON.id = IdNewsEdit
            updateNewsJSON.title = IdNewsEditTitle
            updateNewsJSON.text = IdNewsEditText

            UpdateTextDataJson = JSON.stringify(updateNewsJSON);
            console.log(UpdateTextDataJson);
        }

        else {
            NewsItems[i].children[4].children[0].children[0].children[3].children[1].children[0].classList.replace("bx-edit-alt", "bxs-save");
            NewsItems[i].children[2].children[0].children[0].children[1].readOnly = false;
            NewsItems[i].children[2].children[0].children[0].children[2].readOnly = false;
            NewsItems[i].children[2].children[0].children[0].children[1].style.fontWeight = 'bold'
            NewsItems[i].children[2].children[0].children[0].children[2].style.fontWeight = 'bold'
            NewsItems[i].children[4].children[0].children[0].children[3].children[1].children[0].classList.add("active");
        }

        fetch('/updatePost', {
            method: 'PUT',
            body: UpdateTextDataJson,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then((res) => {
            if (res.status == 404) {
                window.location.href = '/reg'
            }
        })

    })
}
}

for (let i = 0; i < NewsItems.length; i++) {
    let UpdateNewsPostDataArr = [];
    let UpdateNewsPostDataJson;
    
    if(NewsItems[i].children[4].children[0].children[0].children[3]){
    NewsItems[i].children[4].children[0].children[0].children[3].children[0].children[0].addEventListener('click', () => {

        if (NewsWindowDelete.classList.contains('delete-window-hidden')) {
            NewsWindowDelete.classList.remove('delete-window-hidden');
            NewsWindowDelete.children[1].children[1].addEventListener('click', () => {
                NewsItems[i].style.display = "none";

                let IdDelNews = NewsItems[i].children[0].children[0].innerHTML;
                UpdateNewsPostDataArr.push(IdDelNews);

                UpdateNewsPostDataJson = JSON.stringify(UpdateNewsPostDataArr);
                console.log(UpdateNewsPostDataJson);

                fetch('/deletePost', {
                    method: 'DELETE',
                    body: UpdateNewsPostDataJson,
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }).then((res) => {
                    if (res.status == 404) {
                        window.location.href = '/reg'
                    }
                })

                NewsWindowDelete.classList.add('delete-window-hidden');
                location.reload();
            });

            NewsWindowDelete.children[1].children[0].addEventListener('click', () => {
                NewsWindowDelete.classList.add('delete-window-hidden');
                location.reload();
            });
        }
    });
}
}