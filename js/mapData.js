
var overlay = new google.maps.OverlayView();
function ShowAll(){
    //create the Google Map

    d3.csv("data_10k.csv",function(error,data)
    {
        if(error) throw error;

        var tooltip = d3.select("body")
            .append("div")
            .attr("class","tooltip_map");
            //.html("");

        //var overlay = new google.maps.OverlayView();
        //add the container div
        overlay.onAdd = function(){
            var layer = d3.select(this.getPanes().overlayMouseTarget)
                .append("div")
                .attr("class","property");

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
                    .attr("class","marker");

                var r =3;

                /*marker.append("path")
                  .attr({
                        'd': line(data),
                        'stroke': '5px'
                 })
                   .attr("stroke")*/

                marker.append("rect")
                    .attr("x",padding - r)
                    .attr("y",padding - r)
                    .attr("width",function(d){
                        if(d.bedroom > 2){
                            return 0.0;
                        }else{
                            return r*2;
                        }
                    })
                    .attr("height",function(d){
                        if(d.bedroom > 2){
                            return 0.0;
                        }else{
                            return r*2;
                        }
                    })
                    .attr("stroke",function(d){
                        if(d.Price_k < 200)
                            return "black";
                        else if(d.Price_k < 400)
                            return "purple";
                        else if(d.Price_k < 600)
                            return "blue";
                        else if(d.Price_k < 800)
                            return "green";
                        else if(d.Price_k < 1000)
                            return "yellow";
                        else if(d.Price_k < 1200)
                            return "orange";
                        else
                            return "red";
                    })
                    .attr("stroke-opacity",1.0)
                    .attr("stroke-width","2px")
                    .attr("fill",function(d){
                        if(d.Price_k < 200)
                            return "black";
                        else if(d.Price_k < 400)
                            return "purple";
                        else if(d.Price_k < 600)
                            return "blue";
                        else if(d.Price_k < 800)
                            return "green";
                        else if(d.Price_k < 1000)
                            return "yellow";
                        else if(d.Price_k < 1200)
                            return "orange";
                        else
                            return "red";

                    })
                    .attr("fill-opacity",0.0)
                    .on("click",function(d){
                        //set tooltip context
                        d3.select(this).style("cursor", "pointer");
                        var text = d.Formated_Address;
                        text += "<br><b>Price: </b>" + d.Price_k + "k AUD" ;
                        text += "<br><b>" + d.proType +"</b>";
                        text += "<br><b>Bedroom: </b>" + d.bedroom;

                        tooltip.html(text);
                        return tooltip.style("visibility","visible");

                    })
                    .on("mouseover",function(d){
                        //set tooltip context
                        d3.select(this).style("cursor", "pointer");
                        var text = d.Formated_Address;
                        text += "<br><b>Price: </b>" + d.Price_k + "k AUD" ;
                        text += "<br><b>" + d.proType +"</b>";
                        text += "<br><b>Bedroom: </b>" + d.bedroom;

                        tooltip.html(text);
                        return tooltip.style("visibility","visible");

                    })
                    .on("mousemove", function(){
                    return tooltip.style("top", (event.pageY-10)+"px")
                        .style("left",(event.pageX+10)+"px");
                    })
                    .on("mouseout", function(){
                        return tooltip.style("visibility", "hidden");
                    });

                marker.append("circle")
                    .attr("cx",padding)
                    .attr("cy",padding)
                    .attr("r",function(d){
                        if(d.bedroom < 3)
                            return 0.0;
                        else
                            return r;
                    })
                    .attr("stroke",function(d){
                        if(d.Price_k < 200)
                            return "black";
                        else if(d.Price_k < 400)
                            return "purple";
                        else if(d.Price_k < 600)
                            return "blue";
                        else if(d.Price_k < 800)
                            return "green";
                        else if(d.Price_k < 1000)
                            return "yellow";
                        else if(d.Price_k < 1200)
                            return "orange";
                        else
                            return "red";
                    })
                    .attr("stroke-opacity",1.0)
                    .attr("stroke-width","2px")
                    .attr("fill",function(d){
                        if(d.Price_k < 200)
                            return "black";
                        else if(d.Price_k < 400)
                            return "purple";
                        else if(d.Price_k < 600)
                            return "blue";
                        else if(d.Price_k < 800)
                            return "green";
                        else if(d.Price_k < 1000)
                            return "yellow";
                        else if(d.Price_k < 1200)
                            return "orange";
                        else
                            return "red";

                    })
                    .attr("fill-opacity",0.0)
                    .on("click",function(d){
                        //set tooltip context
                        d3.select(this).style("cursor", "pointer");
                        var text = d.Formated_Address;
                        text += "<br><b>Price: </b>" + d.Price_k + "k AUD" ;
                        text += "<br><b>" + d.proType +"</b>";
                        text += "<br><b>Bedroom: </b>" + d.bedroom;

                        tooltip.html(text);
                        return tooltip.style("visibility","visible");

                    })
                    .on("mouseover",function(d){
                        //set tooltip context
                        d3.select(this).style("cursor", "pointer");
                        var text = d.Formated_Address;
                        text += "<br><b>Price: </b>" + d.Price_k + "k AUD" ;
                        text += "<br><b>" + d.proType +"</b>";
                        text += "<br><b>Bedroom: </b>" + d.bedroom;

                        tooltip.html(text);
                        return tooltip.style("visibility","visible");

                    })
                    .on("mousemove", function(){
                        return tooltip.style("top", (event.pageY-10)+"px")
                            .style("left",(event.pageX+10)+"px");
                    })
                    .on("mouseout", function(){
                        return tooltip.style("visibility", "hidden");
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

        overlay.setMap(map);

    });
}

function selectAttribute(){

   /* var zoomLevel = 15;
        map = new google.maps.Map(document.getElementById('map'), 
        {
            zoom : zoomLevel,
            center: {lat : -37.815, lng : 144.9629285},
            style : google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            mapTypeId: google.maps.MapTypeId.RoadMap,
            scaleControl : true
        });*/
    
    var num = document.getElementById("Bedrooms Num").value;
    var Pro = document.getElementById("Property type").value;
    var price = document.getElementById("Price(Max /k AUD)").value;
    var NO = parseInt(num);

    d3.csv("data_10k.csv",function(error,data)
    {
        if(error) throw error;

        var selectedData = [];
        for(var i=0; i<data.length; i++){
           //if(paseInt(data[i].bedroom) >= NO) 
           if(data[i].bedroom >= NO && data[i].proType == Pro && data[i].Price_k <= price)
                selectedData.push(data[i]);

        }

        var tooltip = d3.select("body")
            .append("div")
            .attr("class","tooltip_map");
            //.html("");

        //var overlay = new google.maps.OverlayView();
        //add the container div
        overlay.onAdd = function(){
            var layer = d3.select(this.getPanes().overlayMouseTarget)
                .append("div")
                .attr("class","property");

            //draw each marker
            overlay.draw = function(){
                var projection = this.getProjection(),
                    padding = 6;

                /*var nullData = [];
                var clearData = layer.selectAll("svg")
                    .data(nullData)
                    .exit()
                    .remove();*/

                var marker = layer.selectAll("svg")
                    .data(selectedData)
                    .each(transform)
                    .enter()
                    .append("svg")
                    .each(transform)
                    .attr("class","marker");

                var r =3;

                /*marker.append("path")
                  .attr({
                        'd': line(data),
                        'stroke': '5px'
                 })
                   .attr("stroke")*/

                marker.append("rect")
                    .attr("x",padding - r)
                    .attr("y",padding - r)
                    .attr("width",function(d){
                        if(d.bedroom > 2){
                            return 0.0;
                        }else{
                            return r*2;
                        }
                    })
                    .attr("height",function(d){
                        if(d.bedroom > 2){
                            return 0.0;
                        }else{
                            return r*2;
                        }
                    })
                    .attr("stroke",function(d){
                        if(d.Price_k < 200)
                            return "black";
                        else if(d.Price_k < 400)
                            return "purple";
                        else if(d.Price_k < 600)
                            return "blue";
                        else if(d.Price_k < 800)
                            return "green";
                        else if(d.Price_k < 1000)
                            return "yellow";
                        else if(d.Price_k < 1200)
                            return "orange";
                        else
                            return "red";
                    })
                    .attr("stroke-opacity",1.0)
                    .attr("stroke-width","2px")
                    .attr("fill",function(d){
                        if(d.Price_k < 200)
                            return "black";
                        else if(d.Price_k < 400)
                            return "purple";
                        else if(d.Price_k < 600)
                            return "blue";
                        else if(d.Price_k < 800)
                            return "green";
                        else if(d.Price_k < 1000)
                            return "yellow";
                        else if(d.Price_k < 1200)
                            return "orange";
                        else
                            return "red";

                    })
                    .attr("fill-opacity",0.0)
                    .on("click",function(d){
                        //set tooltip context
                        d3.select(this).style("cursor", "pointer");
                        var text = d.Formated_Address;
                        text += "<br><b>Price: </b>" + d.Price_k + "k AUD" ;
                        text += "<br><b>" + d.proType +"</b>";
                        text += "<br><b>Bedroom: </b>" + d.bedroom;

                        tooltip.html(text);
                        return tooltip.style("visibility","visible");

                    })
                    .on("mouseover",function(d){
                        //set tooltip context
                        d3.select(this).style("cursor", "pointer");
                        var text = d.Formated_Address;
                        text += "<br><b>Price: </b>" + d.Price_k + "k AUD" ;
                        text += "<br><b>" + d.proType +"</b>";
                        text += "<br><b>Bedroom: </b>" + d.bedroom;

                        tooltip.html(text);
                        return tooltip.style("visibility","visible");

                    })
                    .on("mousemove", function(){
                    return tooltip.style("top", (event.pageY-10)+"px")
                        .style("left",(event.pageX+10)+"px");
                    })
                    .on("mouseout", function(){
                        return tooltip.style("visibility", "hidden");
                    });

                marker.append("circle")
                    .attr("cx",padding)
                    .attr("cy",padding)
                    .attr("r",function(d){
                        if(d.bedroom < 3)
                            return 0.0;
                        else
                            return r;
                    })
                    .attr("stroke",function(d){
                        if(d.Price_k < 200)
                            return "black";
                        else if(d.Price_k < 400)
                            return "purple";
                        else if(d.Price_k < 600)
                            return "blue";
                        else if(d.Price_k < 800)
                            return "green";
                        else if(d.Price_k < 1000)
                            return "yellow";
                        else if(d.Price_k < 1200)
                            return "orange";
                        else
                            return "red";
                    })
                    .attr("stroke-opacity",1.0)
                    .attr("stroke-width","2px")
                    .attr("fill",function(d){
                        if(d.Price_k < 200)
                            return "black";
                        else if(d.Price_k < 400)
                            return "purple";
                        else if(d.Price_k < 600)
                            return "blue";
                        else if(d.Price_k < 800)
                            return "green";
                        else if(d.Price_k < 1000)
                            return "yellow";
                        else if(d.Price_k < 1200)
                            return "orange";
                        else
                            return "red";

                    })
                    .attr("fill-opacity",0.0)
                    .on("click",function(d){
                        //set tooltip context
                        d3.select(this).style("cursor", "pointer");
                        var text = d.Formated_Address;
                        text += "<br><b>Price: </b>" + d.Price_k + "k AUD" ;
                        text += "<br><b>" + d.proType +"</b>";
                        text += "<br><b>Bedroom: </b>" + d.bedroom;

                        tooltip.html(text);
                        return tooltip.style("visibility","visible");

                    })
                    .on("mouseover",function(d){
                        //set tooltip context
                        d3.select(this).style("cursor", "pointer");
                        var text = d.Formated_Address;
                        text += "<br><b>Price: </b>" + d.Price_k + "k AUD" ;
                        text += "<br><b>" + d.proType +"</b>";
                        text += "<br><b>Bedroom: </b>" + d.bedroom;

                        tooltip.html(text);
                        return tooltip.style("visibility","visible");

                    })
                    .on("mousemove", function(){
                        return tooltip.style("top", (event.pageY-10)+"px")
                            .style("left",(event.pageX+10)+"px");
                    })
                    .on("mouseout", function(){
                        return tooltip.style("visibility", "hidden");
                    });

                /*marker.append("text")
                    .attr("x",padding + 6)
                    .attr("y",padding)
                    .text(function(d){
                        return d.proType;
                    });*/

                function transform(d){
                    d = new google.maps.LatLng(d.Lat,d.Lng);
                    d = projection.fromLatLngToDivPixel(d);
                    return d3.select(this)
                        .style("left",(d.x - padding) + "px")
                        .style("top",(d.y - padding) + "px")
                }

            };
        };
        overlay.setMap(map);

    });

}

function selectRegion(){
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,              //The default one.
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
            drawingModes: [
                //google.maps.drawing.OverlayType.MARKER,
                google.maps.drawing.OverlayType.CIRCLE,
                //google.maps.drawing.OverlayType.POLYGON,
                //google.maps.drawing.OverlayType.POLYLINE,
                google.maps.drawing.OverlayType.RECTANGLE
            ]
        },
        //markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
        circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 0.3,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 0
        }
    });
}