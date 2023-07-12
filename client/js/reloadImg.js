function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah')
                .attr('src', e.target.result)
        };

        reader.readAsDataURL(input.files[0]);
    }
}


setTimeout(function() {
    $('#mydiv5').fadeOut('fast');
}, 3000);

setTimeout(function() {
    $('#mydiv6').fadeOut('fast');
}, 3000);

setTimeout(function() {
    $('#mydiv7').fadeOut('fast');
}, 3000);