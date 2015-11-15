function PitacoDrawerHelper() {
  this.centralRadius = 40;
  this.branchRadius = 8;
  this.pitacoRadius = 15;
  this.centralProject = {
    cx: 480,
    cy: 425,
    img: "img/central_project_dark.svg"
  }

  this.branches = [
    {
      name: "branch-texto-allergio",
      cx: 660,
      cy: 430,
      pitacos:
        [
          {
            img: "img/fulano.jpg",
            cx: 722,
            cy: 695,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 670,
            cy: 205,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 726,
            cy: 160,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 800,
            cy: 374,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 827,
            cy: 561,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 807,
            cy: 458,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 743,
            cy: 607,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 844,
            cy: 413,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 723,
            cy: 306,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 861,
            cy: 241,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 839,
            cy: 700,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 922,
            cy: 597,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 883,
            cy: 680,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 670,
            cy: 697,
            text: ""
          },
        ]
    },
    {
      name: "branch-similares-allergio",
      cx: 310,
      cy: 428,
      pitacos:
        [
          {
            img: "img/fulano.jpg",
            cx: 351,
            cy: 218,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 24,
            cy: 551,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 271,
            cy: 175,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 195,
            cy: 285,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 140,
            cy: 340,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 120,
            cy: 440,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 215,
            cy: 546,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 200,
            cy: 200,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 103,
            cy: 248,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 315,
            cy: 115,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 50,
            cy: 360,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 94,
            cy: 560,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 245,
            cy: 656,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 310,
            cy: 660,
            text: ""
          },
          {
            img: "img/fulano.jpg",
            cx: 326,
            cy: 596,
            text: ""
          },
        ]
    }
  ];

  this.idCounter = 0;
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

PitacoDrawerHelper.prototype.drawPitacoNet = function() {
  var pitacoTree = d3.select("#pitaco-tree");
  pitacoTree.html("");

  this.branches.forEach(function drawBranch(branchInfo) {

    var branch = pitacoTree.append("g").attr("id", branchInfo.name);
    this.drawSimpleCircle(branch, branchInfo, this.branchRadius);
    this.drawLine(branch, this.centralProject.cx, this.centralProject.cy, branchInfo.cx, branchInfo.cy);

    branchInfo.pitacos.forEach(function drawPitaco(pitacoInfo) {
      this.drawLine(branch, branchInfo.cx, branchInfo.cy, pitacoInfo.cx, pitacoInfo.cy);
      this.drawCircleWithImage(branch, pitacoInfo, this.pitacoRadius).attr("class", "pitaco-circle");
    }.bind(this));

  }.bind(this));

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
  var drawer = new PitacoDrawerHelper();
  drawer.drawPitacoNet();
  drawer.addZoomerBehaviour();
});
