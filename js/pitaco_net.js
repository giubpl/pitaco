function PitacoDrawerHelper(projectName) {
  this.centralRadius = 40;
  this.branchRadius = 8;
  this.pitacoRadius = 15;
  this.filterMarginX = 30;
  this.filterMarginY = 25;
  this.filterButtonsIncreaseY = 50;
  this.filterTextDistanceX = 25;
  this.centralProject = window.projectNet[projectName].centralProject;
  this.branches = window.projectNet[projectName].branches;
  this.idCounter = 0;
  this.activeBranchId = "";
}

PitacoDrawerHelper.prototype.getUniqueid = function() {
  return "pitaco-net-id-" + (this.idCounter++);
}

PitacoDrawerHelper.prototype.drawSimpleCircle = function(element, circleInfo, radius) {
  return element.append("circle").attr("cx", circleInfo.cx).attr("cy", circleInfo.cy).attr("r", radius);
}

PitacoDrawerHelper.prototype.drawCircleWithImage = function(element, circleInfo, radius) {
  var uniqueId = this.getUniqueid();
  var circleGroup = element.append("g");
  this.drawSimpleCircle(circleGroup.append("clipPath").attr("id", uniqueId), circleInfo, radius);
  circleGroup.append("image").attr("xlink:href", circleInfo.img)
                .attr("x", circleInfo.cx - radius).attr("y", circleInfo.cy - radius)
                .attr("height", 2*radius).attr("width", 2*radius)
                .attr("preserveAspectRatio", "none")
                .attr("clip-path", "url(#" + uniqueId + ")");
  this.drawSimpleCircle(circleGroup, circleInfo, radius).attr("fill", "none");
  return circleGroup;
}

PitacoDrawerHelper.prototype.drawLine = function(element, x1, y1, x2, y2) {
  return element.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
}

PitacoDrawerHelper.prototype.drawText = function(element, textMessage, fontWeight, fontSize, fill, keepCursor) {
  var text = element.append("text").text(textMessage).attr("font-weight", fontWeight).attr("font-size", fontSize).attr("fill", fill);
  if(!keepCursor) text.attr("style", "cursor: default");
  return text;
}

PitacoDrawerHelper.prototype.drawButton = function(element, fill, text, fontWeight, fontSize, hasHover) {
  element.selectAll("*").remove();
  var rect = element.append("rect")
                .attr("rx", 3).attr("ry", 3)
                .attr("width", "100%").attr("height", "100%")
                .attr("fill", fill);
  if(hasHover) {
    element.style("cursor", "pointer");
    element.style("opacity", "0.9");
    element.on("mouseover", function() { element.style("opacity", "1");});
    element.on("mouseout", function() { element.style("opacity", "0.9");});
  }
  this.drawText(element, text, fontWeight, fontSize, "#FFFFFF", hasHover)
                .attr("x", "50%").attr("y", "50%")
                .attr("alignment-baseline", "central").attr("text-anchor", "middle");
}

PitacoDrawerHelper.prototype.switchActiveBranch = function(newActiveBranchId) {
  if(this.activeBranchId) {
    d3.select("#" + this.activeBranchId).classed("active-display", false);
    d3.select("#button-filter-" + this.activeBranchId).classed("active-display", false);
  }
  if(newActiveBranchId == this.activeBranchId) {
    this.activeBranchId = "";
    d3.select("#pitaco-tree").classed("filters-activated", false);
  }
  else {
    this.activeBranchId = newActiveBranchId;
    d3.select("#" + this.activeBranchId).classed("active-display", true);
    d3.select("#button-filter-" + this.activeBranchId).classed("active-display", true);
    d3.select("#pitaco-tree").classed("filters-activated", true);
  }
}

