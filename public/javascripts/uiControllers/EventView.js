var years = ['2013','2014','2015'],
    dates = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
var evtObj = {};

var loadEventIndexUi = function(){
    
    var eventTitle = $("#search_data").val();
    var location = $("#userCity").val();
    var category = $("#categorySrch").val(); 
    var param = "eventTitle="+eventTitle+"&location="+location+"&categorySrch="+category;
    //alert(param);
    $.getJSON("/events/listEvents?"+param, function(datas){
			datas.forEach(function(data){
				var start= data.start.split('-');
				start[1] = monthDigit(start[1]);
				data.start = start.join('-');
				var end= data.end.split('-');
				end[1] = monthDigit(end[1]);
				data.end = end.join('-');                                
			});
                        $('#calendar').fullCalendar( 'removeEvents');
                        $('#calendar').fullCalendar( 'addEventSource', datas );
                        listEvents(datas);
                        evtObj = datas;
                        //listEvents(datas);
                        
    });  
}


var showEvents = function(){
    var eventTitle = $("#search_data").val();
    var location = $("#userCity").val();
    var category = $("#categorySrch").val(); 
    var param = "eventTitle="+eventTitle+"&location="+location+"&categorySrch="+category;
    //alert(param);
    $.getJSON("/events/listEvents?"+param, function(datas){
			datas.forEach(function(data){
				var start= data.start.split('-');
				start[1] = monthDigit(start[1]);
				data.start = start.join('-');
				var end= data.end.split('-');
				end[1] = monthDigit(end[1]);
				data.end = end.join('-');                                
			});
                        evtObj = datas;
                        $('#calendar').fullCalendar({
                                header: {
                                        right: 'prev,next',
                                        left: 'title'
                                },
				events: datas,
                                complete : function() {
                                    listEvents(datas);
                                }
			});
                        
                        //listEvents(datas);
                        
    });
}

var listEvents = function(datas){
    if(datas){
       var str = '<table width="100%" border="1" align="center" cellpadding="0" cellspacing="0">'; 
       str += '<tr>';
        str += '<th align="center">Image</th>';
        str += '<th align="center">Event Title</th>';
        str += '<th align="center">Date</th>';
        str += '<th align="center">Location</th>';
       str += '</tr>'
       var d = $('#calendar').fullCalendar('getDate');
       var calDate = new Date(d);
       var calMonth = (calDate.getMonth()+1);
       var calYear = calDate.getFullYear();
       //alert(calMonth);
       datas.forEach(function(data){
           var url = "";
            url = data.title;
            url = url.replace(/ /g, '_');
            url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
            url += "_"+data.id;
            url = url.toLowerCase();
           var date = new Date(data.start);
           var tDate = date.getDate();
           var tMonth = (date.getMonth()+1);
           var tYear = date.getFullYear();
           if((tMonth == calMonth) && (tYear == calYear)){
                str += '<tr>';
                    str += '<td><img style="max-width:125px;max-height:125px;" src="/images/events/thumb/'+data.image+'" alt="'+data.title+'" onclick="window.location.href=\'/events/view/?url='+url+'\'" style="cursor:pointer;" /></td>';
                    str += '<td align="center"><a href="/events/view/?url='+url+'" style="text-decoration:none;">'+data.title+'</a></td>';
                    str += '<td align="center">'+tDate+'/'+tMonth+'/'+tYear+'</td>';
                    str += '<td align="center">'+data.location+'</td>';
                str += '</tr>';  
           }
           
       });
       str += '</table>';
       $("#eventList").html(str);
    }
    
}

var setupUI = function(email, id){
	//$('#contact_email').val(email);
	//$('#id').val(id);

	addToSelect('from_year', years);
	addToSelect('to_year', years);
	addToSelect('from_month', months);
	addToSelect('to_month', months);
	addToSelect('from_date', dates);
	addToSelect('to_date', dates);

	$.getJSON('/categories/droplist', function(categories){
		addToSelect('category', categories);
	});
        
        $.getJSON('/countries/droplist', function(countries){
		addToSelect('country', countries);
                changeState(countries[0].id, null, null);
	});
        
        
}

