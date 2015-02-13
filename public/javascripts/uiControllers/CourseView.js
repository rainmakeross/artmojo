var renderDefaultResult = function(){
    var Html = "<div class='teachers'>";
    Html    += "Your search did not match any artists/schools.<br />";
    Html    += "Suggestions:";
    Html    += "<br />1. Try a different location";
    Html    += "<br />2. Try removing/different filters<br /><br /><br />";
    Html    += "</div>";
    return Html;
}
var showArtistsForCourses = function(course_id, course_name){
    //var spinner = "<img src='/images/ajax-loader-big.gif' alt='Loading course data' />";
    //$('#artist').html(spinner);
    $('#rateArtist').val("");
    $('#reviewArtist').val("");
    $('#innerLocArtist').val("");
    $('#contactArtist').val("");
    $.getJSON("/courses/showartists?id="+course_id, function(data){
            //CourseUIGenerator(dataArr);
            var htmlStr = ArtistUIForCourseView(data, course_name, course_id);
            
            var paginate = false;
            if(htmlStr){
                if(data.length > 30){
                    paginate = true;
                }
                autoCompleteArtistCity();
            }else{
                var Html = "<div class='teachers'>";
                Html    += "<h4>This course is currently not associated with any artist.</h4><br /><br />";
                Html    += "</div>";
                htmlStr += Html;
            }
                        
            if(paginate){
                //alert('Hi')
                $('#artist').html(htmlStr); 
                paginatorForView('artistContainer', 'artistPaginator');
            }else{
                $('#artist').html(htmlStr); 
            }
                      
            
        });
}
var ArtistUIForCourseView = function(datas, course_name, id){
    
    var str = "";
    
    if(datas){
        var artist_img;
        
            str += '<div class="teachers">';
                str += '<ul id="artistContainer">';
                datas.forEach(function(data){
                    var url = "";
                    url = data.full_name;
                    url = url.replace(/ /g, '_');
                    url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                    url += "_"+data.id;
                    url = url.toLowerCase();
                   str += '<li>';
                        str += '<div class="teachersTop">';
                            str += '<div class="teacherImg">';
                                if(data.artist_image){
                                    if(data.localImg == 1){
                                        artist_img = '/images/artists/thumb/'+data.artist_image;
                                    }else{
                                        artist_img = data.artist_image;
                                    }                                    
                                }else{
                                    artist_img = '/images/dummy_user.gif';
                                }
                                if(data.profile_status == 1){
                                    str += '<img src="'+artist_img+'" alt="'+data.full_name+'" style="width:79px;height:79px;cursor:pointer;" onclick="window.location.href=\'/artists/view/?url='+url+'\'" />';                               
                                }else{
                                    str += '<img src="'+artist_img+'" alt="'+data.full_name+'" style="width:79px;height:79px;cursor:pointer;" title="Artist is busy" />';                               
                                }
                                
                            str += '</div>';
                            str += '<div class="teacherInfo">';
                            var full_name = data.full_name;
                            
                            if(data.profile_status == 1){
                                str += '<h3><a href="/artists/view/?url='+url+'">'+full_name+'</a></h3>';
                            }else{
                                str += '<h3>'+full_name+'</h3>';
                            }
                                
                                if(data.phone){ str += '<p><span><img src="/images/tel.png" alt="Call me" /></span>'+data.phone+'</p>'; }
                                if(data.email){ 
                                    
                                    str += '<p><span><img src="/images/mail1.png" alt="Email me" /></span><a href="mailto:'+data.email+'">Email me</a></p>'; 
                                }
                                if(data.website){ 
                                    var website = data.website;
                                    var urlInt = website.substr(0,4);
                                    if(urlInt != 'http'){
                                        website = 'http://'+website;
                                    }
                                    str += '<p><span><img src="/images/icon4.png" alt="See me" /></span><a href="'+website+'" target="_blank">My website</a></p>'; 
                                }
                            str += '</div>';
                        str += '</div>';
                        str += '<div class="clr"></div>';
                        str += '<div class="teachersBttm">';
                            str += '<div class="mapPin">'+data.location+' </div>';
                            /*str += '<div class="rating">';
                                str += '<h3>rating</h3><div class="ratingContent"><img src="/images/stars.png" alt="" /></div>'
                            str += '</div>';*/
                            str += '<div class="clr"></div>';
                        str += '</div>'
                    str += '</li>'; 
                });
                str += '</ul>';                
            str += '</div>'; //teachers end
            str += '<div class="artistContentBttm">';
                str += '&nbsp;';
                str += '<div class="pagination" id="artistPaginator">';
                    
                str += '</div>';
                str += '<div class="clr"></div>';
            str += '</div>';
            str += '<div class="clr"></div>';
        
    }
                
    return str;// 
} 