PitacoDrawerHelper.prototype.drawFilters = function(element) {
  element.selectAll("*").remove();

  var cx = 1000 - this.filterMarginX, cy = this.filterMarginY;
  this.drawText(element, "Filtros", 500, 17, "#FFFFFF")
            .attr("x", cx + this.branchRadius)
            .attr("y", cy)
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "text-before-edge");

  var lastcy = cy + (this.branches.length) * this.filterButtonsIncreaseY;
  this.drawLine(element, cx, cy + this.filterButtonsIncreaseY, cx, lastcy)
            .attr("id", "branch-filter-line");

  this.branches.forEach(function drawFilter(branchInfo, index) {
    cy += this.filterButtonsIncreaseY;
    this.drawLine(element, cx, cy, cx, cy)
            .attr("class", "branch-filter-button")
            .attr("id", "button-filter-"+branchInfo.id)
            .attr("stroke", branchInfo.color)
            .on("click", function() { this.switchActiveBranch(branchInfo.id) }.bind(this));
    this.drawText(element, branchInfo.filterText, 300, 13, "#FFFFFF")
            .attr("x", cx - this.filterTextDistanceX)
            .attr("y", cy + this.branchRadius*3/4)
            .attr("text-anchor", "end");
  }.bind(this));
}

PitacoDrawerHelper.prototype.drawAuthorInfo = function(element, authorInfo) {
  element.selectAll("*").remove();
  element.attr("viewBox", "0 0 262 77");
  this.drawCircleWithImage(element, {cx: 37, cy: 42, img: authorInfo.img}, 33);
  this.drawText(element, authorInfo.name, 500, 18, "#FFFFFF").attr("x", 87).attr("y", 27);
  this.drawText(element, authorInfo.area, 300, 14, "#FFFFFF").attr("x", 87).attr("y", 47);
  var otherProjectsLink = element.append("a").attr("xlink:href", "#");
  this.drawText(otherProjectsLink, "outros projetos", 700, 14, "#3A99D8", true).attr("x", 87).attr("y", 65);
}

PitacoDrawerHelper.prototype.getVideoId = function(videoUrl) {
  var preVersionTag = "watch?v=";
  var indexOfPreVersion = videoUrl.indexOf(preVersionTag);
  if(indexOfPreVersion != -1)
    return videoUrl.substring(indexOfPreVersion + preVersionTag.length);
  else
    return videoUrl.substring(videoUrl.lastIndexOf("/") + 1);
}

PitacoDrawerHelper.prototype.openPitacoDetailView = function(pitacoInfo) {
  if(!pitacoInfo.author) return;

  this.drawAuthorInfo(d3.select("#modal-view-pitaco-author"), pitacoInfo.author);

  var modalElement = $("#modal-view-pitaco");
  modalElement.find(".modal-body-text").text(pitacoInfo.text);
  if(pitacoInfo.video) {
    var videos = modalElement.find(".modal-body-videos").empty();
    if(!Array.isArray(pitacoInfo.video)) pitacoInfo.video = [ pitacoInfo.video ];
    pitacoInfo.video.forEach(function(url) {
      var videoId = this.getVideoId(url);
      var iFrameTag = $("<iframe src='https://www.youtube.com/embed/" + videoId + "' frameborder='0' allowfullscreen></iframe>");
      videos.append(iFrameTag);
    }.bind(this));
  }
  if(pitacoInfo.img != pitacoInfo.author.img) {
    var images = modalElement.find(".modal-body-images").empty();
    if(pitacoInfo.img) {
      if(!Array.isArray(pitacoInfo.img)) pitacoInfo.img = [ pitacoInfo.img ];
      pitacoInfo.img.forEach(function(img) { images.append($("<img src='" + img + "' />")); });
    }
  }

  var tagArea = modalElement.find(".modal-view-pitaco-tag-area").empty();
  if(pitacoInfo.tags) pitacoInfo.tags.forEach(function(tag) {
    var newButton = $("<button />", { class: 'btn btn-xs', html: tag, type: "button" })
          .css("background-color", "#111111").css("color", "#FFFFFF")
          .css("font-weight", 300).css("font-size", "10px")
          .css("margin-left", "3px").css("cursor", "default");
    tagArea.append(newButton);
  }.bind(this));
  modalElement.modal("show");
}

