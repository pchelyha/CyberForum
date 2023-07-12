const body = document.querySelector('body'),
 sidebar = body.querySelector(".sidebar"),
toggle = body.querySelector(".toggle"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");


toggle.addEventListener("click" , () =>{
sidebar.classList.toggle("open");
menuBtnChange();
})

modeSwitch.addEventListener("click" , async() =>{
body.classList.toggle("dark");

if(body.classList.contains("dark")){
    modeText.innerText = "Темная";
}else{
    modeText.innerText = "Светлая";
    
}
await fetch('/tema');
});

    function menuBtnChange() {
    if(sidebar.classList.contains("open")){
        toggle.classList.replace("bx-menu", "bx-menu-alt-right");
    }
    else {
        toggle.classList.replace("bx-menu-alt-right","bx-menu");
    }
}