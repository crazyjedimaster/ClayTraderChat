var app = require('express').createServer();
var io = require('socket.io').listen(app);
var fs = require('fs');

app.listen(8080);
var d = new Date();
var today = date();
var mesHisRoom1 = ["","","","","","","","","",""];
var mesHisRoom2 = ["","","","","","","","","",""];

var streamOptions = { flags: 'a+'};
var fileNameRoom1 = "Room1_" + date() +".txt"
var fileNameRoom2 = "Room2_" + date() +".txt"
var streamRoom1 = fs.createWriteStream(fileNameRoom1,streamOptions);
var streamRoom2 = fs.createWriteStream(fileNameRoom2,streamOptions);


function date() {
    return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
};

function time() {
    return (d.getHours() % 12) + ":" + d.getMinutes() + ":" + d.getSeconds();
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
        if (room == "room1") {
            
            socket.emit('updatechatIntro', 0, mesHisRoom1);
        }
        else if (room == "room2") {
            //var chatHistory = fs.readFileSync(fileNameRoom2);
            //console.log("SUPER CUSTOMER STUFF  " + chatHistory);
            socket.emit('updatechatIntro', 0, mesHisRoom2);
        }
        // echo to room 1 that a person has connected to their room
        //socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room', 0);
        //socket.emit('updaterooms', rooms, room);
    });

    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data, mUserID, avatar) {
        var toSend = '<div class="chat" id = ' + id + '>' + '<div class="avatar">' + avatar + '</div>' + '<div class="user">' + socket.username + '</div>' + '<div class="message">' + data + '</div>  </div>';  
        if (today != date()) {
            //today(date)
            fileNameRoom1 = "Room1_" + date() + ".txt";
            fileNameRoom2 = "Room2_" + date() + ".txt";
            streamRoom1.end();
            streamRoom2.end();
            streamRoom1 = fs.createWriteStream(fileNameRoom1, streamOptions);
            streamRoom2 = fs.createWriteStream(fileNameRoom2, streamOptions);
        }

        if (socket.room == "room1") {
            mesHisRoom1.shift();
            mesHisRoom1.push(mUserID + ';<div class="chat" id = ' + id + '>;<b>' + socket.username + ':</b> ' + data + '  </div>');
            streamRoom1.write("<div id=" + id + " class=Message>" + socket.username + ":" + data + " @ " + d.getTime() + "</div>\n");
        }
        else {
            mesHisRoom2.shift();
            mesHisRoom2.push(mUserID + ';<div class="chat" id = ' + id + '>;<b>' + socket.username + ':</b> ' + data + '  </div>');
            streamRoom2.write("<div id=" + id + " class=Message>" + socket.username + ":" + data + " @ " + d.getTime() + "</div>\n");
        }
        io.sockets. in (socket.room).emit('updatechat', socket.username, toSend, id++, mUserID);

    });
    socket.on('deleteMessage', function (test, data) {
        console.log('CUSTOM LOG - In delete message');
        // adjust recordingstream.write(id +" " + socket.username + ":" + data + " @ " + date.getTime() + "\n");
        // stream.end();
        // we tell the client to execute 'updatechat' with 2 parameters
        if (socket.room == "room1") {
            streamRoom1.write("<div data-id=" + data + " class=Deleted" + " data-Time=" + d.getTime() + "></div>\n");
        }
        else {
            streamRoom2.write("<div data-id=" + data + " class=Deleted" + " data-Time=" + d.getTime() + "></div>\n");
        }
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
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected', 0);
        socket.leave(socket.room);
        //stream.end();
    });

    socket.on('getFile', function (fileName, tempUser) {
        var fileContent;
        try {
            fileContent = fs.readFileSync(fileName);
        }catch(e){
            fileContent = "NO SUCH FILE EXISTS!!"
        }

        //socket.emit('returnFile', fileContent.toString());

        io.sockets. in (socket.room).emit('returnFile', fileContent.toString(), tempUser);

    });
});