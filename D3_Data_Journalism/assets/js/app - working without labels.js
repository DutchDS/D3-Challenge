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
    
    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
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
  // var xLinearScale = xScale(myData, chosenXAxis);
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(myData, d => d[chosenXAxis]) * 0.8,
          d3.max(myData, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    // .domain([0, d3.max(myData, d => d.healthcare)])
    .domain([0, d3.max(myData, d => d[chosenYAxis])])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  // chartGroup.append("g")
  //   .call(leftAxis);
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    // .attr("transform", `translate(${width},0)`)
    .call(leftAxis);


  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(myData)
    .enter()
    .append("g")
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    // .attr("cy", d => yLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "lightblue")
    .attr("opacity", ".75")

  circlesGroup.append("text")
    .attr("dx", d => xLinearScale(d[chosenXAxis])-d3.min(myData, d => d[chosenXAxis]) * 0.8)
    .attr("dy", d => yLinearScale(d[chosenYAxis]))
    .text(d => d.abbr);

  // Create group for  3 x- axis labels
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


   // Create group for  3 y- axis labels
      // Create group for  3 x- axis labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width + 20}, ${height / 2})`)
    .attr("transform", "rotate(-90)");
  
    // append y axis
  // chartGroup.append("text")
  var healthLabel = ylabelsGroup.append("text")
    // .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height * .58))
    .attr("dy", "1em")
    .attr("value", "healthcare")
    .classed("axis-text", true)
    .text("Lacks Heathcare (%)");

  // chartGroup.append("text")
  var smokeLabel = ylabelsGroup.append("text")
    // .attr("transform", "rotate(-90)")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height * .51))
    .attr("dy", "1em")
    .attr("value", "smokes")
    .classed("axis-text", true)
    .text("Smokes (%)");

  // chartGroup.append("text")
  var obesityLabel = ylabelsGroup.append("text")
    // .attr("transform", "rotate(-90)")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "obesity")
    .classed("axis-text", true)
    .text("Obesity (%)");


//  // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//   if (chosenXAxis === "hair_length") {
//     var label = "Hair Length:";
//   }
//   else {
//     var label = "# of Albums:";
//   }

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// }

// // updateToolTip function above csv import
// var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);


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

// function used for updating circles group with a transition to
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXaxis]))

      /* Create the text for each block */
  return circlesGroup;
}
  
// function used for updating circles group with a transition to
// new circles
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  console.log(chosenXAxis);
  console.log(chosenYAxis);
  
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]))

  return circlesGroup;
  }

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
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

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
    circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

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
  
  })
})
// }).catch(function(error) {
//   console.log(error);
//   });
