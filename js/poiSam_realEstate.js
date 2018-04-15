var map;
var zoomLevel;
var overlaySet = [];
//the objected being represented by set S
var represented = [];
var represent;
var features = [];
var currentBounds = [];
var representSet = [];
/*
var drawingManager;
var customisedShape = [];
var selectionMode = 4;
*/
var recordRegionPro = [];
var kItem;
var Distance;
var max = [1510,1497,600,70,5000,5010];
var avgMax = [1510,1497,600,70,5000,5010];
var min = [12,0,24,2,12,50];
var oldBounds = [];

var previousZoomLevel;

var heapSim = [];

function panningWindow(){
  var mapBound = map.getBounds();
    var bounds = [];
    bounds[0] = mapBound.getNorthEast().lat();
    bounds[1] = mapBound.getSouthWest().lat();
    bounds[2] = mapBound.getNorthEast().lng();
    bounds[3] = mapBound.getSouthWest().lng();

    //console.log(bounds);
    //console.log(oldBounds);
    //var boundData = [];
    var oldPro = [];
    var oldRepresented = [];
    for(var i=0;i<representSet.length;i++){
      if(representSet[i].Lat<bounds[0] && representSet[i].Lat>bounds[1] && representSet[i].Lng<bounds[2] && representSet[i].Lng>bounds[3]){
          oldPro.push(representSet[i]);
          var i_represented = represented[i];
          oldRepresented.push(i_represented);
      }
    }

    representSet = [];
    represented = [];

    var old = oldPro.length;
    var newPro = kItem - old;

    for(var i =0; i<old; i++){
      representSet.push(oldPro[i]);
      represented.push(oldRepresented[i]);
    }

    d3.csv("melbourne_vis.csv",function(error,data)
    {
        if(error) throw error;
        var pro1 = [];
        var pro2 = [];
        for(var i=0;i<data.length;i++){
          //if(data[i].Lat<oldBounds[0] && data[i].Lat>oldBounds[1] && data[i].Lng<oldBounds[2] && data[i].Lng>oldBounds[3]){
           // pro1.push(data[i]);
          
      //}
      if(data[i].Lat<bounds[0] && data[i].Lat>bounds[1] && data[i].Lng<bounds[2] && data[i].Lng>bounds[3]){
        if(data[i].Lat > oldBounds[0] || data[i].Lat<oldBounds[1] || data[i].Lng>oldBounds[2] || data[i].Lng<oldBounds[3])
          pro2.push(data[i]);
      }
    }

    console.log(pro2);

    //var difference = getDifference(pro2,pro1);

    representative(pro2,newPro);

        console.log(representSet);
        console.log(represented);

        d3Show(representSet);
        
    });
}

function colores_google(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[n % colores_g.length];
}

function zoomOutWindow(){
  SOSWindow();
}

function zoomInWindow(){
  SOSWindow();
}

function SOSWindow()
{
  representSet = [];
    var mapBound = map.getBounds();
    var bounds = [];
    bounds[0] = mapBound.getNorthEast().lat();
    bounds[1] = mapBound.getSouthWest().lat();
    bounds[2] = mapBound.getNorthEast().lng();
    bounds[3] = mapBound.getSouthWest().lng();
    currentBounds = bounds; 
    var boundData = [];

    d3.csv("melbourne_vis.csv",function(error,data)
    {
        if(error) throw error;

        
        for(var i=0; i<data.length; i++){

           if(data[i].Lat < bounds[0] && data[i].Lat > bounds[1] && data[i].Lng < bounds[2] && data[i].Lng > bounds[3]){
            boundData.push(data[i]);

           }

           
        }
        
        representative(boundData,kItem);
        setRepresentedSet(boundData);

        console.log(representSet);
        //console.log(represented);

        d3Show(representSet);
        
    });

}

/*function subBounds(bounds){

}*/

function simObject_I_J(features,O_i,O_j)
{
    //var avgMax = [1510,1497,600,70,5000,5010];
    //var min = [12,0,24,2,12,50];
    O_i.Price_k = (O_i.Price_k-12)/1498;
    O_j.Price_k = (O_j.Price_k-12)/1498;
    O_i.income_md = (O_i.income_md-0)/1497;
    O_j.income_md = (O_j.income_md-0)/1497;
    O_i.sch_rank = (O_i.sch_rank-24)/576;
    O_j.sch_rank = (O_j.sch_rank-24)/576;
    O_i.Time_train = (O_i.Time_train -2)/68;
    O_j.Time_train = (O_j.Time_train -2)/68;
    O_i.shopping_center = (O_i.shopping_center -12)/4988;
    O_j.shopping_center = (O_j.shopping_center -12)/4988;
    if(O_i.Land_size > 0)
      O_i.Land_size = (O_i.Land_size -50)/4960;
    else
      O_i.Land_size = 0.02;

    //150 - 50/4960
    if(O_j.Land_size > 0)
      O_j.Land_size = (O_j.Land_size -50)/4960;
    else
      O_j.Land_size = 0.02;
                  
    var i_vector = [];
    var j_vector = [];
    i_vector.push(O_i.Price_k);
    i_vector.push(O_i.income_md);
    i_vector.push(O_i.sch_rank);
    i_vector.push(O_i.Time_train);
    i_vector.push(O_i.shopping_center);
    i_vector.push(O_i.Land_size);

    j_vector.push(O_j.Price_k);
    j_vector.push(O_j.income_md);
    j_vector.push(O_j.sch_rank);
    j_vector.push(O_j.Time_train);
    j_vector.push(O_j.shopping_center);
    j_vector.push(O_j.Land_size);

    var sim = simMetrics(i_vector,j_vector);
    return sim;
}

