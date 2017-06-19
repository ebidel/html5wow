// Need to use self in the case we're in a worker and window isn't defined.
self.BlobBuilder = self.WebKitBlobBuilder || self.MozBlobBuilder || self.BlobBuilder;
self.URL = self.URL || self.webkitURL;

var Utils = {

  // This code was written by Tyler Akins and has been placed in the
  // public domain.  It would be nice if you left this header intact.
  // Base64 code from Tyler Akins -- http://rumkin.com

  // schiller: Removed string concatenation in favour of Array.join() optimization,
  //           also precalculate the size of the array needed.

  // ericbidelman: Added toDataURL/toObjectURL methods. Removed encode64 method
  //               in favor of native window.btoa().

  /*toDataURL: function(contentType, uint8Array) {
    return 'data:' + contentType + ';base64,' + window.btoa(this.arrayToBinaryString(uint8Array));
  },*/

  toDataURL: function(contentType, dataStr) {
    return 'data:' + contentType + ';base64,' + self.btoa(dataStr);
  },

  toObjectURL: function(contentType, dataStr) {

    var ui8a = new Uint8Array(dataStr.length);
    for (var i = 0; i < ui8a.length; ++i) { 
      ui8a[i] = dataStr.charCodeAt(i);
    }

    var bb = new BlobBuilder();
    bb.append(ui8a.buffer);

    return self.URL.createObjectURL(bb.getBlob(contentType));
  },

  // Helper function that will create a binary stream out of an array of numbers
  // bytes must be an array and contain numbers, each varying from 0-255
  arrayToBinaryString: function(bytes) {
    if (typeof bytes != typeof []) {
      return null;
    }
    var i = bytes.length;
    var bstr = new Array(i);
    while (i--) {
      bstr[i] = String.fromCharCode(bytes[i]);
    }
    return bstr.join('');
  }
};
