var years = ['2013','2014','2015'],
    dates = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    
var setupUI = function(artistId, requestDate){
	
        
	addToSelect('booking_year', years);
	addToSelect('booking_month', months);
	addToSelect('booking_date', dates);
        if(requestDate){
            var fd = new Date(requestDate);
            var fdate = fd.getDate();
            if(fdate < 10){
                fdate = "0"+fdate;
            }
            var fmonth = (fd.getMonth()+1);
            if(fmonth < 10){
                fmonth = "0"+fmonth;
            }
            var fyear = fd.getFullYear(); 
            $('#booking_year').val(fyear);
            $('#booking_month').val(fmonth);
            $('#booking_date').val(fdate);
        }
        if(artistId){
            $.getJSON('/courses/artistCourses?artistId='+artistId, function(courses){
		addToSelect('course', courses);
                //alert(courseId);
                
            });
            
        }
}



function loadAllBookings(){
    $.getJSON("/bookings/listall/", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Post Date</th>';
             str += '<th align="center">Artist</th>';
             str += '<th align="center">Requester</th>';
             str += '<th align="center">Request Date</th>';
             str += '<th align="center">Status</th>';
             str += '<th align="center">Payment</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                var date = new Date(data.createdAt);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                
                var date2 = new Date(data.requestDate);
                var tDate2 = date2.getDate();
                var tMonth2 = (date2.getMonth()+1);
                var tYear2 = date2.getFullYear();
                str += '<tr>';
                    str += '<td align="center">'+tDate+'/'+tMonth+'/'+tYear+'</td>';
                    str += '<td align="center">'+data.artistName+'</td>';
                    str += '<td align="center">'+data.userName+'</td>';
                    str += '<td align="center">'+tDate2+'/'+tMonth2+'/'+tYear2+'</td>';
                    var statusVal ="Waiting";
                    if(data.status == 1){
                       statusVal ="Approved"; 
                    }
                    str += '<td align="center">'+statusVal+'</td>';
                    var confirmedVal ="Pending";
                    if(data.confirmed == 1){
                       confirmedVal ="Paid"; 
                    }
                    str += '<td align="center">'+confirmedVal+'</td>';
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#bookingList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers"
            } );
         }
                        
                        //listEvents(datas);
                        
    });
    
}

function loadMyBookings(){
    $.getJSON("/bookings/loadMyBookings/", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Post Date</th>';
             str += '<th align="center">Artist</th>';
             str += '<th align="center">Request Date</th>';
             str += '<th align="center">Status</th>';
             str += '<th align="center">Payment</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                var date = new Date(data.createdAt);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                
                var date2 = new Date(data.requestDate);
                var tDate2 = date2.getDate();
                var tMonth2 = (date2.getMonth()+1);
                var tYear2 = date2.getFullYear();
                str += '<tr>';
                    str += '<td align="center">'+tDate+'/'+tMonth+'/'+tYear+'</td>';
                    str += '<td align="center">'+data.artistName+'</td>';
                    str += '<td align="center">'+tDate2+'/'+tMonth2+'/'+tYear2+'</td>';
                    var statusVal ="Waiting";
                    if(data.status == 1){
                       statusVal ="Approved"; 
                    }
                    str += '<td align="center">'+statusVal+'</td>';
                    var confirmedVal ="<a href='/bookings/paynow?id="+data.id+"'>Pay Now</a>";
                    if(data.status == 0){
                       confirmedVal ="N/A"; 
                    }
                    if(data.confirmed == 1){
                       confirmedVal ="Paid"; 
                    }
                    str += '<td align="center">'+confirmedVal+'</td>';
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#bookingList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers"
            } );
         }
                        
                        //listEvents(datas);
                        
    });
    
}

function loadRequests(){
    $.getJSON("/bookings/loadRequests/", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Post Date</th>';
             str += '<th align="center">Requester</th>';
             str += '<th align="center">Request Date</th>';
             str += '<th align="center">Status</th>';
             str += '<th align="center">Payment</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                var date = new Date(data.createdAt);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                
                var date2 = new Date(data.requestDate);
                var tDate2 = date2.getDate();
                var tMonth2 = (date2.getMonth()+1);
                var tYear2 = date2.getFullYear();
                str += '<tr>';
                    str += '<td align="center">'+tDate+'/'+tMonth+'/'+tYear+'</td>';
                    str += '<td align="center">'+data.userName+'</td>';
                    str += '<td align="center">'+tDate2+'/'+tMonth2+'/'+tYear2+'</td>';
                    var statusVal ="<a href='/bookings/accept?id="+data.id+"'>Accept</a>";
                    if(data.status == 1){
                       statusVal ="Approved"; 
                    }
                    str += '<td align="center">'+statusVal+'</td>';
                    var confirmedVal ="Pending";
                    if(data.confirmed == 1){
                       confirmedVal ="Paid"; 
                    }
                    str += '<td align="center">'+confirmedVal+'</td>';
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#bookingList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers"
            } );
         }
                        
                        //listEvents(datas);
                        
    });
    
}

function loadConfirmeds(){
    $.getJSON("/bookings/loadConfirmeds/", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Post Date</th>';
             str += '<th align="center">Requester</th>';
             str += '<th align="center">Request Date</th>';
             str += '<th align="center">Status</th>';
             str += '<th align="center">Payment</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                var date = new Date(data.createdAt);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                
                var date2 = new Date(data.requestDate);
                var tDate2 = date2.getDate();
                var tMonth2 = (date2.getMonth()+1);
                var tYear2 = date2.getFullYear();
                str += '<tr>';
                    str += '<td align="center">'+tDate+'/'+tMonth+'/'+tYear+'</td>';
                    str += '<td align="center">'+data.userName+'</td>';
                    str += '<td align="center">'+tDate2+'/'+tMonth2+'/'+tYear2+'</td>';
                    var statusVal ="Waiting";
                    if(data.status == 1){
                       statusVal ="Approved"; 
                    }
                    str += '<td align="center">'+statusVal+'</td>';
                    var confirmedVal ="Pending";
                    if(data.confirmed == 1){
                       confirmedVal ="Paid"; 
                    }
                    str += '<td align="center">'+confirmedVal+'</td>';
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#bookingList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers"
            } );
         }
                        
                        //listEvents(datas);
                        
    });
    
}

var validateBookingFrm = function(){
    var amount = $('#amount').val();
    var alertTxt = "";
    var bool = true;
    if(amount == ""){
        bool = false;
        alertTxt += "Amount cannot be blank.\n";
    }
    if(!bool){
        alert(alertTxt);
    }
    return bool;    
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

