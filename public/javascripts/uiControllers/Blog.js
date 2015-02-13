

var loadBlog = function(user){
    $.getJSON("/blogs/loadBlogs/", function(datas){
			if(datas){
                            var str = ''
                            
                            //alert(calMonth);
                            datas.forEach(function(data){
                                var url = "";
                                url = data.title;
                                url = url.replace(/ /g, '_');
                                url = url.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                                url += "_"+data.id;
                                url = url.toLowerCase();
                                str += '<div class="blogTitle"><a href="/blogs/view?url='+url+'" style="text-decoration:none;">'+data.title+'</a></div>';
                                var img = "";
                                for(var i=1; i<=5; i++){
                                    if(i <= data.total_rate){
                                        img += "<img src='/images/up-star.png' alt='"+i+" star' />";
                                    }else{
                                        img += "<img src='/images/down-star.png' alt='"+i+" star' />";
                                    }
                                }
                                str += '<div class="blogRating" onclick="alert(\'View full blog to rate\');">'+img+'</div>';
                                var desc = data.content;
                                if(desc.length > 200){
                                    desc = desc.substr(0, 200)+'....';
                                }
                                str += '<div class="blogContent">'+desc+'</div>';
                                str += '<div class="blogAction">';
                                var date = new Date(data.createdAt);
                                var postDate = date.getDate();
                                var postMonth = (date.getMonth()+1);
                                var postYear = date.getFullYear();
                                str += '<span class="clickButtons_small">'+data.first_name+' '+data.last_name+', '+postYear+'/'+postMonth+'/'+postDate+'</span>';
                                if(data.total_comments > 1){
                                    var txt = "comments";
                                }else{
                                    var txt = "comment";
                                }
                                str += '<span class="clickButtons_v3_small">'+data.total_comments+' '+txt+' posted</span>';
                                if((user > 0) && (user == data.userId)){                                    
                                    str += '&nbsp;&nbsp;<a href="/blogs/public/edit?url='+url+'" class="clickButtons_v2_small">Update blog</a>';
                                }
                                
                                str += '</div>';
                                
                                str += '<div class="clr"></div>';
                                str += '<div class="blogSeparator"></div>';

                            });
                            $("#blogList").html(str);
                         }
                        
                        //listEvents(datas);
                        
    });
}

var validateBlogFrm = function(){
    var title = $('#title').val();
    var content = $('#content').val();
    var alertTxt = "";
    var bool = true;
    if(title == ""){
        bool = false;
        alertTxt = "Title cannot be blank.";
    }
    if(content == ""){
        bool = false;
        alertTxt = "Content cannot be blank.";
    }
    if(!bool){
        alert(alertTxt);
    }
    return bool;    
}

var showReviews = function(artist_id){
    $.getJSON("/blogs/showreviews?id="+artist_id, function(data){
                if(data){
                    loadReview(data); 
                    //$("#reviewCnt").html((data.length+1));
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
        $.post("/blogs/public/addreview", postData, function(data, textStatus) {
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