var changeState = function(cid, stateId, cityId){
    $('#stateHolder').html("<select name='state' id='state' onchange='changeCity(this.value);'></select>");
    $.getJSON('/states/droplistbycountry?countryId='+cid, function(states){
                        
                        addToSelect('state', states);
                        
                        if(stateId){
                            //alert(stateId);
                            $("#state").val(stateId);
                            changeCity(stateId, cityId);
                        }else{
                            changeCity(states[0].id, null);
                        }
                        
                });
}

var changeCity = function(sid, cityId){
    $('#cityHolder').html("<select name='city' id='city'></select>");
    if(sid){
        $.getJSON('/cities/droplistbystate?stateId='+sid, function(cities){
                        addToSelect('city', cities);	
                        if(cityId){
                            $("#city").val(cityId);
                        }
                });
    }
    
}

var loadSrchCategory = function(srchCat){
    $.getJSON('/categories/droplist', function(categories){
		addToSelectCat('categorySrch', categories, srchCat);
	});
}

var setupUIEdit = function(categoryId, countryId, stateId, cityId, fromDate, toDate){
	//$('#contact_email').val(email);
	//$('#id').val(id);
        //var fromArr = fromDate.split("-");
        //var toArr = toDate.split("-");
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
        
	addToSelect('from_year', years);
        $('#from_year').val(fyear);
	addToSelect('to_year', years);
        $('#from_year').val(tyear);
	addToSelect('from_month', months);
        $('#from_month').val(fmonth);
	addToSelect('to_month', months);
        $('#to_month').val(tmonth);
	addToSelect('from_date', dates);
        $('#from_date').val(fdate);
	addToSelect('to_date', dates);
        $('#to_date').val(tdate);

	$.getJSON('/categories/droplist', function(categories){
		addToSelect('category', categories);
                //alert(categoryId);
                $('#category').val(categoryId);
                
	});
        
        $.getJSON('/countries/droplist', function(countries){
           addToSelect('country', countries);
           $("#country").val(countryId);
           changeState(countryId, stateId, cityId);
        });
        
        
}

var changeCourse = function(cid){
    $('#courseHolder').html("<select name='course' id='course'></select>");
    $.getJSON('/courses/droplist?cid='+cid, function(courses){
                        addToSelect('course', courses);				
                });
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

var addToSelectCat = function(id, values, catVal) {
	values.forEach(function(value){
                var selected = "";
                if(catVal){
                   if(value.id == catVal){
                        selected = "selected='selected'";
                   } 
                }
                
		$("#" + id).append('<option value="' + value.id + '" '+selected+'>' + value.name + '</option>')
	});
}

var viewEvent = function(data, auth, id) {
	if(auth == data.contact_email) {
            window.location.href = '/events/public/edit/?id='+id;
	}
	else {
            window.location.href = '/events/view/?id='+id;
	}	
}

var monthDigit = function(mnth) {
	switch(mnth) {
		case 'Jan':
			return '01'
			break;
		case 'Feb':
			return '02'
			break;
		case 'Mar':
			return '03'
			break;
		case 'Apr':
			return '04'
			break;
		case 'May':
			return '05'
			break;
		case 'Jun':
			return '06'
			break;
		case 'Jul':
			return '07'
			break;
		case 'Aug':
			return '08'
			break;
		case 'Sep':
			return '09'
			break;
		case 'Oct':
			return '10'
			break;
		case 'Nov':
			return '11'
			break;
		case 'Dec':
			return '12'
			break;
	}
}

var validateEventFrm = function(){
    var title = $('#title').val();
    var email = $('#contact_email').val();
    var alertTxt = "";
    var bool = true;
    if(title == ""){
        bool = false;
        alertTxt += "Title cannot be blank\n";
    }
    if(email == ''){
        bool = false;
        alertTxt += "Email is needed\n";
    }else{
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