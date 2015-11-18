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
  this.activeBranchName = "";
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

PitacoDrawerHelper.prototype.switchActiveBranch = function(newActiveBranchName) {
  if(this.activeBranchName) {
    d3.select("#" + this.activeBranchName).classed("active-display", false);
    d3.select("#button-filter-" + this.activeBranchName).classed("active-display", false);
  }
  if(newActiveBranchName == this.activeBranchName) {
    this.activeBranchName = "";
    d3.select("#pitaco-tree").classed("filters-activated", false);
  }
  else {
    this.activeBranchName = newActiveBranchName;
    d3.select("#" + this.activeBranchName).classed("active-display", true);
    d3.select("#button-filter-" + this.activeBranchName).classed("active-display", true);
    d3.select("#pitaco-tree").classed("filters-activated", true);
  }
}

PitacoDrawerHelper.prototype.drawFilters = function() {
  var filtersArea = d3.select("#pitaco-net-filters");
  filtersArea.html("");

  var cx = 1000 - this.filterMarginX, cy = this.filterMarginY;
  filtersArea.append("text")
            .attr("font-weight", 500)
            .attr("font-size", "17px")
            .attr("x", cx + this.branchRadius)
            .attr("y", cy)
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "text-before-edge")
            .text("Filtros");

  var lastcy = cy + (this.branches.length) * this.filterButtonsIncreaseY;
  this.drawLine(filtersArea, cx, cy + this.filterButtonsIncreaseY, cx, lastcy).attr("id", "branch-filter-line");

  this.branches.forEach(function drawFilter(branchInfo, index) {
    cy += this.filterButtonsIncreaseY;
    this.drawLine(filtersArea, cx, cy, cx, cy)
            .attr("class", "branch-filter-button")
            .attr("id", "button-filter-"+branchInfo.name)
            .attr("stroke", branchInfo.color)
            .on("click", function() {
                this.switchActiveBranch(branchInfo.name)
            }.bind(this));

    filtersArea.append("text")
            .attr("font-weight", 300)
            .attr("font-size", "13px")
            .attr("x", cx - this.filterTextDistanceX)
            .attr("y", cy + this.branchRadius*3/4)
            .attr("text-anchor", "end")
            .text(branchInfo.filterText);
  }.bind(this));
}

PitacoDrawerHelper.prototype.drawPitacoNet = function() {
  var pitacoTree = d3.select("#pitaco-tree");
  pitacoTree.html("");

  var styles = [];
  this.branches.forEach(function drawBranch(branchInfo) {

    var branch = pitacoTree.append("g").attr("id", branchInfo.name);
    this.drawSimpleCircle(branch, branchInfo, this.branchRadius);
    this.drawLine(branch, this.centralProject.cx, this.centralProject.cy, branchInfo.cx, branchInfo.cy);

    styles.push("#" + branchInfo.name + ":hover, #" + branchInfo.name + ".active-display");
    styles.push("{fill:" + branchInfo.color + "; stroke:" + branchInfo.color + ";}");

    branchInfo.pitacos.forEach(function drawPitaco(pitacoInfo) {
      this.drawLine(branch, branchInfo.cx, branchInfo.cy, pitacoInfo.cx, pitacoInfo.cy);
      this.drawCircleWithImage(branch, pitacoInfo, this.pitacoRadius).attr("class", "pitaco-circle");
    }.bind(this));

  }.bind(this));

  pitacoTree.append("style").text(styles.join(""));
  this.drawCircleWithImage(pitacoTree, this.centralProject, this.centralRadius).attr("id", "net-central");
}

PitacoDrawerHelper.prototype.addZoomerBehaviour = function() {
  var svg = d3.select("#pitaco-net-svg");
  var box = svg.node().getBBox();
  var xScale = d3.scale.linear().domain([0, box.width]).range([0, box.width]);
  var yScale = d3.scale.linear().domain([0, box.height]).range([0,box.height]);

  var zoom_group = d3.select("#pitaco-net-zoom-group");
  var zoomer = d3.behavior.zoom()
                  .scaleExtent([0.1,10])
                  .x(xScale)
                  .y(yScale)
                  .on("zoom", function() {
                    zoom_group.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
                  });

  svg.call(zoomer)
      .on("dblclick.zoom", null)
      //FIXME: this is a hack! Remove when development is finished
      .on("dblclick", function() {
          var pt = svg.node().createSVGPoint();
          pt.x = d3.event.x; pt.y = d3.event.y;
          pt = pt.matrixTransform(svg.node().getScreenCTM().inverse());
          alert("cx=" + (pt.x-50) + " cy=" + (pt.y+80));
      });
}

$(document).ready(function() {
  var drawer = new PitacoDrawerHelper("pitaco");
  drawer.drawPitacoNet();
  drawer.drawFilters();
  drawer.addZoomerBehaviour();

  var buttonSeguir = d3.select("#button-seguir");
  buttonSeguir.on("click", function() {
    buttonSeguir.classed("active-display", !buttonSeguir.classed("active-display"));
  });
});
