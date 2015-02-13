var geocoder;
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
            } 
            //Get the latitude and the longitude;
            function successFunction(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                //var lat = '51.0544';
                //var lng = '-114.0669';
                codeLatLng(lat, lng)
            }
            
            function errorFunction(){
                //alert("Geocoder failed");
            }
            
            function initialize() {
                geocoder = new google.maps.Geocoder();
                
                
                
            }
            
            function codeLatLng(lat, lng) {
                var city = "";
                var country = "";
                var latlng = new google.maps.LatLng(lat, lng);
                geocoder.geocode({'latLng': latlng}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        //console.log(results)
                        if (results[1]) {
                            //formatted address
                            //alert(results[0].formatted_address)
                            //find country name
                            for (var i=0; i<results[0].address_components.length; i++) {
                                //alert(results[0].address_components[i].types);
                                for (var b=0;b<results[0].address_components[i].types.length;b++) {
                                    
                                    //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                                    if (results[0].address_components[i].types[b] == "locality") {
                                        city = results[0].address_components[i];
                                        //break;
                                        
                                    }
                                    if (results[0].address_components[i].types[b] == "country") {
                                        country = results[0].address_components[i];
                                        //break;
                                        
                                    }
                                }
                            }
                            //city data
                            //alert(city.short_name + " " + city.long_name)
                            if(city.long_name){
                                //alert(city.short_name);
                                var str = city.long_name+", "+country.long_name;
                                $('#userCity').val(str);
                            }
                            
                        } else {
                            //alert("No results found");
                        }
                    } else {
                        //alert("Geocoder failed due to: " + status);
                    }
                });
            }