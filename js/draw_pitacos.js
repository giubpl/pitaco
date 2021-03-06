function PitacoDrawerHelper(projectId) {
  var projectInfo = window.projectNet[projectId];

  this.centralProject = projectInfo.centralProject;

  if (this.centralProject.detailImg)
    $("#img-project-detail").attr("src", this.centralProject.detailImg);

  this.availableTagsDict = {};
  for(var i=0; i < this.centralProject.availableTags.length; i++)
    this.availableTagsDict[this.centralProject.availableTags[i]] = true;

  this.branches = projectInfo.branches;
  this.activeBranchId = "";
  this.isAddPitacoMode = false;
}

PitacoDrawerHelper.prototype.centralRadius = 40;
PitacoDrawerHelper.prototype.branchRadius = 8;
PitacoDrawerHelper.prototype.pitacoRadius = 15;
PitacoDrawerHelper.prototype.filterMarginX = 30;
PitacoDrawerHelper.prototype.filterMarginY = 25;
PitacoDrawerHelper.prototype.filterButtonsIncreaseY = 50;
PitacoDrawerHelper.prototype.filterTextDistanceX = 25;
PitacoDrawerHelper.prototype.modalEventsHelper = new PitacoModalEventsHelper();
PitacoDrawerHelper.prototype.svgDrawerHelper = new SVGDrawerHelper();

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
  this.svgDrawerHelper.drawText(element, "Filtros", 500, 17, "#FFFFFF")
            .attr("x", cx + this.branchRadius)
            .attr("y", cy)
            .attr("text-anchor", "end")
            .attr("alignment-baseline", "text-before-edge");

  var lastcy = cy + (this.branches.length) * this.filterButtonsIncreaseY;
  this.svgDrawerHelper.drawLine(element, cx, cy + this.filterButtonsIncreaseY, cx, lastcy)
            .attr("id", "branch-filter-line");

  this.branches.forEach(function(branchInfo, index) {
    cy += this.filterButtonsIncreaseY;
    this.svgDrawerHelper.drawLine(element, cx, cy, cx, cy)
            .attr("class", "branch-filter-button")
            .attr("id", "button-filter-"+branchInfo.id)
            .attr("stroke", branchInfo.color)
            .on("click", function() { this.switchActiveBranch(branchInfo.id) }.bind(this));
    this.svgDrawerHelper.drawText(element, branchInfo.filterText, 300, 13, "#FFFFFF")
            .attr("x", cx - this.filterTextDistanceX)
            .attr("y", cy + this.branchRadius*3/4)
            .attr("text-anchor", "end");
  }.bind(this));
}

PitacoDrawerHelper.prototype.drawAuthorInfo = function(element, authorInfo) {
  element.selectAll("*").remove();
  element.attr("viewBox", "0 0 262 77");
  this.svgDrawerHelper.drawCircleWithImage(element, {cx: 37, cy: 42, img: authorInfo.img}, 33);
  this.svgDrawerHelper.drawText(element, authorInfo.name, 500, 18, "#FFFFFF").attr("x", 87).attr("y", 27);
  this.svgDrawerHelper.drawText(element, authorInfo.area, 300, 14, "#FFFFFF").attr("x", 87).attr("y", 47);
  var link = element.append("a").attr("xlink:href", "#");
  this.svgDrawerHelper.drawText(link, "outros projetos", 700, 14, "#3A99D8", true).attr("x", 87).attr("y", 65);
}

PitacoDrawerHelper.prototype.getCircleImg = function(pitacoInfo) {
  if(pitacoInfo.videos && pitacoInfo.videos.length > 0)
    return this.modalEventsHelper.getVideoImageUrl(pitacoInfo.videos[0]);
  else if(pitacoInfo.imgs && pitacoInfo.imgs.length > 0)
    return pitacoInfo.imgs[0];
  else
    return pitacoInfo.author ? pitacoInfo.author.img : null;
}

