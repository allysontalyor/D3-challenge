// define the size of the SVG element
var svgWidth = 960;
var svgHeight = 500;

// set the margins of the chart within the SVG element...distance between the edge of the svg
//element and the edge of the chart
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };

//define the dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group and transform so that the starting point is the bottom right corner of the chart
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {
    //check to see that the data is loading properly
    //console.log(healthData)
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });
    //Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.healthcare)+3])
      .range([height, 0]);

    //Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "lightblue")
      .attr("opacity", ".5");

    //Add the SVG Text Element to the svgContainer
    chartGroup.selectAll("text")
      .data(healthData)
      .enter()
      .append("text")
      .attr("x", function(d) { return xLinearScale(d.poverty)-11})
      .attr("y", d => yLinearScale(d.healthcare)+7)
      .text(d => d.abbr)
      .attr("class", "circleLabel")
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px")
      .attr("fill", "black");

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - ((height+140) / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare %");

    chartGroup.append("text")
      .attr("transform", `translate(${(width-35) / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty %");

}).catch(function(error) {
    console.log(error);
});


//<text x="50%" y="50%" text-anchor="middle" stroke="#51c5cf" stroke-width="2px" dy=".3em">Look, I’m centered!Look, I’m centered!</text>




