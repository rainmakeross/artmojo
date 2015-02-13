

function loadAllTransactions(){
    $.getJSON("/transactions/listall/", function(datas){
        if(datas){
            var str = '<table cellpadding="0" cellspacing="0" border="0" class="display" id="datatable" width="100%">'; 
            str += '<thead>';
            str += '<tr>';
             str += '<th align="center">Tr Date</th>';
             str += '<th align="center">Reason</th>';
             str += '<th align="center">Amount</th>';
             str += '<th align="center">ID</th>';
            str += '</tr>'
            str += '</thead>';
            str += '<tbody>';
            //alert(calMonth);
            datas.forEach(function(data){
                var date = new Date(data.createdAt);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                str += '<tr>';
                    str += '<td align="center">'+tDate+'/'+tMonth+'/'+tYear+'</td>';
                    str += '<td align="center">'+data.paymentReason+'</td>';
                    str += '<td align="center">'+data.amount+' USD</td>';
                    str += '<td align="center">'+data.transactionId+'</td>';
                    
                str += '</tr>';

            });
            str += '</tbody>';
            str += '</table>';
            $("#transactionList").html(str);
            $('#datatable').dataTable( {
                "bProcessing": true,
                "bDeferRender": true,
                "sPaginationType": "full_numbers"
            } );
         }
                        
                        //listEvents(datas);
                        
    });
    
}