PitacoDrawerHelper.prototype.getBranchTransform = function(branchInfo) {
  var attr = "";
  attr += "translate(" + [branchInfo.variationX, branchInfo.variationY] + ")";

  function getAngle(ox, oy, px, py) { return (Math.atan2(px - ox, py - oy) * 180) / Math.PI; }
  var oldAngle = getAngle(this.centralProject.cx, this.centralProject.cy, branchInfo.cx, branchInfo.cy);
  var newAngle = getAngle(this.centralProject.cx, this.centralProject.cy,
                              branchInfo.cx + branchInfo.variationX, branchInfo.cy + branchInfo.variationY)

  branchInfo.rotationAngle = oldAngle - newAngle;
  attr += "rotate(" + [branchInfo.rotationAngle, branchInfo.cx, branchInfo.cy] + ")";
  return attr;
}

PitacoDrawerHelper.prototype.getPitacoTransform = function(pitacoInfo) {
  return "translate(" + [pitacoInfo.variationX, pitacoInfo.variationY] + ")"
          + "rotate(" + [-pitacoInfo.parentBranchInfo.rotationAngle, pitacoInfo.cx, pitacoInfo.cy] + ")";
}

PitacoDrawerHelper.prototype.addDragBehaviourToPitaco = function(pitacoGroup, pitacoInfo) {
  pitacoGroup.call(d3.behavior.drag()
          .on("dragstart", function() { d3.event.sourceEvent.stopPropagation(); })
          .on("drag", function() {
              pitacoInfo.variationX = d3.event.x - pitacoInfo.cx;
              pitacoInfo.variationY = d3.event.y - pitacoInfo.cy;
              pitacoGroup.attr("transform", this.getPitacoTransform(pitacoInfo));
              pitacoInfo.parentLine.attr("x2", d3.event.x).attr("y2", d3.event.y);
              if(pitacoInfo.pitacos) pitacoInfo.pitacos.forEach(function(child) {
                child.parentLine.attr("x1", d3.event.x).attr("y1", d3.event.y);
              })
          }.bind(this))
      );
}

PitacoDrawerHelper.prototype.updatePitacosTransform = function(pitacos) {
  if(pitacos) pitacos.forEach(function(pitaco) {
    pitaco.pitacoGroup.attr("transform", this.getPitacoTransform(pitaco));
    this.updatePitacosTransform(pitaco.pitacos);
  }.bind(this))
}

PitacoDrawerHelper.prototype.addDragBehaviourToBranch = function(brachGroup, branchInfo) {
  brachGroup.call(d3.behavior.drag()
          .on("dragstart", function() { d3.event.sourceEvent.stopPropagation(); })
          .on("drag", function() {
              branchInfo.variationX = d3.event.x - branchInfo.cx;
              branchInfo.variationY = d3.event.y - branchInfo.cy;
              brachGroup.attr("transform", this.getBranchTransform(branchInfo));
              branchInfo.parentLine.attr("x2", d3.event.x).attr("y2", d3.event.y);
              this.updatePitacosTransform(branchInfo.pitacos);
          }.bind(this))
      );
}

PitacoDrawerHelper.prototype.drawPitacos = function(branchInfo, branchGroup, pitacos,
                                                      fatherCx, fatherCy, drawJustLines) {
  if(!pitacos) return;

  pitacos.forEach(function(pitacoInfo) {
    pitacoInfo.parentBranchInfo = branchInfo;
    pitacoInfo.variationX = pitacoInfo.variationX || 0;
    pitacoInfo.variationY = pitacoInfo.variationY || 0;

    this.drawPitacos(branchInfo, branchGroup, pitacoInfo.pitacos,
        pitacoInfo.cx + pitacoInfo.variationX, pitacoInfo.cy + pitacoInfo.variationY, drawJustLines);

    if(drawJustLines)
      pitacoInfo.parentLine = this.svgDrawerHelper.drawLine(
        branchGroup, fatherCx, fatherCy,
        pitacoInfo.cx + pitacoInfo.variationX, pitacoInfo.cy + pitacoInfo.variationY
      );
    else {
      var circleInfo = { cx: pitacoInfo.cx, cy: pitacoInfo.cy, img: this.getCircleImg(pitacoInfo) };

      var pitacoGroup = this.svgDrawerHelper.drawCircleWithImage(branchGroup, circleInfo, this.pitacoRadius)
          .attr("class", "pitaco-circle")
          .attr("transform", this.getPitacoTransform(pitacoInfo))
          .on("click", function() {
            if(d3.event.defaultPrevented) return;
            if(this.isAddPitacoMode) {
              this.openModalAddPitacoWithSource(pitacoInfo);
            }
            else if(pitacoInfo.author) {
              this.drawAuthorInfo(d3.select("#modal-view-pitaco-author"), pitacoInfo.author);
              this.modalEventsHelper.openPitacoDetailView(
                pitacoInfo, this.openModalAddPitacoWithSource.bind(this)
              );
            }
          }.bind(this));

      pitacoInfo.pitacoGroup = pitacoGroup;
      this.addDragBehaviourToPitaco(pitacoGroup, pitacoInfo);
    }
  }.bind(this));
}

