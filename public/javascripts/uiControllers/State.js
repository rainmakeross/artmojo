
    
var setupUI = function(countryId){
	
        
	
        
	$.getJSON('/countries/droplist', function(countries){
		addToSelect('country', countries);
                if(countryId){
                    $("#country").val(countryId);
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





function loadAllStates(){
    $.getJSON("/states/listall/", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Name</th>';
             str += '<th align="center">Code</th>';
             str += '<th align="center">Action</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                
                str += '<tr>';
                    
                    str += '<td align="center">'+data.name+'</td>';
                    str += '<td align="center">'+data.abbr+'</td>';
                    str += '<td align="center"><a href="/states/public/edit?id='+data.id+'">Edit</a></td>';
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#stateList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers"
            } );
         }
                        
                        //listEvents(datas);
                        
    });
    
}

var validateStateFrm = function(){
    var name = $('#name').val();
    var abbr = $('#abbr').val();
    var alertTxt = "";
    var bool = true;
    if(name == ""){
        bool = false;
        alertTxt += "Name cannot be blank.\n";
    }
    if(abbr == ""){
        bool = false;
        alertTxt += "Code cannot be blank.\n";
    }
    if(!bool){
        alert(alertTxt);
    }
    return bool;    
}

