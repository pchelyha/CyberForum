

'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");
    });

})(jQuery);


setTimeout(function() {
    $('#mydiv3').fadeOut('fast');
}, 3000);

setTimeout(function() {
    $('#mydiv4').fadeOut('fast');
}, 3000);