PitacoDrawerHelper.prototype.drawBranch = function(element, branchInfo, styles) {
  branchInfo.variationX = branchInfo.variationX || 0;
  branchInfo.variationY = branchInfo.variationY || 0;
  var branch = element.append("g").attr("id", branchInfo.id);
  branchInfo.parentLine = this.svgDrawerHelper.drawLine(branch,
    this.centralProject.cx, this.centralProject.cy, branchInfo.cx + branchInfo.variationX, branchInfo.cy + branchInfo.variationY);
  var draggableGroup = branch.append("g").attr("transform", this.getBranchTransform(branchInfo));
  this.addDragBehaviourToBranch(draggableGroup, branchInfo);

  this.drawPitacos(branchInfo, draggableGroup, branchInfo.pitacos, branchInfo.cx, branchInfo.cy, true);
  var branchImage = this.svgDrawerHelper.drawSimpleCircle(draggableGroup, branchInfo, this.branchRadius)
      .on("click", function() {
        if(d3.event.defaultPrevented) return;
        if(this.isAddPitacoMode) this.openModalAddPitacoWithSource(branchInfo);
      }.bind(this));
  this.drawPitacos(branchInfo, draggableGroup, branchInfo.pitacos, branchInfo.cx, branchInfo.cy, false);
  styles.push("#" + branchInfo.id + ":hover, #" + branchInfo.id + ".active-display");
  styles.push("{fill:" + branchInfo.color + "; stroke:" + branchInfo.color + ";}");
}

PitacoDrawerHelper.prototype.drawPitacoTree = function(element) {
  element.selectAll("*").remove();
  var styles = [];
  this.branches.forEach(function(branchInfo) { this.drawBranch(element, branchInfo, styles); }.bind(this));
  element.append("style").text(styles.join(""));
  this.svgDrawerHelper.drawCircleWithImage(element, this.centralProject, this.centralRadius).attr("id", "net-central")
      .on("click", function() {
        if(d3.event.defaultPrevented) return;
        this.modalEventsHelper.openProjectDetail();
      }.bind(this));
}

PitacoDrawerHelper.prototype.updateProjectInfo = function() {
  d3.select("#project-info-image").attr("xlink:href", this.centralProject.img);
  d3.select("#project-info-name").text(this.centralProject.name);
  d3.select("#button-seguir").on("click", function() {
    var self = d3.select(this);
    if(self.classed("btn-primary")) {
      self.classed("btn-primary", false);
      self.classed("btn-success", true);
      d3.select("#group-button-seguir").style("display", "none");
      setTimeout(function() { d3.select("#group-button-seguir").style("display", "block"); }, 0);
    } else {
      self.classed("btn-primary", true);
      self.classed("btn-success", false);
      d3.select("#group-button-seguir").style("display", "none");
      setTimeout(function() { d3.select("#group-button-seguir").style("display", "block"); }, 0);
    }
  });
  d3.select("#group-button-seguir").on("mouseenter", function() {
    var self = d3.select(this);
    self.style("display", "none");
    self.style("display", "block");
  }).on("mouseleave", function() {
    var self = d3.select(this);
    self.style("display", "none");
    self.style("display", "block");
  });
}

PitacoDrawerHelper.prototype.drawPitacoNet = function() {
  this.drawPitacoTree(d3.select("#pitaco-tree"));
  this.drawFilters(d3.select("#pitaco-net-filters"));
  this.drawAuthorInfo(d3.select("#pitaco-net-project-author"), this.centralProject.author);
  this.updateProjectInfo();
  this.drawAddPitacoButton();
}

