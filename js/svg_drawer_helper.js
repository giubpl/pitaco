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

SVGDrawerHelper.prototype.drawButton = function(element, text, classes) {
  element.selectAll("*").remove();
  var buttonObject = element.append("foreignObject").attr("width", "100%").attr("height", "100%");
  buttonObject.append("xhtml:button").attr("class", "btn " + classes).text(text);
  return buttonObject;
}