function simMetrics(i_vector,j_vector){
  //cosine
  var i_mode = 0;
  var j_mode = 0;
  var cos = 0
  for(var i = 0;i < 6; i++){
    cos = cos + i_vector[i]*j_vector[i];
    i_mode = i_mode + i_vector[i]*i_vector[i];
    j_mode = j_mode + j_vector[i]*j_vector[i];
  }

  i_mode = Math.sqrt(i_mode);
  j_mode = Math.sqrt(j_mode);

  var sim = cos/(i_mode * j_mode);

  return sim;

}

function sim_o_S(object,Set){
  var n = Set.length;
  var maxSim = 0;
  for(var i = 0; i< n; i++){
    var temp = Set[i];
    var tempSim = simObject_I_J([],object,temp);
    if(tempSim > maxSim)
      maxSim = tempSim;
//need to record the max index n?
  }
  return maxSim;
}

function sim_S_O(Set,O){
  var num = O.length;
  //o.w set to be the same
  var sum = 0
  for(var i = 0; i<num; i++){
    sum += sim_o_S(O[i],Set);
  }
  var avgSim = sum / num;
  return avgSim;
}

function distanceConflict(bounds,a,b,scale){
  //var scale = Distance * 0.01;
  var latDist = (bounds[0] - bounds[1]) * scale;
  var lngDist = (bounds[2] - bounds[3]) * scale;
  if(Math.abs(a.Lat-b.Lat) <= latDist || Math.abs(a.Lng-b.Lng) <= lngDist )
    return false;
  else
    return true;
  //data[i].Lat < bounds[0] && data[i].Lat > bounds[1] && data[i].Lng < bounds[2] && data[i].Lng > bounds[3]
}

function representative(data,k){

        greedySelect(data,k);
}



function initialHeap(O){
  heapSim = [];
  var num = O.length;
  for(var i = 0; i < num; i++){
    var tempSet = [];
    tempSet.push(O[i]);
    var simBound = sim_S_O(tempSet,O);
    var tupleSim = new Array(3);;
    tupleSim[0]=i;
    tupleSim[1]=simBound;
    tupleSim[2]=0;
    heapSim.push(tupleSim);
  }


  heapSim.sort(function(x,y){
    if(y[1] > x[1])
      return 1;
    else if(y[1] == x[1] && x[0] > y[0])
      return 1;
    else
      return -1;
  });

}

function setRepresentedSet(O){
  //represented = new Array();
  //for(var i = 0; i < representSet.length; i++){
  //  represented[i] = new Array();
  //}
  for(var k = 0; k<representSet.length; k++){
    k_set = [];

  for(var i =0; i<O.length; i ++){
    var low = simObject_I_J([],O[i],representSet[k]);
    for(var j =0; j<representSet.length; j++){
      var temp = representSet[j];
      var tempSim = simObject_I_J([],O[i],temp);
      if(tempSim > low){
       break;

      }
    }
    if(j == representSet.length)
    //represented[j].push(O[i]);
      k_set.push(O[i]);

  }
  represented.push(k_set);
}
}


function greedySelect(O,k){
  initialHeap(O);
  NewrepresentSet = [];
  while(NewrepresentSet.length < k && heapSim.length > 0){

    console.log(heapSim);

    var top = heapSim[0];

    while(top[2] != NewrepresentSet.length){
      var tempSet = [];
      for(var j =0; j<NewrepresentSet.length; j++){
        tempSet.push(NewrepresentSet[j]);
      }
      tempSet.push(O[top[0]]);
      var delta = sim_S_O(tempSet,O) - top[1];
      top[1] = delta;
      top[2] = NewrepresentSet.length;

      var j = 0;
      for(var i=1; i<heapSim.length; i++){
        
        if(delta < heapSim[i][1])
        {
          var temp = heapSim[i];
          heapSim[i] = heapSim[j];
          heapSim[j] = temp;
          j = i;
        }
        else 
          break;
      }
      top = heapSim[0];
    }

    var selected = O[top[0]];
    //representSet.push(selected);
    NewrepresentSet.push(selected);

    console.log(representSet);

    var scale = Distance * 0.01;
    //console.log(heapSim);
    var heapNum = heapSim.length;
    var tempHeap = [];

    for(var i = 1; i < heapNum; i++){
      var index = heapSim[i][0];

      var t = O[index];
      if(distanceConflict(currentBounds,selected,t,scale))
        //heapSim.splice(i,1);
        tempHeap.push(heapSim[i]);
    }

    //heapSim = [];
    heapSim = tempHeap;
  }
}

