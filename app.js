const express = require('express');
const bp = require('body-parser');
const mock = require('./mongoose').mock;
const dotenv = require('dotenv');
var path = require("path");

dotenv.config();
var PORT = process.env.PORT || 80; 
var EP_URL = process.env.ENDPOINT_URL || 'http://localhost';

var app = express();
app.use(bp.json());

//make way for some custom css, js and images
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/fonts', express.static(__dirname + '/public/fonts'));

app.use(async (req, res, next) => {
    if(req.path !== '/') {
        res.setHeader('content-type', 'application/json');
    }
    // res.setHeader('content-type', 'text/html');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if (req.path == "/getmock") {
        var mockId = req.query.id;
        var mirror = req.query.mirror;
        var statusCode, responseBody;
        var result = await mock.findById(mockId);        
            if(!result){
                statusCode = 400;
                responseBody = {error: `No mock with id ${mockId} exists`};
            }
            else {
                if(req.method == result.mockResponse.verb) {
                    let http_header_list = result.mockResponse.http_header_list;
                    if(http_header_list !== undefined) {
                    http_header_list.forEach(function(item) {
                            res.setHeader(item.key, item.value);
                        });
                    }
                    statusCode = result.mockResponse.statusCode;
                    // query param mirror=1 will send back the request body as response
                    if(mirror === undefined) {
                        responseBody = result.mockResponse.response_body;
                    } else {
                        responseBody = req.body;
                    }
            }
                else {
                    statusCode = 400;
                    responseBody = {error: `mock ${mockId} is defined with HTTP ${result.mockResponse.verb}`};
                }
            }

            // query param delay=1 will wait for the specified milliseconds (maximum 3000) 
            // before sending a response 
            var delay = req.query.delay;
            if(delay) {
                delay = (delay > 3000)? 3000:delay;
                await new Promise(done => setTimeout(done, delay));
            }
            res.status(statusCode);
            res.send(responseBody);
        }
    next();
    });

app.get('/',function(req,res) {
        res.setHeader('content-type', 'text/html');
        res.sendFile(path.join(__dirname+'/public/index.html'));
        console.log('home page requested');
});

app.get('/getdetails', (req, res) => {
    console.log('inside next()', req.url);
    var _id = req.query.id;
    mock.findOne({
        _id: _id
    }).then((mockedResponse) => {
        // this redundancy is present to give the response back in JSON and not stringyfied JSON
        var json = JSON.parse(mockedResponse.mockResponse.response_body);
        mockedResponse.mockResponse.response_body = null;
        mockedResponse.mockResponse.response_body = json;
        res.status(200).send(mockedResponse);
    }).catch((err) => {
        res.status(404).send({error:`mock request ${_id} does not exist`});
    });
});

app.post('/create', (req, res) => {
    console.log('logging request', req.body);
    // check if fields are missing from form
    if( req.body.verb           === undefined || 
        req.body.description    === undefined || 
        req.body.statusCode     === undefined ||
        req.body.response_body  === undefined) 
        {
            console.log('keys are missing from request');
            res.status(200).send({
                status: 'Error',
                message: 'keys are missing from request'
            });
        }
    // check if any field has unset value   
    else if (req.body.verb   === undefined || 
        req.body.description    === undefined || 
        req.body.statusCode     === 0 ||
        req.body.response_body  === undefined) {
            console.log('All keys are not assigned value');
            res.status(200).send({
                status: 'Error',
                message: 'Please assign value to all fields'
            });
    }    
    else if(! tryParseJSON(req.body.response_body)) {
            res.status(200).send({
                status: 'Error',
                message: 'mocked response body is not JSON'
            });
    }
    // create a mock in DB and send back success response
    else {
        console.log("response body" + JSON.parse(req.body.response_body));
            var mockResponse = new mock({
                mockResponse: req.body
            });
            mockResponse.save().then((doc) => {
                console.log('Saved mockResponse', doc);
                res.status(200).send({
                    status: 'Success',
                    mockUrl: EP_URL + ':80/getmock?id=' + doc._id,
                    viewDetailsUrl: EP_URL + ':80/view/' + doc._id
                })
            }, (err) => {
                console.error(err);
                res.status(200).send({error:'Encountered error while saving mockResponse'})
            });
        }
});

app.listen(PORT, () => {
    console.log('server is up at port ' + PORT);
});

// return true if argument is a JSON object 
// from https://stackoverflow.com/a/20392392 
function tryParseJSON(jsonString){
    try {
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return true;
        }
    }
    catch (e) { 
        console.log('parse error'); 
    }
    return false;
};