var monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var renderDefaultResult = function(){
    var Html    = "Your search did not match any jobs.<br />";
    Html    += "Suggestions:";
    Html    += "<br />1. Try some different category";
    Html    += "<br />2. Try a different location";
    Html    += "<br />3. Try removing/different filters<br /><br /><br />";
    
    return Html;
}

var loadJobResults = function(){
    var course = $('#search_data').val();
    var location = $('#userCity').val();
    if(!course || course == 'What?'){
        course = '%';
    }
    if(!location || location == 'Where?'){
        location = '%';
    }
    var queryStr = "courseName="+course+"&location="+location;
    var spinner = "<img src='/images/ajax-loader-big.gif' alt='Loading job data' />";
    $('#course').html(spinner);
    $('#tabVal').val('job');
    initializeFilters('job');
    $('#courseTab').attr('class', '');
    $('#artistTab').attr('class', '');
    $('#schoolTab').attr('class', '');
    $('#eventTab').attr('class', '');
    $('#jobTab').attr('class', 'activeTab');
    $.getJSON("/jobs/results?"+queryStr, function(data){
        //JobUIGenerator(dataArr);
        var htmlStr = JobUIGenerator(data);            
        $('#course').html(htmlStr); 
        $('#paginator').html("");
        if(data.length > 30){
           paginateData('dataContainer', 'paginator', 30); 
        }
    });
}

var JobUIGenerator = function(data){
    
    var str = "";
    
    if(data.length){
        
        str += '<ul id="dataContainer">';
        data.forEach(function(jobData){
            var url = "";
            url = jobData.jobTitle;
            url = url.replace(/ /g, '_');
            url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
            url += "_"+jobData.id;
            url = url.toLowerCase();
            str += '<li>';
                str += '<div class="galleryContent">';
                    str += '<div class="galleryImg">';
                        if(jobData.job_image){
                            if(jobData.localImg == 1){
                                var img = '/images/jobs/thumb/'+jobData.job_image;
                            }else{
                                var img = jobData.job_image;
                            }
                        }else{
                            var img = '/images/dummy-job.png';
                        }
                        str += '<img src="'+img+'" alt="'+jobData.jobTitle+'" title="'+jobData.jobTitle+'" style="width:198px;height:198px;cursor:pointer;" onclick="window.location.href=\'/jobs/view/?url='+url+'\'" />';
                        
                    str += '</div>';
                    str += '<div class="galleryText">';
                        if(jobData.jobTitle){
                            var title = jobData.jobTitle;
                            if(title.length > 42){
                                title = title.substr(0, 39)+'...';
                            }
                            str += '<h2><a href="/jobs/view?url='+url+'">'+title+'</a></h2>';
                         }else{
                            str += '<h2>Default</h2>';
                         }
                         var date = new Date(jobData.createdAt);
                            var tDate = date.getDate();
                            var tMonth = date.getMonth();
                            var tYear = date.getFullYear();
                         str += '<p>'
                         str += 'Post Date: <strong>'+tDate+' '+monthArr[tMonth]+', '+tYear+'</strong>'; 
                         if(jobData.closingDate != '0000-00-00 00:00:00 Z'){
                            var date2 = new Date(jobData.createdAt);
                            var jDate = date2.getDate();
                            var jMonth = date2.getMonth();
                            var jYear = date2.getFullYear();   
                            str += '<br />Expiry Date: <strong>'+jDate+' '+monthArr[jMonth]+', '+jYear+'</strong>'; 
                         }
                         str += '<br />Location: '+jobData.location; 
                         
                         str += '</p>';
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




    
