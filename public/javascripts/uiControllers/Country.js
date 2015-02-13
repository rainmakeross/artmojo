function loadAllCountrys(){
    $.getJSON("/country/listall", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Name</th>';
             str += '<th align="center">Action</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                str += '<tr>';
                    str += '<td align="center">'+data.name+'</td>';
                    str += '<td align="center"><a href="/country/publicedit?id='+data.id+'">Edit</a></td>';
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#countryList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers"
            } );
         }
                        
    });
    
}

var validateCountryFrm = function(){
    var name = $('#name').val();
    var alertTxt = "";
    var bool = true;
    if(name == ""){
        bool = false;
        alertTxt += "Name cannot be blank.\n";
    }
    if(!bool){
        alert(alertTxt);
    }
    return bool;    
}

