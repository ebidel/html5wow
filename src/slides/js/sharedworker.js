var ports = [];
var state = 'This text is shared state';

function broadcast(callback) {
  for (var i = 0; i < ports.length; i++) {
    callback(ports[i]);
  }
};

function getUpdateMessage() {
  return JSON.stringify({cmd:'update', text:state});
};

onconnect = function(e) {
  var port = e.ports[0];
  port.addEventListener('message', function(e) {
    var data = JSON.parse(e.data);
    switch (data.cmd) {
      case 'update':
        state = data.text;
        var self = this;
        broadcast(function (p) { 
          if (p != self) { 
            p.postMessage(getUpdateMessage()); 
          }
        });
        break;
      case 'close':
        broadcast(function (p) {
          p.postMessage(e.data);
        });
        terminate();
        break;
    }
  });
  port.start();
  ports.push(port);
  port.postMessage(getUpdateMessage());
};