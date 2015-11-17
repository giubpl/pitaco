function PitacoDrawerHelper() {
  this.centralRadius = 40;
  this.branchRadius = 8;
  this.pitacoRadius = 15;
  this.filterButtonsCx = 88;
  this.filterButtonsCy = 57;
  this.filterButtonsIncreaseY = 50;
  this.filterTextDistanceX = 25;
  this.centralProject = {
    cx: 480,
    cy: 425,
    img: "img/central_project_dark.svg"
  }

  this.branches = [
    {
      name: "branch-similares-allergio",
      filterText: "Positivos",
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
            img: "img/users_pitaqueiros/02.jpg",
            cx: 271,
            cy: 175,
            text: "Acho o projeto sensasional! Um espaço para troca de pitacos é o que todo designer precisa."
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
            img: "img/users_pitaqueiros/05.jpg",
            cx: 120,
            cy: 440,
            text: "Amei este projeto! Acho que ele é super útil inclusive para a área de direito, no qual várias pessoas precisam compartilhar textos e escrever textos em conjunto"
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
    },
    {
      name: "branch-texto-allergio",
      filterText: "Negativos",
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
            img: "img/users_pitaqueiros/01.jpg",
            cx: 807,
            cy: 458,
            text: "Acho que o visual poderia ser melhor. Estava pensando que poderia haver algum tipo de feed dos pitacos mais recentes, como uma forma diferenciada do usuário visualizar as informações relevantes a ele."
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
            img: "img/users_pitaqueiros/03.jpg",
            cx: 723,
            cy: 306,
            text: "Gostei bastante do projeto, mas ainda existem muitas funcionalidades que deveriam ser implementadas. Uma funcionalidade que acharia interessante seria um chat para que os usuários se comunicassem para combinar detalhes do projeto"
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
      name: "branch-icons-allergio",
      filterText: "Não sei",
      cx: 513,
      cy: 302,
      pitacos:
        [
          {
            img: "img/fulano.jpg",
            cx: 551,
            cy: 218,
            text: ""
          },
        ]
    }
  ];

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
  var filtersArea = d3.select("#filter-line-group");
  filtersArea.html("");

  var cx = this.filterButtonsCx;
  var cy = this.filterButtonsCy;
  var lastcy = this.filterButtonsCy + (this.branches.length-1) * this.filterButtonsIncreaseY;
  this.drawLine(filtersArea, cx, cy, cx, lastcy).attr("id", "branch-filter-line");
  this.branches.forEach(function drawFilter(branchInfo, index) {
    cy = this.filterButtonsCy + index * this.filterButtonsIncreaseY;
    this.drawLine(filtersArea, cx, cy, cx, cy)
            .attr("class", "branch-filter-button")
            .attr("id", "button-filter-"+branchInfo.name)
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
  drawer.drawFilters();
  drawer.addZoomerBehaviour();

  var buttonSeguir = d3.select("#button-seguir");
  buttonSeguir.on("click", function() {
    buttonSeguir.classed("active-display", !buttonSeguir.classed("active-display"));
  });
});
