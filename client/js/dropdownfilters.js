let NewsDownBtn = document.querySelector('.news_dropdown_button');
let FiltresNewsDown = document.querySelector('.news_forma_cat');

NewsDownBtn.addEventListener('click', () =>{
        if (NewsDownBtn.classList.contains("active")) {
                FiltresNewsDown.style.display = "flex";
                NewsDownBtn.classList.remove("active");
        }
        else {
                FiltresNewsDown.style.display = "none";
                NewsDownBtn.classList.add("active");
        }
})


let Filtres = document.querySelector('.table-row');
