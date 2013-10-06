var http = require('http');
var soap = require('soap');
var cfg = {
    wsdl_file: 'service/wsdl/myservice.wsdl',
    service_url_path: '/wsdl',
    service_port: 8000
};

var myService = {
    'ESyncNotifySPServiceService': {
        'ESyncNotifySP': {
            'eMemOrderRelationUpdateNotify': function(args, callback) {
                args = args["eMemOrderRelationUpdateNotifyRequest"];
                var oraReqNV = {
                    'billnum': args.EUserId,
                    'UpdateType': args.UpdateType,
                    'ProductId': args.ProductId,
                    'stime': args.EffectiveDate,
                    'etime': args.ExpireDate,
                    'mobile': args.UserId.substr( - 11)
                };
                callback({
                    'eMemOrderRelationUpdateNotifyResponse': {
                        'RecordSequenceID': args.RecordSequenceID,
                        'ResultCode': 'hi w'
                    }
                })
            }
        }
    }
}

var xml = require('fs').readFileSync(cfg.wsdl_file, 'utf8'),
    server = http.createServer(function(request,response) {
        response.end("404: Not Found: "+request.url);

    });

server.listen(cfg.service_port);
soap.listen(server, cfg.service_url_path, myService, xml);