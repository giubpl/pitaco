$(document).ready(function() {
  var sidebar_container = $("#sidebar-container");

  $("#sidebar-close-div").click(function(e) {
    sidebar_container.removeClass("sidebar-container-bigger").addClass("sidebar-container-smaller");
    e.stopPropagation();
  });

  sidebar_container.click(function(e) {
    if($(e.target).closest('a').length
      || !sidebar_container.hasClass("sidebar-container-smaller"))
      return;

    sidebar_container.removeClass("sidebar-container-smaller").addClass("sidebar-container-bigger");
  });

});
