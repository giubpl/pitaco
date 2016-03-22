$(document).ready(function() {

  var availableProjects = [
    "pitaco", "allergio"
    /*
    "pitaco", "allergio",
    "japanTales",
    "urbanHeroes", "redesignNatGeo", "cepi",
    "redesignGooglePlay", "vid", "id"
    */
  ];

  var cardDrawerHelper = new CardDrawerHelper();
  for (var i = 0; i < availableProjects.length; i++) {
    cardDrawerHelper.addCardToInitialPage(availableProjects[i]);
  }

  $('.link-to-initial-page').click(function(e) {
    e.preventDefault();
    $('#page-tab-activator a[href="#initial-page"]').tab("show");
  });

  var randomNumber = 1 + ((Math.random() * 4) | 0); //numero aleatorio entre 1 (inclusive) e 4 (inclusive)
  $("#logo-top-menu").attr("src", "img/logos/logo_0" + randomNumber + ".svg");

  $("#sidebar-profile-name").text(window.loggedUser.name);
  $("#sidebar-profile-image").attr("src", window.loggedUser.img);

});
