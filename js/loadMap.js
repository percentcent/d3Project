var map;
var zoomLevel;
var overlaySet = [];
var represented = [];
var represent;
var drawingManager;
var customisedShape = [];
var selectionMode = 4;
var recordRegionPro = [];
var kItem;
var max = [1510,1497,600,70,5000,5010];
var avgMax = [1510,1497,600,70,5000,5010];
var min = [12,0,24,2,12,50];
var oldBounds = [];


function panningWindow(){
  var mapBound = map.getBounds();
    var bounds = [];
    bounds[0] = mapBound.getNorthEast().lat();
    bounds[1] = mapBound.getSouthWest().lat();
    bounds[2] = mapBound.getNorthEast().lng();
    bounds[3] = mapBound.getSouthWest().lng();

    console.log(bounds);
    console.log(oldBounds);
    //var boundData = [];
    var oldPro = [];
    var oldRepresented = [];
    for(var i=0;i<represent.length;i++){
      if(represent[i].Lat<bounds[0] && represent[i].Lat>bounds[1] && represent[i].Lng<bounds[2] && represent[i].Lng>bounds[3]){
          oldPro.push(represent[i]);
          var i_represented = represented[i];
          oldRepresented.push(i_represented);
      }
    }

    represent = [];
    represented = [];

    var old = oldPro.length;
    var newPro = kItem - old;

    for(var i =0; i<old; i++){
      represent.push(oldPro[i]);
      represented.push(oldRepresented[i]);
    }

    d3.csv("melbourne_vis.csv",function(error,data)
    {
        if(error) throw error;
        var pro1 = [];
        var pro2 = [];
        for(var i=0;i<data.length;i++){
          if(data[i].Lat<oldBounds[0] && data[i].Lat>oldBounds[1] && data[i].Lng<oldBounds[2] && data[i].Lng>oldBounds[3]){
            pro1.push(data[i]);
          
      }
      if(data[i].Lat<bounds[0] && data[i].Lat>bounds[1] && data[i].Lng<bounds[2] && data[i].Lng>bounds[3]){
          pro2.push(data[i]);
      }
    }

    var difference = getDifference(pro2,pro1);

    representative(difference,newPro);

        console.log(represent);
        console.log(represented);

        d3Show(represent);
        
    });
}

function colores_google(n) {
  var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  return colores_g[n % colores_g.length];
}

function updateWindow()
{
    var mapBound = map.getBounds();
    var bounds = [];
    bounds[0] = mapBound.getNorthEast().lat();
    bounds[1] = mapBound.getSouthWest().lat();
    bounds[2] = mapBound.getNorthEast().lng();
    bounds[3] = mapBound.getSouthWest().lng();
    //var boundData = [];

    d3.csv("melbourne_vis.csv",function(error,data)
    {
        if(error) throw error;

        var subBoundGroups = subBounds(bounds);
        var group = [];
        group[0] = [];
        group[1] = [];
        group[2] = [];
        group[3] = [];
        group[4] = [];
        group[5] = [];
        group[6] = [];
        group[7] = [];
        for(var i=0; i<data.length; i++){

           if(data[i].Lat < subBoundGroups[0][0] && data[i].Lat > subBoundGroups[0][1] && data[i].Lng < subBoundGroups[0][2] && data[i].Lng > subBoundGroups[0][3]){
              if(data[i].bedroom>2){
                group[0].push(data[i]);
              }
              else{
                group[1].push(data[i]);
              }
           }
           else if(data[i].Lat < subBoundGroups[1][0] && data[i].Lat > subBoundGroups[1][1] && data[i].Lng < subBoundGroups[1][2] && data[i].Lng > subBoundGroups[1][3]){
              if(data[i].bedroom>2){
                group[2].push(data[i]);
              }
              else{
                group[3].push(data[i]);
              }
           }

           else if(data[i].Lat < subBoundGroups[2][0] && data[i].Lat > subBoundGroups[2][1] && data[i].Lng < subBoundGroups[2][2] && data[i].Lng > subBoundGroups[2][3]){
              if(data[i].bedroom>2){
                group[4].push(data[i]);
              }
              else{
                group[5].push(data[i]);
              }
           }

           else if(data[i].Lat < subBoundGroups[3][0] && data[i].Lat > subBoundGroups[3][1] && data[i].Lng < subBoundGroups[3][2] && data[i].Lng > subBoundGroups[3][3]){
              if(data[i].bedroom>2){
                group[6].push(data[i]);
              }
              else{
                group[7].push(data[i]);
              }
           }
           
        }
        var max = 0;
        var k = 0;
        for(var i=0;i<8;i++){
          if(group[i].length > max)
          {
            max = group[i].length;
            k = i;
          }
        }

        var avg = Math.floor(kItem/8);
        var left = kItem - 8*avg;
        represent = [];
        represented = [];
        for(var i =0;i<8;i++){
          if(i != k)
            representative(group[i],avg);
          else
            representative(group[i],avg+left);
        }

        console.log(represent);
        console.log(represented);

        d3Show(represent);
        
    });

}

