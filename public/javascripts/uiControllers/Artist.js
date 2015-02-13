function loadAllArtists(){
    $.getJSON("/artists/listall", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Image</th>';
             str += '<th align="center">Full Name</th>';
             str += '<th align="center">Location</th>';
             str += '<th align="center">Operator</th>';
             str += '<th align="center">Posted At</th>';
             str += '<th align="center">Edit</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                var date = new Date(data.createdAt);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                str += '<tr>';
                    if(data.artist_image){
                        var img = '/images/artists/thumb/'+data.artist_image;
                    }else{
                        var img = '/images/dummy_user.gif';
                    }
                    str += '<td><img src="'+img+'" style="width:125px;height:125px;" alt="'+data.full_name+'" style="cursor:pointer;" /></td>';
                    str += '<td align="center">'+data.full_name+'</td>';
                    str += '<td align="center">'+data.location+'</td>';
                    str += '<td align="center">'+data.operator+'</td>';
                    str += '<td align="center">'+tDate+'/'+tMonth+'/'+tYear+'</td>';
                    str += '<td align="center"><a href="/artists/operator/edit?id='+data.id+'">Edit</a></td>';
                str += '</tr>';
            });
            str += '</tbody>';
            str += '</table>';
            $("#artistList").html(str);
            //if()
            /*$('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers",
            } );*/
         }
                        
    });
    
}
function loadMyArtists(){
    $.getJSON("/artists/loadMyArtists/", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Image</th>';
             str += '<th align="center">Full Name</th>';
             str += '<th align="center">Location</th>';
             str += '<th align="center">Posted At</th>';
             str += '<th align="center">Edit</th>';
            str += '</tr>'
             str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                var date = new Date(data.createdAt);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                str += '<tr>';
                    if(data.artist_image){
                        var img = '/images/artists/thumb/'+data.artist_image;
                    }else{
                        var img = '/images/dummy_user.gif';
                    }
                    str += '<td><img src="'+img+'" style="width:125px;height:125px;" alt="'+data.full_name+'" style="cursor:pointer;" /></td>';
                    str += '<td align="center"><a href="#" style="text-decoration:none;">'+data.full_name+'</a></td>';
                    str += '<td align="center">'+data.location+'</td>';
                    str += '<td align="center">'+tDate+'/'+tMonth+'/'+tYear+'</td>';
                    str += '<td align="center"><a href="/artists/operator/edit?id='+data.id+'">Edit</a></td>';
                str += '</tr>';
            });
            str += '</tbody>';
            str += '</table>';
            $("#artistList").html(str);
            $('#datatable').dataTable();
         }
                        
    });
    
}

var setupUI = function(){
        $.getJSON('/countries/droplist', function(countries){
           addToSelect('country', countries);
           changeState(countries[0].id);
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
        getAllCourses();
        
        
        
}

var getAllCourses = function(){
    $('#courses').html("");
    //alert('hi')
    $.getJSON('/courses/all', function(courses){
        var str = "";
        //alert(mod);
        if(courses){
            str += '<ul>';
            var j = 0;
            courses.forEach(function(course){
                
                str += "<li><input type='checkbox' name='course' value='"+course.id+"' />"+course.course_name+"</li>";
                j++;
            });
            str += '</ul>';
            $('#courses').html(str);
        }
          
    });
}



var changeCourse = function(cid){
    $('#courses').html("");
    //alert('hi')
    if(cid){
        $.getJSON('/courses/droplistbycategory?cid='+cid, function(courses){
            var str = "";
            if(courses){
                str += '<ul>';
                var j = 0;
                courses.forEach(function(course){
                    str += "<li><input type='checkbox' name='course' value='"+course.id+"' />"+course.course_name+"</li>";
                });
                str += '</ul>';
                $('#courses').html(str);
            }

        });
    }else{
        getAllCourses();
    }
    
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
    if(sid){
        $.getJSON('/cities/droplistbystate?stateId='+sid, function(cities){
                        addToSelect('city', cities);
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