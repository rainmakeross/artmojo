

var showCourses = function(artist_id, artist_name){
    //var spinner = "<img src='/images/ajax-loader-big.gif' alt='Loading course data' />";
    //$('#course').html(spinner);
    $.getJSON("/artists/showcourses?id="+artist_id, function(data){
            var htmlStr = CourseUI(data, artist_name);
            $('#course').html(htmlStr);  
        });
}

var showInterests = function(artist_id, artist_name){
    //var spinner = "<img src='/images/ajax-loader-big.gif' alt='Loading course data' />";
    //$('#course').html(spinner);
    $.getJSON("/artists/showinterests?id="+artist_id, function(data){
            var htmlStr = InterestUI(data, artist_name);
            $('#interest').html(htmlStr);  
        });
}

var CourseUI = function(data, artist_name){
    
    var str = "";
    
    if(data){
        if(data.length > 0){
            if(data.length > 1){
                var txt = "courses";
            }else{
                var txt = "course";
            }
            str += '<h2>'+artist_name+' teaches “<strong>'+data.length+' '+txt+'.</strong>“</h2>';        
            str += '<ul>';
            for(var i=0; i<data.length;i++){
                var url = "";
                url = data[i].course_name;
                url = url.replace(/ /g, '_');
                url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                url += "_"+data[i].id;
                url = url.toLowerCase();
                str += '<li><a href="/courses/view?url='+url+'">'+data[i].course_name+'</a></li>';
            }
            str += '</ul>';
        }else{
            str += '<h2>'+artist_name+' do not teach any courses .</h2>';  
        }   
    }else{
        str += '<h2>'+artist_name+' do not teach any courses .</h2>';  
    }
                
    return str;// 
}

var InterestUI = function(data, artist_name){
    
    var str = "";
    if(data){
        if(data.length > 0){
            if(data.length > 1){
                var txt = "courses";
            }else{
                var txt = "course";
            }
            str += '<h2>'+artist_name+' is interested in “<strong>'+data.length+' '+txt+'.</strong>“</h2>';        
            str += '<ul>';
            for(var i=0; i<data.length;i++){
                var url = "";
                url = data[i].course_name;
                url = url.replace(/ /g, '_');
                url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                url += "_"+data[i].id;
                url = url.toLowerCase();
                str += '<li><a href="/courses/view?url='+url+'">'+data[i].course_name+'</a></li>';
            }
            str += '</ul>';
        }else{
            str += '<h2>'+artist_name+' is not interested in any courses .</h2>';  
        }   
    }else{
        str += '<h2>'+artist_name+' is not interested in any courses .</h2>';  
    }
    
                
    return str;// 
}

var showSchools = function(artist_id, artist_name){
    //var spinner = "<img src='/images/ajax-loader-big.gif' alt='Loading school data' />";
    //$('#school').html(spinner);
    $.getJSON("/artists/showschools?id="+artist_id, function(data){
            var htmlStr = SchoolUI(data, artist_name);
            $('#school').html(htmlStr);                    
            
        });
}
    
var SchoolUI = function(data, artist_name){
    
    var str = "";
    if(data){
        if(data.length > 0){
            if(data.length > 1){
                var txt = "schools";
            }else{
                var txt = "school";
            }
            str += '<h2>'+artist_name+' teaches in “<strong>'+data.length+' '+txt+'.</strong>“</h2>';        
            str += '<ul>';
            for(var i=0; i<data.length;i++){
                var url = "";
                url = data[i].school_name;
                url = url.replace(/ /g, '_');
                url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                url += "_"+data[i].id;
                url = url.toLowerCase();
                str += '<li><a href="/schools/view?url='+url+'">'+data[i].school_name+'</a></li>';
            }
            str += '</ul>';
        }else{
            str += '<h2>'+artist_name+' is not associated with any school .</h2>';  
        }
    }else{
        str += '<h2>'+artist_name+' is not associated with any school .</h2>';  
    }
    
                
    return str;// 
}



var showReviews = function(artist_id){
    $.getJSON("/artists/showreviews?id="+artist_id, function(data){
                if(data){
                    loadReview(data); 
                    //$("#reviewCnt").html((data.length));
                }

            });
    
}

