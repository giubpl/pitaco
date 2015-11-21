function SVGDrawerHelper() {
  this.idCounter = 0;
}

SVGDrawerHelper.prototype.getUniqueid = function() {
  return "svg-drawer-id-" + (this.idCounter++);
}

SVGDrawerHelper.prototype.drawSimpleCircle = function(element, circleInfo, radius) {
  return element.append("circle").attr("cx", circleInfo.cx).attr("cy", circleInfo.cy).attr("r", radius);
}

SVGDrawerHelper.prototype.drawCircleWithImage = function(element, circleInfo, radius) {
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

SVGDrawerHelper.prototype.drawLine = function(element, x1, y1, x2, y2) {
  return element.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
}

SVGDrawerHelper.prototype.drawText = function(element, textMessage, fontWeight, fontSize, fill, keepCursor) {
  var text = element.append("text").text(textMessage).attr("font-weight", fontWeight).attr("font-size", fontSize).attr("fill", fill);
  if(!keepCursor) text.attr("style", "cursor: default");
  return text;
}

SVGDrawerHelper.prototype.drawButton = function(element, fill, text, fontWeight, fontSize, hasHover) {
  element.selectAll("*").remove();
  var buttonGroup = element.append("g");
  var rect = buttonGroup.append("rect")
                .attr("rx", 3).attr("ry", 3)
                .attr("width", "100%").attr("height", "100%")
                .attr("fill", fill);
  if(hasHover) {
    buttonGroup.style("cursor", "pointer");
    buttonGroup.style("opacity", "0.9");
    buttonGroup.on("mouseover", function() { buttonGroup.style("opacity", "1");});
    buttonGroup.on("mouseout", function() { buttonGroup.style("opacity", "0.9");});
  }
  this.drawText(buttonGroup, text, fontWeight, fontSize, "#FFFFFF", hasHover)
                .attr("x", "50%").attr("y", "50%")
                .attr("alignment-baseline", "central").attr("text-anchor", "middle");
  return buttonGroup;
}
