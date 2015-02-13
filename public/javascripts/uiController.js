//javascript document


   

var autoCompleteKeywords = function(){
    $( "#search_data" ).autocomplete({
            source: function (request, response) {
                $.getJSON("/courses/autocomplete?term=" + request.term, function (data) {
                    response($.map(data, function (value, key) {
                        return {
                                label: key,
                                value: value
                            };
                        
                    }));
                });
            },
            minLength: 2,
            open: function() {
                    $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
            },
            close: function() {
                    $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
            },
            select: function( event, ui ) {
               setSrchTxt( ui.item.value );
            }
    });
}

var autoCompleteCity = function(){
    $( "#userCity" ).autocomplete({
            source: function (request, response) {
                $.getJSON("/cities/autocomplete?term=" + request.term, function (data) {
                    response($.map(data, function (value, key) {
                        return {
                            label: value,
                            value: key
                        };
                    }));
                });
            },
            minLength: 2,
            open: function() {
                    $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
            },
            close: function() {
                    $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
            },
            select: function( event, ui ) {
               setLocation( ui.item.value );
               loadIndexUi( ui.item.value );
            }
    });
}

var loadMentors = function(){
    $.getJSON("/artists/loadmentors", function(mentors){
        var str = "";
        var url = "";
        var i = 0;
            if(mentors.length){
                mentors.forEach(function(mentorData){
                   //create url
                   var url = "";
                   url = mentorData.full_name;
                   url = url.replace(/ /g, '_');
                   url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                   url += "_"+mentorData.id;
                   url = url.toLowerCase();
                   if(i==2){
                       str += '<div class="mentorsBox" style="margin: 13px 0 0 0;">'; 
                    }else{
                        str += '<div class="mentorsBox">';
                    }
                    if(mentorData.artist_image){
                        if(mentorData.localImg == 1){
                            var img = '/images/artists/thumb/'+mentorData.artist_image;
                        }else{
                            var img = mentorData.artist_image;
                        }
                    }else{
                        var img = '/images/dummy_user.gif';
                    }
                    str += '<div class="mentorsBoxImg"><img id="mentorImgs'+mentorData.id+'" src="'+img+'" alt="'+mentorData.full_name+'" onclick="window.location.href=\'/artists/view/?url='+url+'\'" style="cursor:pointer;" class="indexImg" /></div>';
                    str += '<div class="mentorsBoxText">';
                    str += '<div class="mentorsBoxTextLeft">';
                    $('#mentorImgs'+mentorData.id).error(function() {
                        alert('Image does not exist !!');
                      });
                    if(mentorData.full_name){
                       var full_name = mentorData.full_name;
                       
                       str += '<titleText><a href="/artists/view/?url='+url+'" style="text-decoration:none;">'+full_name+'</a></titleText>';
                    }else{
                       str += '<titleText>Default</titleText>';
                    }
                    
                    str += '<br /><span>&nbsp;</span>';
                    str += '</div>';
                    str += '<div class="clr"></div>';
                    str += '</div>';
                    str += '<div class="mentorsDescriptions">';
                    
                    if(mentorData.description){
                       var desc = mentorData.description;                   
                    }else{
                       var desc = 'Location: '+mentorData.location;
                    }                    
                    if(desc.length > 100){
                        desc = desc.substr(0, 100)+'....';
                    }
                    str += '<p>'+desc+'</p>';                   
                    str += '</div></div>'; 
                    i++;
                });
            }
            //alert(str);
            $('#indexMentors').html(str);
            
            
            
        });
}

