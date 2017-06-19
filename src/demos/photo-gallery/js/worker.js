/*
 * Copyright (c) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Author: Eric Bidelman <ericbidelman@chromiumg.org>
 */

importScripts('utils.js', 'binary.js', 'unzip.js');

function loadZip(url, opt_debug) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    var arrayBuffer = xhr.mozResponseArrayBuffer ? xhr.mozResponseArrayBuffer : xhr.response;
    postMessage({isDone: true, report: unzip(arrayBuffer, opt_debug || false)});
  }
  xhr.responseType = 'arraybuffer'; // xhr.responseType='blob' doesn't work (crbug.com/52486)
  xhr.send(null);
}

self.onmessage = function(e) {
  var data = e.data;

  if (!data.url && !data.file) {
    self.postMessage({
      status: 'error', message: 'No url specified for zip file.'
    });
    self.close();
    return;
  }

  if (data.file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      postMessage({isDone: true, report: unzip(this.result, data.debug)});
    };
    reader.readAsArrayBuffer(data.file);
  } else {
    loadZip(data.url, data.debug);
  }
};
