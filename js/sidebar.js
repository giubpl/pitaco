$(document).ready(function() {

  var sidebar_container = $("#sidebar-container");
  var expand_collapse_div = $("#sidebar-expand-collapse");

  expand_collapse_div.click(function() {
    if(expand_collapse_div.hasClass("collapse-display")) {
      expand_collapse_div.removeClass("collapse-display").addClass("expand-display");
      sidebar_container.removeClass("sidebar-container-bigger").addClass("sidebar-container-smaller");
    }
    else {
      expand_collapse_div.removeClass("expand-display").addClass("collapse-display");
      sidebar_container.removeClass("sidebar-container-smaller").addClass("sidebar-container-bigger");
    }
  });

});
