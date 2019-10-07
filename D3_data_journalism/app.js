// Set SVG size and margins
var svgWidth = 960;
var svgHeight = 500

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

// Calculate width and heght of figure in refernce to SVG size and margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create SVG svg object attaching to ID in html where the chart will be situated
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    
// create a chart group to make mass changes
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read in data from CSV file
d3.csv("data.csv").then(function(plotData) {
    plotData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // Set x and y axes scales and assign to variables
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(plotData, d => d.poverty)])
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(plotData, d => d.healthcare)])
        .range([height, 0]);
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);
    
    // bind data to a new child group
    var circlesGroup = chartGroup.selectAll("Matts")
        .data(plotData)
        .enter()
        
    // append circle elements to plot the data  
    circlesGroup.append("circle")
        .attr("cx" , d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".60")
    
    // append text elements to plot state abbreviations with in the cirle data points
    circlesGroup.append("text")
        .attr("font-size", "10px")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d=> yLinearScale(d.healthcare)+4);
    
    // create and append y-axis text
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left*.5)
        .attr("x", 0 - (height/1.5))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)")
        .style("font-weight", "bold")
    
    // create and append x-axis text
    chartGroup.append("text")
        .attr("transform", `translate(${width/2.25}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)")
        .style("font-weight", "bold");

// catch and display any from data read
}).catch(function(error) {
    console.log(error)
});
