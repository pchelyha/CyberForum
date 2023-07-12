let NewsSearchField = document.querySelector('.input-box').children[1];

let NewsForumText = document.querySelectorAll('.table-row');

let NewsCategoryText = document.querySelectorAll('.subforum-row');

// Поиск обсуждений
NewsSearchField.addEventListener('keyup', () => {
  for(let i = 0; i < NewsForumText.length; i++){
    NewsForumText[i].style.display = "none";
  }
  for(let i = 0; i < NewsForumText.length; i++){
      if(NewsForumText[i].children[2].children[0].children[0].children[1].value.toLowerCase().includes(NewsSearchField.value.toLowerCase())){
        NewsForumText[i].style.display = "";
      }
      if(NewsForumText[i].children[2].children[0].children[0].children[2].value.toLowerCase().includes(NewsSearchField.value.toLowerCase())){
        NewsForumText[i].style.display = "";
    }
  }
})


// Поиск катеорий
NewsSearchField.addEventListener('keyup', () => {
    for(let i = 0; i < NewsCategoryText.length; i++){
        NewsCategoryText[i].style.display = "none";
    }
    for(let i = 0; i < NewsCategoryText.length; i++){
        if(NewsCategoryText[i].children[2].children[0].children[0].children[1].value.toLowerCase().includes(NewsSearchField.value.toLowerCase())){
            NewsCategoryText[i].style.display = "";
        }
        if(NewsCategoryText[i].children[2].children[0].children[0].children[2].value.toLowerCase().includes(NewsSearchField.value.toLowerCase())){
            NewsCategoryText[i].style.display = "";
      }
    }
  })