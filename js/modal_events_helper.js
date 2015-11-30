function PitacoModalEventsHelper(centralProject) {
  if(centralProject && centralProject.detailImg)
    $("#img-project-detail").attr("src", centralProject.detailImg);
};

PitacoModalEventsHelper.prototype.displayUploadedImage = function(fileInput) {
  var nFiles = fileInput.files.length;
  if(nFiles == 0) return;
  var theFile = fileInput.files[nFiles-1];
  var reader = new FileReader();
  reader.onload = function (e) { this.displaySharedImage(e.target.result); }.bind(this);
  reader.readAsDataURL(theFile);
}

PitacoModalEventsHelper.prototype.displaySharedImage = function(imageUrl) {
  var newDiv = $("<div class='uploaded-div'/>");
  var removeImage = $("<div class='content-remove'><img src='img/close_icon.png'/></div>");
  newDiv.append(removeImage);
  newDiv.append($("<img class='uploaded-content' />").attr("src", imageUrl));
  removeImage.click(function() {
    newDiv.remove();
    $(fileInput).wrap('<form>').closest('form').get(0).reset();
  });
  $('#uploaded-images').append(newDiv);
}

PitacoModalEventsHelper.prototype.displaySharedVideo = function(videoId) {
  var iFrame = $("<iframe src='https://www.youtube.com/embed/" + videoId + "' frameborder='0' allowfullscreen></iframe>");
  var newDiv = $("<div class='uploaded-div'/>");
  var removeVideo = $("<div class='content-remove'><img src='img/close_icon.png'/></div>");
  newDiv.append(removeVideo);
  newDiv.append(iFrame);
  removeVideo.click(function() { newDiv.remove(); });
  $('#uploaded-videos').append(newDiv);
}

PitacoModalEventsHelper.prototype.getVideoId = function(videoUrl) {
  var preVersionTag = "watch?v=";
  var indexOfPreVersion = videoUrl.indexOf(preVersionTag);
  if(indexOfPreVersion != -1)
    return videoUrl.substring(indexOfPreVersion + preVersionTag.length);
  else
    return videoUrl.substring(videoUrl.lastIndexOf("/") + 1);
}

PitacoModalEventsHelper.prototype.getVideoImageUrl = function(videoUrl) {
  return "http://img.youtube.com/vi/" + this.getVideoId(videoUrl) + "/mqdefault.jpg";
}

PitacoModalEventsHelper.prototype.addPitacoModalEvents = function() {
  var pitacoShareUrl = $("#pitaco-share-url");

  $("#modal-pitaco-share-button").click(function() {
    pitacoShareUrl.toggleClass("hide").val("");
  });

  $("#modal-add-pitaco").on('hidden.bs.modal', function() {
    var self = $(this);
    self.find("#uploaded-images").empty();
    self.find("#uploaded-videos").empty();
    self.find("#pitaco-text-area").html("");
    self.find('#pitaco-add-modal-tags').tagit('removeAll');
  });

  $("#modal-view-pitaco").on('hidden.bs.modal', function() {
    var self = $(this);
    self.find(".modal-body-images").empty();
    self.find(".modal-body-videos").empty();
    self.find(".modal-view-pitaco-tag-area").empty();
  });

  var fileInput = document.getElementById("modal-pitaco-file-input");
  $(fileInput).change(function() { this.displayUploadedImage(fileInput); }.bind(this));

  pitacoShareUrl.keypress(function(e) {
    if(e.which != 13) return; // pressed key was not the enter button
    pitacoShareUrl.addClass("hide");
    var url = pitacoShareUrl.val();
    var img = new Image();
    img.onload =  function() { this.displaySharedImage(url); }.bind(this);
    img.onerror = function() { this.displaySharedVideo(this.getVideoId(url)); }.bind(this);
    img.src = url;
  }.bind(this));
}

PitacoModalEventsHelper.prototype.openPitacoDetailView = function(pitacoInfo, callbackAnswerButton) {
  var modalElement = $("#modal-view-pitaco");
  modalElement.find(".modal-body-text").html(pitacoInfo.text);

  var videos = modalElement.find(".modal-body-videos").empty();
  if(pitacoInfo.videos) pitacoInfo.videos.forEach(function(videoUrl) {
    videos.append($("<iframe src='" + videoUrl + "' frameborder='0' allowfullscreen></iframe>"));
  });

  var images = modalElement.find(".modal-body-images").empty();
  if(pitacoInfo.imgs) pitacoInfo.imgs.forEach(function(imageUrl) {
    images.append($("<img src='" + imageUrl + "' />"));
  });

  var tagArea = modalElement.find(".modal-view-pitaco-tag-area").empty();
  if(pitacoInfo.tags) pitacoInfo.tags.forEach(function(tag) {
    tagArea.append($("<button />", { class: 'btn btn-tag', html: tag, type: "button" }));
  });

  $("#modal-view-pitaco-answer-button").unbind('click').click(function() {
    if(!this.isWaitingToClose) {
      this.isWaitingToClose = true;
      modalElement.one('hidden.bs.modal', function() {
        this.isWaitingToClose = false;
        callbackAnswerButton(pitacoInfo);
      }.bind(this));
      modalElement.modal("hide");
    }
  }.bind(this));

  modalElement.modal("show");
}

PitacoModalEventsHelper.prototype.openModalAddPitaco = function(availableTags, callbackAddPitaco) {
  $("#pitaco-share-url").addClass("hide").val("");
  $('#pitaco-add-modal-tags').tagit({
    placeholderText: "Coloque aqui palavras chaves que definam o seu pitaco",
    availableTags: availableTags
  });
  $("#modal-add-pitaco-button-confirm").unbind('click').click(function() {
    var author = window.loggedUser;
    var text = $("#pitaco-text-area").html();
    var imgs = $("#uploaded-images .uploaded-content").map(function() { return $(this).attr('src'); }).get();
    var videos = $("#uploaded-videos iframe").map(function() { return $(this).attr('src'); }).get();
    var tags = $("#pitaco-add-modal-tags").tagit("assignedTags");
    var newPitacoInfo = { author: author, text: text, imgs: imgs, videos: videos, tags: tags };
    callbackAddPitaco(newPitacoInfo);
    $("#modal-add-pitaco").modal('hide');
  }.bind(this));
  $("#modal-add-pitaco").modal({show: true, backdrop: "static"});
}

PitacoModalEventsHelper.prototype.openProjectDetail = function() {
  $("#modal-project-details").modal("show");
}

$(document).ready(function addPitacoModalEvents() {
  var helper = new PitacoModalEventsHelper();
  helper.addPitacoModalEvents();
});
