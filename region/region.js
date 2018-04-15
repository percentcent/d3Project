var overlaySet = [];
var max = [1159,961,343,37,4789,586];
var min = [480,421,40,6,300,100];

/*
Price_k income_md  sch_rank. Time_train shopping_center Land_size
*/

function initMap(){
	d3.csv("selectedSuburb.csv",function(error,data)
    {
    	if(error) throw error;
    	d3Show(data);
    });

}

function colores_google(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[n % colores_g.length];
}

function d3Show(data){
        
          //add the container div
        deleteOverlay();
        var overlay = new google.maps.OverlayView();
        overlaySet.push(overlay);
        overlay.onAdd = function(){
            
        var  layer = d3.select(this.getPanes().overlayMouseTarget)
                .append("div")
                .attr("class","property");

            //draw each marker
            overlay.draw = function(){
                var projection = this.getProjection(),
                    padding = 15;

                var points = [];

              

                var marker = layer.selectAll("svg")
                    .data(data)
                    .each(transform)
                    .enter()
                    .append("svg")
                    .each(transform)
                    .attr("class",function(d,i){
                    	if(i==0)
                    		return "target";
                    	else
                    		return "marker";
                    });         


                //var r =15;

                var points = [];
                var feature = [];
                var polygon = [];

                for(var i =0; i<data.length;i++){
                  feature[i] =[];
                  var center_x = 60;
                  var center_y =65;
                  var size_of_edge = 40;
                  points[i]="";

                  feature[i].push(data[i].Price_k);
                  feature[i].push(data[i].income_md);
                  feature[i].push(data[i].sch_rank);
                  feature[i].push(data[i].Time_train);
                  feature[i].push(data[i].shopping_center);
                  feature[i].push(data[i].Land_size);

                  for(var j=0;j<6;j++){
                    var location;
                    if(feature[i][j]>0)
                       {
                        if(j == 1|| j== 5)
                        location=0.3+(feature[i][j]-min[j])/(max[j]-min[j])*0.7;
                        else
                      location=0.3+(max[j]-feature[i][j])/(max[j]-min[j])*0.7;

                       }
                     else
                      location = 0.5;
                    var value_location_x = center_x + Math.cos(j * 2 * Math.PI / 6) * size_of_edge * location;
                    var value_location_y = center_y + Math.sin(j * 2 * Math.PI / 6) * size_of_edge * location;
                    points[i]+=value_location_x+","+value_location_y+" ";

                  }

                  
                }

                 var outPoints;
                outPoints ="";

                for (var i = 0; i < 6; i++){
                                  var x_end = Math.cos(i * 2 * Math.PI / 6) * size_of_edge;
                var y_end = Math.sin(i * 2 * Math.PI / 6) * size_of_edge;

                var x = center_x + x_end;
                var y = center_y + y_end;

                  outPoints += x + "," + y + " ";
                }

                marker.append("polygon")
                    .attr("points", outPoints)
                    .attr("stroke", "lightblue")
                    .attr("stroke-width", "1.5px")
                    .attr("stroke-opacity",0.6)
                    .attr("fill","white")
                    .attr("fill-opacity",0.6);

                 /*Drawing Axes*/
                 var lines =[];
                for (var i = 0; i < 6; i++) {
                  
                var x_end = Math.cos(i * 2 * Math.PI / 6) * size_of_edge;
                var y_end = Math.sin(i * 2 * Math.PI / 6) * size_of_edge;
                lines[i] = marker.append("line")
                  .attr("x1", center_x)
                  .attr("y1", center_y)
                  .attr("x2", center_x + x_end)
                  .attr("y2", center_y + y_end)
                  .attr("stroke", "lightblue")
                  .attr("stroke-opacity",0.6)
                  .attr("stroke-width", "1.5px");

    
                }
                  
                    marker.append("polygon")
                    .attr("class",function(d,i){
                    	if(i==0)
                    		return "target_poly"
                    	else
                    		"common_poly"
                    })
                    .attr("points", function(d,i){
                      return points[i];
                    })
                    .attr("id", function(d,i){
                      return i;
                    })
                    .attr("stroke",function(d,i){
                        return colores_google(i);
                    })
                    .attr("stroke-opacity",1.0)
                    .attr("stroke-width","1px")
                    .attr("fill",function(d,i){
                    	return colores_google(i);                        

                    })
                    .attr("fill-opacity",0.6);

                    var targetSuburb = d3.select(".target")
                    	.on("click",function(){
                    	
                        showRepresented();

                    	});

                    marker.append("text")
                      .attr("x",25)
                      .attr("y",65)
                      .attr("font-size", 15)
                      .attr("font-family", "sans-serif")
                     .attr("font-style", "italic")
                      .text(function(d){
                      	return d.Suburb;
                      });

                   // console.log(represented);
                   var strs = ["Good public school","Close to shopping center"];

                   var text1 = d3.select(".target")
                   	  .append("text")
                      .attr("x",0)
                      .attr("y",110)
                      .attr("font-size", 13)
                      .attr("font-family", "sans-serif")
                      .style('fill', '#3366cc')
                      .attr("font-style", "italic")
                      .text("Good public school");

                    var text2 = d3.select(".target")
                   	  .append("text")
                      .attr("x",0)
                      .attr("y",20)
                      .attr("font-size", 13)
                      .attr("font-family", "sans-serif")
                      .style('fill', '#3366cc')
                      .attr("font-style", "italic")
                      .text("Close to shopping center");

                     /*text.selectAll("tspan")
                     	.data(strs)
                     	.enter()
                     	.append("tspan")
                     	.attr("x",text.attr("x"))
						.attr("dy","1em")
						.text(function(d){
							return d;
						});*/

               
                console.log(outPoints);

                   
                function transform(d){
                    d = new google.maps.LatLng(d.Lat,d.Lng);
                    d = projection.fromLatLngToDivPixel(d);
                    return d3.select(this)
                        .style("left",(d.x - padding) + "px")
                        .style("top",(d.y - padding) + "px")
                }

            };
        };

        overlay.onRemove = function()
        {
          d3.selectAll(".property")
                    .remove();

        };
        setOverlay(map);
}

