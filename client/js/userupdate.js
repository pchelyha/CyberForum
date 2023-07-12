let UserDataFields = document.querySelectorAll('.profile-information-field-text');
let UserEditBtn = document.querySelector('.profile-information-button-edit');
let UserSaveBtn = document.querySelector('.profile-information-button-save');
let UserLoadFileBtn = document.querySelector('.profile-cart-user-load-file');
let employees = document.querySelectorAll('.profile-information');
let ProfileInfa = document.querySelectorAll('.profile-cart');
let employeesDataArr = [];
let UpdateDataObj = {
    userName: null,
    email: null,
    gender: null,
    birthday: null,
}
let UpdateUserDataJSON;

UserEditBtn.addEventListener('click', ()=>{
    for(let i = 0; i < UserDataFields.length; i++){
        ProfileInfa[0].children[3].style.display = "none";

        UserDataFields[i].readOnly = false;
        UserDataFields[i].classList.add('edit-profile-input');
        employees[0].children[2].children[1].disabled=false;
        employees[0].children[3].children[1].readOnly = false;
        employees[0].children[3].children[1].classList.add('edit-profile-input');
        employees[0].children[2].children[1].classList.add('edit-profile-input');
        UserEditBtn.style.display = "none";
        UserSaveBtn.style.display = "flex";
        UserLoadFileBtn.style.display = "flex";
    }
});

UserSaveBtn.addEventListener('click', ()=>{
    ProfileInfa[0].children[3].style.display = "flex";
    for(let i = 0; i < UserDataFields.length; i++){
        UserDataFields[i].readOnly = true;
        UserDataFields[i].classList.remove('edit-profile-input');
        employees[0].children[3].children[1].readOnly = true;
        employees[0].children[2].children[1].disabled=true;
        employees[0].children[3].children[1].classList.remove('edit-profile-input');
        employees[0].children[2].children[1].classList.remove('edit-profile-input');
        UserEditBtn.style.display = "flex";
        UserSaveBtn.style.display = "none";
        UserLoadFileBtn.style.display = "none";
    }
    for(let i = 0; i < UserDataFields.length; i++){
        Object.keys(UpdateDataObj).forEach((value, i) => {
            UpdateDataObj[value] = UserDataFields[i].value;
        });
    }
    // Парсинг данных в JSON
    UpdateUserDataJSON = JSON.stringify(UpdateDataObj);

    // fetch
    fetch(window.location.href, {
        method: 'PUT',
        body: UpdateUserDataJSON,
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => {
       return response.json();
    })
    .then((data) => {
        UserDataFields[0].value=data.response;
        console.log("Отправленные данные", data)
    })
    .catch((err) => {
        console.log(err);
    })
})
