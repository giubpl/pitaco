$(document).ready(function() {

  $(".top-buttons-area .normal-display").click(function(e) {
    if($(this).hasClass("normal-display"))
      $(this).removeClass("normal-display").addClass("active-display");
    else
      $(this).removeClass("active-display").addClass("normal-display");
  });

});
