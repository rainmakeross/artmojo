

var showCourses = function(school_id, school_name){
    //var spinner = "<img src='/images/ajax-loader-big.gif' alt='Loading course data' />";
    //$('#course').html(spinner);
    $.getJSON("/schools/showcourses?id="+school_id, function(data){
            var htmlStr = CourseUI(data, school_name);
            $('#course').html(htmlStr);  
        });
}

var CourseUI = function(data, school_name){
    
    var str = "";
    if(data){
        if(data.length > 0){
            if(data.length > 1){
                var txt = "courses";
            }else{
                var txt = "course";
            }
            str += '<h2>'+school_name+' teaches “<strong>'+data.length+' '+txt+'.</strong>“</h2>';        
            str += '<ul>';
            for(var i=0; i<data.length;i++){
                var url = "";
                url = data[i].course_name;
                url = url.replace(/ /g, '_');
                url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                url += "_"+data[i].id;
                url = url.toLowerCase();
                str += '<li><a href="/courses/view?url='+data[i].url+'">'+data[i].course_name+'</a></li>';
            }
            str += '</ul>';
        }else{
            str += '<h2>'+school_name+' do not teach any courses .</h2>';  
        }   
    }else{
        str += '<h2>'+school_name+' do not teach any courses .</h2>';  
    }
    
                
    return str;// 
}

var showArtists = function(school_id, school_name){
    //var spinner = "<img src='/images/ajax-loader-big.gif' alt='Loading school data' />";
    //$('#school').html(spinner);
    $.getJSON("/schools/showartists?id="+school_id, function(data){
            var htmlStr = ArtistUI(data, school_name);
            $('#artist').html(htmlStr);                    
            
        });
}
    
var ArtistUI = function(data, school_name){
    
    var str = "";
    if(data){
        if(data.length > 0){
            if(data.length > 1){
                var txt = "artists";
            }else{
                var txt = "artist";
            }
            str += '<h2>“<strong>'+data.length+'</strong>“ '+txt+' teaches in '+school_name+'.</h2>';        
            str += '<ul>';
            for(var i=0; i<data.length;i++){
                var url = "";
                url = data[i].full_name;
                url = url.replace(/ /g, '_');
                url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                url += "_"+data[i].id;
                url = url.toLowerCase();
                str += '<li><a href="/artists/view?url='+url+'">'+data[i].full_name+'</a></li>';
            }
            str += '</ul>';
        }else{
            str += '<h2>No artist is associated with '+school_name+'.</h2>';  
        }   
    }else{
        str += '<h2>No artist is associated with '+school_name+'.</h2>';  
    }
    
                
    return str;// 
}

var showReviews = function(school_id){
    $.getJSON("/schools/showreviews?id="+school_id, function(data){
                if(data){
                    loadReview(data); 
                    //$("#reviewCnt").html((data.length+1));
                }

            });
    
}

var loadReview = function(datas){
    if(datas){
        
        var str = '<ul>';     
        datas.forEach(function(data){
            var date = new Date(data.createdAt);
            var postDate = date.getDate();
            var postMonth = (date.getMonth()+1);
            var postYear = date.getFullYear();
            str += '<li>';
            str += '<p>'+data.comments+'</p>';
            str += '<div class="compositor"><strong>'+data.first_name+' '+data.last_name+'</strong><span>'+postYear+'/'+postMonth+'/'+postDate+'</span></div>';
            //str += '<div class="like"><small>5</small><a href="#"></a></div>';
            str += '<div class="clr"></div>';
            str += '</li>';
        });
        str += '</ul>';
        //alert(str);
        $('#reviews').html(str); 
    }
}

var addReview = function(){
    var logStatus = $('#st').val();
    if(logStatus == 1){
        //var spinner = "<img src='/images/ajax-loader-big.gif' alt='Loading school data' />";
        //$('#school').html(spinner);
        var postData = $("#reviewFrm").serialize();
        $.post("/schools/public/addreview", postData, function(data, textStatus) {
            //data contains the JSON object
            //textStatus contains the status: success, error, etc
            if(data){
                loadReview(data) ;
                var cnt = (parseInt($("#reviewCnt").text())+1);
                $("#reviewCnt").text(cnt);
                $("#review").val("");
            }
          }, "json");
    }else{
        alert("Only logged in users can write a review");
    }
    
}


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
        $.getJSON('/schools/getcourses?id='+id, function(dataSource){
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

var changeCourse = function(cid, id){
    $('#courses').html("");
    //alert('hi')
    if(cid){
        $.getJSON('/courses/droplistbycategory?cid='+cid, function(courses){
        var str = "";
        //alert(mod);
        $.getJSON('/schools/getcourses?id='+id, function(dataSource){
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