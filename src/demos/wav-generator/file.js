window.BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder || window.BlobBuilder;
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;

var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};


var filer = filer || new function() {

  var fs_ = null;
  const FS_INIT_ERROR_MSG = 'Filesystem has not been initialized.';

  var init_ = function(persistent, size, successCallback, opt_errorHandler) {
    var type = persistent ? window.PERSISTENT : window.TEMPORARY;
    window.requestFileSystem(
      type, // persistent vs. temporary storage
      size, // size (bytes) of needed space
      function(fs) {
        fs_ = fs;
        successCallback(fs);
      },  // success callback
      opt_errorHandler  // opt. error callback, denial of access
    );
  };

  var readDir_ = function(successCallback, opt_errorHandler) {
    // Read contents of current working directory. According to spec, need to
    // keep calling readEntries() until length of result array is 0. We're
    // guarenteed the same entry won't be returned again.
    var entries = [];
    var reader = fs_.root.createReader();

    var readEntries = function() {
      reader.readEntries(function(results) {
        if (!results.length) {
          successCallback(entries.sort());
        } else {
          entries = entries.concat(util.toArray(results));
          readEntries();
        }
      }, opt_errorHandler);
    };

    readEntries();
  };

  var open_ = function(name, successCallback, opt_errorHandler) {
    if (!fs_) {
      throw new Error(FS_INIT_ERROR_MSG);
    }

    fs_.root.getFile(name, {create: false}, function(fileEntry) {
      fileEntry.file(function(file) {
        successCallback(file);
      }, opt_errorHandler); // Get the File obj.
    }, opt_errorHandler);
  };

  var create_ = function(name, opt_exclusive, successCallback, opt_errorHandler) {
    if (!fs_) {
      throw new Error(FS_INIT_ERROR_MSG);
    }

    var exclusive = opt_exclusive != null ? opt_exclusive : true;
    fs_.root.getFile(name, {create: true,  exclusive: exclusive},
      successCallback,
      function(e) {
        if (e.code == FileError.INVALID_MODIFICATION_ERR) {
          opt_errorHandler && opt_errorHandler(e);
          throw new Error("'" + name + "' already exists");
        }
      }
    );
  };

  /**
   * Deletes an entry for the file storage.
   * @param {FileEntry|DirectoryEntry} entry The entry to delete.
   * @param {Function} successCallback Zero arg callback invoked on
   *     successful removal.
   * @param {Function} opt_errorHandler Optional error callback.
   */
  var rm_ = function(entry, successCallback, opt_errorHandler) {
    // TODO(ericbidelman): suppport recursive deletes using dirEntry.removeRecursively

    if (!fs_) {
      throw new Error(FS_INIT_ERROR_MSG);
    }

    entry.remove(successCallback, opt_errorHandler);
  };

 /**
   * Writes data to a file. If it already exists, its contents are overwritten.
   * @param {string} name The name of the file to open and write to.
   * @param {object} dataObj The data to write. Example:
   *     {data: string|Blob|File|ArrayBuffer, type: mimetype}
   * @param {Function} successCallback Success callback, which is passed
   *     a single FileWriter.
   * @param {Function} opt_errorHandler Optional error callback.
   */
  var write_ = function(name, dataObj, successCallback, opt_errorHandler) {
    if (!fs_) {
      throw new Error(FS_INIT_ERROR_MSG);
    }

    fs_.root.getFile(name, {create: true}, function(fileEntry) {

      fileEntry.createWriter(function(fileWriter) {

        fileWriter.onwrite = function(e) {
          console.log('Write completed.');
        };

        fileWriter.onerror = function(e) {
          console.log('Write failed: ' + e);
        };

        var bb = new BlobBuilder();
        bb.append(dataObj.data);
        fileWriter.write(bb.getBlob(dataObj.type));

        successCallback(fileEntry, fileWriter);
      }, opt_errorHandler);

    }, opt_errorHandler);
  };

  return {
    init: init_,
    readDir: readDir_,
    create: create_,
    open: open_,
    write: write_,
    rm: rm_,
    getFS: function() {
      return fs_;
    }
  };

};

