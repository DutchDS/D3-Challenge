    var svgWidth = 960;
    var svgHeight = 500;
    
    var margin = {
      top: 20,
      right: 40,
      bottom: 80,
      left: 100
    };
    
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    
///////////////////////////////////////////////////////////////////////////////////    
/////////// Create an SVG wrapper, append an SVG group that will hold our chart,///
/////////// and shift the latter by left and top margins.//////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Initial Params
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";

//////////////////////////////////////////////////////////////    
/////////// Define all functions//////////////////////////////
//////////////////////////////////////////////////////////////

// function used for updating x-scale var upon click on axis label
function xScale(allFields, chosenXAxis) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(allFields, d => d[chosenXAxis]) * 0.8,
      d3.max(allFields, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
  } 
// function used for updating x-scale var upon click on axis label
function yScale(allFields, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(allFields, d => d[chosenYAxis])])
  .range([height, 0]);
  return yLinearScale;
  }
// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
  }
// function used for updating yAxis var upon click on yxis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  console.log("IS THIS THE PROBLEM?")
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
  }
// function used for updating circles group with a transition to new circles
function renderXCircles(circlesGroup, textGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXaxis]))
    // .attr("dx", d => newXScale(d[chosenXAxis]))
  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXaxis])-8)

      /* Create the text for each block */
  return circlesGroup;
  } 
// function used for updating circles group with a transition to new circles
function renderYCircles(circlesGroup, textGroup, newYScale, chosenYAxis) {
  console.log(chosenXAxis);
  console.log(chosenYAxis);
  
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]))
  
  textGroup.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenYAxis])+5)
 
  return circlesGroup;
  }


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(myData, err) {
  if (err) throw err;

  // parse data
  myData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    console.log("state and abbr: " + data.abbr + " - " + data.state)
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(myData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(myData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // // append initial circles
  var circlesGroup = chartGroup.selectAll(".node")
    .data(myData)
    .enter()
    .append("g")
    .attr("class", ".node")
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "red")
    .attr("opacity", ".5")
    .text(d => d.abbr)
    .attr("font-size", "10px")
  
  // // append initial circles
  var textGroup = chartGroup.selectAll(".node")
    .data(myData)
    .enter()
    .append("g")
    .attr("class", "text")
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis])-8)
    .attr("y", d => yLinearScale(d[chosenYAxis])+5)
    .text(d => d.abbr)
    .attr("font-size", "12px")

///////////////////////////////////////////////////////////    
/////////// Tooltip stuff /////////////////////////////////
///////////////////////////////////////////////////////////

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([30, 90])
    .html(function(d) {
      return (`State: ${d.abbr}<br> Age ${d.age}`);
    });

  chartGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
    })
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
  
  /////////////////////////////////////////////////
  ///// Create group for  3 x- axis labels ////////
  /////////////////////////////////////////////////

  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (median)");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (median)");  

///////////////////////////////////////////////////////
//////// Create group for  3 y- axis labels////////////
///////////////////////////////////////////////////////

  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width + 20}, ${height / 2})`)
    .attr("transform", "rotate(-90)");
  
    // append y axis
  // chartGroup.append("text")
  var healthLabel = ylabelsGroup.append("text")
    // .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare")    
    .classed("active", true)
    .text("Lacks Heathcare (%)");

  // chartGroup.append("text")
  var smokeLabel = ylabelsGroup.append("text")
    // .attr("transform", "rotate(-90)")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "smokes")
    .classed("inactive", true)
    .text("Smokes (%)");

  // chartGroup.append("text")
  var obesityLabel = ylabelsGroup.append("text")
    // .attr("transform", "rotate(-90)")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "obesity")
    .classed("inactive", true)
    .text("Obesity (%)");

// // updateToolTip function above csv import
// var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log(chosenXAxis)
        xLinearScale = xScale(myData, chosenXAxis);
        xAxis = renderXAxes(xLinearScale, xAxis);
        circlesGroup = renderXCircles(circlesGroup, textGroup, xLinearScale, chosenXAxis);
        // textGroup = renderXText(textGroup, xLinearScale, chosenXAxis);

// //         // updates tooltips with new info
// //         circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "income") {
          incomeLabel
          .classed("active", true)
          .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

// y axis labels event listener
ylabelsGroup.selectAll("text")
  .on("click", function() {
  var value = d3.select(this).attr("value");
  console.log("Chosen: " + value);

  if (value !== chosenYAxis) {
    chosenYAxis = value;
    console.log(chosenYAxis)

    yLinearScale = yScale(myData, chosenYAxis);
    yAxis = renderYAxes(yLinearScale, yAxis);
    circlesGroup = renderYCircles(circlesGroup, textGroup, yLinearScale, chosenYAxis);
    // textGroup = renderYText(textGroup, yLinearScale, chosenYAxis);

// //         // updates tooltips with new info
// //         circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // changes classes to change bold text
    if (chosenYAxis === "healthcare") {
      healthLabel
        .classed("active", true)
        .classed("inactive", false);
      smokeLabel
        .classed("active", false)
        .classed("inactive", true);
      obesityLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else if (chosenYAxis === "smokes") {
      smokeLabel
        .classed("active", true)
        .classed("inactive", false);
      healthLabel
        .classed("active", false)
        .classed("inactive", true);
      obesityLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else {
      healthLabel
        .classed("active", false)
        .classed("inactive", true);
      smokeLabel
        .classed("active", false)
        .classed("inactive", true);
      obesityLabel
        .classed("active", true)
        .classed("inactive", false);
    }

  }
  
  });

}).catch(function(error) {
  console.log(error);

});