PitacoDrawerHelper.prototype.addZoomerBehaviour = function() {
  var svg = d3.select("#pitaco-net-svg");
  var zoom_group = d3.select("#pitaco-net-zoom-group");
  var zoomer = d3.behavior.zoom().scaleExtent([0.1,10]).on("zoom", function() {
    zoom_group.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
  });
  svg.call(zoomer);
      /* XXX: this is a hack! Enable to double click and see point coordinates
      .on("dblclick.zoom", null)
      .on("dblclick", function() {
          var pt = svg.node().createSVGPoint();
          pt.x = d3.event.x; pt.y = d3.event.y;
          pt = pt.matrixTransform(svg.node().getScreenCTM().inverse());
          alert("cx=" + (pt.x-50) + " cy=" + (pt.y+80));
      });
      */
}

PitacoDrawerHelper.prototype.enterAddPitacoMode = function() {
  if(this.isAddPitacoMode) {
      this.leaveAddPitacoMode();
      return;
  }
  this.isAddPitacoMode = true;
  d3.select(document).on("keyup", function() {
    if(d3.event.keyCode == 27) { //esc key
      this.leaveAddPitacoMode();
    }
  }.bind(this));
  d3.select("#pitaco-net-svg").style("cursor", "crosshair");
  d3.select("#group-button-dar-pitaco button").classed("active", true);

  //somehow it solves a bug that prevents safari from reloading background of foreignObjects
  d3.select("#group-button-dar-pitaco").style("display", "none");
  setTimeout(function() { d3.select("#group-button-dar-pitaco").style("display", "block") }, 0);
}

PitacoDrawerHelper.prototype.leaveAddPitacoMode = function() {
  this.isAddPitacoMode = false;
  d3.select(document).on("keyup", null);
  d3.select("#pitaco-net-svg").style("cursor", "auto");
  d3.select("#group-button-dar-pitaco button").classed("active", false).node().blur();

  //somehow it solves a bug that prevents safari from reloading background of foreignObjects
  d3.select("#group-button-dar-pitaco").style("display", "none");
  setTimeout(function() { d3.select("#group-button-dar-pitaco").style("display", "block") }, 0);
}

PitacoDrawerHelper.prototype.storeNewTags = function(tags) {
  for(var i=0; i < tags.length; i++)
    if(!this.availableTagsDict[tags[i]]) {
      this.availableTagsDict[tags[i]] = true;
      this.centralProject.availableTags.push(tags[i]);
    }
}

PitacoDrawerHelper.prototype.addPitacoOnSource = function(source, newPitacoInfo) {
  var randomNumberX = -100 + ((Math.random() * 200) | 0);
  var randomNumberY = -100 + ((Math.random() * 200) | 0);
  if(Math.abs(randomNumberX) + Math.abs(randomNumberY) < 50) randomNumberY = 50;
  newPitacoInfo.cx = source.cx + source.variationX + randomNumberX;
  newPitacoInfo.cy = source.cy + source.variationY + randomNumberY;
  source.pitacos = source.pitacos || [];
  source.pitacos.push(newPitacoInfo);
  this.storeNewTags(newPitacoInfo.tags);
  this.drawPitacoNet();
}

PitacoDrawerHelper.prototype.openModalAddPitacoWithSource = function(source) {
  this.leaveAddPitacoMode();
  this.modalEventsHelper.openModalAddPitaco(
    this.centralProject.availableTags,
    function addPitaco(newPitacoInfo) { this.addPitacoOnSource(source, newPitacoInfo); }.bind(this)
  );
}

PitacoDrawerHelper.prototype.drawAddPitacoButton = function() {
  this.svgDrawerHelper.drawButton(d3.select("#group-button-dar-pitaco"), "Dar pitaco", "btn-primary")
        .on("click", this.enterAddPitacoMode.bind(this))
        //somehow it solves a bug that prevents safari from reloading background of foreignObjects
        .on("mouseenter", function() {
          var self = d3.select(this);
          self.style("display", "none");
          self.style("display", "block");
        }).on("mouseleave", function() {
          var self = d3.select(this);
          self.style("display", "none");
          self.style("display", "block");
        });
}

$(document).ready(function() {
  var drawer = new PitacoDrawerHelper("pitaco");
  drawer.drawPitacoNet();
  drawer.addZoomerBehaviour();
});