PitacoDrawerHelper.prototype.drawPitacos = function(branch, pitacos, fatherCx, fatherCy, drawJustLines) {
  if(!pitacos) return;

  pitacos.forEach(function(pitacoInfo) {
    this.drawPitacos(branch, pitacoInfo.pitacos, pitacoInfo.cx, pitacoInfo.cy, drawJustLines);
    if(drawJustLines)
      this.drawLine(branch, fatherCx, fatherCy, pitacoInfo.cx, pitacoInfo.cy);
    else {
      var circleInfo = { cx: pitacoInfo.cx, cy: pitacoInfo.cy, img: pitacoInfo.img };
      var img = circleInfo.img;
      var video = pitacoInfo.video;
      if(Array.isArray(video)) video = video[0];
      if(video) img = "http://img.youtube.com/vi/" + this.getVideoId(video) + "/mqdefault.jpg";
      if(Array.isArray(img)) img = img[0];
      if(!img && pitacoInfo.author) img = pitacoInfo.author.img;
      circleInfo.img = img;
      this.drawCircleWithImage(branch, circleInfo, this.pitacoRadius)
          .attr("class", "pitaco-circle")
          .on("click", function() { this.openPitacoDetailView(pitacoInfo); }.bind(this));
    }
  }.bind(this))
}

PitacoDrawerHelper.prototype.drawBranch = function(element, branchInfo, styles) {
  var branch = element.append("g").attr("id", branchInfo.id);
  this.drawLine(branch, this.centralProject.cx, this.centralProject.cy, branchInfo.cx, branchInfo.cy);
  this.drawPitacos(branch, branchInfo.pitacos, branchInfo.cx, branchInfo.cy, true);
  this.drawSimpleCircle(branch, branchInfo, this.branchRadius);
  this.drawPitacos(branch, branchInfo.pitacos, branchInfo.cx, branchInfo.cy, false);
  styles.push("#" + branchInfo.id + ":hover, #" + branchInfo.id + ".active-display");
  styles.push("{fill:" + branchInfo.color + "; stroke:" + branchInfo.color + ";}");
}

PitacoDrawerHelper.prototype.drawPitacoTree = function(element) {
  element.selectAll("*").remove();
  var styles = [];
  this.branches.forEach(function(branchInfo) { this.drawBranch(element, branchInfo, styles); }.bind(this));
  element.append("style").text(styles.join(""));
  this.drawCircleWithImage(element, this.centralProject, this.centralRadius).attr("id", "net-central");
}

PitacoDrawerHelper.prototype.updateProjectInfo = function() {
  d3.select("#project-info-image").attr("xlink:href", this.centralProject.img);
  d3.select("#project-info-name").text(this.centralProject.name);
  d3.select("#button-seguir").on("click", function() {
    var self = d3.select(this);
    self.classed("active-display", !self.classed("active-display"));
  });
}

PitacoDrawerHelper.prototype.drawPitacoNet = function() {
  this.drawPitacoTree(d3.select("#pitaco-tree"));
  this.drawFilters(d3.select("#pitaco-net-filters"));
  this.drawAuthorInfo(d3.select("#pitaco-net-project-author"), this.centralProject.author);
  this.drawButton(d3.select("#button-dar-pitaco"), "#3498DB", "Dar pitaco", 700, 15, true);
  this.updateProjectInfo();
}

PitacoDrawerHelper.prototype.addZoomerBehaviour = function() {
  var svg = d3.select("#pitaco-net-svg");
  var zoom_group = d3.select("#pitaco-net-zoom-group");
  var zoomer = d3.behavior.zoom().scaleExtent([0.1,10]).on("zoom", function() {
    zoom_group.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
  });
  svg.call(zoomer)
      .on("dblclick.zoom", null)
      //FIXME: this is a hack! Remove when development is finished
      .on("dblclick", function() {
          if(!d3.event.shiftKey)
            return;
          var pt = svg.node().createSVGPoint();
          pt.x = d3.event.x; pt.y = d3.event.y;
          pt = pt.matrixTransform(svg.node().getScreenCTM().inverse());
          alert("cx=" + (pt.x-50) + " cy=" + (pt.y+80));
      });
}

$(document).ready(function() {
  var drawer = new PitacoDrawerHelper("pitaco");
  drawer.drawPitacoNet();
  drawer.addZoomerBehaviour();
});