function initMap(){
  kItem = 20;
  Distance = 1;
  //selectOnMap();
  var slider = document.getElementById("myRange");
  var output = document.getElementById("kItem");
  output.innerHTML = "Value/k:"+slider.value;

slider.oninput = function() {
  output.innerHTML = "Value/k:"+this.value;
  kItem = this.value;
  SOSWindow();
}
  var sliderDist = document.getElementById("distRange");
  var outputDist = document.getElementById("Distance");
  outputDist.innerHTML = "Distance:"+sliderDist.value;

  sliderDist.oninput = function() {
  outputDist.innerHTML = "Distance:"+this.value;
  Distance = this.value;
  SOSWindow();
  }

    SOSWindow();

    previousZoomLevel = map.getZoom();

    map.addListener('dragstart',function()
    {
      var mapBound = map.getBounds();
    oldBounds[0] = mapBound.getNorthEast().lat();
    oldBounds[1] = mapBound.getSouthWest().lat();
    oldBounds[2] = mapBound.getNorthEast().lng();
    oldBounds[3] = mapBound.getSouthWest().lng();


    })

    map.addListener('dragend',function(){
    panningWindow();
    });

    map.addListener('zoom_changed',function(){
      var newZoomLevel = map.getZoom();
      if(newZoomLevel<previousZoomLevel)
        zoomOutWindow();
      else
        zoomInWindow();
      previousZoomLevel = newZoomLevel;
    
    });
  
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
                    .attr("class","marker");         


                //var r =15;

                var points = [];
                var feature = [];
                var polygon = [];

                for(var i =0; i<data.length;i++){
                  feature[i] =[];
                  var center_x = 30;
                  var center_y =30;
                  var size_of_edge = 30;
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
                        if(j == 1 || j == 0 || j== 5)
                        //location=0.3+(feature[i][j]-min[j])/(max[j]-min[j])*0.7;
                        location = 0.3 + feature[i][j]*0.7;
                        else
                      //location=0.3+(max[j]-feature[i][j])/(max[j]-min[j])*0.7;
                        location = 0.7 - feature[i][j]*0.3

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
                    .attr("fill-opacity",0.6)
                    .on("click",function(d,i){
                      showRepresented(data,i);

                    });

                    //console.log(represented);

                    marker.append("text")
                      .text(function(d,i){
                        //return represented[i].length;
                        //return 10;
                      })
                      .attr("x",25)
                      .attr("y",35)
                      .attr("font-size", 15)
                      .attr("font-family", "simsum")
                      .attr("font-style", "italic");
                      //.attr("font-style", "italic");

               
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
  //var tempData = data;
  var highlight = data[i];
  var representedSet = represented[i];
  //representSet.push(highlight);
  //tempData.splice(i,1);
  console.log(representedSet);
  //console.log(tempData);
  //var sim =[];
  var index = i;
  //sim = getSimItems(representedSet,3);
  //console.log(sim);
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
                    padding = 15;

                var points = [];

              

                var marker = layer.selectAll("svg")
                    .data(data)
                    .each(transform)
                    .enter()
                    .append("svg")
                    .each(transform)
                    .attr("class","hiden");         

                var points = [];
                var feature = [];
                var polygon = [];

                for(var i =0; i<data.length;i++){
                  feature[i] =[];
                  var center_x = 30;
                  var center_y =30;
                  var size_of_edge = 30;
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
                        if(j == 1 || j == 0 || j== 5)
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
                    .attr("stroke-opacity",0.3)
                    .attr("fill","white")
                    .attr("fill-opacity",0.3);

                 /*Drawing Axes*/
                for (var i = 0; i < 6; i++) {
                  
                var x_end = Math.cos(i * 2 * Math.PI / 6) * size_of_edge;
                var y_end = Math.sin(i * 2 * Math.PI / 6) * size_of_edge;
                lines[i] = marker.append("line")
                  .attr("x1", center_x)
                  .attr("y1", center_y)
                  .attr("x2", center_x + x_end)
                  .attr("y2", center_y + y_end)
                  .attr("stroke", "lightblue")
                  .attr("stroke-opacity",0.3)
                  .attr("stroke-width", "1.5px");

    
                }
                  
                    marker.append("polygon")
                    .attr("points", function(d,i){
                      return points[i];
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
                        return represented[i].length;
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
  d3Show(represent);
}


function setK(){
var slider = document.getElementById("myRange");
var output = document.getElementById("kItem");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = "Value/k: " +this.value;
}
}

