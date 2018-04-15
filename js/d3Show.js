var overlaySet = [];

function colores_google(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[n % colores_g.length];
}

function getRadius(num){
	if(num < 5)
		return 10;
	else if(num < 10)
		return 13;
	else if(num < 15)
		return 16;
	else if(num < 20)
		return 19;
	else if(num < 25)
		return 22;
	else if(num < 30)
		return 25;
	else
		return 28;
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
                    padding = 30;


                var marker = layer.selectAll("svg")
                    .data(data)
                    .each(transform)
                    .enter()
                    .append("svg")
                    .each(transform)
                    .attr("class","marker");     


                    marker.append("circle")
                    .attr("cx",padding)
                    .attr("cy",padding)
                    .attr("r",function(d,i){
                        return getRadius(heapList[i].length);
                    })
                    .attr("id", function(d,i){
                      return i;
                    })
                    .attr("stroke",function(d,i){
                        return colores_google(i);
                    })
                    .attr("stroke-opacity",1.0)
                    .attr("stroke-width","2px")
                    .attr("fill",function(d,i){
                        return colores_google(i);

                    })
                    .attr("fill-opacity",0.6)
                    .on("click",function(d,i){
                        showRepresented(data,i);
                    });
                    
               

                    marker.append("text")
                      .text(function(d,i){
                        return heapList[i].length;

                      })
                      .attr("x",25)
                      .attr("y",35)
                      .attr("font-size", 15)
                      .attr("font-family", "simsum")
                      .attr("font-style", "italic");
                      
                   
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

function initRepresentList(data,target){
  var div_name= "heatmap_div";
  heatmap(data,target,div_name);

}

function showRepresented(data,i){

  var highlight = data[i];
  var representedSet = heapList[i];
  console.log(representedSet);
  
  var index = i;
  
  deleteOverlay();
        var overlay = new google.maps.OverlayView();
        overlaySet.push(overlay);
        overlay.onAdd = function(){
            
          var  layer = d3.select(this.getPanes().overlayMouseTarget)
                .append("div")
                .attr("class","hidenProperty");

                    //draw each marker
            overlay.draw = function(){
                var projection = this.getProjection(),
                    padding = 30;


                var marker = layer.selectAll("svg")
                    .data(data)
                    .each(transform)
                    .enter()
                    .append("svg")
                    .each(transform)
                    .attr("class","hiden");  


                    marker.append("circle")
                    .attr("cx",padding)
                    .attr("cy",padding)
                    .attr("r",function(d,i){
                        return getRadius(heapList[i].length);
                    })
                    .attr("id", function(d,i){
                      return i;
                    })
                    .attr("stroke",function(d,i){
                        return colores_google(i);
                    })
                    .attr("stroke-opacity",function(d,i){
                      if(i == index)
                        return 0.7;
                      else
                        return 0.3;
                    }
                  )
                    .attr("stroke-width","1px")
                    .attr("fill",function(d,i){
                        return colores_google(i);

                    })
                    .attr("fill-opacity",function(d,i){
                      if(i == index)
                        return 0.7;
                      else
                        return 0.3;
                    });

              
                marker.append("text")
                      .text(function(d,i){
                        return heapList[i].length;
                      })
                      .attr("x",25)
                      .attr("y",35)
                      .attr("font-size", 15)
                      .attr("font-family", "simsum")
                      .attr("font-style", "italic");
                    
                

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
          d3.selectAll(".hiden")
                    .remove();

        };

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
                    .data(representedSet)
                    //.each(transform)
                    .enter()
                    .append("svg")
                    .each(transform)
                    .attr("class","show");         

                var r =15;
                var max = representedSet.length-1;

                show.append("circle")
                    .attr("cx",padding)
                    .attr("cy",padding)
                    .attr("r",4)
                    //.attr("height",7)
                    .attr("stroke",function(){
                        return colores_google(index);
                    })
                    .attr("stroke-opacity",1.0)
                    .attr("stroke-width","2px")
                    .attr("fill",function(d){
                        return colores_google(index);

                    })
                    .attr("fill-opacity",0.5);
                    
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

        initRepresentList(representedSet,highlight);
        showSimList();

}

function hiddenSimList(){
  $('.representList').css({'width':'0px'});
  $('#map').css({'width':'80%'});
  //$('#deleteButton').css({'display':'none'});
  /*var x = document.getElementById("deleteButton");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }*/
  d3Show(NewRepresentSet);
}