var loadSchools = function(){
    $.getJSON("/schools/loadschools", function(schools){
        var str = "";
        
        var i = 0;
            if(schools.length){
                schools.forEach(function(schoolData){
                   var url = "";
                   url = schoolData.school_name;
                   url = url.replace(/ /g, '_');
                   url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                   url += "_"+schoolData.id;
                   url = url.toLowerCase();
                    if(i==2){
                       str += '<div class="schoolsBox" style="margin: 13px 0 0 0;">'; 
                    }else{
                        str += '<div class="schoolsBox">';
                    }
                    if(schoolData.school_image){
                        if(schoolData.localImg == 1){
                            var img = '/images/schools/thumb/'+schoolData.school_image;
                        }else{
                            var img = schoolData.school_image;
                        }
                    }else{
                        var img = '/images/dummy_user.gif';
                    }
                    str += '<div class="schoolsBoxImg"><img id="schoolImgs'+schoolData.id+'" src="'+img+'" alt="'+schoolData.school_name+'" onclick="window.location.href=\'/schools/view/?url='+url+'\'" style="cursor:pointer;" class="indexImg" /></div>';
                    str += '<div class="schoolsBoxText">';
                    str += '<div class="schoolsBoxTextLeft">';
                    $('#schoolImgs'+schoolData.id).error(function() {
                        alert('Image does not exist !!');
                      });
                    if(schoolData.school_name){
                       var school_name = schoolData.school_name;
                       
                       str += '<titleText><a href="/schools/view/?url='+url+'" style="text-decoration:none;">'+school_name+'</a></titleText>';
                    }else{
                       str += '<titleText>Default</titleText>';
                    }
                    
                    
                    str += '<br /><span>&nbsp;</span>';
                    str += '</div>';
                    str += '<div class="clr"></div>';
                    str += '</div>';
                    str += '<div class="schoolsDescriptions">';
                    
                    if(schoolData.description){
                       var desc = schoolData.description;                   
                    }else{
                       var desc = 'Location: '+schoolData.location;
                    }                    
                    if(desc.length > 100){
                        desc = desc.substr(0, 100)+'....';
                    }
                    str += '<p>'+desc+'</p>';                   
                    str += '</div>';
                    str += '</div>';
                    i++;
                });
            }
            $('#indexSchools').html(str);
            
            
            
        });
}

var loadCourses = function(){
    $.getJSON("/courses/loadcourses", function(courses){
        var str = "";      
    	var i =0;
            if(courses.length){
                courses.forEach(function(courseData){
                   //create url
                   var url = "";
                   url = courseData.course_name;
                   url = url.replace(/ /g, '_');
                   url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                   url += "_"+courseData.id;
                   url = url.toLowerCase();
                    if(i==2){
                       str += '<div class="artFormBox" style="margin: 13px 0 0 0;">'; 
                    }else{
                        str += '<div class="artFormBox">';
                    }
                    str += '<div class="artFormBoxImg"><img src="/images/courses/'+courseData.course_image+'" alt="'+courseData.course_name+'" class="indexImg" onclick="window.location.href=\'/courses/view/?url='+url+'\'" style="cursor:pointer;" /></div>';
                    str += '<div class="artFormBoxText">';
                    if(courseData.course_name){
                       var course_name = courseData.course_name;
                       
                       str += '<artTextTitle><a href="/courses/view/?url='+url+'" style="text-decoration:none; color:#000000;">'+course_name+'</a></artTextTitle>';
                    }else{
                       str += '<artTextTitle>Default</artTextTitle>';
                    }
                    
                    str += '</div>';
                    str += '<div class="artFormDescriptions">';
                    if(courseData.course_description){
                       var desc = courseData.course_description;
                       if(desc.length > 100){
                           desc = desc.substr(0, 100)+'....';
                       }
                       str += '<p>'+desc+'</p>'; 
                    }else{
                       str += '<p>Course description is coming soon</p>';
                    }   
                    str += '</div></div>';
                    i++;
                });
                
            }
            $('#indexCourses').html(str);
            
        });
}

