   
var setupUI = function(categoryId){
	
        
	
        $.getJSON('/categories/droplist', function(categories){
		addToSelect('category', categories);
                //alert(categoryId);
                if(categoryId){
                    $("#category").val(categoryId);
                }
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



function loadAllCourses(){
    $.getJSON("/courses/listall/", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Image</th>';
             str += '<th align="center">Course Title</th>';
             str += '<th align="center">Action</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                
                str += '<tr>';
                    if(data.course_image){
                        var img = '/images/courses/'+data.course_image;
                    }else{
                        var img = '/images/dummy-course.png';
                    }
                    str += '<td><img src="'+img+'" style="width:125px;height:125px;" alt="'+data.course_name+'" style="cursor:pointer;" /></td>';
                    str += '<td align="center">'+data.course_name+'</td>';
                    str += '<td align="center"><a href="/courses/public/edit?id='+data.id+'">Edit</a></td>';
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#courseList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers"
            } );
         }
                        
                        //listEvents(datas);
                        
    });
    
}

var validateCourseFrm = function(){
    var course_name = $('#course_name').val();
    var course_description = $('#course_description').val();
    var alertTxt = "";
    var bool = true;
    if(course_name == ""){
        bool = false;
        alertTxt += "Title cannot be blank.\n";
    }
    if(course_description == ""){
        bool = false;
        alertTxt += "Description cannot be blank.\n";
    }
    if(!bool){
        alert(alertTxt);
    }
    return bool;    
}

