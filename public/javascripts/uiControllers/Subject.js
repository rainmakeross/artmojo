   
var setupUI = function(courseId){
	
        
	
        $.getJSON('/courses/all', function(courses){
		addToSelect('course', courses);
                //alert(courseId);
                if(courseId){
                    $("#course").val(courseId);
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



function loadAllSubjects(){
    $.getJSON("/subjects/listall/", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Subject Title</th>';
             str += '<th align="center">Action</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                str += '<tr>';
                    
                    str += '<td align="center">'+data.subject_name+'</td>';
                    str += '<td align="center"><a href="/subjects/public/edit?id='+data.id+'">Edit</a></td>';
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#subjectList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers",
            } );
         }
                        
                        //listEvents(datas);
                        
    });
    
}

var validateSubjectFrm = function(){
    var subject_name = $('#subject_name').val();
    var alertTxt = "";
    var bool = true;
    if(subject_name == ""){
        bool = false;
        alertTxt += "Title cannot be blank.\n";
    }
    if(!bool){
        alert(alertTxt);
    }
    return bool;    
}