var showSchoolsForCourses = function(course_id, course_name){
    //var spinner = "<img src='/images/ajax-loader-big.gif' alt='Loading course data' />";
    //$('#school').html(spinner);
    $('#rateSchool').val("");
    $('#reviewSchool').val("");
    $('#innerLocSchool').val("");
    $('#contactSchool').val("");
    $.getJSON("/courses/showschools?id="+course_id, function(data){
            //CourseUIGenerator(dataArr);
            var htmlStr = SchoolUIForCourseView(data, course_name, course_id);
            
            var paginate = false;
            if(htmlStr){
                if(data.length > 30){
                    paginate = true;
                }
                autoCompleteSchoolCity();
            }else{
                var Html = "<div class='teachers'>";
                Html    += "<h4>This course is currently not associated with any school.</h4><br /><br />";
                Html    += "</div>";
                htmlStr += Html;
            }
                        
            if(paginate){
                //alert('Hi')
                $('#school').html(htmlStr); 
                paginatorForView('schoolContainer', 'schoolPaginator'); 
            }else{
                $('#school').html(htmlStr); 
            }    
            
        });
    
}
    

var SchoolUIForCourseView = function(datas, course_name, id){
    
    var str = "";
    
    if(datas){
        var school_img;
            str += '<div class="teachers">';
                str += '<ul id="schoolContainer">';
                datas.forEach(function(data){
                    var url = "";
                    url = data.school_name;
                    url = url.replace(/ /g, '_');
                    url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                    url += "_"+data.id;
                    url = url.toLowerCase();
                    str += '<li style="min-height:200px;">';
                        str += '<div class="teachersTop">';
                            str += '<div class="teacherImg">';
                                if(data.school_image){
                                    if(data.localImg == 1){
                                        school_img = '/images/schools/thumb/'+data.school_image;
                                    }else{
                                        school_img = data.school_image;
                                    }
                                    //alert(data.localImg+" "+data.school_image);
                                }else{
                                    school_img = '/images/dummy_user.gif';
                                }
                                str += '<img src="'+school_img+'" alt="'+data.school_name+'" style="width:79px;height:79px;cursor:pointer;" onclick="window.location.href=\'/schools/view/?url='+url+'\'" />';                               
                            str += '</div>';
                            str += '<div class="teacherInfo">';
                            var school_name = data.school_name;
                            
                                str += '<h3><a href="/schools/view/?url='+url+'">'+school_name+'</a></h3>';
                                if(data.phone){ str += '<p><span><img src="/images/tel.png" alt="Call me" /></span>'+data.phone+'</p>'; }
                                if(data.email){ 
                                    
                                    str += '<p><span><img src="/images/mail1.png" alt="Email me" /></span><a href="mailto:'+data.email+'">Email us</a></p>'; 
                                }
                                if(data.website){ 
                                    var website = data.website;
                                    var urlInt = website.substr(0,4);
                                    if(urlInt != 'http'){
                                        website = 'http://'+website;
                                    }
                                    str += '<p><span><img src="/images/icon4.png" alt="See me" /></span><a href="'+website+'" target="_blank">Our website</a></p>'; 
                                }
                            str += '</div>';
                        str += '</div>';
                        str += '<div class="clr"></div>';
                        str += '<div class="teachersBttm">';
                            str += '<div class="mapPin">'+data.location+'</div>';
                            /*str += '<div class="rating">';
                                str += '<h3>rating</h3><div class="ratingContent"><img src="/images/stars.png" alt="" /></div>'
                            str += '</div>';*/
                            str += '<div class="clr"></div>';
                        str += '</div>'
                    str += '</li>';
                });
                
                str += '</ul>';                
            str += '</div>'; //teachers end
            str += '<div class="artistContentBttm">';
                str += '&nbsp;';
                str += '<div class="pagination" id="schoolPaginator">';
                    
                str += '</div>';
                str += '<div class="clr"></div>';
            str += '</div>';
            str += '<div class="clr"></div>';
    }
                
    return str;// 
}

