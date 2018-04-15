var currentBounds = [];
var kItem = 20;
var Distance = 3;
var map;
var previousZoomLevel;
var oldBounds = [];

function initMap(){
  
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


    });

    map.addListener('dragend',function(){
    	panningWindow();
    });

    map.addListener('zoom_changed',function(){
      var newZoomLevel = map.getZoom();
      if(newZoomLevel < previousZoomLevel)
        zoomOutWindow();
      else
        zoomInWindow();
      previousZoomLevel = newZoomLevel;
    
    });  
}

function zoomOutWindow(){
  //SOSWindow();
    var mapBound = map.getBounds();
    var bounds = [];
    bounds[0] = mapBound.getNorthEast().lat();
    bounds[1] = mapBound.getSouthWest().lat();
    bounds[2] = mapBound.getNorthEast().lng();
    bounds[3] = mapBound.getSouthWest().lng();

    d3.csv("melbourne_vis.csv",function(error,data)
    {
        if(error) throw error;
        var candidate = [];
        for(var i = 0;i < NewRepresentSet.length; i++){
           if(NewRepresentSet[i].Lat<bounds[0] && NewRepresentSet[i].Lat>bounds[1] && NewRepresentSet[i].Lng<bounds[2] && NewRepresentSet[i].Lng>bounds[3]){
              candidate.push(NewRepresentSet[i]);
          
         }
       }

        NewRepresentSet = [];
        var boundData = [];
        
        for(var i=0;i<data.length;i++){
          
        if(data[i].Lat<bounds[0] && data[i].Lat>bounds[1] && data[i].Lng<bounds[2] && data[i].Lng>bounds[3]){
          boundData.push(data[i]);
           if(data[i].Lat > currentBounds[0] || data[i].Lat<currentBounds[1] || data[i].Lng>currentBounds[2] || data[i].Lng<currentBounds[3])
              candidate.push(data[i]);
          }
        }

    greedySelect(candidate,kItem);
    //console.log(NewRepresentSet);  
    setRepresentedSet(boundData);
    d3Show(NewRepresentSet);
        
    });

}

function zoomInWindow(){
  //SOSWindow();
    var mapBound = map.getBounds();
    var bounds = [];
    bounds[0] = mapBound.getNorthEast().lat();
    bounds[1] = mapBound.getSouthWest().lat();
    bounds[2] = mapBound.getNorthEast().lng();
    bounds[3] = mapBound.getSouthWest().lng();

    d3.csv("melbourne_vis.csv",function(error,data)
    {
        if(error) throw error;
        var candidate = [];
        var oldPro = [];

        for(var i = 0;i < NewRepresentSet.length; i++){
           if(NewRepresentSet[i].Lat<bounds[0] && NewRepresentSet[i].Lat>bounds[1] && NewRepresentSet[i].Lng<bounds[2] && NewRepresentSet[i].Lng>bounds[3]){
              oldPro.push(NewRepresentSet[i]);
          
         }
        }

        NewRepresentSet = [];
        NewRepresentSet = oldPro;

        var boundData = [];
        
        for(var i=0;i<data.length;i++){
          
        if(data[i].Lat<bounds[0] && data[i].Lat>bounds[1] && data[i].Lng<bounds[2] && data[i].Lng>bounds[3]){
            boundData.push(data[i]);
            for(var k = 0; k < NewRepresentSet.length; k++){
              if(data[i].Lat == NewRepresentSet[k].Lat && data[i].Lng == NewRepresentSet[k].Lng)
                break;
            }
            if(k == NewRepresentSet.length)
              candidate.push(data[i]);
           
          }
        }

    greedySelect(candidate,kItem);
    //console.log(NewRepresentSet);  
    setRepresentedSet(boundData);
    d3Show(NewRepresentSet);
        
    });


}

function panningWindow(){
  	var mapBound = map.getBounds();
    var bounds = [];
    bounds[0] = mapBound.getNorthEast().lat();
    bounds[1] = mapBound.getSouthWest().lat();
    bounds[2] = mapBound.getNorthEast().lng();
    bounds[3] = mapBound.getSouthWest().lng();
    currentBounds = bounds;

    var oldPro = [];

    for(var i = 0;i < NewRepresentSet.length; i++){
      if(NewRepresentSet[i].Lat<bounds[0] && NewRepresentSet[i].Lat>bounds[1] && NewRepresentSet[i].Lng<bounds[2] && NewRepresentSet[i].Lng>bounds[3]){
          oldPro.push(NewRepresentSet[i]);
          
      }
    }

    NewRepresentSet = [];
    heapList = [];

    var old = oldPro.length;
    var newPro = kItem - old;

    for(var i = 0; i < old; i++){
      NewRepresentSet.push(oldPro[i]);
      
    }

    d3.csv("melbourne_vis.csv",function(error,data)
    {
        if(error) throw error;
        var candidate = [];
        var boundData = [];
        
        for(var i=0;i<data.length;i++){
          
     	 if(data[i].Lat<bounds[0] && data[i].Lat>bounds[1] && data[i].Lng<bounds[2] && data[i].Lng>bounds[3]){
     	 	boundData.push(data[i]);
       		 if(data[i].Lat > oldBounds[0] || data[i].Lat<oldBounds[1] || data[i].Lng>oldBounds[2] || data[i].Lng<oldBounds[3])
          		candidate.push(data[i]);
      		}
    	}

    console.log(candidate);


    greedySelect(candidate,kItem);
    //console.log(NewRepresentSet);  

    setRepresentedSet(boundData);
    //console.log(heapList);
    d3Show(NewRepresentSet);

        
    });
}

