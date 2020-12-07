/*
 * Starbucks Drink Visualization
 * Built using d3.js in Fall 2020
 * @author: Katherine Shambaugh
 */ 

var width = 700;
var height = 700;

d3.csv("starbucksdrinks.csv", function (csv) {
	//Converts csv data to usable numbers
	for (var i = 0; i < csv.length; ++i) {
		csv[i].Caffeine = Number(csv[i].Caffeine);
    	csv[i].Calories = Number(csv[i].Calories);
    	csv[i].Fat = Number(csv[i].Fat);
    	csv[i].Carbohydrates = Number(csv[i].Carbohydrates);
    	csv[i].DietaryFiber = Number(csv[i].DietaryFiber);
    	csv[i].Sugars = Number(csv[i].Sugars);
    	csv[i].Protein = Number(csv[i].Protein);
	}

	//Pulls all the non-caffeinated items
	var items = [];
	var nonCaffeineExtent = d3.extent(csv, function (row) {
	  	if (row.Caffeine == 0) {
	  		if (!row.Beverage_prep.includes("ilk")) {
		    	items.push(row.Beverage + row.Beverage_prep);
			} else if (row.Beverage_prep.includes("onfat")) {
		    	items.push(row.Beverage + row.Beverage_prep);
		    }
		}
	});

	//Sets up x axis for non-caffeinated drinks
	var xScale = d3.scaleBand()
    	.domain(items)
    	.range([25, 675]);  
	var xAxis = d3.axisBottom().scale(xScale);
  
	//Create SVGs for charts
	//This is the circular packing
	var chart1 = d3
		.select("#chart1")
		.html("<h2>Caffeinated Options</h2>")
	    .append("svg:svg")
	    .attr('id', "chartOneSVG")
	    .attr("width", width)
	    .attr("height", height - 150)

	//This is the stacked bar chart
	var chart2 = d3
		.select("#chart2")
		.append("svg:svg")
		.attr('id', "chartTwoSVG")
    	.attr("width", width)
    	.attr("height", height - 44);

    //This is the non-caffeinated scatterplot
    var noCaffeine = d3.select("#chart1")
 		.append("div")
 		.attr('id', "noCaffeine")
 		.html("<hr><h2>Non-Caffeinated Options</h2>")
 		.append("svg")
 			.attr('id', "noCaffeineSVG")
 	 		.attr("width", width)
 			.attr("height", 60);

	//Creates a tooltip for the circles
	var tooltip = d3.select("#chart1")
		.append("div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.style("background-color", "white")
	    .style("border", "solid")
	    .style("border-width", "2px")
	    .style("border-radius", "5px")
	    .style("padding", "5px");

	//Creates a tooltip for the rectangles
	var tooltipRect = d3.select("#chart2")
		.append("div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.style("background-color", "white")
	    .style("border", "solid")
	    .style("border-width", "2px")
	    .style("border-radius", "5px")
	    .style("padding", "5px");

	//This creates the bar chart on circle click
 	var createBarChart = function(d) {
 		//Clear the old chart
 		document.getElementById("chartTwoSVG").innerHTML = " ";

 		//Handles milk selection
 		if (d.Beverage_prep.includes('ilk')) {
 			var select = document.getElementById("milk-buttons");
 			select.style.visibility = 'visible';
 			document.getElementById("milk-label").style.visibility = 'visible';
 			var size = d.Beverage_prep.split(" ");
 			var dataExists = false;
 			select.onchange = function() {
 				for (var i=0; i < csv.length; i++) {
 					if (csv[i].Beverage == d.Beverage) {
 						if (csv[i].Beverage_prep.includes(size[0])) {
 							if (csv[i].Beverage_prep.includes(select.value)) {
 								dataExists = true;
 								createBarChart(csv[i]);
 							}
 						}
 					}
 				}
 				if (dataExists == false) {
 					alert("No data for that milk type!");
 				}
 			}
 		} else {
 			var select = document.getElementById("milk-buttons");
 			select.style.visibility = 'hidden';
 			document.getElementById("milk-label").style.visibility = 'hidden';
 		}

 		//Draw the lines for the cup drawing
 		d3.select("#chartTwoSVG").append('line')
	    	.style("stroke", "black")
	    	.style("stroke-width", 2)
	    	.attr("x1", 510)
	    	.attr("y1", 100)
	    	.attr("x2", 510)
	    	.attr("y2", 630);

    	d3.select("#chartTwoSVG").append('line')
	    	.style("stroke", "black")
	    	.style("stroke-width", 2)
	    	.attr("x1", 180)
	    	.attr("y1", 631)
	    	.attr("x2", 511)
	    	.attr("y2", 631);

    	d3.select('#chartTwoSVG').append('rect')
    		.style("stroke", "black")
    		.style("stroke-width", 2)
    		.style("fill", "white")
    		.attr('x', 180) 
    		.attr('y', 50)
    		.attr('rx', 5)
    		.attr('width', 327)
    		.attr('height', 60);

    	d3.select('#chartTwoSVG').append('rect')
    		.style("stroke", "black")
    		.style("stroke-width", 2)
    		.style("fill", "white")
    		.attr('x', 160) 
    		.attr('y', 100)
    		.attr('rx', 5)
    		.attr('width', 367)
    		.attr('height', 20);

    	//Add the title to the stacked bar chart
 		d3.select("#chartTwoSVG")
 			.append("text")
		        .attr("x", (width / 2))             
		        .attr("y", 30)
		        .style("font-size", "16px") 
		        .style("text-decoration", "underline") 
		        .attr("text-anchor", "middle") 
		        .text(d.Beverage +  ' - ' + d.Beverage_prep);

		//Creates the y-axis for the bar chart
 		var sum = d.Calories + d.Fat + d.Carbohydrates + d.DietaryFiber + d.Sugars + d.Protein;
 		var ingredientExtent = d3.extent([0,sum]);
 		var yScale = d3.scaleLinear().domain(ingredientExtent).range([630, 130]);
		var yAxis = d3.axisLeft().scale(yScale);
		d3.select("#chartTwoSVG")
    		.append("g") // create a group node
    		.attr("transform", "translate(180, 0)")
    		.call(yAxis) // call the axis
    	d3.select("#chartTwoSVG").append("text") //Add the label
    		.attr("class", "y label")
    		.attr("text-anchor", "end")
    		.attr("y", 130)
    		.attr('x', -250)
    		.attr("dy", ".75em")
    		.attr("transform", "rotate(-90)")
    		.text("Count of nutrition information (calories/g)");

    	//Grab the data we want to show on the bar chart
    	var data = [ 
              {Calories: d.Calories, Fat: d.Fat, Carbohydrates: d.Carbohydrates, DietaryFiber: d.DietaryFiber, Sugars: d.Sugars, Protein: d.Protein}
            ]; 

        //Set colors for each category
        var color = d3.scaleOrdinal()
    		.domain(["Calories", "Fat", "Carbohydrates", "DietaryFiber", "Sugars", "Protein"])
    		.range(['#4477AA','#66CCEE','#228833', '#CCBB44', '#EE6677', '#AA3377'])
    	
    	//Create the stacks of data and populate
    	var stackGen = d3.stack() 
            .keys(["Calories", "Fat", "Carbohydrates", "DietaryFiber", "Sugars", "Protein"]);
        var stack = stackGen(data); 
        
        //Add each stack to the graph
    	var layer = d3.select("#chartTwoSVG").selectAll(".stack")
        	.data(stack)
        	.enter().append("g")
        	.attr("class", "stack")
        	.attr('id', d.key)
        	.attr("fill", function(d) { return color(d.key); })

        //Add each rectangle to the graph
		layer.selectAll("rect")
        	.data(function (d) {
            	return d;
        	})
        	.enter().append("rect")
        	.attr("x", 190)
        	.attr("y", function(d) { return yScale(d[1]); })
        	.attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
        	.attr("width", 310)
        	.on("mouseover", function(){
		    	d3.select(this)
		      		.style("stroke", "black")
		    	return tooltip.style("visibility", "visible");
		    })
			.on("mousemove", function(d){
				var fill = this.parentElement.getAttribute("fill"); //There is probably a better way to do this but alas
				if (fill == "#4477AA") {
					tooltip.html((d[1] - d[0]) + " calories"); //Displays the value
				} else if (fill == "#66CCEE") {
					tooltip.html((d[1] - d[0]) + " grams fat");
				} else if (fill == "#228833") {
					tooltip.html((d[1] - d[0]) + " grams carbohydrates");
				} else if (fill == "#CCBB44") {
					tooltip.html((d[1] - d[0]) + " grams dietary fiber");
				} else if (fill == "#EE6677") {
					tooltip.html((d[1] - d[0]) + " grams sugars");
				} else if (fill == "#AA3377") {
					tooltip.html((d[1] - d[0]) + " grams protein");
				}
				return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
			})
			.on("mouseout", function(){
				d3.select(this)
		      		.style("stroke", "")
				return tooltip.style("visibility", "hidden");
			})

		//This creates the legend
        d3.select("#chartTwoSVG").append("text").attr("x", 570).attr("y", 70).text("Legend").style("font-size", "15px").style("text-decoration", "underline").attr("alignment-baseline","middle")
       	d3.select("#chartTwoSVG").append("circle").attr("cx",550).attr("cy",90).attr("r", 6).style("fill", "#AA3377")
		d3.select("#chartTwoSVG").append("circle").attr("cx",550).attr("cy",110).attr("r", 6).style("fill", "#EE6677")
       	d3.select("#chartTwoSVG").append("circle").attr("cx",550).attr("cy",130).attr("r", 6).style("fill", "#CCBB44")
       	d3.select("#chartTwoSVG").append("circle").attr("cx",550).attr("cy",150).attr("r", 6).style("fill", "#228833")
       	d3.select("#chartTwoSVG").append("circle").attr("cx",550).attr("cy",170).attr("r", 6).style("fill", "#66CCEE")
       	d3.select("#chartTwoSVG").append("circle").attr("cx",550).attr("cy",190).attr("r", 6).style("fill", "#4477AA")
		d3.select("#chartTwoSVG").append("text").attr("x", 570).attr("y", 190).text("Calories").style("font-size", "15px").attr("alignment-baseline","middle")
		d3.select("#chartTwoSVG").append("text").attr("x", 570).attr("y", 170).text("Fat").style("font-size", "15px").attr("alignment-baseline","middle")
		d3.select("#chartTwoSVG").append("text").attr("x", 570).attr("y", 150).text("Carbohydrates").style("font-size", "15px").attr("alignment-baseline","middle")
		d3.select("#chartTwoSVG").append("text").attr("x", 570).attr("y", 130).text("Dietary Fiber").style("font-size", "15px").attr("alignment-baseline","middle")
		d3.select("#chartTwoSVG").append("text").attr("x", 570).attr("y", 110).text("Sugars").style("font-size", "15px").attr("alignment-baseline","middle")
		d3.select("#chartTwoSVG").append("text").attr("x", 570).attr("y", 90).text("Protein").style("font-size", "15px").attr("alignment-baseline","middle")
 	}

 	//Appends the circles to the circular packing graph
	var caffeineNode = chart1.append("g")
		.selectAll("circle")
		.data(csv)
		.enter()
		.append("circle")
			.attr("r", function(d){ 
		    	if (d.Caffeine > 0) {
		    		if (!d.Beverage_prep.includes("ilk")) {
		    			return d.Caffeine / 8;
		    		} else if (d.Beverage_prep.includes("onfat")) {
		    			return d.Caffeine / 8;
		    		}
		    	}
    		})
		    .attr("cx", width / 2)
		    .attr("cy", height / 2)
		    .style("fill", "#007343")
		    .style("fill-opacity", 0.4)
		    .attr("stroke", "#007343")
		    .style("stroke-width", 2)
		    .on("mouseover", function(){
		    	d3.select(this)
		      		.style("stroke", "black")
		    	return tooltip.style("visibility", "visible");
		    })
			.on("mousemove", function(d){
				tooltip.html(d.Beverage + " - " + d.Beverage_prep + "<br><b>Caffeine content: </b>" + d.Caffeine + "mg");
				return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
			})
			.on("mouseout", function(){
				d3.select(this)
		      		.style("stroke", "#007343")
				return tooltip.style("visibility", "hidden");
			})
			.on('click', function (d) {
				var circles = chart1.selectAll('circle');
				for (var i = 0; i < circles._groups[0].length; i++) {
					d3.select(circles._groups[0][i]).style("fill-opacity", 0.4);
				}
				var circlesTwo = noCaffeine.selectAll('circle');
				for (var i = 0; i < circlesTwo._groups[0].length; i++) {
					d3.select(circlesTwo._groups[0][i]).style("fill-opacity", 0.4);
				}
				d3.select(this)
		      		.style("fill-opacity", 1);
				createBarChart(d);
			});

	//Appends the circles to the scatterplot
	var noCaffeineNode = d3.select("#noCaffeineSVG")
	  	.append("g")
	  	.selectAll("circle")
	  	.data(csv)
	  	.enter()
	  	.append("circle")
	    	.attr("r", function(d){ 
	    		if (d.Caffeine == 0) {
	    			if (!d.Beverage_prep.includes("ilk")) {
		    			return 7;
		    		} else if (d.Beverage_prep.includes("onfat")) {
		    			return 7;
		    		}
	    		}
	    	})
	    	.attr("cx", function (d) {
	      		return xScale(d.Beverage + d.Beverage_prep);
	    	})
	    	.attr("cy", function (d) {
	      		return 150 / 5;
	    	})
	    	.style("fill", "#007343")
	    	.style("fill-opacity", 0.4)
	    	.attr("stroke", "#007343")
	    	.style("stroke-width", 2)
	    	.on("mouseover", function(){
		    	d3.select(this)
		      		.style("stroke", "black")
		    	return tooltip.style("visibility", "visible");
		    })
			.on("mousemove", function(d){
				tooltip.html(d.Beverage + " - " + d.Beverage_prep);
				return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
			})
			.on("mouseout", function(){
				d3.select(this)
		      		.style("stroke", "#007343")
				return tooltip.style("visibility", "hidden");
			})
			.on('click', function (d) {
				var circles = chart1.selectAll('circle');
				for (var i = 0; i < circles._groups[0].length; i++) {
					d3.select(circles._groups[0][i]).style("fill-opacity", 0.4);
				}
				var circlesTwo = noCaffeine.selectAll('circle');
				for (var i = 0; i < circlesTwo._groups[0].length; i++) {
					d3.select(circlesTwo._groups[0][i]).style("fill-opacity", 0.4);
				}
				d3.select(this)
		      		.style("fill-opacity", 1);
				createBarChart(d);
			});
	
	//Sets up the physics for the circular packing
	var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y((height-150) / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.1).radius(function(d){ return (d.Caffeine / 8) + 2 }).iterations(1)) // Force that avoids circle overlapping

    //Adds the simulation to the circles
	simulation
	    .nodes(csv)
	    .on("tick", function(d){
	    	caffeineNode
				.attr("cx", function(d){ return d.x; })
				.attr("cy", function(d){ return d.y; })
	    });

	//Appends the x-axis to the scatterplot
	d3.select("#noCaffeineSVG")
	    .append("g")
	    .attr("transform", "translate(0," + (10) + ")")
	    .call(xAxis)
    	.attr("visibility", "hidden")
});
