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

PitacoDrawerHelper.prototype.drawCircleWithImage = function(element, circleInfo, radius) {
  var uniqueId = "pitaco-net-id-" + (this.idCounter++);
  var circleGroup = element.append("g");
  var clipPath = circleGroup.append("clipPath")
                .attr("id", uniqueId)
                .append("circle")
                      .attr("cx", circleInfo.cx)
                      .attr("cy", circleInfo.cy)
                      .attr("r", radius);
  circleGroup.append("image")
                .attr("x", circleInfo.cx - radius)
                .attr("y", circleInfo.cy - radius)
                .attr("width", 2*radius)
                .attr("height", 2*radius)
                .attr("xlink:href", circleInfo.img)
                .attr("clip-path", "url(#" + uniqueId + ")");
  circleGroup.append("circle")
                .attr("fill", "none")
                .attr("cx", circleInfo.cx)
                .attr("cy", circleInfo.cy)
                .attr("r", radius);
  return circleGroup;
}

PitacoDrawerHelper.prototype.drawSimpleCircle = function(element, circleInfo, radius) {
  return element.append("circle").attr("cx", circleInfo.cx).attr("cy", circleInfo.cy).attr("r", radius);
}

PitacoDrawerHelper.prototype.drawLine = function(element, x1, y1, x2, y2) {
  return element.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
}

PitacoDrawerHelper.prototype.drawText = function(element, textMessage, fontWeight, fontSize) {
  return element.append("text").text(textMessage).attr("font-weight", fontWeight).attr("font-size", fontSize);
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
  this.drawText(element, "Filtros", 500, 17)
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

    this.drawText(element, branchInfo.filterText, 300, 13)
            .attr("x", cx - this.filterTextDistanceX)
            .attr("y", cy + this.branchRadius*3/4)
            .attr("text-anchor", "end");
  }.bind(this));
}

PitacoDrawerHelper.prototype.drawAuthorInfo = function(element, authorInfo) {
  element.selectAll("*").remove();
  element.attr("viewBox", "0 0 262 77");

  this.drawCircleWithImage(element, {cx: 37, cy: 42, img: authorInfo.img}, 33);

  this.drawText(element, authorInfo.name, 500, 18)
            .attr("fill", "#FFFFFF").attr("x", 87).attr("y", 27).attr("style", "cursor: default");

  this.drawText(element, authorInfo.area, 300, 14)
            .attr("fill", "#FFFFFF").attr("x", 87).attr("y", 47).attr("style", "cursor: default");

  var otherProjectsLink = element.append("a").attr("xlink:href", "#");
  this.drawText(otherProjectsLink, "outros projetos", 700, 14)
            .attr("fill", "#3A99D8").attr("x", 87).attr("y", 65);
}

PitacoDrawerHelper.prototype.openPitacoDetailView = function(pitacoInfo) {
  if(!pitacoInfo.author) return;

  this.drawAuthorInfo(d3.select("#modal-view-pitaco-author"), pitacoInfo.author);

  var modalElement = $("#modal-view-pitaco");
  modalElement.find(".modal-body").text(pitacoInfo.text);
  modalElement.modal("show");
}

PitacoDrawerHelper.prototype.drawPitacos = function(branch, pitacos, fatherCx, fatherCy, drawJustLines) {
  if(!pitacos) return;

  pitacos.forEach(function(pitacoInfo) {
    this.drawPitacos(branch, pitacoInfo.pitacos, pitacoInfo.cx, pitacoInfo.cy, drawJustLines);
    if(drawJustLines)
      this.drawLine(branch, fatherCx, fatherCy, pitacoInfo.cx, pitacoInfo.cy);
    else
      this.drawCircleWithImage(branch, pitacoInfo, this.pitacoRadius)
          .attr("class", "pitaco-circle")
          .on("click", function() { this.openPitacoDetailView(pitacoInfo); }.bind(this));
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
