var renderDefaultResult = function(){
    var Html    = "Your search did not match any artists/schools.<br />";
    Html    += "Suggestions:";
    Html    += "<br />1. Try some different category";
    Html    += "<br />2. Try a different location";
    Html    += "<br />3. Try removing/different filters<br /><br /><br />";
    
    return Html;
}

var loadCategories = function(){
    $.getJSON('/categories/droplist', function(categories){
		addToSelect('categoryId', categories);
	});
}

var addToSelect = function(id, values) {
	values.forEach(function(value){
		if(id == 'categoryId') {
			$("#" + id).append('<option value="' + value.id + '">' + value.name + '</option>')
		}
	});
}

var loadCourseResults = function(){
    var course = $('#search_data').val();
    $('#paginator').html("");
    var location = $('#userCity').val();
    if(!course || course == 'What?'){
        course = '%';
    }
    if(!location || location == 'Where?'){
        location = '%';
    }
    var queryStr = "courseName="+course+"&location="+location;
    var spinner = "<img src='/images/ajax-loader-big.gif' alt='Loading course data' />";
    $('#course').html(spinner);
    $('#tabVal').val('course');
    initializeFilters('course');
    $('#courseTab').attr('class', 'activeTab');
    $('#artistTab').attr('class', '');
    $('#schoolTab').attr('class', '');
    $('#eventTab').attr('class', '');
    $('#jobTab').attr('class', '');
    $.getJSON("/courses/results?"+queryStr, function(data){
        //CourseUIGenerator(dataArr);
        var htmlStr = CourseUIGenerator(data); 
        //alert(htmlStr);
        $('#course').html(htmlStr); 
    });
}

var CourseUIGenerator = function(data){
    
    var str = "";
    
    if(data.length > 0){
        
        str += '<ul>';
        data.forEach(function(courseData){
            var url = "";
            url = courseData.course_name;
            url = url.replace(/ /g, '_');
            url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
            url += "_"+courseData.id;
            url = url.toLowerCase();
            str += '<li>';
                str += '<div class="galleryContent">';
                    str += '<div class="galleryImg">';
                        var img = '/images/courses/'+courseData.course_image;
                        str += '<img src="'+img+'" alt="'+courseData.course_name+'" title="'+courseData.course_name+'" style="width:198px;height:198px;cursor:pointer;" onclick="window.location.href=\'/courses/view/?url='+url+'\'" />';
                        
                         //str += '<a href="/courses/view/?url='+url+'" class="artistButton"><strong>'+artistCntPrint+'</strong> '+artistText+'</a>';
                         //str += '<a href="/courses/view/?url='+url+'" class="schoolButton"><strong>'+schoolCntPrint+'</strong> '+schoolText+'</a>';
                    str += '</div>';
                    str += '<div class="galleryText">';
                        if(courseData.course_name){
                            var course_name = courseData.course_name;
                            if(course_name.length > 35){
                                course_name = course_name.substr(0, 32)+'..';
                            }
                            str += '<h2><a href="/courses/view?url='+url+'">'+course_name+'</a></h2>';
                         }else{
                            str += '<h2>Default</h2>';
                         }
                         
                        if(courseData.course_description){
                            var desc = courseData.course_description;
                            if(desc.length > 55){
                                desc = desc.substr(0, 52)+'... <a href="/courses/view?url='+url+'">more</a>';
                            }
                            str += '<p>'+desc+'</p>'; 
                        }else{
                           str += '<p>Course description is coming soon</p>';
                        }
                        
                        str += '<div class="clr"></div>';
                    str += '</div>';
                str += '</div>';
            str += '</li>';
        });
        str += '</ul>';
        str += '<div class="clr"></div>';        
    }else{
        str += renderDefaultResult();
    }
                
    return str;// 
}




    