var loadEvents = function(){
    $('#mainEvent').html("");
    $.getJSON("/events/loadevents", function(eventsData){
        var str1 = ""; 
        
            if(eventsData.length){
                var desc1 = eventsData[0].description;
                if(desc1){
                    if(desc1.length > 400){
                        desc1 = desc1.substr(0, 400)+'....';
                    }  
                }else{
                    desc1 = "&nbsp;";
                }

                if(eventsData[0].event_image){
                    var img2 = '/images/events/thumb/'+eventsData[0].event_image;
                }else{
                    var img2 = '/images/dummy_user.gif';
                }
                //create url
                var url1 = "";
                url1 = eventsData[0].title;
                url1 = url1.replace(/ /g, '_');
                url1 = url1.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                url1 += "_"+eventsData[0].id;
                url1 = url1.toLowerCase();
                loadMainEvent(base64_encode(url1), base64_encode(eventsData[0].title), base64_encode(img2), base64_encode(eventsData[0].from_date), base64_encode(desc1));
                //alert(eventsData);
                eventsData.forEach(function(eventData){
                    //create url
                    var url = "";
                    url = eventData.title;
                    url = url.replace(/ /g, '_');
                    url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                    url += "_"+eventData.id;
                    url = url.toLowerCase();
                    //alert("Here");
                    var desc = eventData.description;
                    if(desc){
                        if(desc.length > 80){
                            desc = desc.substr(0, 80)+'....';
                        }
                    }else{
                        desc = "&nbsp;";
                    }
                    
                    var desc2 = eventData.description;
                    if(desc2){
                        if(desc2.length > 400){
                            desc2 = desc2.substr(0, 400)+'....';
                        } 
                    }else{
                        desc2 = "&nbsp;";
                    }
                    
                    str1 += '<div class="search2">';
                    if(eventData.event_image){
                        var img = '/images/events/thumb/'+eventData.event_image;
                    }else{
                        var img = '/images/dummy_user.gif';
                    }
                    str1 += '<div class="searchImg2"><img alt="'+eventData.title+'" style="cursor:pointer" src="'+img+'" width="75" height="75" onclick="loadMainEvent(\''+base64_encode(url)+'\', \''+base64_encode(eventData.title)+'\', \''+base64_encode(img)+'\', \''+base64_encode(eventData.from_date)+'\', \''+base64_encode(desc2)+'\');"></div>';
                    str1 += '<div class="searchText2">';
                    var title = "Default";
                    if(eventData.title){
                       var title = eventData.title;
                       if(title.length > 120){
                           title = title.substr(0, 120)+'..';
                       }
                       
                    }
                    str1 += '<h2><a href="#" onclick="loadMainEvent(\''+base64_encode(url)+'\', \''+base64_encode(eventData.title)+'\', \''+base64_encode(img)+'\', \''+base64_encode(eventData.from_date)+'\', \''+base64_encode(desc2)+'\'); return false;">'+title+'</a></h2>';
                    var fdate1 = new Date(eventData.from_date);
                    var date1 = fdate1.getFullYear()+"-"+(fdate1.getMonth()+1)+"-"+fdate1.getDate();
                    str1 += '<span class="date">'+date1+' </span>';
                    
                    //str1 += '<p>'+desc+' </p>';
                    str1 += '</div><div class="clr"></div></div>'; 
                });
                
                
                
            }
            $('#leftEvents').html(str1);
            
            
        });
}

var loadMainEvent = function(url, title, image, fromDate, desc){
    fromDate = base64_decode(fromDate);
    url = base64_decode(url);
    title = base64_decode(title);
    image = base64_decode(image);
    desc = base64_decode(desc);
    var fdate2 = new Date(fromDate);
    var date2 = fdate2.getFullYear()+"-"+(fdate2.getMonth()+1)+"-"+fdate2.getDate();
    var str = "";
    str = '<div class="searchText" style=" width:90%;">';
    str += '<h2><a href="/events/view?url='+url+'">'+title+'</a></h2>';
    str += '<span class="date">'+date2+'</span>';
    str += '<p>'+desc+'</p>';
    str += '<div class="eventImg"><img alt="'+title+'" style="cursor:pointer" src="'+image+'" width="249" height="250" onclick="window.location.href=\'/events/view/?url='+url+'\'"></div></div>';
    str += '<div class="clr"></div>'
    $('#mainEvent').html(str);
}

