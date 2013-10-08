var soap = require('soap');
var http = require('http');
var url = require('url');
var url = require('request');
var path = require('path');
var args = {
    'RecordSequenceID': 12
};
var client_servise;
soap.createClient('service/wsdl/myservice.wsdl', function(err, client) {
        client_servise = client;
        //console.log(client_servise)
    },
    'http://localhost:8000/wsdl?wsdl');


http.createServer(function(request, response) {
    client_servise.ESyncNotifySPServiceService.ESyncNotifySP.eMemOrderRelationUpdateNotify({RecordSequenceID: 'value'}, function(err, result, body) {
        //console.log(result);
        console.log(err);
        response.writeHead(200, {"Content-Type": "text/plain"});
        //response.write((result['eMemOrderRelationUpdateNotifyResponse']));
        response.end();
    })
}).listen(3000);
