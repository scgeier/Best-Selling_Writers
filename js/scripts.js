//Set the size of the chart and use the D3 format that puts commas in the numbers
var diameter = 560,
    format = d3.format(",d");

//Set the size of the pack layout and make the area of each circle a function of the data//
var pack = d3.layout.pack()
    .size([diameter - 50, diameter - 50])
    .value(function(d) { return d.sales; })
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

//Make the data set for the Legend
var legendData = [
      {
        cx: 50,
        fill:"#1F77b4",
        title:"Romance"
      },
      {
        cx: 150,
        fill:"#ff7f0e",
        title:"Mystery"
      },
       {
        cx: 250,
        fill:"#2ca02c",
        title:"Children/YA"
      },
        {
        cx: 350,
        fill:"#cc0000",
        title:"Thriller"
      },
      {
        cx: 450,
        fill:"#9467bd",
        title:"Horror"
      },
      {
        cx: 550,
        fill:"#8c564b",
        title:"Western"
      },
       {
        cx: 650,
        fill:"#e6e600",
        title:"Literature"
      }
      ];
    
//Make a div for author biogrpahies to appear to the right of the chart on bubble mouseovers    
var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("opacity", 0);



//Build the chart
d3.json("../data/authors.json", function(error, root) {
  if (error) throw error;

var node = svg.datum(root).selectAll(".node")
      .data(pack.nodes)

//If a JSON object has children, give it the "node" class; otherwise, make it "leaf node"//
node.enter().append("g")
      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
      .transition()
      .duration(2000)
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
  
  
//Add a mouseover tooltip to show the number of books sold over each bubble//
node.append("title")
      .text(function(d){
            return salesInfo(d);
      });

//Add a function to change 'million' to 'billion,' when appropriate     
function salesInfo(d) {
    if (d.sales >= 1000) {
        return (d.sales / 1000) + " billion books sold";
    } else{
      return d.sales + " million books sold";
    }
};

//Create the circles using the JSON data; set the colors based on the fiction genre//
node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d){
        var color;
          if (d.genre == "Romance") {
            color = "#1F77b4";
          }else if(d.genre == "Mystery"){
            color = "#ff7f0e";
          }else if(d.genre == "Children/Young Adult"){
            color = "#2ca02c";
          }else if (d.genre == "Thriller") {
            color = "#cc0000";
          } else if (d.genre == "Horror") {
            color = "#9467bd";
          }else if (d.genre == "Western") {
            color = "#8c564b";
          }else if (d.genre == "Literature") {
            color = "#e6e600";
          }
          return color;
      })

//Replace the project intro text in the right-hand div witht the author bios when user hovers over a bubble//
      .on("mouseenter", function(d){
            if (d.description !== undefined) {
                  
        d3.select("#caveat")
           .style("opacity", 0)
         tooltip.transition()
          .delay(200)
          .attr("class", "col-sm-12 col-md-6 biography")
          .style("opacity", 1)
          .style("left", "50%")
          .style("bottom", "45%")
  
          
          tooltip.html("<h3><span>" + d.first + " " + d.last + "</span></h3>"
                      + salesInfo(d) + "</br></br>"
                      + "<img src=" + "'" + d.photo + "'" + "/>"
                      + d.description + "</br></br>"
                      + "Well-Known Works: <i>" + d.books + "</i>")
                .attr("class", "description")
            }
      })
      
    //Remove author bio on mouseleave//
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

//Add a function to display both first and last names when there is enough space in the bubble
function authorName(d){
      if (d.sales > 700 ) {
        return d.first + " " + d.last;
      }else{
        return d.last.substring(0, d.r / 4); 
      }
};

//Build the legend below the chart
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

d3.select(self.frameElement).style("height", diameter + "px");