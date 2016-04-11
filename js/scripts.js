var diameter = 560,
    format = d3.format(",d");

var pack = d3.layout.pack()
    .size([diameter - 50, diameter - 50])
    .value(function(d) { return d.sales; })//make the area of each circle a function of the data//
    .sort(function comparator(a, b) {
          return -(a.value - b.value);
    });

//Make the chart canvas
var svg = d3.select("#chart").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
  .append("g")
    .attr("transform", "translate(50,20)");//move the chart 100 to the left and 20 down within the canvas//

//Make the legend canvas
var legend = d3.select("#legend").append("svg")
    .attr("width", 1260)
    .attr("height", 200)
    //.style("background", "#dddddd")

//The data set for the Legend
var legendData = [
      {
        cx: 50,
        fill:"#e7969c",
        title:"Romance"
      },
      {
        cx: 150,
        fill:"#bd9e39",
        title:"Mystery"
      },
       {
        cx: 250,
        fill:"#fdae6b",
        title:"Children/YA"
      },
        {
        cx: 350,
        fill:"#e7ba52",
        title:"Thriller"
      },
      {
        cx: 450,
        fill:"#8ca252",
        title:"Horror"
      },
      {
        cx: 550,
        fill:"#e7cb94",
        title:"Western"
      },
       {
        cx: 650,
        fill:"#cedb9c",
        title:"Literature"
      }
      ];
    
//Make a div for the author info to appear to the right of the chart on mouseovers    
var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
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
      .text(function(d){
            return salesInfo(d);
      });
      
function salesInfo(d) {
    if (d.sales >= 1000) {
        return (d.sales / 1000) + " billion books sold";
    }else{
      return d.sales + " million books sold";
    }
};

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

    //Make the author's information replace the intro text in the right-hand div when user hovers over a bubble//
      .on("mouseenter", function(d){
            if (d.description !== undefined) {
                  
        d3.select("#caveat")
           .style("opacity", 0)
         tooltip.transition()
          .delay(200)
          .style("opacity", 1)
          .style("left", "51%")
          .style("bottom", "40%")
  
          
          tooltip.html("<h3><span>" + d.first + " " + d.last + "</span></h3>"
                      + salesInfo(d) + "</br></br>"
                      + "<img src=" + "'" + d.photo + "'" + "/>"
                      + d.description + "</br></br>"
                      + "Well-Known Works: <i>" + d.books + "</i>")
                .attr("class", "description")
            }
      })
      
    //Remove album description on mouseleave//
      .on("mouseleave", function(d){
            d3.select("#caveat")
           .style("opacity", 1)
         tooltip.transition().style("opacity", 0)
      })
  
  
//Filter the data and append text to only the leaf nodes (i.e. the JSON objects without children)//
node.filter(function(d) { return !d.children; }).append("text")
      .attr("dy", ".2em")
      .style("text-anchor", "middle")
      .style("font-size", ".65em")
      .text(function(d) { return authorName(d);});

function authorName(d){
      if (d.sales > 700 ) {
        return d.first + " " + d.last;
      }else{
        return d.last.substring(0, d.r / 4); 
      }
};

legend.selectAll("circle")
      .data(legendData)
      .enter()
      .append("circle")
      .transition()
      .delay(2000)
      .attr("cx", function(d){return d.cx;})
      .attr("cy", 10)
      .attr("r", 10)
      .style("fill", function(d) { return d.fill;});
      
legend.selectAll("text")
      .data(legendData)
      .enter()
      .append("text")
      .transition()
      .delay(2000)
      .attr("x", function(d) { return d.cx + 15; })
      .attr("y", 15)
      .attr("font-family", "sans-serif")
      .attr("font-size", "1.5em")
      .attr("fill", "black")
      .text( function (d) {return d.title;});
});


//Make a click event to enter new JSON data
//d3.select("#option")
      //.on("click", function(e){
        //currentUrl = "../data/1997.json";
        //update();
        //})
      
};

update();

d3.select(self.frameElement).style("height", diameter + "px");