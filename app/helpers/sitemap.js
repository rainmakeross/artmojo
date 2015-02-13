/*
 * Generate dynamic site map
 */

var course = require('../models/course');
var artist = require('../models/artist');
var school = require('../models/school');
var event = require('../models/event');
var job = require('../models/job');
var fs = require('fs');
var zlib = require('zlib');
var config = require('../../config/config');
var data_limit = 50000;

exports.generateXMLSiteMap = function(req, res){
    var courseArr = new Array();
    var artistArr = new Array();
    var schoolArr = new Array();
    var eventArr = new Array();
    var jobArr = new Array();
    var finalArr = new Array();
    var obj = {};
    //get course data
    course.showUrl(function(data){
        //res.send(data);
        
        obj = data;
        if(data.length > 0){
            Object.keys(data).forEach(function(key) {
                var courseUrl = "";
                courseUrl = data[key].course_name;
                courseUrl = courseUrl.replace(/ /g, '_');
                courseUrl = courseUrl.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                courseUrl += "_"+data[key].id;
                courseUrl = courseUrl.toLowerCase();
                courseArr[key] = "https://artmojo.co/courses/view?url="+courseUrl;  
            });
        }
        artist.showUrl(function(data){
            
            if(data.length > 0){
                Object.keys(data).forEach(function(key) {
                    var artistUrl = "";
                    artistUrl = data[key].first_name + " " + data[key].last_name;
                    artistUrl = artistUrl.replace(/ /g, '_');
                    artistUrl = artistUrl.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                    artistUrl += "_"+data[key].id;
                    artistUrl = artistUrl.toLowerCase();
                    artistArr[key] = "https://artmojo.co/artists/view?url="+artistUrl; 
                });

            }
            school.showUrl(function(data){
                
                if(data.length > 0){
                    Object.keys(data).forEach(function(key) {
                        var schoolUrl = "";
                        schoolUrl = data[key].school_name;
                        schoolUrl = schoolUrl.replace(/ /g, '_');
                        schoolUrl = schoolUrl.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                        schoolUrl += "_"+data[key].id;
                        schoolUrl = schoolUrl.toLowerCase();
                        schoolArr[key] = "https://artmojo.co/schools/view?url="+schoolUrl;  
                    });
                }
                event.showUrl(function(data){
                    
                    if(data.length > 0){
                        Object.keys(data).forEach(function(key) {
                            var eventUrl = "";
                            eventUrl = data[key].title;
                            eventUrl = eventUrl.replace(/ /g, '_');
                            eventUrl = eventUrl.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                            eventUrl += "_"+data[key].id;
                            eventUrl = eventUrl.toLowerCase();
                            eventArr[key] = "https://artmojo.co/events/view?url="+eventUrl;  
                        });
                    }
                    job.showUrl(function(data){
                        
                        if(data.length > 0){
                            Object.keys(data).forEach(function(key) {
                                var jobUrl = "";
                                jobUrl = data[key].jobTitle;
                                jobUrl = jobUrl.replace(/ /g, '_');
                                jobUrl = jobUrl.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'');
                                jobUrl += "_"+data[key].id;
                                jobUrl = jobUrl.toLowerCase();
                                jobArr[key] = "https://artmojo.co/jobs/view?url="+jobUrl;  
                            });
                        }
                        finalArr = courseArr.concat(artistArr, schoolArr, eventArr, jobArr);
                        //res.send(finalArr);
                        //next step
                        var fileArr = new Array();
                        var date = new Date();
                        var Yr = date.getFullYear();
                        var Mon = (date.getMonth() + 1);
                        if(Mon <= 9){
                           Mon = '0'+Mon; 
                        }                    
                        var D = date.getDate();
                        if(D <= 9){
                           D = '0'+D; 
                        }
                        if(finalArr.length <= data_limit){
                            var fileName = "GaWFsasg!!237.xml";
                            fileArr[0] = config.routeUrl+"AsdE2341!!/"+fileName+".gz";
                            var filePath = "./public/AsdE2341!!/"+fileName+".gz";
                            var xml_data  = '<?xml version="1.0" encoding="UTF-8"?>';
                            xml_data += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
                            for(var i=0; i<finalArr.length; i++){
                                xml_data += '<url><loc>'+finalArr[i]+'</loc><lastmod>'+Yr+'-'+Mon+'-'+D+'</lastmod></url>';
                            }
                            xml_data += '</urlset>'; 
                            //create file
                            zlib.gzip(new Buffer(xml_data, 'utf8'), function(error, data) {
                                fs.writeFile(filePath, data);
                            });
                        }else{
                            var pieces = parseInt(finalArr.length / data_limit);
                            var executeArr = finalArr;
                            if(pieces > 0){
                                for(var x=0; x<=pieces; x++){
                                    var processArr = new Array();
                                    processArr = executeArr.splice(0,data_limit);
                                    if(processArr && (processArr.length>0)){
                                        var fileName = "GaWFsasg!!237"+x+".xml";
                                        fileArr[x] = config.routeUrl+"public/AsdE2341!!/"+fileName+".gz";
                                        var filePath = "./AsdE2341!!/"+fileName+".gz";
                                        var xml_data  = '<?xml version="1.0" encoding="UTF-8"?>';
                                        xml_data += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
                                        for(var i=0; i<processArr.length; i++){
                                            xml_data += '<url><loc>'+processArr[i]+'</loc><lastmod>'+Yr+'-'+Mon+'-'+D+'</lastmod></url>';
                                        }
                                        xml_data += '</urlset>'; 
                                        //create file
                                        zlib.gzip(new Buffer(xml_data, 'utf8'), function(error, data) {
                                            fs.writeFile(filePath, data);
                                        });
                                    }
                                }
                            }
                        }
                        if(fileArr.length > 0){
                            var masterfile = "./public/AsdE2341!!/Hwe!{$$&d.xml";
                            var master_xml  = '<?xml version="1.0" encoding="UTF-8"?>';
                            master_xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
                            for(var i=0; i<fileArr.length; i++){
                                master_xml  += '<sitemap><loc>'+fileArr[i]+'</loc><lastmod>'+Yr+'-'+Mon+'-'+D+'</lastmod></sitemap>';
                            }
                            master_xml  += '</sitemapindex>';
                            fs.writeFile(masterfile, master_xml);
                        }  
                        res.send(finalArr.length);
                    });
                });
            });

            
            
        });
        
    });
    
    
    
    //res.send(finalArr);
    
}