var loadReview = function(datas){
    if(datas){
        
        var str = '<ul>';     
        datas.forEach(function(data){
            var date = new Date(data.createdAt);
            var postDate = date.getDate();
            var postMonth = (date.getMonth()+1);
            var postYear = date.getFullYear();
            str += '<li>';
            str += '<p>'+data.comments+'</p>';
            str += '<div class="compositor"><strong>'+data.first_name+' '+data.last_name+'</strong><span>'+postYear+'/'+postMonth+'/'+postDate+'</span></div>';
            //str += '<div class="like"><small>5</small><a href="#"></a></div>';
            str += '<div class="clr"></div>';
            str += '</li>';
        });
        str += '</ul>';
        //alert(str);
        $('#reviews').html(str); 
    }
}

var addReview = function(){
    var logStatus = $('#st').val();
    if(logStatus == 1){
        //var spinner = "<img src='/images/ajax-loader-big.gif' alt='Loading school data' />";
        //$('#school').html(spinner);
        var postData = $("#reviewFrm").serialize();
        $.post("/artists/public/addreview", postData, function(data, textStatus) {
            //data contains the JSON object
            //textStatus contains the status: success, error, etc
            if(data){
                loadReview(data) ;
                var cnt = (parseInt($("#reviewCnt").text())+1);
                $("#reviewCnt").text(cnt);
                $("#review").val("");
            }
          }, "json");
    }else{
        alert("Only logged in users can write a review");
    }
    
}

var performAction = function(actionVal){
    var relVal = $('#url').val();
    if(actionVal == 1){
        window.location.href = '/signup?url='+relVal;
    }
    if(actionVal == 2){
        window.location.href = '/login';
    }
}

var loadMyImages = function(){
    $.getJSON("/artists/loadimages", function(datas){
                if(datas){
                    var str = '<table width="100%" border="1" align="center" cellpadding="0" cellspacing="0">'; 
                    str += '<tr>';
                     str += '<th align="center">Image</th>';
                     str += '<th align="left" style="padding-left:8px;">Title</th>';
                    str += '</tr>'
                    
                    //alert(calMonth);
                    datas.forEach(function(data){
                        str += '<tr>';
                             str += '<td width="105"><img src="/images/artists/thumb/'+data.image+'" alt="'+data.title+'" style="max-width:105px;" /></td>';
                             str += '<td align="center"><a href="#" style="text-decoration:none;">'+data.title+'</a></td>';
                             
                        str += '</tr>';  

                    });
                    str += '</table>';
                    $("#myList").html(str);
                 }

            });
    
}

var loadMyVideos = function(){
    $.getJSON("/artists/loadvideos", function(datas){
                if(datas){
                    var str = '<table width="100%" border="1" align="center" cellpadding="0" cellspacing="0">'; 
                    str += '<tr>';
                     str += '<th align="center">Cover</th>';
                     str += '<th align="left" style="padding-left:8px;">Title</th>';
                    str += '</tr>'
                    
                    //alert(datas);
                    datas.forEach(function(data){
                        str += '<tr>';
                             str += '<td width="105"><img src="/videos/artists/additional_videos/cover/'+data.videoCover+'" alt="'+data.title+'" style="width:105px;" /></td>';
                             str += '<td align="center"><a href="#" style="text-decoration:none;">'+data.title+'</a></td>';
                             
                        str += '</tr>';  

                    });
                    str += '</table>';
                    $("#myList").html(str);
                 }

            });
    
}

var loadMyCredentials = function(cat){
    $.getJSON("/artists/loadcredentials?cat="+cat, function(datas){
                if(datas){
                    var str = '<table width="100%" border="1" align="center" cellpadding="0" cellspacing="0">'; 
                    str += '<tr>';
                     str += '<th align="left" width="40%" style="padding-left:8px;">Title</th>';
                     str += '<th align="left" width="20%" style="padding-left:8px;">Role</th>';
                     str += '<th align="left" width="40%" style="padding-left:8px;">Production</th>';
                    str += '</tr>'
                    
                    //alert(datas);
                    datas.forEach(function(data){
                        str += '<tr>';
                             str += '<td width="40%" style="padding-left:8px;">'+data.title+'</td>';
                             str += '<td width="20%" style="padding-left:8px;">'+data.role+'</td>';
                             str += '<td width="40%" style="padding-left:8px;">'+data.production+'</td>';
                        str += '</tr>';  

                    });
                    str += '</table>';
                    $("#myCat"+cat).html(str);
                 }

            });
    
}

