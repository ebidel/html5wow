function degToRad(degrees) {
  return degrees * Math.PI / 180;
}
    
function initGL(canvas, width, height) {
  console.log('initGL: %o %s %s', canvas, width, height);
  var gl = null;
  canvas.width = width;
  canvas.height = height;
  try {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = width;
    gl.viewportHeight = height;
  } catch (e) {
    console.log(e);
  }
  if (!gl) {
    console.log("Could not initialise WebGL, sorry :-(");
  }
  return gl;
};

function getShader(gl, id) {
  var dom = document.querySelector('#' + id);
  var str = dom.textContent;
  var shader;
  if (dom.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (dom.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
  gl.shaderSource(shader, str);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
};

function getShaderProgram(gl, fragment_shader_id, vertex_shader_id) {
  var fragmentShader = getShader(gl, fragment_shader_id);
  var vertexShader = getShader(gl, vertex_shader_id);
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }
  gl.useProgram(program);
  
  program.vertexPositionAttribute = gl.getAttribLocation(program, "aVertexPosition");
  gl.enableVertexAttribArray(program.vertexPositionAttribute);

  program.textureCoordAttribute = gl.getAttribLocation(program, "aTextureCoord");
  gl.enableVertexAttribArray(program.textureCoordAttribute);
          
  program.pMatrixUniform = gl.getUniformLocation(program, "uPMatrix");
  program.mvMatrixUniform = gl.getUniformLocation(program, "uMVMatrix");
  program.samplerUniform = gl.getUniformLocation(program, "uSampler");
  //program.timeUniform = gl.getUniformLocation(program, "time");
  return program;
};

function setMatrixUniforms(gl, shaderProgram, pMatrix, mvMatrix) {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
};

function getBuffer(gl) {
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  var vertices = [
      -0.5,  0.0, -0.5,
      -0.6,  2.0, -0.6,
       0.5,  0.0, -0.5,
       
      -0.6,  2.0, -0.6,
       0.6,  2.0, -0.6,
       0.5,  0.0, -0.5,
       
       0.5,  0.0, -0.5,
       0.6,  2.0, -0.6,
       0.5,  0.0,  0.5,
       
       0.6,  2.0, -0.6,
       0.6,  2.0,  0.6,
       0.5,  0.0,  0.5,
       
       0.6,  2.0,  0.6,
       0.5,  0.0,  0.5,
      -0.5,  0.0,  0.5,
      
      -0.6,  2.0,  0.6,
       0.6,  2.0,  0.6,
      -0.5,  0.0,  0.5,
      
      -0.6,  2.0,  0.6,
      -0.6,  2.0, -0.6,
      -0.5,  0.0,  0.5,
      
      -0.6,  2.0, -0.6,
      -0.5,  0.0, -0.5,
      -0.5,  0.0,  0.5
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  positionBuffer.itemSize = 3;
  positionBuffer.numItems = 24;
  return positionBuffer;
};

function getTextureBuffer(gl) {
  textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  var textureCoords = [
    1.0, 0.0,
    1.0, 1.0,
    0.5, 0.0,
    
    1.0, 1.0,
    0.5, 1.0,
    0.5, 0.0,
    
    0.5, 0.0,
    0.5, 1.0,
    0.0, 0.0,
    
    0.5, 1.0,
    0.0, 1.0,
    0.0, 0.0,
    
    1.0, 1.0,
    1.0, 0.0,
    0.5, 0.0,
    
    0.5, 1.0,
    1.0, 1.0,
    0.5, 0.0,
    
    0.5, 1.0,
    0.0, 1.0,
    0.5, 0.0,
    
    0.0, 1.0,
    0.0, 0.0,
    0.5, 0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
  textureCoordBuffer.itemSize = 2;
  textureCoordBuffer.numItems = 24;
  return textureCoordBuffer;
};

function drawScene(gl, shaderProgram, pMatrix, mvMatrix, positionBuffer, textureBuffer, texture, stack, deg, elapsed) {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
  mat4.identity(mvMatrix);
  mat4.translate(mvMatrix, [0, -2.0, -6.0]);
  
  mvPushMatrix(mvMatrix, stack);
  mat4.rotate(mvMatrix, degToRad(deg), [0, 1, 0]);

  var timeBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, timeBuffer);
  var l2 = gl.getUniformLocation(shaderProgram, "time");
  document.querySelector('#outputtext').textContent = 'Time: ' + elapsed;
  gl.uniform1f(l2, elapsed);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, positionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(shaderProgram.samplerUniform, 0);
          
  setMatrixUniforms(gl, shaderProgram, pMatrix, mvMatrix);
  gl.drawArrays(gl.TRIANGLES, 0, positionBuffer.numItems);
  
  mvMatrix = mvPopMatrix(stack);
};

function onTextureLoaded(gl, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  //gl.generateMipmap(gl.TEXTURE_2D);
};

function loadTexture(gl, filename, callback) {
  texture = gl.createTexture();
  texture.image = new Image();
  texture.image.onload = function() {
    onTextureLoaded(gl, texture);
    callback(texture);
  }
  texture.image.src = filename;
};


var stop = false;

function start(canvas, width, height, fragment_id, vertex_id) {
  console.log('start: %o %s %s %s %s', canvas, width, height, fragment_id, vertex_id);
  var gl = initGL(canvas, width, height);
  var shaderProgram = getShaderProgram(gl, fragment_id, vertex_id);
  var mvMatrix = mat4.create();
  var pMatrix = mat4.create();
  var positionBuffer = getBuffer(gl);
  var textureBuffer = getTextureBuffer(gl);
  var stack = [];
  var deg = 270 - 45;
  
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  var lastTime = 0;
  var texture = null;
  var started = new Date().getTime();
  function tick() {
    var timeNow = new Date().getTime();
    var elapsed = 0;
    if (lastTime != 0) {
      var elapsed = timeNow - lastTime;
      deg += (120 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
    var totalElapsed = (timeNow - started) / 1000.0;
    drawScene(gl, shaderProgram, pMatrix, mvMatrix, positionBuffer, textureBuffer, texture, stack, deg, totalElapsed);
    if (!stop) {
      webkitRequestAnimationFrame(tick);
    }
  }
  
  loadTexture(gl, 'html5-4.png', function(tex) {
    texture = tex;
    tick();
  });
};

function mvPushMatrix(matrix, stack) {
  var copy = mat4.create();
  mat4.set(matrix, copy);
  stack.push(copy);
};

function mvPopMatrix(stack) {
  if (stack.length == 0) {
      throw "Invalid popMatrix!";
  }
  return stack.pop();
};



