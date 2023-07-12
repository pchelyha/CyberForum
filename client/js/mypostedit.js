let NewsLike = document.querySelectorAll('.like-like');


for(let i = 0; i < NewsLike.length; i++) {
   
    NewsLike[i].children[1].addEventListener('click', () => {
        let UpdateNewsLikeDataArr = [];
        let UpdateNewsLikeDataJson;
    
        NewsLike[i].children[1].style.color = "#de4040";

        if(NewsLike[i].children[1].children[0].classList.contains("bx-like")){
            NewsLike[i].children[1].children[0].classList.replace("bx-like", "bxs-like");
            NewsLike[i].children[2].value= 1;
        }
        else {
            NewsLike[i].children[1].children[0].classList.replace("bxs-like", "bx-like");
            NewsLike[i].children[2].value= 0;
            NewsLike[i].children[1].style.color = "";
        }
        let NewsDataLikeArr = [null, null];
        NewsDataLikeArr[0] = NewsLike[i].children[0].innerHTML;
        NewsDataLikeArr[1] = NewsLike[i].children[2].value;
        UpdateNewsLikeDataArr.push(NewsDataLikeArr);
    
        UpdateNewsLikeDataJson = JSON.stringify(UpdateNewsLikeDataArr);
        console.log(UpdateNewsLikeDataJson);
    })
}
