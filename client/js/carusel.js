    /*------------------------
        Latest Review Slider
    --------------------------*/
    $(".custom-carousel").owlCarousel({
      loop: true,
      margin: 0,
      items: 4,
      dots: true,
      smartSpeed: 1200,
      autoHeight: false,
      dotsEach: 2,
      autoplay: true,
      responsive: {
          320: {
              items: 1
          },
          480: {
              items: 2
          },
          768: {
              items: 3
          },
          992: {
              items: 4
          }
      }
  });