var loadSubject = function(tag){
   if(tag){
        var tagArr = tag.split(",");
        var str = "<ul>";
        for(i=0; i<tagArr.length; i++){
            str += "<li><a href='#'>"+tagArr[i]+"</a></li>";
        }
        str += "</ul>";
        $("#subjectTag").html(str);
   }
}

var autoCompleteArtistCity = function(){
    $('#innerLocArtist').live('keydown', function(){
        $( "#innerLocArtist" ).autocomplete({
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
                   $( "#innerLocArtist" ).val( ui.item.value );
                   submitArtistFilter(); 
                }
        });    
    });   
    
}

var submitArtistFilter = function(){
    var postData = $("#artistFilter").serialize();
    var course_name = $("#aCourseName").val();
    var course_id = $("#aCourseId").val();
    $.post("/courses/filterartists", postData, function(data, textStatus) {
           //data contains the JSON object
           //textStatus contains the status: success, error, etc
           //$('#artist').html("");
           if(data){
               var htmlStr = ArtistUIForCourseView(data, course_name, course_id);
               var defaultHtml = renderDefaultResult();
               var paginate = false;
               if(htmlStr){
                   if(data.length > 30){
                       paginate = true;
                   }
                   autoCompleteArtistCity();
                   if(paginate){
                        //alert('Hi')
                        $('#artist').html(htmlStr); 
                        paginatorForView('artistContainer', 'artistPaginator'); 
                    }else{
                        $('#artist').html(htmlStr); 
                    }
               }else{
                   $('#artist').html(defaultHtml);
               }
               //alert(htmlStr);
                 
           }else{
               $('#artist').html(defaultHtml);
           }
         }, "json");
}

var autoCompleteSchoolCity = function(){
    $('#innerLocSchool').live('keydown', function(){
        $( "#innerLocSchool" ).autocomplete({
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
                   $( "#innerLocSchool" ).val( ui.item.value );
                   submitSchoolFilter(); 
                }
        });   
    });
    
}

var fireArtistSearch = function(value){
    submitArtistFilter();
}

var fireSchoolSearch = function(value){
    submitSchoolFilter();
}

var submitSchoolFilter = function(){
    var postData = $("#schoolFilter").serialize();
    var course_name = $("#sCourseName").val();
    var course_id = $("#sCourseId").val();
    $.post("/courses/filterschools", postData, function(data, textStatus) {
           //data contains the JSON object
           //textStatus contains the status: success, error, etc
           if(data){
               var htmlStr = SchoolUIForCourseView(data, course_name, course_id);
               var defaultHtml = renderDefaultResult();
               var paginate = false;
               if(htmlStr){
                   if(data.length > 30){
                       paginate = true;
                   }
                   autoCompleteSchoolCity();
                   if(paginate){
                        //alert('Hi')
                        $('#school').html(htmlStr); 
                        paginatorForView('schoolContainer', 'schoolPaginator');
                    }else{
                        $('#school').html(htmlStr); 
                    }
               }else{
                   $('#school').html(defaultHtml);
               }
               
               
           }else{
               $('#school').html(defaultHtml);
           }
         }, "json");
}