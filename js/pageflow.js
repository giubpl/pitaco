var PageFlow = {
  setMainPage: function(name) {
    $("#page-container").load(name+".html");
  }
};

$(document).ready(function() {

  PageFlow.setMainPage("pitaco_net");

});
