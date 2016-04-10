var diameter = 760,
    format = d3.format(",d");

var pack = d3.layout.pack()
    .size([diameter - 50, diameter - 50])
    .value(function(d) { return d.sales; })//make the area of each circle a function of the data//
    .sort(function comparator(a, b) {
          return -(a.value - b.value);
    });

//Make the canvas
var svg = d3.select("#chart").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
  .append("g")
    .attr("transform", "translate(50,20)");//move the chart 100 to the left and 20 down within the canvas//

//Make a div for the album info to appear on mouseovers    
var tooltip = d3.select("body").append("div")
                .attr("class", "col-xs-12 col-md-6")
                .style("position", "absolute")
                .style("opacity", 0);

//Initialize the URL for the first JSON file on load
var currentUrl = "../data/authors.json";

//Build the chart
function update() {
  
d3.json(currentUrl, function(error, root) {
  if (error) throw error;

  var node = svg.datum(root).selectAll(".node")
      .data(pack.nodes)
     
node.exit().remove()

node.enter().append("g")
      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })//if the JSON object has children, give it the "node" class; otherwise, make it "leaf node"//
      .transition()
      .duration(2000)
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
  
  
//Add a mouseover to show each of the album sales figures//
node.append("title")
      .text(function(d) { return d.sales + " million"; });
      

//Create the circles using the JSON data//
node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d){
        var color;
          if (d.genre == "Romance") {
            color = "#e7969c";
          }else if(d.genre == "Mystery"){
            color = "#bd9e39";
          }else if(d.genre == "Children/Young Adult"){
            color = "#fdae6b";
          }else if (d.genre == "Thriller") {
            color = "#e7ba52";
          } else if (d.genre == "Horror") {
            color = "#8ca252";
          }else if (d.genre == "Western") {
            color = "#e7cb94";
          }else if (d.genre == "Literature") {
            color = "#cedb9c";
          }
          return color;
      })

    //Make description of each album appear in side div when user hovers over a bubble//
      .on("mouseenter", function(d){
      
         tooltip.transition()
          .style("opacity", 1)
          .style("left", "50%")
          .style("bottom", "50%")
  
          
          tooltip.html("<h3><span>" + d.first + " " + d.last + "</span></h3>"
                      + d.sales + "</br></br>"
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
      .text(function(d) { return d.last.substring(0, d.r / 4); })

});

//Make a click event to enter new JSON data
d3.select("#option")
      .on("click", function(e){
        currentUrl = "../data/1997.json";
        update();
        })
      
};

update();

d3.select(self.frameElement).style("height", diameter + "px");