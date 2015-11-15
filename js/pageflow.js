var PageFlow = {
  setMainPage: function(name) {
    $('#page-tab-activator a[href="#'+name+'"]').tab("show");
  }
};

$(document).ready(function() {

  PageFlow.setMainPage("pitaco-net");

});
