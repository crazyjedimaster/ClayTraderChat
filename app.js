var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var app = require('express').createServer();
var io = require('socket.io').listen(app);
var fs = require('fs');

app.listen(server_port,server_ip_address);
var today = date();
var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Decr" ];



var room1 = {
    RoomName:'room1',
    MessageHistory : ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
    FileName : 'room1' + "_" + date() +".txt",
    Stream : fs.createWriteStream('room1' + "_" + date() +".txt",streamOptions)
}

var room2 = {
    RoomName:'room2',
    MessageHistory : ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
    FileName : 'room2' + "_" + date() +".txt",
    Stream : fs.createWriteStream('room2' + "_" + date() +".txt",streamOptions)
}

var room3 = {
    RoomName:'room3',
    MessageHistory : ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
    FileName : 'room3' + "_" + date() +".txt",
    Stream : fs.createWriteStream('room3' + "_" + date() +".txt",streamOptions)
}

var logRoom = {
    RoomName:'logRoom',
    MessageHistory : ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
    FileName : 'logRoom' + "_" + date() +".txt",
    Stream : fs.createWriteStream('logRoom' + "_" + date() +".txt",streamOptions)
}
var RoomObject = [room1, room2, room3, logRoom];

var mesHisRoom1 = ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""];
var mesHisRoom2 = ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""];
var mesHisRoom3 = ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""];

var MS_PER_HOUR = 3600000;
var TIME_OFFSET = 5;

var streamOptions = { flags: 'a+'};
var fileNameRoom1 = "Room1_" + date() + ".txt";
var fileNameRoom2 = "Room2_" + date() + ".txt";
var fileNameRoom3 = "Room3_" + date() + ".txt";
var streamRoom1 = fs.createWriteStream(fileNameRoom1,streamOptions);
var streamRoom2 = fs.createWriteStream(fileNameRoom2,streamOptions);
var streamRoom3 = fs.createWriteStream(fileNameRoom3,streamOptions);



