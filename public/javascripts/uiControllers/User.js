function loadAllUsers(){
    $.getJSON("/users/listall", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Name</th>';
             str += '<th align="center">Email</th>';
             str += '<th align="center">Password</th>';
             str += '<th align="center">Type</th>';
             str += '<th align="center">Action</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                str += '<tr>';
                    str += '<td align="center">'+data.first_name+' '+data.last_name+'</td>';
                    str += '<td align="center">'+data.email+'</td>';
                    str += '<td align="center">'+data.password+'</td>';
                    var userType = "Admin";
                    if(data.user_typeId == 2){
                        userType = "Artist";
                    }
                    if(data.user_typeId == 3){
                        userType = "Research Ninja";
                    }
                    str += '<td align="center">'+userType+'</td>';
                    str += '<td align="center"><a href="/users/publicedit?id='+data.id+'">Edit</a></td>';
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#userList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers",
            } );
         }
                        
    });
    
}

var validateUserFrm = function(){
    var email = $('#email').val();
    var first_name = $('#first_name').val();
    var last_name = $('#last_name').val();
    var password = $('#password').val();
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
    if(first_name == ''){
        bool = false;
        str += "First name is needed\n";
    }
    if(last_name == ''){
        bool = false;
        str += "Last name is needed\n";
    }
    if(password == ''){
        bool = false;
        str += "Password is needed\n";
    }
    if(!bool){
        alert(alertTxt);
    }
    return bool;    
}

