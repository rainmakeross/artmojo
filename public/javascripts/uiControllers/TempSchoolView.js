

var setupUI = function(id){
	$.getJSON('/countries/droplist', function(countries){
		addToSelect('country', countries);
                changeState(countries[0].id)
	});
        if(id){
            $.getJSON('/categories/droplist', function(categories){
                    addToSelect('category', categories);
                    changeCourseById(categories[0].id, id)
            });
        }else{
            $.getJSON('/categories/droplist', function(categories){
                    addToSelect('category', categories);
                    changeCourse(categories[0].id)
            });
        }
}

var performAction = function(actionVal){
    var relVal = $('#url').val();
    if(actionVal == 1){
        window.location.href = '/login?url='+relVal;
    }
    if(actionVal == 2){
        window.location.href = '/login?url='+relVal;
    }
    if(actionVal == 3){
        window.location.href = '/tempschools/public/edit?url='+relVal;
    }
}


var changeCourseById = function(cid, id){
    $('#courses').html("");
    //alert('hi')
    $.getJSON('/courses/droplistbycategory?cid='+cid, function(courses){
        var str = "";
        //alert(mod);
        $.getJSON('/schools/getcourses?id='+id, function(dataSource){
            if(courses){
                var j = 0;
                courses.forEach(function(course){
                    var check = "";
                    if((dataSource.length > 0) && (dataSource.length > j)){
                        if(course.id == dataSource[j].courseId){
                            check = "checked='checked'";
                        }
                    }
                    str += "<input type='checkbox' name='course' value='"+course.id+"' "+check+" />"+course.course_name+"&nbsp";
                    j++;
                });
                $('#courses').html(str);
            }   
        });
          
    });
}

var changeCourse = function(cid){
    $('#courses').html("");
    //alert('hi')
    $.getJSON('/courses/droplistbycategory?cid='+cid, function(courses){
        var str = "";
        //alert(mod);
        if(courses){
            var j = 0;
            courses.forEach(function(course){
                str += "<input type='checkbox' name='course' value='"+course.id+"' />"+course.course_name+"&nbsp";
                j++;
            });
            $('#courses').html(str);
        }
          
    });
}

var changeState = function(cid){
    $('#stateHolder').html("<select name='state' id='state' onchange='changeCity(this.value);'></select>");
    $.getJSON('/states/droplistbycountry?countryId='+cid, function(states){
                        addToSelect('state', states);
                        changeCity(states[0].id);
                });
}

var changeCity = function(sid){
    $('#cityHolder').html("<select name='city' id='city'></select>");
    $.getJSON('/cities/droplistbystate?stateId='+sid, function(cities){
                        addToSelect('city', cities);				
                });
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



var validateTempSchool = function(){
    
    var email = $('#your_email').val();
    var school_name = $('#school_name').val();
    var bool = true;
    var str = '';
    if(email == ''){
        bool = false;
        str += "Email is needed\n";
    }else{
       if(!isEmail(email)){
           bool = false;
           str += "Email is not in correct format\n";
       } 
    }
    if(school_name == ''){
        bool = false;
        str += "School name is needed\n";
    }
    if(bool){
        return bool;
    }else{
        alert(str);
        return bool;
    }
}