var oldBounds = [];
var represent = [];

function initMap()
{
	var mapBound = map.getBounds();
    var bounds = [];
    bounds[0] = mapBound.getNorthEast().lat();
    bounds[1] = mapBound.getSouthWest().lat();
    bounds[2] = mapBound.getNorthEast().lng();
    bounds[3] = mapBound.getSouthWest().lng();

    var boundData = [];

     d3.csv("data_lag_lng.csv",function(error,data)
    {
        if(error) throw error;

        for(var i =0; i<data.length;i++){
        	if(data[i].lat < bounds[0] && data[i].lat > bounds[1] && data[i].lon < bounds[2] && data[i].lon > bounds[3])
           {
           	boundData.push(data[i]);

           }
        }

        //console.log(boundData);

        representative(boundData,100);
        d3Show(represent);
    
    });

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
    
    })
}

function panningWindow(){
	var mapBound = map.getBounds();
    var bounds = [];
    bounds[0] = mapBound.getNorthEast().lat();
    bounds[1] = mapBound.getSouthWest().lat();
    bounds[2] = mapBound.getNorthEast().lng();
    bounds[3] = mapBound.getSouthWest().lng();

    console.log(bounds);
    console.log(oldBounds);

    var oldTweet = [];
    
    for(var i=0;i<represent.length;i++){
      if(represent[i].lat<bounds[0] && represent[i].lat>bounds[1] && represent[i].lon<bounds[2] && represent[i].lon>bounds[3]){
          oldTweet.push(represent[i]);
      }
    }

    var tweetNum = oldTweet.length;
    var newTweet = 100 - tweetNum;

    /*represent = [];
    
    for(var i =0; i<tweetNum; i++){
      represent.push(oldTweet[i]);
    }*/

    d3.csv("data_lag_lng.csv",function(error,data)
    {
        if(error) throw error;
        /*var tw1 = [];
        var tw2 = [];
        for(var i=0;i<data.length;i++){
          if(data[i].lat<oldBounds[0] && data[i].lat>oldBounds[1] && data[i].lon<oldBounds[2] && data[i].lon>oldBounds[3]){
            tw1.push(data[i]);
          
      }
      if(data[i].lat<bounds[0] && data[i].lat>bounds[1] && data[i].lon<bounds[2] && data[i].lon>bounds[3]){
          tw2.push(data[i]);
      }
    }

    var difference = getDifference(tw2,tw1);

    representative(difference,newTweet);
    d3Update(represent);*/
    var newSet = [];
    for(var i=0;i<data.length;i++){
          if(data[i].lat<bounds[0] && data[i].lat>oldBounds[0] && data[i].lon<bounds[2] && data[i].lon>bounds[3]){
            newSet.push(data[i]);
          
      }
  }
  	representative(newSet,newTweet);
  	d3Update(represent);
        
    });
}

function d3Update(data){
	var overlay = new google.maps.OverlayView();
	overlay.onAdd = function(){
            var layer = d3.select(this.getPanes().overlayMouseTarget)
                .append("div")
                .attr("class","tweet");

            //draw each marker
            overlay.draw = function(){
                var projection = this.getProjection(),
                    padding = 6;

                var marker = layer.selectAll("svg")
                    .data(data)
                    .each(transform)
                    .enter()
                    .append("svg")
                    .each(transform)
                    .attr("class",function(d,i){
                    	
                    	return "t"+i;
                    });

                var r =3;

                marker.append("circle")
                    .attr("cx",padding)
                    .attr("cy",padding)
                    .attr("r",3)
                    .attr("stroke",function(d,i){
                    		return "#dd4477";
                    })
                    .attr("stroke-opacity",1.0)
                    .attr("stroke-width","2px")
                    .attr("fill",function(d,i){
                    	return "#dd4477";
                    })
                    .attr("fill-opacity",0.3);


                

                function transform(d){
                    d = new google.maps.LatLng(d.lat,d.lon);
                    d = projection.fromLatLngToDivPixel(d);
                    return d3.select(this)
                        .style("left",(d.x - padding) + "px")
                        .style("top",(d.y - padding) + "px")
                }

            };
        };

        overlay.setMap(map);


}

