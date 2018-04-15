function initMap(){
    //create the Google Map
    var map = new google.maps.Map(d3.select("#map").node(),
        {
            zoom : 15,
            center: {lat : -37.815, lng : 144.9629285},
            style : google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            mapTypeId: google.maps.MapTypeId.RoadMap,
            scaleControl : true
        });

    d3.csv("data_10k.csv",function(error,data)
    {
        if(error) throw error;

        var overlay = new google.maps.OverlayView();
        //add the container div
        overlay.onAdd = function(){
            var layer = d3.select(this.getPanes().overlayMouseTarget)
                .append("div")
                .attr("class","property");

            //draw each marker
            overlay.draw = function(){
                var projection = this.getProjection(),
                    padding = 10;

                var marker = layer.selectAll("svg")
                    .data(data)
                    .each(transform)
                    .enter()
                    .append("svg")
                    .each(transform)
                    .attr("class","marker");

                var r =5;

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
                    .attr("stroke-width","1px")
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
                    .attr("fill-opacity",0.1)
                    .on("click",function(d){
                        var text = "<p>" + d.Formated_Address +"</p>";
                        text += "<br><b>Price: </b>" + d.Price_k + "k AUD" ;
                        text += "<br>" + d.proType;
                        text += "<br><b>Bedroom: </b>" + d.bedroom;

                        var infowindow = new google.maps.InfoWindow({
                            content: text
                        });
                        infowindow.open(map,marker);
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
                    .attr("stroke-width","1px")
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
                    .attr("fill-opacity",0.1)
                    .on("click",function(d){
                        var text = "<p>" + d.Formated_Address +"</p>";
                        text += "<br><b>Price: </b>" + d.Price_k + "k AUD" ;
                        text += "<br>" + d.proType;
                        text += "<br><b>Bedroom: </b>" + d.bedroom;

                        var infowindow = new google.maps.InfoWindow({
                            content: text
                        });
                        infowindow.open(map,marker);
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