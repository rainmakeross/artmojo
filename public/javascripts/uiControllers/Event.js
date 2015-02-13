function loadAllEvents(){
    $.getJSON("/events/listall/", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Image</th>';
             str += '<th align="center">Event Title</th>';
             str += '<th align="center">Location</th>';
             str += '<th align="center">Operator</th>';
             str += '<th align="center">Posted At</th>';             
             str += '<th align="center">Action</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                var date = new Date(data.createdAt);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                str += '<tr>';
                    if(data.event_image){
                        var img = '/images/events/thumb/'+data.event_image;
                    }else{
                        var img = '/images/dummy-event.png';
                    }
                    str += '<td><img src="'+img+'" style="width:125px;height:125px;" alt="'+data.title+'" /></td>';
                    str += '<td align="center">'+data.title+'</td>';
                    str += '<td align="center">'+data.location+'</td>';
                    str += '<td align="center">'+data.operator+'</td>';
                    str += '<td align="center">'+tDate+'/'+tMonth+'/'+tYear+'</td>';                    
                    str += '<td align="center"><a href="/events/public/edit?id='+data.id+'">Edit</a></td>';
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#eventList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers"
            } );
         }
                        
                        //listEvents(datas);
                        
    });
    
}
function loadMyEvents(){
    $.getJSON("/events/loadMyEvents/", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Image</th>';
             str += '<th align="center">Title</th>';
             str += '<th align="center">Location</th>';
             str += '<th align="center">Posted At</th>';
             str += '<th align="center">Action</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                var date = new Date(data.createdAt);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                str += '<tr>';
                    if(data.event_image){
                        var img = '/images/events/thumb/'+data.event_image;
                    }else{
                        var img = '/images/dummy_user.gif';
                    }
                    str += '<td><img src="'+img+'" style="width:125px;height:125px;" alt="'+data.title+'" style="cursor:pointer;" /></td>';
                    str += '<td align="center"><a href="#" style="text-decoration:none;">'+data.title+'</a></td>';
                    str += '<td align="center">'+data.location+'</td>';
                    str += '<td align="center">'+tDate+'/'+tMonth+'/'+tYear+'</td>';
                    str += '<td align="center"><a href="/events/public/edit?id='+data.id+'">Edit</a></td>';
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#eventList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers"
            } );
         }
                        
                        //listEvents(datas);
                        
    });
    
}

function loadOpEvents(){
    $.getJSON("/events/loadMyEvents/", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Image</th>';
             str += '<th align="center">Title</th>';
             str += '<th align="center">Location</th>';
             str += '<th align="center">Posted At</th>';
             str += '<th align="center">Action</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                var date = new Date(data.createdAt);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                str += '<tr>';
                    if(data.event_image){
                        var img = '/images/events/thumb/'+data.event_image;
                    }else{
                        var img = '/images/dummy_user.gif';
                    }
                    str += '<td><img src="'+img+'" style="width:125px;height:125px;" alt="'+data.title+'" style="cursor:pointer;" /></td>';
                    str += '<td align="center"><a href="#" style="text-decoration:none;">'+data.title+'</a></td>';
                    str += '<td align="center">'+data.location+'</td>';
                    str += '<td align="center">'+tDate+'/'+tMonth+'/'+tYear+'</td>';
                    str += '<td align="center"><a href="/events/operator/edit?id='+data.id+'">Edit</a></td>';
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#eventList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers"
            } );
         }
                        
                        //listEvents(datas);
                        
    });
    
}

var validateEventFrm = function(){
    var title = $('#title').val();
    var email = $('#contact_email').val();
    var image_url = $('#image_url').val();
    var alertTxt = "";
    var bool = true;
    if(title == ""){
        bool = false;
        alertTxt += "Title cannot be blank\n";
    }
    if(email){
        if(!isEmail(email)){
           bool = false;
           alertTxt += "Email is not in correct format\n";
       }
    }
    
    if(!bool){
        alert(alertTxt);
    }
    return bool;    
}