function d3Show(data){
	data.splice(0,0,{"tid":1,"createtime":"0","lat":-37.817903,"lon":144.968179,"country":"Australia","ulocation":"mel"});
	data.splice(1,0,{"tid":1,"createtime":"0","lat":-37.8098087,"lon":144.963001,"country":"Australia","ulocation":"mel"});
	data.splice(2,0,{"tid":1,"createtime":"0","lat":-37.8181898,"lon":144.9428416,"country":"Australia","ulocation":"mel"});
	
	console.log(data);
	var overlay = new google.maps.OverlayView();
	overlay.onAdd = function(){
            var layer = d3.select(this.getPanes().overlayMouseTarget)
                .append("div")
                .attr("class","tweet");

            //draw each marker
            overlay.draw = function(){
                var projection = this.getProjection(),
                    padding = 6;

                var marker = layer.selectAll("svg")
                    .data(data)
                    .each(transform)
                    .enter()
                    .append("svg")
                    .each(transform)
                    .attr("class",function(d,i){
                    	
                    	return "t"+i;
                    });

                var r =3;

                marker.append("circle")
                    .attr("cx",padding)
                    .attr("cy",padding)
                    .attr("r",3)
                    .attr("stroke",function(d,i){
                    	//if(i>2)
                    		return "#3366cc";
                    	//else 
                    	//	return "#dd4477";
                    })
                    .attr("stroke-opacity",1.0)
                    .attr("stroke-width","2px")
                    .attr("fill",function(d,i){
                    	//if(i>2)
                    		return "#3366cc";
                    	//else 
                    	//	return "#dd4477";
                    })
                    .attr("fill-opacity",0.3);


                    
                 /* marker.append("text")
                      .attr("x",0)
                      .attr("y",30)
                      .attr("font-size", 13)
                      .attr("font-family", "sans-serif")
                      .style('fill', '#dd4477')
                      .attr("font-style", "italic")
                      .text(function(d,i){
                      	if(i==0)
                      		return "Gorgeous sunny day in #melbourne at #fedsquare Kpop Festival #fun @ Federation Square";
                      	else if(i==1)
                      		return "State Library of Victoria #WhiteNightMelb http://t.co/YwdBraU5Pc";
                      	else if(i==2)
                      		return "Breakfast at St Ali's in the Docklands - just one little street and i'm already enamoured by the? https://t.co/VygJBIwDZC"
                      });*/

                    var strs = ["Gorgeous sunny day in", "#melbourne at #fedsquare Kpop", "Festival #fun @ Federation Square"];

                   var text1 = d3.select(".t0")
                   	  .append("text")
                      .attr("x",0)
                      .attr("y",10)
                      .attr("font-size", 13)
                      .attr("font-family", "sans-serif")
                      .style('fill', '#3366cc')
                      .attr("font-style", "italic");

                   text1.selectAll("tspan")
					.data(strs)
					.enter()
					.append("tspan")
					.attr("x",text1.attr("x"))
					.attr("dy","1em")
					.text(function(d){
					return d;
					});

					strs = ["State Library of Victoria", "#WhiteNightMelb","http://t.co/YwdBraU5Pc"];

                   var text2= d3.select(".t1")
                   	  .append("text")
                      .attr("x",0)
                      .attr("y",10)
                      .attr("font-size", 13)
                      .attr("font-family", "sans-serif")
                      .style('fill', '#3366cc')
                      .attr("font-style", "italic");

                   text2.selectAll("tspan")
					.data(strs)
					.enter()
					.append("tspan")
					.attr("x",text2.attr("x"))
					.attr("dy","1em")
					.text(function(d){
					return d;
					});
                      
                    strs = ["Breakfast at St Ali's", "in the Docklands-", "just one little street","and i'm already enamoured","by the? https://t.co/VygJBIwDZC"];

                   var text3= d3.select(".t2")
                   	  .append("text")
                      .attr("x",0)
                      .attr("y",10)
                      .attr("font-size", 13)
                      .attr("font-family", "sans-serif")
                      .style('fill', '#3366cc')
                      .attr("font-style", "italic");

                   text3.selectAll("tspan")
					.data(strs)
					.enter()
					.append("tspan")
					.attr("x",text3.attr("x"))
					.attr("dy","1em")
					.text(function(d){
					return d;
					});


                function transform(d){
                    d = new google.maps.LatLng(d.lat,d.lon);
                    d = projection.fromLatLngToDivPixel(d);
                    return d3.select(this)
                        .style("left",(d.x - padding) + "px")
                        .style("top",(d.y - padding) + "px")
                }

            };
        };

        overlay.setMap(map);


}

function representative(data,k){

		represent = [];

		var representIndex = [];
        var indexList = [];
        for(var i = 0; i < data.length; i++){
          indexList.push(i);
        }
        representIndex = getRepresentItems(indexList,k);

        for(var i = 0; i < k; i++){
          represent.push(data[representIndex[i]]);

        }


}

function getRepresentItems(data,count)
{
  var represent_t =[];
  var n = data.length;
  var gap = Math.floor(n/count);
  for(var i = 0; i<count; i++){
    var r = Math.random();
    var index = i*gap + Math.floor(r*gap);
    represent_t.push(index);
  }
  return represent_t;
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

