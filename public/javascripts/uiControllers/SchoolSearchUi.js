var renderDefaultResult = function(){
    var Html    = "Your search did not match any artists/schools.<br />";
    Html    += "Suggestions:";
    Html    += "<br />1. Try some different category";
    Html    += "<br />2. Try a different location";
    Html    += "<br />3. Try removing/different filters<br /><br /><br />";
    
    return Html;
}

var loadSchoolResults = function(){
    var course = $('#search_data').val();
    var location = $('#userCity').val();
    if(!course || course == 'What?'){
        course = '%';
    }
    if(!location || location == 'Where?'){
        location = '%';
    }
    var queryStr = "courseName="+course+"&location="+location;
    var spinner = "<img src='/images/ajax-loader-big.gif' alt='Loading school data' />";
    $('#course').html(spinner);
    $('#tabVal').val('school');
    initializeFilters('school');
    $('#courseTab').attr('class', '');
    $('#artistTab').attr('class', '');
    $('#eventTab').attr('class', '');
    $('#jobTab').attr('class', '');
    $('#schoolTab').attr('class', 'activeTab');
    $.getJSON("/schools/results?"+queryStr, function(data){
        //SchoolUIGenerator(dataArr);
        var htmlStr = SchoolUIGenerator(data);            
        $('#course').html(htmlStr); 
        if(data.length > 30){
           paginateData('dataContainer', 'paginator', 30); 
        }
    });
}

var SchoolUIGenerator = function(data){
    
    var str = "";
    
    if(data.length > 0){
        
        str += '<ul id="dataContainer">';
        data.forEach(function(schoolData){
            var url = "";
            url = schoolData.school_name;
            url = url.replace(/ /g, '_');
            url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
            url += "_"+schoolData.id;
            url = url.toLowerCase();
            str += '<li>';
                str += '<div class="galleryContent">';
                    str += '<div class="galleryImg">';
                        if(schoolData.school_image){
                            if(schoolData.localImg == 1){
                                var img = '/images/schools/thumb/'+schoolData.school_image;
                            }else{
                                var img = schoolData.school_image;
                            }
                        }else{
                            var img = '/images/dummy_user.gif';
                        }
                        str += '<img src="'+img+'" alt="'+schoolData.school_name+'" title="'+schoolData.school_name+'" style="width:198px;height:198px;cursor:pointer;" onclick="window.location.href=\'/schools/view/?url='+url+'\'" />';
                        
                         //str += '<a href="/schools/view/?url='+url+'" class="artistButton"><strong>'+courseCntPrint+'</strong> '+artistText+'</a>';
                         //str += '<a href="/schools/view/?url='+url+'" class="schoolButton"><strong>'+artistCntPrint+'</strong> '+schoolText+'</a>';
                    str += '</div>';
                    str += '<div class="galleryText">';
                        if(schoolData.school_name){
                            var school_name = schoolData.school_name;
                            if(school_name.length > 35){
                                school_name = school_name.substr(0, 32)+'..';
                            }
                            str += '<h2><a href="/schools/view?url='+url+'">'+school_name+'</a></h2>';
                         }else{
                            str += '<h2>Default</h2>';
                         }
                         if(schoolData.description){
                            var desc = schoolData.description; 
                         }else{
                            var desc = 'Location: '+schoolData.location;
                         }
                         if(desc.length > 55){
                            desc = desc.substr(0, 52)+'... <a href="/schools/view?url='+url+'">more</a>';
                         }
                         str += '<p>'+desc+'</p>';
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




    