function date() {
    var now = new Date();
    var d = new Date(now - (TIME_OFFSET * MS_PER_HOUR));

    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    if (month < 10) 
    {
        month = "0" + month;
    }
    var day = d.getDate();
    if (day < 10) 
    {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
};

function time() {
    var now = new Date();
    var d = new Date(now - (TIME_OFFSET * MS_PER_HOUR));


    var hours = d.getHours() % 12;
    if (hours < 10) 
    {
        hours = "0" + hours;
    }

    var minutes = d.getMinutes();
    if (minutes < 10) 
    {
        minutes = "0" + minutes;
    }

    var seconds = d.getSeconds();
    if (seconds < 10) 
    {
        seconds = "0" + seconds;
    }

    return (hours + ":" + minutes + ":" + seconds);
}

function shortDate() {
     var now = new Date();
    var d = new Date(now - (TIME_OFFSET * MS_PER_HOUR));

    var month = monthNames[d.getMonth()];
    var day = d.getDate();

    return month + ' ' + day;
}


// routing
app.get('/', function (req, res) {
    //res.send('HelloWorld');
    console.log('CUSTOM LOG - before sendFile');
    res.sendfile('/index.html', { root: __dirname });
    console.log('CUSTOM LOG - after sendFile');
});

var id = 0;
// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['room1','room2','room3','logRoom'];

io.sockets.on('connection', function (socket) {
    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function (username, room) {
        // store the username in the socket session for this client
        socket.username = username;
        // store the room name in the socket session for this client
        socket.room = room;
        // add the client's username to the global list
        usernames[username] = username;
        // send client to room 1
        socket.join(room);
        // echo to client they've connected
        for (var i = 0; i < RoomObject.length; i++) {
            if (RoomObject[i].RoomName == socket.room) {
                socket.emit('updatechatIntro', 0, RoomObject[i].MessageHistory);
            }
        }
        /*if (room == "room1") {
            
        }
        else if (room == "room2") {
        socket.emit('updatechatIntro', 0, mesHisRoom2);
        }
        else if (room == "room3") {
        socket.emit('updatechatIntro', 0, mesHisRoom3);
        }*/
        // echo to room 1 that a person has connected to their room
        //socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room', 0);
        //socket.emit('updaterooms', rooms, room);
    });

    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data, mUserID, avatar) {
        var toSend = '<div class="chat group" id = ' + id + '>' + '<div class="avatar"><a target="_blank" href="http://claytrader.com/users/' + socket.username + '">' + avatar + '</div>' + '<div class="content"><div class="user"><a target="_blank" href="http://claytrader.com/users/' + socket.username + '">' + socket.username + '</a></div><div class="time">' + shortDate().toString() + ' ' + time().toString() + '</div><div class="message">' + data + '</div> </div> </div>';
        if (today != date()) {
            for (var i = 0; i < RoomObject.length; i++) {
                RoomObject[i].FileName = RoomObject[i].RoomName + '_' + date() + ".txt";
                RoomObject[i].Stream.end();
                RoomObject[i].Stream = fs.createWriteStream(RoomObject[i].FileName, streamOptions);
            }
            
            /*fileNameRoom1 = "Room1_" + date() + ".txt";
            fileNameRoom2 = "Room2_" + date() + ".txt";
            fileNameRoom3 = "Room2_" + date() + ".txt";
            streamRoom1.end();
            streamRoom2.end();
            streamRoom3.end();
            streamRoom1 = fs.createWriteStream(fileNameRoom1, streamOptions);
            streamRoom2 = fs.createWriteStream(fileNameRoom2, streamOptions);
            streamRoom3 = fs.createWriteStream(fileNameRoom3, streamOptions);*/
        }
        for (var i = 0; i < RoomObject.length; i++) {
            if (RoomObject[i].RoomName == socket.room) {
                RoomObject[i].MessageHistory.shift();
                RoomObject[i].MessageHistory.push(mUserID + ';' + toSend);
                RoomObject[i].Stream.write(toSend);
            }
        }
        /*if (socket.room == "room1") {
        mesHisRoom1.shift();
        mesHisRoom1.push(mUserID + ';' + toSend);
        streamRoom1.write(toSend);
        }
        else if (socket.room == "room2") {
        mesHisRoom2.shift();
        mesHisRoom2.push(mUserID + ';' + toSend);
        streamRoom2.write(toSend);
        }
        else if (socket.room == "room3") {
        mesHisRoom3.shift();
        mesHisRoom3.push(mUserID + ';' + toSend);
        streamRoom3.write(toSend);
        }*/
        io.sockets. in (socket.room).emit('updatechat', socket.username, toSend, id++, mUserID);

    });
    socket.on('deleteMessage', function (test, data) {
        // we tell the client to execute 'updatechat' with 2 parameters
        for (var i = 0; i < RoomObject.length; i++) {
            if (RoomObject[i].RoomName == socket.room) {
                RoomObject[i].Stream.write("<div data-id=" + data + " class=Deleted" + " data-Time=" + time().toString() + "></div>\n");
            }
        }
        /*if (socket.room == "room1") {
        streamRoom1.write("<div data-id=" + data + " class=Deleted" + " data-Time=" + time().toString() + "></div>\n");
        }
        else if (socket.room == "room2") {
        streamRoom2.write("<div data-id=" + data + " class=Deleted" + " data-Time=" + time().toString() + "></div>\n");
        }
        else if (socket.room == "room3") {
        streamRoom3.write("<div data-id=" + data + " class=Deleted" + " data-Time=" + time().toString() + "></div>\n");
        }*/
        io.sockets. in (socket.room).emit('updateDelete', socket.username, data, test, id++);
    });
    socket.on('banUser', function (test, user) {
        console.log('CUSTOM LOG - In ban User');
        io.sockets. in (socket.room).emit('banned', socket.username, user, test, id++);
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        console.log('CUSTOM LOG - In disconnect');
        // remove the username from global usernames list
        delete usernames[socket.username];
        // update list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
        // echo globally that this client has left
        //socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected', 0);
        socket.leave(socket.room);
        //stream.end();
    });

    socket.on('getFile', function (fileName, tempUser) {
        var fileContent;
        try {
            fileContent = fs.readFileSync(fileName);
        } catch (e) {
            fileContent = "NO SUCH FILE EXISTS!!"
        }

        //socket.emit('returnFile', fileContent.toString());

        io.sockets. in (socket.room).emit('returnFile', fileContent.toString(), tempUser);

    });
});