function subBounds(bounds){
  var midLat = (bounds[0]+bounds[1])/2;
  var midLng = (bounds[2]+bounds[3])/2;

  var subBounds = [];
  var tempbound = [];
  tempbound[0] = bounds[0];
  tempbound[1] = midLat;
  tempbound[2] = midLng;
  tempbound[3] = bounds[3];
  subBounds.push(tempbound);

  tempbound = [];
  tempbound[0] = bounds[0];
  tempbound[1] = midLat;
  tempbound[2] = bounds[2];
  tempbound[3] = midLng;
  subBounds.push(tempbound);

  tempbound = [];
  tempbound[0] = midLat;
  tempbound[1] = bounds[1];
  tempbound[2] = midLng;
  tempbound[3] = bounds[3];
  subBounds.push(tempbound);

  tempbound = [];
  tempbound[0] = midLat;
  tempbound[1] = bounds[1];
  tempbound[2] = bounds[2];
  tempbound[3] = midLng;
  subBounds.push(tempbound);

  return subBounds;

}

function initMap(){
  kItem = 20;
  selectOnMap();
  var slider = document.getElementById("myRange");
  var output = document.getElementById("kItem");
  output.innerHTML = "Value/k:"+slider.value;

slider.oninput = function() {
  output.innerHTML = "Value/k:"+this.value;
  kItem = this.value;
  updateWindow();
}
    updateWindow();

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
    updateWindow();
    });
  
}



function getSimItems(arr,count){
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }

    return shuffled.slice(min);
}

