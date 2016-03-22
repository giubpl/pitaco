function CardDrawerHelper() {};

CardDrawerHelper.prototype.cardHeight = 315;
CardDrawerHelper.prototype.cardWidth = 286;
CardDrawerHelper.prototype.cardMargin = 20;
CardDrawerHelper.prototype.cardColor = "#51515E";
CardDrawerHelper.prototype.svgDrawerHelper = new SVGDrawerHelper();

CardDrawerHelper.prototype.addCardToInitialPage = function(projectId) {
  var card = $("<svg class='card' viewBox='0 0 571 631' />");
  card.click(function() {
    var drawer = new PitacoDrawerHelper(projectId);
    drawer.drawPitacoNet();
    $('#page-tab-activator a[href="#pitaco-net"]').tab("show");
  });
  this.drawCard(d3.select(card[0]), projectId);
  $("#initial-page").append(card);
}

CardDrawerHelper.prototype.drawCommentsIcon = function(element) {
  element.append("path").attr("fill", "#DDDDDD")
  .attr("d", "M108.5,584.6h-2.5v11.3H89.6v2.5c0,0.7,0.6,1.3,1.3,1.3h13.9l5,5v-18.9\
      C109.7,585.1,109.2,584.6,108.5,584.6z M103.4,592.1v-11.3c0-0.7-0.6-1.3-1.3-1.3H85.8c-0.7,0-1.3,0.6-1.3,1.3v17.6l5-5h12.6\
      C102.9,593.4,103.4,592.8,103.4,592.1z");
}

CardDrawerHelper.prototype.drawUsersIcon = function(element) {
  element.append("path").attr("fill", "#DDDDDD")
    .attr("d", "M203.7,591.7c1.8,0,3.3-1.5,3.3-3.3c0-1.8-1.5-3.3-3.3-3.3s-3.3,1.5-3.3,3.3\
      C200.4,590.2,201.8,591.7,203.7,591.7z M194.8,591.7c1.8,0,3.3-1.5,3.3-3.3c0-1.8-1.5-3.3-3.3-3.3s-3.3,1.5-3.3,3.3\
      C191.5,590.2,193,591.7,194.8,591.7z M194.8,593.9c-2.6,0-7.7,1.3-7.7,3.9v2.8h15.5v-2.8C202.6,595.2,197.4,593.9,194.8,593.9z\
      M203.7,593.9c-0.3,0-0.7,0-1.1,0.1c1.3,0.9,2.2,2.2,2.2,3.8v2.8h6.6v-2.8C211.4,595.2,206.2,593.9,203.7,593.9z");
}

CardDrawerHelper.prototype.drawCard = function(element, projectId) {
  var centralProject = window.projectNet[projectId].centralProject;
  var authorImg = centralProject.author.img;
  var authorName = centralProject.author.name;
  var projectName = centralProject.name;
  var projectTags = centralProject.projectTags.join(", ");
  var projectComments = centralProject.totalComments;
  var projectUsers = centralProject.totalUsers;
  var cardImg = centralProject.cardImg || centralProject.img;
  element.append("rect").attr("fill", this.cardColor).attr("width", "100%").attr("height", "100%");
  this.svgDrawerHelper.drawCircleWithImage(element, {cx: 89, cy: 444, img: authorImg}, 39);
  this.svgDrawerHelper.drawText(element, projectName, 400, 29, "#DDDDDD", true)
        .attr("x", 145).attr("y", 439);
  this.svgDrawerHelper.drawText(element, authorName, 300, 24, "#BBBBBB", true)
        .attr("x", 144).attr("y", 468);
  this.svgDrawerHelper.drawText(element, projectTags, 300, 21, "#BBBBBB", true)
        .attr("x", 50).attr("y", 537).attr("opacity", 0.5);
  this.svgDrawerHelper.drawLine(element, 50, 557, 521, 557)
        .attr("fill", "#FFFFFF").attr("stroke", "#FFFFFF").attr("stroke-miterlimit", 10).attr("opacity", 0.5);
  this.svgDrawerHelper.drawText(element, projectComments, 300, 25, "#BBBBBB", true)
        .attr("x", 49).attr("y", 600);
  this.drawCommentsIcon(element);
  this.svgDrawerHelper.drawText(element, projectUsers, 300, 25, "#BBBBBB", true)
        .attr("x", 148).attr("y", 600);
  this.drawUsersIcon(element);
  element.append("image").attr("width", 571).attr("height", 390)
        .attr("preserveAspectRatio", "none").attr("xlink:href", cardImg);
}
