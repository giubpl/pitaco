$(document).ready(function() {

  $('#initial-page img').click(function() {
    /*
    var drawer = new PitacoDrawerHelper();
    drawer.centralProject.img = $(this).attr("src");
    drawer.drawPitacoNet();
    */
    $('#page-tab-activator a[href="#pitaco-net"]').tab("show");
  });

  $('.link-to-initial-page').click(function(e) {
    e.preventDefault();
    $('#page-tab-activator a[href="#initial-page"]').tab("show");
  });

  var randomNumber = 1 + ((Math.random() * 4) | 0); //numero aleatorio entre 1 (inclusive) e 4 (inclusive)
  $("#logo-top-menu").attr("src", "img/logos/logo_0" + randomNumber + ".svg");

});