function getRepresentItems(data,count)
{
  var represent =[];
  var n = data.length;
  var gap = Math.floor(n/count);
  for(var i = 0; i<count; i++){
    var r = Math.random();
    var index = i*gap + Math.floor(r*gap);
    represent.push(index);
  }
  return represent;
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

                    console.log(represented);

                    marker.append("text")
                      .text(function(d,i){
                        return represented[i].length;
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
  var representSet = represented[i];
  //representSet.push(highlight);
  //tempData.splice(i,1);
  console.log(representSet);
  //console.log(tempData);
  var sim =[];
  var index = i;
  sim = getSimItems(representSet,3);
  console.log(sim);
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
                    .data(representSet)
                    //.each(transform)
                    .enter()
                    .append("svg")
                    .each(transform)
                    .attr("class","show");         


                var r =15;
                var max = representSet.length-1;

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

        initRepresentList(representSet,highlight);
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

function distanceCheck(dataIndex,data){
  var mapBound = map.getBounds();
    var bounds = [];
    bounds[0] = mapBound.getNorthEast().lat();
    bounds[1] = mapBound.getSouthWest().lat();
    bounds[2] = mapBound.getNorthEast().lng();
    bounds[3] = mapBound.getSouthWest().lng();
    var latGap = Math.abs((bounds[0] - bounds[1])/50);
    var lngGap = Math.abs((bounds[2] - bounds[3])/50);
  var max = dataIndex.length;
  var flag = true;
  for(var i = 0; i < max-1; i++){
    if(!flag)
      break;
    for(var j = i+1; j<max; j++){
      if(Math.abs(data[dataIndex[i]].Lat - data[dataIndex[i]].Lat) < latGap || Math.abs(data[dataIndex[i]].Lng - data[dataIndex[i]].Lng) < lngGap)
        {
          flag= false;
          break;
        }
    }
  }

  return flag;

}

function representative(data,k){

        //represent = [];
        var representIndex = [];
        var indexList = [];
        for(var i = 0; i < data.length; i++){
          indexList.push(i);
        }
        representIndex = getRepresentItems(indexList,k);
        //console.log( getRepresentItems(indexList,k) );
        //represented = [];
        /*while(!distanceCheck(representIndex,data))
        {
          representIndex = getRepresentItems(indexList,k);

        }*/
        for(var i = 0; i < k; i++){
          represent.push(data[representIndex[i]]);

        }

        for(var i = 0; i < k; i++){
          var i_represented = [];
          for(var m = representIndex[i]+1; m < data.length; m++)
          {
            var max;
            if(i == k-1)
              max = data.length;
            else
              max = representIndex[i+1]
            if(m<max)
              i_represented.push(data[m]);
            else
              break;

          }
          represented.push(i_represented);
        }
        //console.log(represented);



        //d3Show(represent);
}

function getRepresentative(data,k)
{
  represent = [];
  represented = [];
  representative(data,k);
  d3Show(represent);
}

function selectOnMap()
{
   drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
            drawingModes: ['circle', 'polygon', 'rectangle']
          },
          circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 0.3,
            strokeWeight: 3,
            clickable: false,
            editable: false,
            zIndex: 1
          },
          rectangleOptions:{
            fillColor: '#ffff00',
            fillOpacity: 0.3,
            strokeWeight: 3,
            clickable: false,
            editable: false,
            zIndex: 1
          },
          polygonOptions:{
            fillColor: '#ffff00',
            strokeWidth: 0,
            clickable: false,
            zIndex: 1
          }
        });

   google.maps.event.addListener(drawingManager, 'circlecomplete', function (circle) {
    var maxShape;
    if(selectionMode==1)
      maxShape=1;
    else
      maxShape=2;
      
      switch(selectionMode){ 
        case 1:
        firstCircleSelection(circle);
      break;

      case 2:

      var num = customisedShape.length;
      if(num == 0)
        firstCircleSelection(circle);
      else if(num == 1){
        secondCircleSelection(circle,2);

      }
      else if(num == 2){
        firstCircleSelection(circle);
      }
      break;

      case 3:
      var num = customisedShape.length;
      if(num == 0)
        firstCircleSelection(circle);
      else if(num == 1){
        secondCircleSelection(circle,3);
        
      }
      else if(num == 2){
        firstCircleSelection(circle);
      }
      break;

      case 4:
      var num = customisedShape.length;
      if(num == 0)
        firstCircleSelection(circle);
      else if(num == 1){
        secondCircleSelection(circle,4);

        
      }
      else if(num == 2){
        firstCircleSelection(circle);
      }
      break;

      }
      

   });

   google.maps.event.addListener(drawingManager, 'rectanglecomplete', function (rectangle){
    var maxShape;
    if(selectionMode==1)
      maxShape=1;
    else
      maxShape=2;
      
      switch(selectionMode){ 
        case 1:
        firstRectSelection(rectangle);
      break;

      case 2:

      var num = customisedShape.length;
      if(num == 0)
        firstRectSelection(rectangle);
      else if(num == 1){
        secondRectSelection(rectangle,2);

      }
      else if(num == 2){
        firstRectSelection(rectangle);
      }
      break;

      case 3:
      var num = customisedShape.length;
      if(num == 0)
        firstRectSelection(rectangle);
      else if(num == 1){
        secondRectSelection(rectangle,3);
        
      }
      else if(num == 2){
        firstRectSelection(rectangle);
      }
      break;

      case 4:
      var num = customisedShape.length;
      if(num == 0)
        firstRectSelection(rectangle);
      else if(num == 1){
        secondRectSelection(rectangle,4);

        
      }
      else if(num == 2){
        firstRectSelection(rectangle);
      }
      break;

      }
      


   });


   google.maps.event.addListener(drawingManager, 'polygoncomplete', function (polygon) {
      var boundData = [];
      deleteAllShape();
      customisedShape.push(polygon);
            google.maps.Polygon.prototype.containsLatLng = function(latLng) {
  // Exclude points outside of bounds as there is no way they are in the poly

  var inPoly = false,
    bounds, lat, lng,
    numPaths, p, path, numPoints,
    i, j, vertex1, vertex2;

  // Arguments are a pair of lat, lng variables
  if (arguments.length == 2) {
    if (
      typeof arguments[0] == "number" &&
      typeof arguments[1] == "number"
    ) {
      lat = arguments[0];
      lng = arguments[1];
    }
  } else if (arguments.length == 1) {
    bounds = this.getBounds();

    if (!bounds && !bounds.contains(latLng)) {
      return false;
    }
    lat = latLng.lat();
    lng = latLng.lng();
  } else {
    console.log("Wrong number of inputs in google.maps.Polygon.prototype.contains.LatLng");
  }

  // Raycast point in polygon method

  numPaths = this.getPaths().getLength();
  for (p = 0; p < numPaths; p++) {
    path = this.getPaths().getAt(p);
    numPoints = path.getLength();
    j = numPoints - 1;

    for (i = 0; i < numPoints; i++) {
      vertex1 = path.getAt(i);
      vertex2 = path.getAt(j);

      if (
        vertex1.lng() <  lng &&
        vertex2.lng() >= lng ||
        vertex2.lng() <  lng &&
        vertex1.lng() >= lng
      ) {
        if (
          vertex1.lat() +
          (lng - vertex1.lng()) /
          (vertex2.lng() - vertex1.lng()) *
          (vertex2.lat() - vertex1.lat()) <
          lat
        ) {
          inPoly = !inPoly;
        }
      }

      j = i;
    }
  }

  return inPoly;
};

if (!google.maps.Polygon.prototype.getBounds) {
  google.maps.Polygon.prototype.getBounds = function(latLng) {
    var bounds = new google.maps.LatLngBounds(),
      paths = this.getPaths(),
      path,
      p, i;

    for (p = 0; p < paths.getLength(); p++) {
      path = paths.getAt(p);
      for (i = 0; i < path.getLength(); i++) {
        bounds.extend(path.getAt(i));
      }
    }

    return bounds;
  };
}

      d3.csv("melbourne_vis.csv",function(error,data)
    {
        if(error) throw error;
        for(var i=0; i<data.length; i++){

           var latLng = new google.maps.LatLng(data[i].Lat, data[i].Lng);
           if(polygon.containsLatLng(latLng))
            boundData.push(data[i]);
        }
        
        
        getRepresentative(boundData,kItem);
        
    });
      

   });


        drawingManager.setMap(map);

}

