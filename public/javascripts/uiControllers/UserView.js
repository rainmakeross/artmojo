var years = ['2013','2014','2015'],
	dates = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
	months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];



var setupUI = function(id, mod, countryId, stateId, cityId){
        $.getJSON('/countries/droplist', function(countries){
           addToSelect('country', countries);
           $("#country").val(countryId);
           changeState(countryId, stateId, cityId);
        });
        /*$.getJSON('/cities/droplist/', function(cities){
                addToSelect('city', cities);
                if(cityId){
                    $("#city").val(cityId);
                }
        });*/
	
        $.getJSON('/categories/droplist', function(categories){
		addToSelect('category', categories);
	});
        $.getJSON('/categories/droplist', function(categories){
		addToSelect('icategory', categories);
	});
        getAllCourses(id, mod);
        getAllInterests(id, mod);
        
        
        
}

var getAllCourses = function(id){
    $('#courses').html("");
    //alert('hi')
    $.getJSON('/courses/all', function(courses){
        var str = "";
        //alert(mod);
        $.getJSON('/artists/getcourses?id='+id, function(dataSource){
                if(courses){
                    str += '<ul>';
                    var j = 0;
                    courses.forEach(function(course){
                        var check = "";
                        //alert(dataSource.length);
                        if(dataSource.length > 0){
                            for(var x = 0; x < dataSource.length; x++){
                                if(course.id == dataSource[x].courseId){
                                    check = "checked='checked'";
                                    break;
                                }
                            }
                            
                        }
                        str += "<li><input type='checkbox' name='course' value='"+course.id+"' "+check+" />"+course.course_name+"</li>";
                        j++;
                    });
                    str += '</ul>';
                    $('#courses').html(str);
                }   
            });
          
    });
}

var getAllInterests = function(id){
    $('#interests').html("");
    //alert('hi')
    $.getJSON('/courses/all', function(courses){
        var str = "";
        //alert(mod);
        $.getJSON('/artists/getinterests?id='+id, function(dataSource){
                if(courses){
                    str += '<ul>';
                    var j = 0;
                    courses.forEach(function(course){
                        var check = "";
                        if(dataSource.length > 0){
                            for(var x = 0; x < dataSource.length; x++){
                                if(course.id == dataSource[x].courseId){
                                    check = "checked='checked'";
                                    break;
                                }
                            }
                            
                        }
                        str += "<li><input type='checkbox' name='interest' value='"+course.id+"' "+check+" />"+course.course_name+"</li>";
                        j++;
                    });
                    str += '</ul>';
                    $('#interests').html(str);
                }   
            });
          
    });
}

var changeCourse = function(cid, id){
    $('#courses').html("");
    //alert('hi')
    if(cid){
        $.getJSON('/courses/droplistbycategory?cid='+cid, function(courses){
        var str = "";
        //alert(mod);
        $.getJSON('/artists/getcourses?id='+id, function(dataSource){
                    if(courses){
                        str += '<ul>';
                        var j = 0;
                        courses.forEach(function(course){
                            var check = "";
                            if(dataSource.length > 0){
                                for(var x = 0; x < dataSource.length; x++){
                                    if(course.id == dataSource[x].courseId){
                                        check = "checked='checked'";
                                        break;
                                    }
                                }

                            }
                            str += "<li><input type='checkbox' name='course' value='"+course.id+"' "+check+" />"+course.course_name+"</li>";
                            j++;
                        });
                        str += '</ul>';
                        $('#courses').html(str);
                    }   
                });

        });
    }else{
        getAllCourses(id);
    }
    
}

