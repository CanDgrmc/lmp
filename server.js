/**
 * Created by Dgr on 22.02.2017.
 */
var express = require('express');
var app = express();
var server = app.listen(3000,running);
var fs = require('fs');
var db="data.json";
// Socket Codes
var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection',connected);
function connected(socket){
    console.log(socket.id+' client connected');

    var js=fs.readFileSync(db);
    var jsondata=JSON.parse(js);
    io.sockets.emit('onLoad',jsondata.lights);
    socket.on('click',msgid);
    function msgid(data){
        io.sockets.emit('click',data);

        //emit data

        var updobj={
            "id": data[0].id,
            "status": data[0].status
        };

        // Save emit data to Json

        var js=fs.readFileSync(db);
        var json=JSON.parse(js);
        // control json
        var i=0;
       while(i<json.lights.length){
           if(json.lights[i].id==data[0].id){
               json.lights.splice(i,1)
           }
           i++
       }
        json.lights.push(updobj);
        var finaljson=JSON.stringify(json);
        fs.writeFile(db,finaljson,callback)
        function callback(){
            console.log('emit data saved')
       }



    }
}
//Socket Ends

function running(){
    console.log('Running..')
}

// Routes \\
app.use(express.static('public'));

app.get('/',check)
    function check(req,res){
        var data=fs.readFileSync(db);
        var parsed=JSON.parse(data);
        var number=parsed.number;
        
        // onLoad Json Check on html
        /*var printstring;
        parsed.lights.forEach(function(data){printstring+='<span>'+ data.id+': '+data.status+ '</span><br>'})*/
        
        
        
        if (number==0){
            res.sendFile("public/inp.html",{root:__dirname});
        }
        else{
            var header="<html><head>" +
                '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">'+
                '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">'+
                '<link rel="stylesheet" type="text/css" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" />'+
                '<link rel="stylesheet" href="css/set.css">'+
                '<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>'+
                '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>'+

                "</head><body>"+
                '<div class="well"><p><span class="text text-danger">Number of Lights</span>:'+ number +' </p></div><button class="btn btn-outline-danger btn-lg" id="resetbtn">Reset</button><button class="btn btn-outline-success btn-lg">All On</button><button class="btn btn-outline-warning btn-lg">All Off</button><div class="container well lmpwrap col-md-12">';
            var div = '';
            var i=0;
            var footer = '</div><script src="js/things.js"></script></body></html>';


            while(i<number){
                i++;
                div += "<div class='col-md-2 col-xs-5 lmp off' id='"+ i +"' status='0'><i class='fa fa-lightbulb-o fa-6'></i><div class='count hide'><i class='fa fa-spinner fa-spin'></i><p ></p></div></div>";

            }

            var response=header+div+footer;
            res.send(response);
        }


    }

app.get('/add/:number',getnumb)
    function getnumb(req, res) {

        var nmb=req.params;
        var nb=nmb.number;
        var json={"number":nb,"lights":[]};
        var i=1;
        while(i<=nb) {
            var idN=i.toString();
            var obj = {
                "id": idN,
                "status": "0"
            };
            json.lights.push(obj);
            i++
        }

        res.sendFile('public/redirect.html',{root:__dirname});
    //***************************\\
    var data=JSON.stringify(json);
    fs.writeFile(db,data,done);
    function done(){
        console.log('number is set: '+nb)
    }

}

app.get('/reset',reset)

    function reset(req,res){
       var rst={"number":0,'lights':[]};
       var reset=JSON.stringify(rst);
        fs.writeFile(db,reset,done)
        function done(){
            console.log('Reset number..');
        }
        res.sendFile('public/redirect.html',{root:__dirname});
    }

app.get('/switch/:id/:status',swt);
function swt(req,res) {
    var data = req.params;
    var id = data.id;
    var status = data.status;
    var js = fs.readFileSync(db);
    var json = JSON.parse(js);
    var i = 0;
    while (i < json.lights.length) {
        if (json.lights[i].id == data.id) {
            json.lights.splice(i, 1)
        }
        i++
    }
    var updobj = {
        "id": id,
        "status": status
    };
    json.lights.push(updobj);
    var finaljson = JSON.stringify(json);
    fs.writeFile(db, finaljson, callback);
    function callback() {
        console.log('data changed')
        res.sendFile('public/redirect.html', {root: __dirname})
    }
}


//  Routes End \\