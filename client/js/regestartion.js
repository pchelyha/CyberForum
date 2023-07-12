const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container-reg');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});
function addRigthPanel(){
    container.classList.add("right-panel-active");
}
function removeRigthPanel(){
    container.classList.remove("right-panel-active");
}

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

setTimeout(function() {
    $('#mydiv').fadeOut('fast');
}, 3000);

setTimeout(function() {
    $('#mydiv1').fadeOut('fast');
}, 3000);

setTimeout(function() {
    $('#mydiv2').fadeOut('fast');
}, 3000);