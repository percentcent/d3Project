
var heapSim;
var NewRepresentSet;
var heapList = [];
//var features = ["proType","Price_k", "bedroom","bathroom","parking","age_md","income_md","local_Per","English_Per","rent_md","sch_rank", "to_station","Time_train","Total_Time", "supermarket","hospital","shopping_center","clinic","Land_size"];
var features = ["Price_k","income_md","sch_rank","Time_train","shopping_center","Land_size"];
var max_min = [1498,1497,576,68,4988,4960];
var selectedF = [1,6,10,11,14,18];

//similarity metric---cosine
function SOSWindow()
{
    
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
        //console.log(kItem);
        
        NewRepresentSet = [];
        greedySelect(boundData,kItem);
        console.log(NewRepresentSet);  

        setRepresentedSet(boundData);
        console.log(heapList);
        d3Show(NewRepresentSet);
        
    });

}

function selectAttribute(){
  var feature1 = chose_get_value(document.getElementById("basic"));
  var feature2 = chose_get_value(document.getElementById("neighbour"));
  var feature3 = chose_get_value(document.getElementById("school"));
  var feature4 = chose_get_value(document.getElementById("travel"));
  var feature5 = chose_get_value(document.getElementById("facility"));
  var feature6 = chose_get_value(document.getElementById("land"));
  features = [];

}

//get select value
    function chose_get_value(select){  
        return $(select).val();  
    } 


//similarity metric---Manhattan
function sim_ManhattanDist(objectI,objectJ){
  var sim_sum = 1;
  var n = selectedF.length;
  for(var i = 0; i < n; i++){
    //var different = (objectI[features[selectedF[i]]] - objectJ[features[selectedF[i]]]) / max_min[selectedF[i]];
    var different = (objectI[features[i]] - objectJ[features[i]]) / max_min[i];
    different = Math.abs(different);
    sim_sum -= 1/n * different;

  }
  return sim_sum;
}

function sim_o_S(object,Set){
  
  //what about the case that the land size is -1
  var n = Set.length;
  var maxSim = 0;
  for(var i = 0; i< n; i++){
    var temp = Set[i];
    //var tempSim = simObject_I_J([],object,temp);
    var tempSim = sim_ManhattanDist(object,temp);
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


function greedySelect(O,k){
  initialHeap(O);
  //NewRepresentSet = [];
  while(NewRepresentSet.length < k && heapSim.length > 0){

    console.log(heapSim);

    var top = heapSim[0];

    while(top[2] != NewRepresentSet.length){
      var tempSet = [];
      for(var j =0; j < NewRepresentSet.length; j++){
        tempSet.push(NewRepresentSet[j]);
      }
      tempSet.push(O[top[0]]);

      var delta = sim_S_O(tempSet,O) - sim_S_O(NewRepresentSet,O);
      top[1] = delta;
      top[2] = NewRepresentSet.length;

      var index = 0;
      for(var i=1; i < heapSim.length; i++){
        
        if(delta < heapSim[i][1])
        {
          var temp = heapSim[i];
          heapSim[i] = top;
          heapSim[index] = temp;
          index = i;
        }
        else 
          break;
      }
      top = heapSim[0];
    }

    var selected = O[top[0]];
    console.log(top[0]);
    //representSet.push(selected);
    NewRepresentSet.push(selected);

    console.log(NewRepresentSet);


    var scale = Distance * 0.005;
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

function getHeatmapObject(target,Object,Set){
  var n = Object.length;
  var rep = Set.length;
  var heatmapObject = [];
  for(var i = 0; i < n; i++){
    var comp = sim_ManhattanDist(target,Object[i]);
    //var comp = simObject_I_J([],target,Object[i]);
    
    for(var j = 0; j < rep; j++){
      var sim = sim_ManhattanDist(Set[j],Object[i]);
      //var sim = simObject_I_J([],target,Object[i]);

      if(sim > comp)
        break;

    }
    if(j == rep)
      heatmapObject.push(Object[i]);
  }
  console.log(heatmapObject);
  return heatmapObject;

}

function setRepresentedSet(O){
  heapList = [];
  
  for(var k = 0; k<NewRepresentSet.length; k++){
    var k_set = [];

    for(var i =0; i<O.length; i ++){
    //var low = simObject_I_J([],O[i],representSet[k]);
    var low = sim_ManhattanDist(O[i],NewRepresentSet[k]);
    for(var j =0; j < NewRepresentSet.length; j++){
      var temp = NewRepresentSet[j];
      //var tempSim = simObject_I_J([],O[i],temp);
      var tempSim = sim_ManhattanDist(O[i],temp);
      if(tempSim > low){
       break;

      }
    }
    if(j == NewRepresentSet.length)
    //represented[j].push(O[i]);
      k_set.push(O[i]);

  }
  heapList.push(k_set);
  }
}

