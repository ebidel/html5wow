importScripts('sha1.js');

var dict = [];

onmessage = function(e) {
  if ('cmd' in e.data) {
    switch (e.data.cmd) {
      case 'init':
        dict = e.data.dict;
        break;
      case 'check':
        checkPortion(e.data.portion, e.data.status);
        break;
    }
  }
  
};

function checkPortion(portion, status) {
  //postMessage({cmd:'debug',args:['starting new portion', portion]});
  for (var i = portion.start; i <= portion.end; i++) {
    var hex = hex_sha1(dict[i]);
    if (dict[i].indexOf('goog') > -1) {
      postMessage({cmd:'debug',args:['found goog', dict[i], hex, portion, status]});
    }
    for (var j = 0, status_hex; status_hex = status[j]; j++) {
      if (hex == status_hex) {
        postMessage({cmd:'found',word:dict[i]});
      }
    }
  }
  postMessage({cmd:'done',portion:portion});
};