var PageFlow = {
  setMainPage: function(name) {
    $("#page-container").load(name+".html");
    $("#main-page-stylesheet").attr("href", "css/"+name+".css");
  }
};

$(document).ready(function() {

  PageFlow.setMainPage("pitaco_net");

});
