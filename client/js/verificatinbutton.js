let VerificationNewsItems = document.querySelectorAll('.table-row');

for(let i = 0; i < VerificationNewsItems.length; i++) {
   
    VerificationNewsItems[i].children[2].children[1].children[0].children[0].addEventListener('click', () => {

        let UpdateVerificationDataArr = [];
        let UpdateVerificationDataJson;

        let IdVerification = VerificationNewsItems[i].children[0].children[0].innerHTML;

        UpdateVerificationDataArr.push(IdVerification);

        UpdateVerificationDataJson = JSON.stringify(UpdateVerificationDataArr);
        console.log(UpdateVerificationDataJson);

        fetch('/vefifyNews',{
            method:"POST",
            body: UpdateVerificationDataJson,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }).then(response=>{
            response.status==200?window.location.reload():window.location.href="/error";
        }).catch(err=>{console.log(err);});
    })
}


for(let i = 0; i < VerificationNewsItems.length; i++) {
   
    VerificationNewsItems[i].children[2].children[1].children[1].children[0].addEventListener('click', () => {

        let UpdateVerificationDataArr = [];
        let UpdateVerificationDataJson;

        let IdVerification = VerificationNewsItems[i].children[0].children[0].innerHTML;

        UpdateVerificationDataArr.push(IdVerification);

        UpdateVerificationDataJson = JSON.stringify(UpdateVerificationDataArr);
        console.log(UpdateVerificationDataJson);
        fetch('/deletePost', {
            method: 'DELETE',
            body: UpdateVerificationDataJson,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then((res)=>{
            if(res.status==404){
                window.location.href='/reg'
            }
            location.reload();

        })
    })
}