
/*
 * GET users listing.
 */
var PayPalEC   = require( 'paypal-ec' )
  , booking    = require('../models/booking')
  , transaction    = require('../models/transaction')
  , utils      = require('../helpers/utils')
  , config     = require('../../config/config')
  , fs         = require('fs')
  , errorLog   = config.webroot + '/logs/';
  
var cred = {
  username  : 'mithun.das-facilitator_api1.raincheck.it',
  password  : '1366092710',
  signature : 'A4FXlgHFuMdMtY37GJoLkV0wSm9UARg9G1Z0ZwphK-d2SOYusulFtVSB'
};

var opts = {
  sandbox : true,
  version : '92.0'
};

var paypalParam = {
    returnUrl                        : config.routeUrl+'payments/confirm?plan=normal',
    cancelUrl                        : config.routeUrl+'payments/cancel',
    SOLUTIONTYPE                     : 'sole',
    LANDINGPAGE                      : 'Billing',
    PAYMENTREQUEST_0_AMT             : '0.00',
    PAYMENTREQUEST_0_DESC            : 'One-time Purchase',
    PAYMENTREQUEST_0_CURRENCYCODE    : 'USD',
    PAYMENTREQUEST_0_PAYMENTACTION   : 'Sale',
    L_PAYMENTREQUEST_0_ITEMCATEGORY0 : 'Digital',
    L_PAYMENTREQUEST_0_NAME0         : 'One-time',
    L_PAYMENTREQUEST_0_AMT0          : '0.00',
    L_PAYMENTREQUEST_0_QTY0          : '1'
};

var ec = new PayPalEC( cred, opts );

exports.checkout = function(req, res){
    if(req.query){
        if(req.query.id.length){
            var bookingId = req.query.id; 
            var params = paypalParam;
            booking.fetchDatabyId(bookingId, function(data){
                var date = new Date(data.requestDate);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                var fullDate = tDate+'/'+tMonth+'/'+tYear;
                params['PAYMENTREQUEST_0_AMT'] = data.amount;
                params['L_PAYMENTREQUEST_0_AMT0'] = data.amount;
                params['L_PAYMENTREQUEST_0_NAME0'] = 'Payment for class booking';
                params['PAYMENTREQUEST_0_DESC'] = data.userName+' is paying USD '+data.amount+' to '+data.artistName+' for booking a class at '+fullDate;
                params['returnUrl'] = config.routeUrl+'payments/confirm?id='+data.id;
                params['cancelUrl'] = config.routeUrl+'payments/cancel?id='+data.id;
                console.log(params);
                ec.set( params, function ( err, data ){
                    if( err ){
                       console.log( err ); 
                    } else {
                       res.redirect( data.PAYMENTURL );
                    }

                    //res.redirect( data.PAYMENTURL );
                });
            });
        }
    }
}

exports.confirm = function(req, res){
    console.log(req.query);
    if(req.query){
        if(req.query.id.length){
            var bookingId = req.query.id; 
            var params = paypalParam;
            booking.fetchDatabyId(bookingId, function(bookData){
                var date = new Date(bookData.requestDate);
                var tDate = date.getDate();
                var tMonth = (date.getMonth()+1);
                var tYear = date.getFullYear();
                var fullDate = tDate+'/'+tMonth+'/'+tYear;
                params['PAYMENTREQUEST_0_AMT'] = bookData.amount;
                params['L_PAYMENTREQUEST_0_AMT0'] = bookData.amount;
                params['L_PAYMENTREQUEST_0_NAME0'] = 'Payment for class booking';
                params['PAYMENTREQUEST_0_DESC'] = bookData.userName+' is paying USD '+bookData.amount+' to '+bookData.artistName+' for booking a class at '+fullDate;
                params['returnUrl'] = config.routeUrl+'payments/confirm?id='+bookData.id;
                params['cancelUrl'] = config.routeUrl+'payments/cancel?id='+bookData.id;
                params.TOKEN   = req.query.token;
                params.PAYERID = req.query.PayerID;
                ec.do_payment( params, function ( err, data ){
                    if( err ){
                       console.log( err ); 
                    } else {
                       //res.send(data);
                       if(data['PAYMENTINFO_0_ACK'] == "Success"){
                           var trParam = {};
                           booking.confirm(bookingId, function(confirmStat){
                               trParam['bookingId'] = bookingId;
                               trParam['paidBy'] = req.user.id;
                               trParam['paidTo'] = bookData.artistId;
                               trParam['paymentReason'] = params['PAYMENTREQUEST_0_DESC'];
                               trParam['transactionId'] = data['PAYMENTINFO_0_TRANSACTIONID'];
                               trParam['amount'] = data['PAYMENTINFO_0_AMT'];
                               transaction.add(trParam, function(trStat){
                                   res.redirect('/mybookings');
                               });
                           });
                       }
                    }
                  });
            });
        }
    }
}

exports.cancel = function(req, res){
    if(req.query){
        if(req.query.id.length){
            res.redirect('/bookings/paynow?id='+req.query.id);
        }
    }
}