function clearOnMap(){
  deleteAllShape();
  updateWindow();
  drawingManager.setMap(null);
}

function deleteAllShape() {
  for (var i=0; i < customisedShape.length; i++)
  {
    customisedShape[i].setMap(null);
  }
  customisedShape = [];
}

function firstCircleSelection(circle){
      deleteAllShape();
      recordRegionPro = [];
      customisedShape.push(circle);
      google.maps.Circle.prototype.contains = function(latLng) {
      return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
    };
      //console.log(bounds);
      var boundData = [];
      d3.csv("melbourne_vis.csv",function(error,data)
      {
        if(error) throw error;
        
        for(var i=0; i<data.length; i++){

           var latLng = new google.maps.LatLng(data[i].Lat, data[i].Lng);
           if(circle.contains(latLng))
           {
            boundData.push(data[i]);
            recordRegionPro.push(data[i]);

           }
            
        }
        //console.log(recordRegionPro.length);
        
        getRepresentative(boundData,kItem);
        
      });

}

function firstRectSelection(rectangle){
      recordRegionPro = [];
      var bounds = rectangle.getBounds();
      deleteAllShape();
      customisedShape.push(rectangle);
      //console.log(bounds);
      var boundData = [];
      d3.csv("melbourne_vis.csv",function(error,data)
    {
        if(error) throw error;
        for(var i=0; i<data.length; i++){

           var latLng = new google.maps.LatLng(data[i].Lat, data[i].Lng);
           if(bounds.contains(latLng))
            boundData.push(data[i]);
        }
      
        getRepresentative(boundData,kItem);
        
    });

  
}