var loadJobs = function(){
    $('#mainJob').html("");
    $.getJSON("/jobs/loadEjobs", function(jobs){
        var str1 = ""; 
        
            if(jobs.length){
                var desc1 = jobs[0].description;
                if(desc1){
                    if(desc1.length > 400){
                        desc1 = desc1.substr(0, 400)+'....';
                    }  
                }else{
                    desc1 = "&nbsp;";
                }

                if(jobs[0].job_image){
                    var img2 = '/images/jobs/thumb/'+jobs[0].job_image;
                }else{
                    var img2 = '/images/dummy-job.png';
                }
                //create url
                var url1 = "";
                url1 = jobs[0].jobTitle;
                url1 = url1.replace(/ /g, '_');
                url1 = url1.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                url1 += "_"+jobs[0].id;
                url1 = url1.toLowerCase();
                loadMainJob(base64_encode(url1), base64_encode(jobs[0].jobTitle), base64_encode(img2), base64_encode(jobs[0].createdAt), base64_encode(desc1));
                jobs.forEach(function(jobData){
                    //create url
                    var url = "";
                    url = jobData.jobTitle;
                    url = url.replace(/ /g, '_');
                    url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                    url += "_"+jobData.id;
                    url = url.toLowerCase();
                    var desc = jobData.description;
                    if(desc){
                        if(desc.length > 80){
                            desc = desc.substr(0, 80)+'....';
                        }
                    }else{
                        desc = "&nbsp;";
                    }
                    
                    var desc2 = jobData.description;
                    if(desc2){
                        if(desc2.length > 400){
                            desc2 = desc2.substr(0, 400)+'....';
                        } 
                    }else{
                        desc2 = "&nbsp;";
                    }
                    
                    str1 += '<div class="search2">';
                    if(jobData.job_image){
                        var img = '/images/jobs/thumb/'+jobData.job_image;
                    }else{
                        var img = '/images/dummy-job.png';
                    }
                    str1 += '<div class="searchImg2"><img alt="'+jobData.jobTitle+'" style="cursor:pointer" src="'+img+'" width="75" height="75" onclick="loadMainJob(\''+base64_encode(url)+'\', \''+base64_encode(jobData.jobTitle)+'\', \''+base64_encode(img)+'\', \''+base64_encode(jobData.closingDate)+'\', \''+base64_encode(desc2)+'\');"></div>';
                    str1 += '<div class="searchText2">';
                    var title = "Default";
                    if(jobData.jobTitle){
                       var title = jobData.jobTitle;
                       if(title.length > 120){
                           title = title.substr(0, 120)+'..';
                       }
                       
                    }
                    str1 += '<h2><a href="#" onclick="loadMainJob(\''+base64_encode(url)+'\', \''+base64_encode(jobData.jobTitle)+'\', \''+base64_encode(img)+'\', \''+base64_encode(jobData.createdAt)+'\', \''+base64_encode(desc2)+'\'); return false;">'+title+'</a></h2>';
                    var fdate1 = new Date(jobData.createdAt);
                    var date1 = fdate1.getFullYear()+"-"+(fdate1.getMonth()+1)+"-"+fdate1.getDate();
                    str1 += '<span class="date">'+date1+' </span>';
                    
                    //str1 += '<p>'+desc+' </p>';
                    str1 += '</div><div class="clr"></div></div>'; 
                });
                
                
                
            }
            $('#leftJobs').html(str1);
            
            
        });
}

var loadMainJob = function(url, title, image, fromDate, desc){
    fromDate = base64_decode(fromDate);
    url = base64_decode(url);
    title = base64_decode(title);
    image = base64_decode(image);
    desc = base64_decode(desc);
    var fdate2 = new Date(fromDate);
    var date2 = fdate2.getFullYear()+"-"+(fdate2.getMonth()+1)+"-"+fdate2.getDate();
    var str = "";
    str = '<div class="searchText" style=" width:90%;">';
    str += '<h2><a href="/jobs/view?url='+url+'">'+title+'</a></h2>';
    str += '<span class="date">'+date2+'</span>';
    str += '<p>'+desc+'</p>';
    str += '<div class="eventImg"><img alt="'+title+'" style="cursor:pointer" src="'+image+'" width="250" height="250" onclick="window.location.href=\'/events/view/?url='+url+'\'"></div></div>';
    str += '<div class="clr"></div>'
    $('#mainJob').html(str);
}

var loadLocationNCreateUi = function(){
    var userCity = $.cookie('userCity');
    //alert($.cookie('userCity'));
    if(userCity){
        $('#userCity').val(userCity);  
        loadAllFeaturedUi();
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
                loadAllFeaturedUi();


            });
    }
    
}

var loadLocationNCreateEventUi = function(){
    var userCity = $.cookie('userCity');
    //alert($.cookie('userCity'));
    if(userCity){
        $('#userCity').val(userCity);  
        loadAllFeaturedUi();
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
                loadAllFeaturedUi();


            });
    }
    
}

var loadLocationNCreateJobUi = function(category){
    var userCity = $.cookie('userCity');
    //alert($.cookie('userCity'));
    if(userCity){
        $('#userCity').val(userCity);  
        loadJob(category);
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
                loadJob(category);
            });
    }
}

var loadLocation = function(){
    var userCity = $.cookie('userCity');
    //alert($.cookie('userCity'));
    if(userCity){
        $('#userCity').val(userCity);        
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


            });
    }
    
}

var loadSrchTxt = function(){
    var search_data = $.cookie('search_data');
    //alert($.cookie('userCity'));
    if(search_data){
        $('#search_data').val(search_data);        
    }
    
}

var setLocation = function(value){
    //alert(value);
    $.cookie('userCity', value); //session cookie
}

var setSrchTxt = function(value){
    //alert(value);
    $.cookie('search_data', value); //session cookie
}