var changeInterest = function(cid, id){
    $('#interests').html("");
    //alert('hi')
    if(cid){
        $.getJSON('/courses/droplistbycategory?cid='+cid, function(courses){
            var str = "";
            //alert(mod);
            $.getJSON('/artists/getcourses?id='+id, function(dataSource){
                    if(courses){
                        str += '<ul>';
                        var j = 0;
                        courses.forEach(function(course){
                            var check = "";
                            if(dataSource.length > 0){
                                for(var x = 0; x < dataSource.length; x++){
                                    if(course.id == dataSource[x].courseId){
                                        check = "checked='checked'";
                                        break;
                                    }
                                }

                            }
                            str += "<li><input type='checkbox' name='interest' value='"+course.id+"' "+check+" />"+course.course_name+"</li>";
                            j++;
                        });
                        //alert(str);
                        str += '</ul>';
                        $('#interests').html(str);
                        //alert($('#interests').html());
                    }   
                });

        });    
    }else{
        getAllInterests(id);
    }
    
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

var addToSelect = function(id, values) {
	values.forEach(function(value){
		if(value.id) {
			$("#" + id).append('<option value="' + value.id + '">' + value.name + '</option>')
		}
		else
			$("#" + id).append('<option value="' + value + '">' + value + '</option>')
	});
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



var loadMyArtist = function(){
    $.getJSON("/artists/quicklist/list", function(datas){
                if(datas){
                    var str = '<table width="100%" border="1" align="center" cellpadding="0" cellspacing="0">'; 
                    str += '<tr>';
                     str += '<th align="center">Image</th>';
                     str += '<th align="left" style="padding-left:8px;">Artist Name</th>';
                    str += '</tr>'
                    
                    //alert(calMonth);
                    datas.forEach(function(data){
                        var url = "";
                        url = data.full_name;
                        url = url.replace(/ /g, '_');
                        url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                        url += "_"+data.id;
                        str += '<tr>';
                             str += '<td width="55"><img src="/images/artists/thumb/'+data.artist_image+'" alt="'+data.full_name+'" style="max-width:55px;" /></td>';
                             str += '<td align="center"><a href="/artists/view?url='+url+'" style="text-decoration:none;">'+data.full_name+'</a></td>';
                             
                        str += '</tr>';  

                    });
                    str += '</table>';
                    $("#myList").html(str);
                 }

            });
    
}

var loadMySchool = function(){
    $.getJSON("/schools/quicklist/list", function(datas){
                if(datas){
                    var str = '<table width="100%" border="1" align="center" cellpadding="0" cellspacing="0">'; 
                    str += '<tr>';
                     str += '<th align="center">Image</th>';
                     str += '<th align="left" style="padding-left:8px;">School Name</th>';
                    str += '</tr>'
                    
                    //alert(calMonth);
                    datas.forEach(function(data){
                        var url = "";
                        url = data.school_name;
                        url = url.replace(/ /g, '_');
                        url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                        url += "_"+data.id;
                        str += '<tr>';
                             str += '<td width="55"><img src="/images/schools/thumb/'+data.school_image+'" alt="'+data.school_name+'" style="max-width:55px;" /></td>';
                             str += '<td align="center"><a href="/schools/view?url='+url+'" style="text-decoration:none;">'+data.school_name+'</a></td>';
                             
                        str += '</tr>';  

                    });
                    str += '</table>';
                    $("#myList").html(str);
                 }

            });
    
}

var validateEditFrm = function(){
    var email = $('#email').val();
    var first_name = $('#first_name').val();
    var last_name = $('#last_name').val();
    var bool = true;
    var str = '';
    if(first_name == ''){
        bool = false;
        str += "First name is needed\n";
    }
    if(last_name == ''){
        bool = false;
        str += "Last name is needed\n";
    }
    if(email == ''){
        bool = false;
        str += "Email is needed\n";
    }else{
       if(!isEmail(email)){
           bool = false;
           str += "Email is not in correct format\n";
       } 
    }
    if(!bool){
        alert(str);
    }
    return bool;
}

var validateOppEditFrm = function(){
    var email = $('#email').val();
    var first_name = $('#first_name').val();
    var last_name = $('#last_name').val();
    var image_url = $('#image_url').val();
    var bool = true;
    var str = '';
    if(first_name == ''){
        bool = false;
        str += "First name is needed\n";
    }
    if(last_name == ''){
        bool = false;
        str += "Last name is needed\n";
    }
    if(email){
        if(!isEmail(email)){
           bool = false;
           str += "Email is not in correct format\n";
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
        alert(str);
    }
    return bool;
}