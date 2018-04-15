

function heatmap(data, target, div_name){	

		d3.selectAll("svg").remove();
	
		var x_elements = ["Price_k", "Land_size",  "income_md", "sch_rank", "Time_train", "shopping_center"];
		var x_label = ["similarity", "price (k)", "land size (m^2)", "regional median income", "school ranking", "train time to CBD (min)", "shopping center (m)"]; 
		data.splice(0,0,target);
		
		var reversed =[1, 0, 0, 1, 1, 1];
		
		var y_elements = [];
		for(var i=0; i<data.length; i++){
			var t = "P" + i;
			y_elements.push(t);
		}
		
		console.log(y_elements);

		var data_sim=[];
		
		var data_vis=[];
		var data_ele=[];
		var temp_sim = [];

		for(var i=0; i<data.length; i++){
			temp_sim[i] = 1;
			for(var j=0; j<x_elements.length; j++){

				var temp_value = (data[i][x_elements[j]]- data[0][x_elements[j]]) / data[0][x_elements[j]];

				var difference = Math.abs(temp_value.toFixed(2));

				if(difference >1){
					difference = 1;
				}

				if(i==1){
					console.log(difference);
					console.log(temp_sim[i]);
				}

				
				temp_sim[i] -= difference/6;

			}
			temp_sim[i] = temp_sim[i].toFixed(2);
			data[i].sim = temp_sim[i];

		}

		data.sort(sortRule);

		for(var i=0; i< data.length; i++){
			data_sim[i] ={};
			data_sim[i].id ="P"+i;
			data_sim[i].property = "sim";
			data_sim[i].real_value =  data[i].sim;
			data_sim[i].value = parseFloat(data[i].sim)-1;

			for(var j=0; j<x_elements.length; j++){
				var data_temp={};
				data_temp.id = "P"+i;
				data_temp.property = x_elements[j];


				data_temp.real_value = data[i][x_elements[j]];
				if(data_temp.real_value == -1){
					data_temp.real_value="-";
				}
				
				data_temp.value = (data[i][x_elements[j]]- data[0][x_elements[j]]) / data[0][x_elements[j]];
				
				if(reversed[j] == 1){
					data_temp.value = 0 - data_temp.value;
				}
				data_ele.push(data_temp);

			}
		}

		var count = 0;
		for(var i=0;i<data.length; i++){
			//data[i].sim = data_sim[i].real_value;
			//data_sim[i].real_value = data_sim[i].real_value.toFixed(2);
			data_vis.push(data_sim[i]);
			for(var j=0; j<x_elements.length; j++){
				data_vis.push(data_ele[count]);
				count++;

			}
		}
		console.log(data_vis);

		x_elements.splice(0,0,"sim");
		
		var itemSize = 40, //x scale
			cellSize = 20,
			margin = {top: 120, right: 20, bottom: 20, left: 30};
		
		var div_height = document.getElementById(div_name).clientHeight;
		var div_width = document.getElementById(div_name).clientWidth;
      
		var width = div_width - margin.right - margin.left,
			height = div_height - margin.top - margin.bottom;
		
		var xScale = d3.scale.ordinal()
			.domain(x_elements)
			.rangeBands([0, x_elements.length * itemSize]);
		
		var xScale2 = d3.scale.ordinal()
			.domain(x_label)
			.rangeBands([0, x_label.length * itemSize]);

		var xAxis = d3.svg.axis()
			.scale(xScale2)
			.tickFormat(function (d) {
				return d;
			})
			.orient("top");

		var yScale = d3.scale.ordinal()
			.domain(y_elements)
			.rangeBands([0, y_elements.length * cellSize]);

		var yAxis = d3.svg.axis()
			.scale(yScale)
			.tickFormat(function (d) {
				return d;
			})
			.orient("left");
			
		var svg = d3.select('#'+div_name)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.selectAll('text')
			.attr('font-weight', 'normal')
			.attr("font-style", "italic");

		svg.append("g")
			.attr("class", "x axis")
			.call(xAxis)
			.selectAll('text')
			.attr('font-weight', 'normal')
			.style("text-anchor", "start")
			.attr("dx", ".8em")
			.attr("dy", ".5em")
			.attr("transform", function (d) {
				return "rotate(-50)";
			});
			
		
		
		var cells = svg.selectAll('rect')
			.data(data_vis)
			.enter().append('g').append('rect')
			.attr('width', itemSize-1)
			.attr('height', cellSize-1)
			.attr('y', function(d) { return yScale(d.id); })
			.attr('x', function(d) { return xScale(d.property); })
			.attr('fill', function(d) { return color_mapping(d.value); })
			.style("opacity", 0.6);
			
		console.log(data_vis);
		
		/*var text = svg.selectAll('text')
			.data(data_vis)
			.enter().append('g').append('text')
			.attr("x", function(d) { 
				console.log(d);
				return xScale(d.property)+ itemSize/3; 
				
			})
			.attr("y", function(d) { 
				return yScale(d.id) + cellSize/1.5; 
			})
			.text(function(d){ return d.real_value;})
			.attr("font-size", 10)
			.attr("font-family", "sans-serif")
			.attr("font-style", "italic");*/
			
		for(var i=0; i<data_vis.length; i++){
			svg.append("text")
			.attr("x", xScale(data_vis[i].property)+ itemSize/3 )
			.attr("y", yScale(data_vis[i].id) + cellSize/1.5 )
			.text(data_vis[i].real_value)
			.attr("font-size", 10)
			.attr("font-family", "sans-serif")
			.attr("font-style", "italic");
		}

		console.log(data_sim);
		data.splice(0,1);			

}

function color_mapping(value){
	var colors = ["#74c476", "#a1d99b", "#c7e9c0", "#e5f5e0",  "#f7fcf5", "#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a"];
	if(value>1){
		return colors[9];
	}else if(value<-1){
		return colors[0];
	}
	return colors[parseInt((value+1)*5)];
}

function sortRule(a,b){
	return b.sim - a.sim;
}