function showRepresented(){
	//d3.selectAll(".common_poly")
	//	.attr("fill-opacity",0.2);

	d3.csv("region.csv",function(error,data)
    {
    	if(error) throw error;
    	
    	var overlayHighlight = new google.maps.OverlayView();
        overlaySet.push(overlayHighlight);
        overlayHighlight.onAdd = function(){
            
            var layerHighlight = d3.select(this.getPanes().overlayMouseTarget)
                .append("div")
                .attr("class","ShowProperty");

            //draw each marker
            overlayHighlight.draw = function(){
                var projection = this.getProjection(),
                    padding = 15;

                var show = layerHighlight.selectAll("svg")
                    .data(data)
                    .each(transform)
                    .enter()
                    .append("svg")
                    .each(transform)
                    .attr("class","show");    

                console.log(data);     


                var r =10;

                show.append("circle")
                    .attr("cx",30)
                    .attr("cy",30)
                    .attr("r",r)
                    .attr("stroke","#3366cc")
                    .attr("stroke-opacity",1.0)
                    .attr("stroke-width","2px")
                    .attr("fill","#3366cc")
                    .attr("fill-opacity",0.5);

                 show.append("text")
                      .attr("x",10)
                      .attr("y",30)
                      .attr("font-size", 13)
                      .attr("font-family", "sans-serif")
                      .attr("font-style", "italic")
                      .text(function(d){
                      	return d.Suburb;
                      });
                    
                    function transform(d){
                    d = new google.maps.LatLng(d.Lat,d.Lng);
                    d = projection.fromLatLngToDivPixel(d);
                    return d3.select(this)
                        .style("left",(d.x - padding) + "px")
                        .style("top",(d.y - padding) + "px")
                }

            };
        };

        overlayHighlight.onRemove = function()
        {
          d3.selectAll(".show").remove();

        };
        setOverlay(map);
    });

}


function setOverlay(map){
  for(var i = 0; i < overlaySet.length; i++){
    overlaySet[i].setMap(map);
  }
}

function deleteOverlay()
{
  setOverlay(null);
  overlaySet = [];
}