var loadAllFeaturedUi = function(){
    
    loadMentors();
    loadSchools();
    loadCourses();
    loadEvents();
    loadJobs(); 
}

var loadIndexUi = function(value){
    if(value.length){
       if(value.length >= 2) {
            loadMentors();
            loadSchools();
            loadCourses();
            loadEvents();
            loadJobs();
       }
    }
    
}

var paginateData = function(dataContainer, pageContainer, perPage){
    var pageData = $('#'+pageContainer).html();
    //alert(pageData);
    if(pageData){
        setTimeout(function(){
            paginatorReInitialize(dataContainer, pageContainer, perPage);
        },1000)                               
    }else{
        paginatorInitialize(dataContainer, pageContainer, perPage); 
    }
}

var getArtistCountForCourse = function(){
    $.getJSON("/courses/artistcount", function(data){
            if(data){
                $('#userCity').val(locVal);   
            }
        
            
        });
}
   
var subscribe = function(){
    var postData = $("#nlFrm").serialize();
    $.post('/newsletter/subscribe', postData, function(data) {
        alert(data);
    });
}    
    
var initializeFilters = function(filterOn){
    $('#filterFrm').each (function(){
        this.reset();
      });
    
    if(filterOn == 'course'){
        $("#categoryId").prop('disabled', false);
        $("#ratingVal").prop('disabled', true);
        $("#reviewVal").prop('disabled', true);
        $("#phoneVal").prop('disabled', true);
        $("#emailVal").prop('disabled', true);
        $("#websiteVal").prop('disabled', true);
        $('#idTab').val('course');
    }
    if(filterOn == 'artist'){
        $("#categoryId").prop('disabled', true);
        $("#ratingVal").prop('disabled', false);
        $("#reviewVal").prop('disabled', false);
        $("#phoneVal").prop('disabled', false);
        $("#emailVal").prop('disabled', false);
        $("#websiteVal").prop('disabled', false);
        $('#idTab').val('artist');
    }
    if(filterOn == 'school'){
        $("#categoryId").prop('disabled', true);
        $("#ratingVal").prop('disabled', false);
        $("#reviewVal").prop('disabled', false);
        $("#phoneVal").prop('disabled', false);
        $("#emailVal").prop('disabled', false);
        $("#websiteVal").prop('disabled', false);;        
        $('#idTab').val('school');
    }
    if(filterOn == 'event'){
        $("#categoryId").prop('disabled', false);
        $("#ratingVal").prop('disabled', true);
        $("#reviewVal").prop('disabled', true);
        $("#phoneVal").prop('disabled', true);
        $("#emailVal").prop('disabled', true);
        $("#websiteVal").prop('disabled', true);
        $('#idTab').val('event');
    }
    if(filterOn == 'job'){
        $("#categoryId").prop('disabled', false);
        $("#ratingVal").prop('disabled', true);
        $("#reviewVal").prop('disabled', true);
        $("#phoneVal").prop('disabled', true);
        $("#emailVal").prop('disabled', true);
        $("#websiteVal").prop('disabled', true);
        $('#idTab').val('job');
    }
    
}

var submitFilter = function(){
    var filterOn = $('#idTab').val();
    var postData = $('#filterFrm').serialize();
    var masterPostData = $('#searchFrm').serialize();
    var finalPostData = postData+"&"+masterPostData;
    //alert(finalPostData);
    if(filterOn == 'course'){
        var postUrl = "/courses/search/filterResults";
    }
    if(filterOn == 'artist'){
        var postUrl = "/artists/search/filterResults";
    }
    if(filterOn == 'school'){
        var postUrl = "/schools/search/filterResults";
    }
    if(filterOn == 'event'){
        var postUrl = "/events/search/filterResults";
    }
    if(filterOn == 'job'){
        var postUrl = "/jobs/search/filterResults";
    }
    $.post(postUrl, finalPostData, function(data, textStatus) {
           //data contains the JSON object
           //textStatus contains the status: success, error, etc
           //$('#school').html("");
           if(data){
                if(filterOn == 'course'){
                    var htmlStr = CourseUIGenerator(data);            
                    $('#course').html(htmlStr);
                    $('#paginator').html("");
                }
                if(filterOn == 'artist'){
                    var htmlStr = ArtistUIGenerator(data);  
                    $('#course').html(htmlStr);
                    $('#paginator').html("");
                    if(data.length > 30){
                       paginateData('dataContainer', 'paginator', 30); 
                    }
                }
                if(filterOn == 'school'){
                    var htmlStr = SchoolUIGenerator(data);            
                    $('#course').html(htmlStr); 
                    $('#paginator').html("");
                    if(data.length > 30){
                       paginateData('dataContainer', 'paginator', 30); 
                    }
                }
                if(filterOn == 'event'){
                    var htmlStr = EventUIGenerator(data);            
                    $('#course').html(htmlStr); 
                    $('#paginator').html("");
                    if(data.length > 30){
                       paginateData('dataContainer', 'paginator', 30); 
                    }
                }
                if(filterOn == 'job'){
                    var htmlStr = JobUIGenerator(data);            
                    $('#course').html(htmlStr); 
                    $('#paginator').html("");
                    if(data.length > 30){
                       paginateData('dataContainer', 'paginator', 30); 
                    }
                }
           }else{
               alert("No results found.");
           }
         }, "json");
}

