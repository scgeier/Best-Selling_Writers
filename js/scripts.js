var diameter = 760,
    format = d3.format(",d");

var pack = d3.layout.pack()
    .size([diameter - 100, diameter - 100])
    .value(function(d) { return d.sales; });//make the area of each circle a function of the data//


var svg = d3.select("#chart").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
  .append("g")
    .attr("transform", "translate(50,20)");//move the graphic 100 to the left and 20 down within the canvas//

      
var tooltip = d3.select("body").append("div")
                .attr("class", "col-xs-12 col-md-6")
                .style("position", "absolute")
                .style("opacity", 0);

              
d3.json("../data/albums.json", function(error, root) {
  if (error) throw error;

      
  var node = svg.datum(root).selectAll(".node")
      .data(pack.nodes)
    .enter().append("g")
      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })//if the JSON object has children, give it the "node" class; otherwise, make it "leaf node"//
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

//Add a mouseover to show each of the album sales figures//
  node.append("title")
      .text(function(d) { return d.sales + " million"; });

//Create the circles using the JSON data//
  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d){
        var color;
          if (d.genre == "pop") {
            color = "#fd8d3c";
          }else if(d.genre == "rock"){
            color = "#e6550d";
          }else if(d.genre == "hip hop"){
            color = "#fdae6b";
          }else if (d.genre == "country") {
            color = "#fdd0a2";
          }
          return color;
      })
    
    //Make description of each album appear in side div when user hovers over a bubble//
      .on("mouseenter", function(d){
      
         tooltip.transition()
          .style("opacity", 1)
          .style("left", "50%")
          .style("bottom", "50%")
  
          
          tooltip.html("<h3><span>" + d.name + "</span>" + " by " + d.artist + "</h3>"
                      + d.sales + " million copies</br></br>"
                      + d.description)
                .attr("class", "description")
      })
      
    //Remove album description on mouseleave//
      .on("mouseleave", function(d){
         tooltip.transition().style("opacity", 0)
      })
      
      
//Filter the data and append text to only the leaf nodes (i.e. the JSON objects without children)//
  node.filter(function(d) { return !d.children; }).append("text")
      .attr("dy", ".2em")
      .style("text-anchor", "middle")
      .style("font-size", ".9em")
      .text(function(d) { return d.name.substring(0, d.r / 3); });
  
  
    
});


d3.select(self.frameElement).style("height", diameter + "px");