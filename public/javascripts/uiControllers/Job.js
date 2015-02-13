var years = ['2013','2014','2015'],
    dates = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    
var setupUI = function(categoryId, job_typeId, countryId, stateId, cityId, closingDate){
	
        
	addToSelect('from_year', years);
	addToSelect('from_month', months);
	addToSelect('from_date', dates);
        if(closingDate){
            var fd = new Date(closingDate);
            var fdate = fd.getDate();
            if(fdate < 10){
                fdate = "0"+fdate;
            }
            var fmonth = (fd.getMonth()+1);
            if(fmonth < 10){
                fmonth = "0"+fmonth;
            }
            var fyear = fd.getFullYear(); 
            $('#from_year').val(fyear);
            $('#from_month').val(fmonth);
            $('#from_date').val(fdate);
        }
        $.getJSON('/categories/droplist', function(categories){
		addToSelect('category', categories);
                //alert(categoryId);
                if(categoryId){
                    $("#category").val(categoryId);
                }
	});
	$.getJSON('/jobtypes/droplist', function(jobtypes){
		addToSelect('job_typeId', jobtypes);
                if(job_typeId){
                    $("#job_typeId").val(job_typeId);
                }
	});
        
        $.getJSON('/countries/droplist', function(countries){
		addToSelect('country', countries);
                if(countryId){
                    $("#country").val(countryId);
                    changeState(countryId, stateId, cityId)
                }else{
                    changeState(countries[0].id, null, null)
                }
                
	});
}


var changeState = function(countryId, stateId, cityId){
    $('#stateHolder').html("<select name='state' id='state' onchange='changeCity(this.value);'></select>");
    if(countryId){
        $.getJSON('/states/droplistbycountry?countryId='+countryId, function(states){
                            addToSelect('state', states);
                            if(stateId){
                                $("#state").val(stateId);
                                changeCity(stateId, cityId);
                            }else{
                                changeCity(states[0].id, null);
                            }

                    });    
    }
    
}

var changeCity = function(stateId, cityId){
    $('#cityHolder').html("<select name='city' id='city'></select>");
    if(stateId){
        $.getJSON('/cities/droplistbystate?stateId='+stateId, function(cities){
                            addToSelect('city', cities);
                            if(cityId){
                                $("#city").val(cityId);
                            }
                    });    
    }
    
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

var loadSrchCategory = function(srchCat){
    $.getJSON('/categories/droplist', function(categories){
		addToSelectCat('categorySrch', categories, srchCat);
	});
}

var addToSelectCat = function(id, values, catVal) {
	values.forEach(function(value){
                var selected = "";
                if(catVal){
                   if(value.id == catVal){
                        selected = "selected='selected'";
                   } 
                }
                
		$("#" + id).append('<option value="' + value.id + '" '+selected+'>' + value.name + '</option>')
	});
}

var loadLocationNCreateJobIndex = function(category){
    var userCity = $.cookie('userCity');
    //alert($.cookie('userCity'));
    if(userCity){
        $('#userCity').val(userCity);  
        loadJobIndex(category);
    }else{
        $.getJSON("/geoip", function(data){
                if(data){
                    var locVal = data.city+", "+data.region;
                    if(!locVal){
                        locVal = data.country;
                    }
                    $('#userCity').val(locVal); 
                    $.cookie('userCity', locVal); //session cookie                 

                }
                loadJobIndex(category);
            });
    }
}


var loadJobIndex = function(category){
    var jobTitle = "";
    var location = "";
    var categoryVal = "";
    if($("#search_data").val()){
        jobTitle = $("#search_data").val();
    }
    if($("#userCity").val()){
        location = $("#userCity").val();
    }
    if($("#categorySrch").val()){
        categoryVal = $("#categorySrch").val(); 
    }else{
        if(category){
            categoryVal = category; 
        }
    }
    
    var param = "jobTitle="+jobTitle+"&location="+location+"&categorySrch="+categoryVal;
    $.getJSON("/jobs/loadJobs/?"+param, function(datas){
        if(datas){
            var str = '<table width="100%" border="1" align="center" cellpadding="0" cellspacing="0">'; 
            str += '<tr>';
             str += '<th align="center">Image</th>';
             str += '<th align="center">Job Title</th>';
             str += '<th align="center">Posted At</th>';
             str += '<th align="center">Location</th>';
             str += '<th align="center">Action</th>';
            str += '</tr>'
            
            //alert(calMonth);
            datas.forEach(function(data){
                var date = new Date(data.createdAt);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                var url = "";
                url = data.jobTitle;
                url = url.replace(/ /g, '_');
                url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                url += "_"+data.id;
                url = url.toLowerCase();
                str += '<tr>';
                    if(data.job_image){
                        var img = '/images/jobs/thumb/'+data.job_image;
                    }else{
                        var img = '/images/dummy-job.png';
                    }
                    str += '<td><img src="'+img+'" style="width:125px;height:125px;" alt="'+data.jobTitle+'" onclick="window.location.href=/jobs/view?url='+url+'" style="cursor:pointer;" /></td>';
                    str += '<td align="center"><a href="/jobs/view?url='+url+'" style="text-decoration:none;">'+data.jobTitle+'</a></td>';
                    str += '<td align="center">'+tDate+'/'+tMonth+'/'+tYear+'</td>';
                    str += '<td align="center">'+data.location+'</td>';
                    str += '<td align="center"><a href="/jobs/public/edit?id='+data.id+'">Edit</a></td>';
                str += '</tr>';

            });
            str += '</table>';
            $("#jobList").html(str);
         }
                        
                        //listEvents(datas);
                        
    });
}

function loadAllJobs(){
    $.getJSON("/jobs/listall/", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Image</th>';
             str += '<th align="center">Job Title</th>';
             str += '<th align="center">Operator</th>';
             str += '<th align="center">Posted At</th>';
             str += '<th align="center">Location</th>';
             str += '<th align="center">Action</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                var url = "";
                url = data.jobTitle;
                url = url.replace(/ /g, '_');
                url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                url += "_"+data.id;
                url = url.toLowerCase();
                var date = new Date(data.createdAt);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                str += '<tr>';
                    if(data.job_image){
                        var img = '/images/jobs/thumb/'+data.job_image;
                    }else{
                        var img = '/images/dummy-job.png';
                    }
                    str += '<td><img src="'+img+'" style="width:125px;height:125px;" alt="'+data.jobTitle+'" onclick="window.location.href=/jobs/view?url='+url+'" style="cursor:pointer;" /></td>';
                    str += '<td align="center">'+data.jobTitle+'</td>';
                    str += '<td align="center">'+data.operator+'</td>';
                    str += '<td align="center">'+tDate+'/'+tMonth+'/'+tYear+'</td>';
                    str += '<td align="center">'+data.location+'</td>';
                    str += '<td align="center"><a href="/jobs/public/edit?id='+data.id+'">Edit</a></td>';
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#jobList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers"
            } );
         }
                        
                        //listEvents(datas);
                        
    });
    
}