var addtolistartist = function(artist_id){
    var url = '/artists/quicklist/publicadd/?id='+artist_id;
    $.ajax({
        cache: false,
        url: url,
        success: function(ret) {
            alert(ret);
        }
    });
}
var addtolistschool = function(school_id){
    var url = '/schools/quicklist/publicadd/?id='+school_id;
    $.ajax({
        cache: false,
        url: url,
        success: function(ret) {
            alert(ret);
        }
    });
}

var validateLogin = function(){
    var email = $('#email').val();
    var password = $('#password').val();
    var bool = true;
    var str = '';
    if(email == ''){
        bool = false;
        str += "Email is needed\n";
    }
    if(password == ''){
        bool = false;
        str += "Password is needed";
    }
    if(!bool){
        alert(str);
    }
    return bool;
}

var isEmail = function (email) {
	AtPos = email.indexOf("@")
	StopPos = email.lastIndexOf(".")
	Message = ""

	/*if (email == "") {
		return false;
	}*/

	if (AtPos == -1 || StopPos == -1) {
		return false;
	}

	if (StopPos < AtPos) {
		return false;
	}

	if (StopPos - AtPos == 1) {
		return false;
	}

	return true;
}

var doSignup = function(){
    
    var postData = $('#signupFrm').serialize();
    var email = $('#semail').val();
    var first_name = $('#first_name').val();
    var last_name = $('#last_name').val();
    var password = $('#spassword').val();
    var rpassword = $('#rpassword').val();
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
    }else{
        if(rpassword == ''){
            bool = false;
            str += "Retype your password\n";
        }else{
            if(password != rpassword){
                bool = false;
                str += "Inputted password does not match with retyped password\n";
            }
        }
    }
    if(bool){
        $.ajax({
            type: 'post',
            url: '/users/dosignup',
            data: postData,
            success: function(ret) {
                alert(ret);
                $('#first_name').val("");
                $('#last_name').val("");
                $('#semail').val("");
                $('#spassword').val("");
                $('#rpassword').val("");
            }
        });
    }else{
        alert(str);
    }
}

var doSendPassword = function(){
    
    var postData = $('#resetFrm').serialize();
    var email = $('#semail').val();
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
    if(bool){
        $.ajax({
            type: 'post',
            url: '/users/sendpassword',
            data: postData,
            success: function(ret) {
                alert(ret);
                $('#semail').val("");
            }
        });
    }else{
        alert(str);
    }
}

var resendToken = function(){
    
    $.ajax({
        type: 'post',
        url: '/users/resendToken',
        success: function(ret) {
            alert(ret);
        }
    });
}

var doContact = function(){
    
    var postData = $('#contactFrm').serialize();
    var email = $('#semail').val();
    var name = $('#full_name').val();
    var email = $('#semail').val();
    var subject = $('#subject').val();
    var message = $('#message').val();
    var bool = true;
    var str = '';
    if(name == ''){
        bool = false;
        str += "Name is needed\n";
    }
    if(email == ''){
        bool = false;
        str += "Email is needed\n";
    }else{
       if(!isEmail(email)){
           bool = false;
           str += "Email is not in correct format\n";
       } 
    }
    if(subject == ''){
        bool = false;
        str += "Subject is needed\n";
    }
    if(message == ''){
        bool = false;
        str += "Message is needed\n";
    }
    if(bool){
        $.ajax({
            type: 'post',
            url: '/pages/doContact',
            data: postData,
            success: function(ret) {
                alert(ret);
                $('#semail').val("");
                $('#full_name').val("");
                $('#subject').val("");
                $('#message').val("");
            }
        });
    }else{
        alert(str);
    }
}