var loadAllCredentials = function(url, cat){
    $.getJSON("/artists/credentials/all?url="+url+"&cat="+cat, function(datas){
                if(datas){
                    var str = '<table width="100%" border="1" align="center" cellpadding="0" cellspacing="0">'; 
                    
                    
                    //alert(datas);
                    datas.forEach(function(data){
                        str += '<tr>';
                             str += '<td width="40%" style="padding-left:8px;">'+data.title+'</td>';
                             str += '<td width="20%" style="padding-left:8px;">'+data.role+'</td>';
                             str += '<td width="40%" style="padding-left:8px;">'+data.production+'</td>';
                        str += '</tr>';  

                    });
                    str += '</table>';
                    $("#myCat"+cat).html(str);
                 }

            });
    
}

loadCredCat = function(){
    $.getJSON('/artists/credentials/droplist', function(categories){
		addToSelect('categoryId', categories);
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

var loadMyAudios = function(){
    $.getJSON("/artists/loadaudios", function(datas){
                if(datas){
                    var str = '<table width="100%" border="1" align="center" cellpadding="0" cellspacing="0">'; 
                    str += '<tr>';
                     str += '<th align="center">Cover</th>';
                     str += '<th align="left" style="padding-left:8px;">Title</th>';
                    str += '</tr>'
                    
                    //alert(datas);
                    datas.forEach(function(data){
                        str += '<tr>';
                             str += '<td width="105"><img src="/audios/artists/additional_audios/cover/'+data.audioCover+'" alt="'+data.title+'" style="width:105px;" /></td>';
                             str += '<td align="center"><a href="#" style="text-decoration:none;">'+data.title+'</a></td>';
                             
                        str += '</tr>';  

                    });
                    str += '</table>';
                    $("#myList").html(str);
                 }

            });
    
}

var loadAllImages = function(url){
    $.getJSON("/artists/images/all?url="+url, function(datas){
                if(datas){
                    var str = '<ul id="imageSlider" class="bxslider">'
                    var content = "";
                    //alert(calMonth);
                    datas.forEach(function(data){
                        content += '<li><img src="/images/artists/thumb/'+data.image+'" alt="'+data.title+'" /></li>';
                         

                    });
                    str = str+content;
                    str += '</ul>';
                    if(content){
                        $("#images").html(str);
                        $('#imageSlider').bxSlider({
                            slideWidth: 350,
                            minSlides: 2,
                            maxSlides: 3,
                            slideMargin: 10
                          });    
                    }else{
                        var str = "<h4>No Images uploaded yet.</h4>";
                        $("#images").html(str);
                    }
                    
                 }else{
                     var str = "<h4>No Images uploaded yet.</h4>";
                     $("#images").html(str);
                 }

            });
    
}



var loadAllAudios = function(url){
    $.getJSON("/artists/audios/all?url="+url, function(datas){
                if(datas){
                    var str = '<table width="100%" border="1" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:15px;">'; 
                    var content = "";
                    //alert(datas);
                    datas.forEach(function(data){
                        content += '<tr>';
                             content += '<td style="width:65px;"><img src="/audios/artists/additional_audios/cover/'+data.audioCover+'" alt="'+data.title+'" style="width:60px;height:60px;" /></td>';
                             content += '<td align="left" style="padding-left:25px;">';
                             content += data.title+'<br />';
                             content += '<object type="application/x-shockwave-flash" data="/mp3Player/dewplayer.swf?mp3=/audios/artists/additional_audios/'+data.audio+'" width="200" height="20" id="dewplayer"><param name="wmode" value="transparent" /><param name="movie" value="/mp3Player/dewplayer.swf?mp3=/audios/artists/additional_audios/'+data.audio+'" /></object>';
                             
                        content += '</tr>';  

                    });
                    str = str + content;
                    str += '</table>';
                    if(content){
                        $("#audios").html(str);
                    }else{
                        $("#audios").html("<h4>No Audio uploaded yet.</h4>");
                    }
                    
                 }else{
                     $("#audios").html("<h4>No Audio uploaded yet.</h4>");
                 }

            });
    
}