function loadMyJobs(){
    $.getJSON("/jobs/loadMyJobs/", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Image</th>';
             str += '<th align="center">Job Title</th>';
             str += '<th align="center">Posted At</th>';
             str += '<th align="center">Location</th>';
             str += '<th align="center">Action</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                var url = "";
                url = data.jobTitle;
                url = url.replace(/ /g, '_');
                url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                url += "_"+data.id;
                url = url.toLowerCase();
                var date = new Date(data.createdAt);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                str += '<tr>';
                    if(data.job_image){
                        var img = '/images/jobs/thumb/'+data.job_image;
                    }else{
                        var img = '/images/dummy-job.png';
                    }
                    str += '<td><img src="'+img+'" style="width:125px;height:125px;" alt="'+data.jobTitle+'" onclick="window.location.href=/jobs/view?url='+url+'" style="cursor:pointer;" /></td>';
                    str += '<td align="center"><a href="#" style="text-decoration:none;">'+data.jobTitle+'</a></td>';
                    str += '<td align="center">'+tDate+'/'+tMonth+'/'+tYear+'</td>';
                    str += '<td align="center">'+data.location+'</td>';
                    str += '<td align="center"><a href="/jobs/public/edit?id='+data.id+'">Edit</a></td>';
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#jobList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers"
            } );
         }
                        
                        //listEvents(datas);
                        
    });
    
}

function loadOpJobs(){
    $.getJSON("/jobs/loadMyJobs/", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Image</th>';
             str += '<th align="center">Job Title</th>';
             str += '<th align="center">Posted At</th>';
             str += '<th align="center">Location</th>';
             str += '<th align="center">Action</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                var url = "";
                url = data.jobTitle;
                url = url.replace(/ /g, '_');
                url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                url += "_"+data.id;
                url = url.toLowerCase();
                var date = new Date(data.createdAt);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                str += '<tr>';
                    if(data.job_image){
                        var img = '/images/jobs/thumb/'+data.job_image;
                    }else{
                        var img = '/images/dummy-job.png';
                    }
                    str += '<td><img src="'+img+'" style="width:125px;height:125px;" alt="'+data.jobTitle+'" onclick="window.location.href=/jobs/view?url='+url+'" style="cursor:pointer;" /></td>';
                    str += '<td align="center"><a href="#" style="text-decoration:none;">'+data.jobTitle+'</a></td>';
                    str += '<td align="center">'+tDate+'/'+tMonth+'/'+tYear+'</td>';
                    str += '<td align="center">'+data.location+'</td>';
                    str += '<td align="center"><a href="/jobs/operator/edit?id='+data.id+'">Edit</a></td>';
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#jobList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers"
            } );
         }
                        
                        //listEvents(datas);
                        
    });
    
}

var validateJobFrm = function(){
    var jobTitle = $('#jobTitle').val();
    var content = $('#description').val();
    var email = $('#applicationEmail').val();
    var image_url = $('#image_url').val();
    var alertTxt = "";
    var bool = true;
    if(jobTitle == ""){
        bool = false;
        alertTxt += "Title cannot be blank.\n";
    }
   
    if(email){
        if(!isEmail(email)){
           bool = false;
           alertTxt += "Email is not in correct format\n";
       }
    }
    
    if(!bool){
        alert(alertTxt);
    }
    return bool;    
}

var validateJobOpFrm = function(){
    var jobTitle = $('#jobTitle').val();
    var content = $('#description').val();
    var email = $('#applicationEmail').val();
    var image_url = $('#image_url').val();
    var alertTxt = "";
    var bool = true;
    if(jobTitle == ""){
        bool = false;
        alertTxt += "Title cannot be blank.\n";
    }
    
    if(email){
        if(!isEmail(email)){
           bool = false;
           alertTxt += "Email is not in correct format\n";
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
        alert(alertTxt);
    }
    return bool;    
}