var validateEventOpFrm = function(){
    var title = $('#title').val();
    var email = $('#contact_email').val();
    var image_url = $('#image_url').val();
    var alertTxt = "";
    var bool = true;
    if(title == ""){
        bool = false;
        alertTxt += "Title cannot be blank\n";
    }
    if(email){
        if(!isEmail(email)){
           bool = false;
           alertTxt += "Email is not in correct format\n";
       }
    }
    if(image_url){
        if(image_url.length > 0){
            //format check
            var url =  image_url;
            var urlInt = url.substr(0,4);
            if(urlInt == 'http'){
                var urlChunk = url.split("/");
                var lastIndex = (urlChunk.length - 1);
                var fileName = urlChunk[lastIndex]; 
                //work for filenames having query string attached
                if(findQueryString(fileName)){
                    var fArr = fileName.split("?");
                    fileName = fArr[0];
                }
                var splitFile = fileName.split(".");
                var lastIndexS = (splitFile.length - 1);
                if(!splitFile[lastIndexS]){
                   alertTxt += "Image url format is not recognised"; 
                   bool = false;
                }else{
                    var ext = splitFile[lastIndexS];
                    var imgExt = ['JPG', 'JPEG', 'GIF', 'PNG', 'TIFF', 'jpg', 'jpeg', 'gif', 'png', 'tiff'];
                    if(!in_array(ext, imgExt)){
                       alertTxt += "Image url format is not recognised";  
                       bool = false;
                    }
                }
            }
            
            
        }
    }
    if(!bool){
        alert(alertTxt);
    }
    return bool;    
}

var years = ['2013','2014','2015'],
    dates = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    
var setupUI = function(categoryId, countryId, stateId, cityId, fromDate, toDate){
	addToSelect('from_year', years);
	addToSelect('to_year', years);
	addToSelect('from_month', months);
	addToSelect('to_month', months);
	addToSelect('from_date', dates);
	addToSelect('to_date', dates);
        if(fromDate){
            var fd = new Date(fromDate);
            var fdate = fd.getDate();
            if(fdate < 10){
                fdate = "0"+fdate;
            }
            var fmonth = (fd.getMonth()+1);
            if(fmonth < 10){
                fmonth = "0"+fmonth;
            }
            var fyear = fd.getFullYear();    
            addToSelect('from_year', years);
            $('#from_year').val(fyear);
            addToSelect('from_month', months);
            $('#from_month').val(fmonth);
            addToSelect('from_date', dates);
            $('#from_date').val(fdate);
        }
        if(toDate){
            var td = new Date(toDate);
            var tdate = td.getDate();
            if(tdate < 10){
                tdate = "0"+tdate;
            }
            var tmonth = (td.getMonth()+1);
            if(tmonth < 10){
                tmonth = "0"+tmonth;
            }
            var tyear = td.getFullYear();
            addToSelect('to_year', years);
            $('#from_year').val(tyear);	
            addToSelect('to_month', months);
            $('#to_month').val(tmonth);	
            addToSelect('to_date', dates);
            $('#to_date').val(tdate);
        }

	$.getJSON('/categories/droplist', function(categories){
		addToSelect('category', categories);
                //alert(categoryId);
                if(categoryId){
                    $("#category").val(categoryId);
                }
	});
        
        $.getJSON('/countries/droplist', function(countries){
		addToSelect('country', countries);
                if(countryId){
                    $("#country").val(countryId);
                    changeState(countryId, stateId, cityId)
                }else{
                    changeState(countries[0].id, null, null)
                }
                
	});
}


var changeState = function(countryId, stateId, cityId){
    $('#stateHolder').html("<select name='state' id='state' onchange='changeCity(this.value);'></select>");
    if(countryId){
        $.getJSON('/states/droplistbycountry?countryId='+countryId, function(states){
                            addToSelect('state', states);
                            if(stateId){
                                $("#state").val(stateId);
                                changeCity(stateId, cityId);
                            }else{
                                changeCity(states[0].id, null);
                            }

                    });    
    }
    
}

var changeCity = function(stateId, cityId){
    $('#cityHolder').html("<select name='city' id='city'></select>");
    if(stateId){
        $.getJSON('/cities/droplistbystate?stateId='+stateId, function(cities){
                            addToSelect('city', cities);
                            if(cityId){
                                $("#city").val(cityId);
                            }
                    });    
    }
    
}


var addToSelect = function(id, values) {
	values.forEach(function(value){
		if(id == 'course') {
			$("#" + id).append('<option value="' + value.id + '">' + value.course_name + '</option>')
		}
		else if(value.id) {
			$("#" + id).append('<option value="' + value.id + '">' + value.name + '</option>')
		}
		else
			$("#" + id).append('<option value="' + value + '">' + value + '</option>')
	});
}