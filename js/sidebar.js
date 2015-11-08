$(document).ready(function() {

  var container = $("#sidebar-and-page-container");
  var expand_collapse_div = $("#sidebar-expand-collapse");

  expand_collapse_div.click(function() {
    if(expand_collapse_div.hasClass("collapse-display")) {
      expand_collapse_div.removeClass("collapse-display").addClass("expand-display");
      container.removeClass("sidebar-container-bigger").addClass("sidebar-container-smaller");
    }
    else {
      expand_collapse_div.removeClass("expand-display").addClass("collapse-display");
      container.removeClass("sidebar-container-smaller").addClass("sidebar-container-bigger");
    }
  });

});
