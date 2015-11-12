$(document).ready(function() {

  //SETAR PARA TRUE QUANDO QUISER VER AS COORDENADAS PARA MONTAR O SVG
  //NAO ESQUECE QUE TEM QUE SER DUPLO CLIQUE
  var justAlertCoordinates = false;
  //OI GIULIA!!! AQUI!!!

  var svg = d3.select("#pitaco-net-svg");
  var box = svg.node().getBBox();
  var xScale = d3.scale.linear().domain([0, box.width]).range([0, box.width]);
  var yScale = d3.scale.linear().domain([0, box.height]).range([0,box.height]);

  if(justAlertCoordinates) {
    svg.on("dblclick", function() {
      alert("cx=" + (d3.event.x-260) + " cy=" + (d3.event.y+15));
      d3.event.stopPropagation();
      d3.event.preventDefault();
    });
  }
  else {
    var zoom_group = d3.select("#pitaco-net-zoom-group");
    var zoomer = d3.behavior.zoom()
                    .scaleExtent([0.1,10])
                    .x(xScale)
                    .y(yScale)
                    .on("zoom", function() {
                      zoom_group.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
                    });

    svg.call(zoomer);
  }

});