function secondRectSelection(rectangle,selectMode){
    customisedShape.push(rectangle);
     var bounds = rectangle.getBounds(); 
      
      var boundData = [];
      d3.csv("melbourne_vis.csv",function(error,data)
    {
        if(error) throw error;
        for(var i=0; i<data.length; i++){

           var latLng = new google.maps.LatLng(data[i].Lat, data[i].Lng);
           if(bounds.contains(latLng)){
            boundData.push(data[i]);            

           }
            
        }

        switch(selectMode){
          case 2:
          console.log(recordRegionPro);
          console.log(boundData);
          //var union = boundData.concat(recordRegionPro.filter(v => !boundData.includes(v)));
          var union = getUnion(recordRegionPro,boundData);
          console.log(union);
          
          getRepresentative(union,kItem);
          
          break;

          case 3:
          console.log(recordRegionPro);
          console.log(boundData);
          var intersection = getIntersection(recordRegionPro,boundData);
          //var intersection = boundData.filter(v => recordRegionPro.includes(v));
          console.log(intersection);
          
          getRepresentative(intersection,kItem);
          
          break;
          case 4:
          //var difference = recordRegionPro.filter(v => !boundData.includes(v));
          var difference = getDifference(recordRegionPro,boundData);
          getRepresentative(difference,kItem);
        
          break;
        }


        
    });

}

function secondCircleSelection(circle,selectMode){
      
      customisedShape.push(circle);
      google.maps.Circle.prototype.contains = function(latLng) {
      return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
    };
      
      var boundData = [];
      d3.csv("melbourne_vis.csv",function(error,data)
    {
        if(error) throw error;
        for(var i=0; i<data.length; i++){

           var latLng = new google.maps.LatLng(data[i].Lat, data[i].Lng);
           if(circle.contains(latLng)){
            boundData.push(data[i]);            

           }
            
        }

        switch(selectMode){
          case 2:
          console.log(recordRegionPro);
          console.log(boundData);
          //var union = boundData.concat(recordRegionPro.filter(v => !boundData.includes(v)));
          var union = getUnion(recordRegionPro,boundData);
          console.log(union);
          
          getRepresentative(union,kItem);
          
          break;

          case 3:
          console.log(recordRegionPro);
          console.log(boundData);
          var intersection = getIntersection(recordRegionPro,boundData);
          //var intersection = boundData.filter(v => recordRegionPro.includes(v));
          console.log(intersection);
          
          getRepresentative(intersection,kItem);
          
          break;
          case 4:
          //var difference = recordRegionPro.filter(v => !boundData.includes(v));
          var difference = getDifference(recordRegionPro,boundData);
          getRepresentative(difference,kItem);
        
          break;
        }


        
    });


}

function getIntersection(a,b){
  var c = [];
  var lenA = a.length;
  var lenB = b.length;
  for(var i = 0;i<lenA;i++){
    for(var j =0; j<lenB; j++)
    {
      if(_.isEqual(a[i],b[j]))
        {
          c.push(a[i]);
          break;
        }
    }
  }
  return c;
}

function getUnion(a,b){
  var c = [];
  var lenA = a.length;
  var lenB = b.length;
  for(var i = 0;i<lenA;i++){
    c.push(a[i]);
  }
  for(var i = 0;i<lenB;i++){
    var flag = true;
    for(var j =0; j<lenA; j++)
    {
      if(_.isEqual(b[i],a[j]))
        {
          flag = false;
          break;
        }
    }
    if(flag)
      c.push(b[i]);
  }
  return c;

}

function getDifference(a,b){
  var c = [];
  var lenA = a.length;
  var lenB = b.length;
  for(var i = 0;i<lenA;i++){
    var flag = true;
    for(var j =0; j<lenB; j++)
    {
      if(_.isEqual(a[i],b[j]))
        {
          flag = false;
          break;
        }
    }
    if(flag)
      c.push(a[i]);
  }
  return c;
}

function setK(){
var slider = document.getElementById("myRange");
var output = document.getElementById("kItem");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = "Value/k: " +this.value;
}
}





