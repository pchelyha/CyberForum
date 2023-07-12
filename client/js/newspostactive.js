let AddNewsForm = document.querySelector('.add-new-com-news');
let AddNewsBtn = document.querySelector('.news-detals-buttons');
let AddNewsAlertWindow = document.querySelector('.no-text-open');
let NewsLike = document.querySelectorAll('.like-like-com');
let NewsLikeComm = document.querySelectorAll('.like-like_com-com');

let NewsItems = document.querySelectorAll('.body-news-activ_coms');
let NewsWindowDelete = document.querySelector('.delete-window');

let NewNewsDataArr = [];
let NewNewsDataObj = {
    NewNewsName: null,
    NewNewsDecription: null,
    NewNewsDate: null,
    NewsLike:null
}
let NewNewsDataJSON;

let updateCommJSON={
    id:null,
    text:null,
    }

for(let i = 0; i < NewsLike.length; i++) {
   
    NewsLike[i].children[1].addEventListener('click', () => {
        let UpdateNewsLikeDataArr = [];
        let UpdateNewsLikeDataJson;
    
        NewsLike[i].children[1].style.color = "#de4040";

        if(NewsLike[i].children[1].children[0].classList.contains("bx-like")){
            NewsLike[i].children[1].children[0].classList.replace("bx-like", "bxs-like");
            NewsLike[i].children[2].value=Number(NewsLike[i].children[2].value)+1;
        }
        else {
            NewsLike[i].children[1].children[0].classList.replace("bxs-like", "bx-like");
            NewsLike[i].children[2].value= Number(NewsLike[i].children[2].value)-1;
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
    }).then((res)=>{
        if(res.status==404){
            window.location.href='/reg'
        }
    })
    })
}


for(let i = 0; i < NewsLikeComm.length; i++) {
   
    NewsLikeComm[i].children[1].addEventListener('click', () => {
        let UpdateNewsLikeCommDataArr = [];
        let UpdateNewsLikeCommDataJson;
    
        NewsLikeComm[i].children[1].style.color = "#de4040";

        if(NewsLikeComm[i].children[1].children[0].classList.contains("bx-like")){
            NewsLikeComm[i].children[1].children[0].classList.replace("bx-like", "bxs-like");
            NewsLikeComm[i].children[2].value=Number(NewsLikeComm[i].children[2].value)+1;
        }
        else {
            NewsLikeComm[i].children[1].children[0].classList.replace("bxs-like", "bx-like");
            NewsLikeComm[i].children[2].value= Number(NewsLikeComm[i].children[2].value)-1;
            NewsLikeComm[i].children[1].style.color = "";
        }
        let IdNrews = NewsLikeComm[i].children[0].innerHTML;
        let IdNumberLike = NewsLikeComm[i].children[2].value;

        UpdateNewsLikeCommDataArr.push(IdNrews);
        UpdateNewsLikeCommDataArr.push(IdNumberLike);

        UpdateNewsLikeCommDataJson = JSON.stringify(UpdateNewsLikeCommDataArr);
        console.log(UpdateNewsLikeCommDataJson);
        
    fetch('/addCommentLike', {
        method: 'POST',
        body: UpdateNewsLikeCommDataJson,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    }).then((res)=>{
        if(res.status==404){
            window.location.href='/reg'
        }
    })
    })
}


AddNewsBtn.children[0].addEventListener('click', () => {
    AddNewsForm.style.display = "flex";
});

AddNewsForm.children[2].children[0].addEventListener('click', () => {
    if(AddNewsForm.children[1].children[0].children[0].value.replaceAll(' ','') != ''){
        NewNewsDataArr[0] = AddNewsForm.children[1].children[0].children[0].value;
        // Parse Array to Object
        for(let i = 0; i < Object.values(NewNewsDataObj).length; i++){
            Object.keys(NewNewsDataObj).forEach((value, i) => {
                NewNewsDataObj[value] = NewNewsDataArr[i];
            });
        }
        // Parse to JSON
        NewNewsDataJSON = JSON.stringify(NewNewsDataObj);
        // Fetch
        fetch(window.location.href, {
            method: 'PUT',
            body: NewNewsDataJSON,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => {
            if(response.status==400) {
                window.location.href='/reg'
               return;
            }
        
        })
        .then((data) => {
            console.log("Отправленные данные", data)
        })
        .catch((err) => {
            console.log(err);
        })
        location.reload();
    }
    else {
        if(AddNewsAlertWindow.classList.contains('ne-texts-hidden')){
            AddNewsAlertWindow.classList.remove('ne-texts-hidden');
            window.location.href = "#no-text-open";
            AddNewsAlertWindow.children[1].children[0].addEventListener('click', () => {
                AddNewsAlertWindow.classList.add('ne-texts-hidden');
            });
        }
        else {
            AddNewsAlertWindow.classList.add('ne-texts-hidden');
        }
    }
})


for (let i=0; i<NewsItems.length; i++) {
    if(NewsItems[i].children[2].children[1]){

    NewsItems[i].children[2].children[1].children[1].children[0].addEventListener('click', () =>{
         let UpdateCommTextDataJson;

        if (NewsItems[i].children[2].children[1].children[1].children[0].classList.contains("active")) {
            NewsItems[i].children[2].children[1].children[1].children[0].classList.replace("bxs-save", "bx-edit-alt");
            NewsItems[i].children[2].children[0].children[0].children[0].readOnly=true;

            NewsItems[i].children[2].children[0].children[0].children[0].style.fontWeight='normal'

            NewsItems[i].children[2].children[1].children[1].children[0].classList.remove("active");

        let IdComsEdit = NewsItems[i].children[0].children[0].innerHTML;
        let IdComsEditText =  NewsItems[i].children[2].children[0].children[0].children[0].value;


        updateCommJSON.id = IdComsEdit
        updateCommJSON.text = IdComsEditText


        UpdateCommTextDataJson = JSON.stringify(updateCommJSON);
        console.log(UpdateCommTextDataJson);
    }

    else {
        NewsItems[i].children[2].children[1].children[1].children[0].classList.replace("bx-edit-alt", "bxs-save");
        NewsItems[i].children[2].children[0].children[0].children[0].readOnly=false;

        NewsItems[i].children[2].children[0].children[0].children[0].style.fontWeight='bold'

        NewsItems[i].children[2].children[1].children[1].children[0].classList.add("active");
}

fetch('/updateComment', {
    method: 'PUT',
    body: UpdateCommTextDataJson,
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    },
}).then((res)=>{
    if(res.status==404){
        window.location.href='/reg'
    }
})

    })
}
}


for(let i = 0; i < NewsItems.length; i++) {
    let UpdateDelComDataArr = [];
    let UpdateDelComDataJson;
    if(NewsItems[i].children[2].children[1]){
    NewsItems[i].children[2].children[1].children[0].children[0].addEventListener('click', () => {

        if(NewsWindowDelete.classList.contains('delete-window-hidden')){
            NewsWindowDelete.classList.remove('delete-window-hidden');
            NewsWindowDelete.children[1].children[1].addEventListener('click', () => {
                NewsItems[i].style.display = "none";

                let IdDelCom = NewsItems[i].children[0].children[0].innerHTML;
                UpdateDelComDataArr.push(IdDelCom);

                UpdateDelComDataJson = JSON.stringify(UpdateDelComDataArr);
                console.log(UpdateDelComDataJson);

                fetch('/deleteComment', {
                    method: 'DELETE',
                    body: UpdateDelComDataJson,
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }).then((res)=>{
                    if(res.status==404){
                        window.location.href='/reg'
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
