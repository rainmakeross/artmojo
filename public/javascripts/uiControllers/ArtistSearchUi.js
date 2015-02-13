var renderDefaultResult = function(){
    var Html    = "Your search did not match any artists/schools.<br />";
    Html    += "Suggestions:";
    Html    += "<br />1. Try some different category";
    Html    += "<br />2. Try a different location";
    Html    += "<br />3. Try removing/different filters<br /><br /><br />";
    
    return Html;
}
var loadArtistResults = function(){
    var course = $('#search_data').val();
    var location = $('#userCity').val();
    if(!course || course == 'What?'){
        course = '%';
    }
    if(!location || location == 'Where?'){
        location = '%';
    }
    var queryStr = "courseName="+course+"&location="+location;
    var spinner = "<img src='/images/ajax-loader-big.gif' alt='Loading artist data' />";
    $('#course').html(spinner);
    $('#tabVal').val('artist');
    initializeFilters('artist');
    $('#courseTab').attr('class', '');
    $('#artistTab').attr('class', 'activeTab');
    $('#schoolTab').attr('class', '');
    $('#eventTab').attr('class', '');
    $('#jobTab').attr('class', '');
    $.getJSON("/artists/results?"+queryStr, function(data){
        //ArtistUIGenerator(dataArr);
        var htmlStr = ArtistUIGenerator(data);  
        $('#course').html(htmlStr);
        
        if(data.length > 30){
           paginateData('dataContainer', 'paginator', 30); 
        }
         
    });
}

var ArtistUIGenerator = function(data){
    
    var str = "";
    
    if(data.length > 0){
        
        str += '<ul id="dataContainer">';
        data.forEach(function(artistData){
            var url = "";
            url = artistData.full_name;
            url = url.replace(/ /g, '_');
            url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
            url += "_"+artistData.id;
            url = url.toLowerCase();
            str += '<li>';
                str += '<div class="galleryContent">';
                    str += '<div class="galleryImg">';
                        if(artistData.artist_image){
                            if(artistData.localImg == 1){
                                var img = '/images/artists/thumb/'+artistData.artist_image;
                            }else{
                                var img = artistData.artist_image;
                            }
                        }else{
                            var img = '/images/dummy_user.gif';
                        }
                        str += '<img src="'+img+'" alt="'+artistData.full_name+'" title="'+artistData.full_name+'" style="width:198px;height:198px;cursor:pointer;" onclick="window.location.href=\'/artists/view/?url='+url+'\'" />';
                        
                         //str += '<a href="/artists/view/?url='+url+'" class="artistButton"><strong>'+courseCntPrint+'</strong> '+artistText+'</a>';
                         //str += '<a href="/artists/view/?url='+url+'" class="schoolButton"><strong>'+schoolCntPrint+'</strong> '+schoolText+'</a>';
                    str += '</div>';
                    str += '<div class="galleryText">';
                        if(artistData.full_name){
                            var full_name = artistData.full_name;
                            if(full_name.length > 35){
                                full_name = full_name.substr(0, 32)+'..';
                            }
                            str += '<h2><a href="/artists/view?url='+url+'">'+full_name+'</a></h2>';
                         }else{
                            str += '<h2>Default</h2>';
                         }
                         
                         if(artistData.description){
                            var desc = artistData.description; 
                         }else{
                            var desc = 'Location: '+artistData.location;
                         }
                         if(desc.length > 55){
                            desc = desc.substr(0, 52)+'... <a href="/artists/view?url='+url+'">more</a>';
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




    
