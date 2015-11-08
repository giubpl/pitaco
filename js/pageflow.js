var PageFlow = {
  setMainPage: function(name) {
    $("#main-page").load(name+".html");
    $("#main-page-stylesheet").attr("href", "css/"+name+".css");
  }
};

$(document).ready(function() {

  PageFlow.setMainPage("initial_page");
  
});
