var monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var renderDefaultResult = function(){
    var Html    = "Your search did not match any events.<br />";
    Html    += "Suggestions:";
    Html    += "<br />1. Try some different category";
    Html    += "<br />2. Try a different location";
    Html    += "<br />3. Try removing/different filters<br /><br /><br />";
    
    return Html;
}

var loadEventResults = function(){
    var course = $('#search_data').val();
    var location = $('#userCity').val();
    if(!course || course == 'What?'){
        course = '%';
    }
    if(!location || location == 'Where?'){
        location = '%';
    }
    var queryStr = "courseName="+course+"&location="+location;
    var spinner = "<img src='/images/ajax-loader-big.gif' alt='Loading event data' />";
    $('#course').html(spinner);
    $('#tabVal').val('event');
    initializeFilters('event');
    $('#courseTab').attr('class', '');
    $('#artistTab').attr('class', '');
    $('#schoolTab').attr('class', '');
    $('#jobTab').attr('class', '');
    $('#eventTab').attr('class', 'activeTab');
    $.getJSON("/events/results?"+queryStr, function(data){
        //EventUIGenerator(dataArr);
        var htmlStr = EventUIGenerator(data);            
        $('#course').html(htmlStr); 
        if(data.length > 30){
           paginateData('dataContainer', 'paginator', 30); 
        }
    });
}

var EventUIGenerator = function(data){
    
    var str = "";
    
    if(data.length){
        
        str += '<ul id="dataContainer">';
        data.forEach(function(eventData){
            var url = "";
            url = eventData.title;
            url = url.replace(/ /g, '_');
            url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
            url += "_"+eventData.id;
            url = url.toLowerCase();
            str += '<li>';
                str += '<div class="galleryContent">';
                    str += '<div class="galleryImg">';
                        if(eventData.event_image){
                            if(eventData.localImg == 1){
                                var img = '/images/events/thumb/'+eventData.event_image;
                            }else{
                                var img = eventData.event_image;
                            }
                        }else{
                            var img = '/images/dummy_user.gif';
                        }
                        str += '<img src="'+img+'" alt="'+eventData.title+'" title="'+eventData.title+'" style="width:198px;height:198px;cursor:pointer;" onclick="window.location.href=\'/events/view/?url='+url+'\'" />';
                        
                    str += '</div>';
                    str += '<div class="galleryText">';
                        if(eventData.title){
                            var title = eventData.title;
                            if(title.length > 42){
                                title = title.substr(0, 39)+'...';
                            }
                            str += '<h2><a href="/events/view?url='+url+'">'+title+'</a></h2>';
                         }else{
                            str += '<h2>Default</h2>';
                         }
                         var date = new Date(eventData.from_date);
                            var tDate = date.getDate();
                            var tMonth = date.getMonth();
                            var tYear = date.getFullYear();
                         str += '<p>'
                         str += 'Date: <strong>'+tDate+' '+monthArr[tMonth]+', '+tYear+'</strong>'; 
                         str += '<br />Location: '+eventData.location; 
                         
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




    
