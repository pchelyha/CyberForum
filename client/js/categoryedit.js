let NewsItems = document.querySelectorAll('.subforum-row');
let CatsWindowDelete = document.querySelector('.delete-window');

let updateNewsJSON={
    id:null,
    title:null,
    text:null
}

for (let i=0; i<NewsItems.length; i++) {

    NewsItems[i].children[4].children[2].children[0].addEventListener('click', () =>{
         let UpdateTextDataJson;

        if (NewsItems[i].children[4].children[2].children[0].classList.contains("active")) {
            NewsItems[i].children[4].children[2].children[0].classList.replace("bxs-save", "bx-edit-alt");
            NewsItems[i].children[2].children[0].children[0].children[1].readOnly=true;
            NewsItems[i].children[2].children[0].children[0].children[2].readOnly=true;
            NewsItems[i].children[2].children[0].children[0].children[1].style.fontWeight='bold'
            NewsItems[i].children[2].children[0].children[0].children[2].style.fontWeight='normal'
        NewsItems[i].children[4].children[2].children[0].classList.remove("active");

        let IdNewsEditCat = NewsItems[i].children[0].children[0].innerHTML;
        let IdCatEditTitle =  NewsItems[i].children[2].children[0].children[0].children[1].value;
        let IdCatEditText  = NewsItems[i].children[2].children[0].children[0].children[2].value;

        updateNewsJSON.id = IdNewsEditCat
        updateNewsJSON.title = IdCatEditTitle
        updateNewsJSON.text = IdCatEditText

        UpdateTextDataJson = JSON.stringify(updateNewsJSON);
        console.log(UpdateTextDataJson);
    }

    else {
        NewsItems[i].children[4].children[2].children[0].classList.replace("bx-edit-alt", "bxs-save");
        NewsItems[i].children[2].children[0].children[0].children[1].readOnly=false;
        NewsItems[i].children[2].children[0].children[0].children[2].readOnly=false;
        NewsItems[i].children[2].children[0].children[0].children[1].style.fontWeight='bold'
        NewsItems[i].children[2].children[0].children[0].children[2].style.fontWeight='bold'
        NewsItems[i].children[4].children[2].children[0].classList.add("active");
}

fetch('/updateCategory', {
    method: 'PUT',
    body: UpdateTextDataJson,
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

for(let i = 0; i < NewsItems.length; i++) {
    let UpdateNewsDataArr = [];
    let UpdateNewsDataJson;

    NewsItems[i].children[4].children[1].children[0].addEventListener('click', () => {

        if(CatsWindowDelete.classList.contains('delete-window-hidden')){
            CatsWindowDelete.classList.remove('delete-window-hidden');
            CatsWindowDelete.children[1].children[1].addEventListener('click', () => {
                NewsItems[i].style.display = "none";

                let IdDelNews = NewsItems[i].children[0].children[0].innerHTML;
                UpdateNewsDataArr.push(IdDelNews);

                UpdateNewsDataJson = JSON.stringify(UpdateNewsDataArr);
                console.log(UpdateNewsDataJson);

                fetch('/deleteCategory', {
                    method: 'DELETE',
                    body: UpdateNewsDataJson,
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }).then((res)=>{
                    if(res.status==404){
                        window.location.href='/reg'
                    }
                }).catch(err=>{
                    location.reload();
                })

                CatsWindowDelete.classList.add('delete-window-hidden');
                location.reload();
            });

            CatsWindowDelete.children[1].children[0].addEventListener('click', () => {
                CatsWindowDelete.classList.add('delete-window-hidden');
                location.reload();
            });
        }
    });
}