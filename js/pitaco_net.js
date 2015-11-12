$(document).ready(function() {

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

  svg.call(zoomer);

});