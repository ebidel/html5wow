function WebGlLogo(canvas, w, h, fragment_src, vertex_src, texture_src) {
  this.w = w;
  this.h = h;
  this.canvas = canvas;
  this.init(fragment_src, vertex_src);
  this.running = false;
  var self = this;
  this.loadTexture(texture_src, function() {
    self.running = true;
    self.tick();
  });
};

WebGlLogo.prototype.init = function(fragment_src, vertex_src) {
  this.canvas.width = this.w;
  this.canvas.height = this.h;
  try {
    this.gl = this.canvas.getContext("experimental-webgl");
  } catch (e) {
    console.log(e);
  }
  if (!this.gl) {
    console.log(this.gl);
    throw 'Could not initialize WebGL';
  }
  this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.program = this.getShaderProgram(fragment_src, vertex_src);
  this.mvMatrix = mat4.create();
  this.pMatrix = mat4.create();
  this.model = {
    'vertexBuffer' : this.getVertexBuffer(),
    'textureBuffer' : this.getTextureBuffer()
  };
  this.mouseX = 250;
  this.mouseY = 250;
  this.texture = null;
  this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
};

WebGlLogo.prototype.onMouseMove = function(evt) {
  this.mouseX = evt.offsetX;
  this.mouseY = evt.offsetY;
};

WebGlLogo.prototype.getShader = function(src, type) {
  var shader = this.gl.createShader(type);
  this.gl.shaderSource(shader, src);
  this.gl.compileShader(shader)
  if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
    throw this.gl.getShaderInfoLog(shader);
  return shader;
};

WebGlLogo.prototype.getShaderProgram = function(fragment_src, vertex_src) {
  var fragShader = this.getShader(fragment_src, this.gl.FRAGMENT_SHADER);
  var vertShader = this.getShader(vertex_src, this.gl.VERTEX_SHADER);
  var program = this.gl.createProgram();
  this.gl.attachShader(program, vertShader);
  this.gl.attachShader(program, fragShader);
  this.gl.linkProgram(program);
  if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS))
    throw 'Could not initialize shaders';
  this.gl.useProgram(program);

  program.vertexAttr = this.gl.getAttribLocation(program, 'aVertexPosition');
  this.gl.enableVertexAttribArray(program.vertexAttr);

  program.textureAttr = this.gl.getAttribLocation(program, 'aTextureCoord');
  this.gl.enableVertexAttribArray(program.textureAttr);

  program.pMatrixUniform = this.gl.getUniformLocation(program, 'uPMatrix');
  program.mvMatrixUniform = this.gl.getUniformLocation(program, 'uMVMatrix');
  program.samplerUniform = this.gl.getUniformLocation(program, 'uSampler');

  return program;
};

WebGlLogo.prototype.degToRad = function(degrees) {
  return degrees * Math.PI / 180;
};

WebGlLogo.prototype.draw = function() {
  this.gl.viewport(0, 0, this.w, this.h);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  mat4.identity(this.mvMatrix);
  mat4.perspective(45, this.w / this.h, 0.1, 100.0, this.pMatrix);
  mat4.translate(this.mvMatrix, [0, 0, -6.0]);

  var hW = this.w / 2;
  var hH = this.h / 2;
  var yDeg = -30.0 * ((hW - this.mouseX) / hW);
  var xDeg = -30.0 * ((hH - this.mouseY) / hH) + 10;
  mat4.rotate(this.mvMatrix, this.degToRad(yDeg), [0, 1, 0]);
  mat4.rotate(this.mvMatrix, this.degToRad(xDeg), [1, 0, 0]);

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.model.vertexBuffer);
  this.gl.vertexAttribPointer(this.program.vertexAttr,
                              this.model.vertexBuffer.itemSize,
                              this.gl.FLOAT, false, 0, 0);

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.model.textureBuffer);
  this.gl.vertexAttribPointer(this.program.textureAttr,
                              this.model.textureBuffer.itemSize,
                              this.gl.FLOAT, false, 0, 0);

  this.gl.activeTexture(this.gl.TEXTURE0);
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  this.gl.uniform1i(this.program.samplerUniform, 0);
  this.gl.uniformMatrix4fv(this.program.pMatrixUniform, false, this.pMatrix);
  this.gl.uniformMatrix4fv(this.program.mvMatrixUniform, false, this.mvMatrix);
  this.gl.drawArrays(this.gl.TRIANGLES, 0, this.model.vertexBuffer.numItems);
};

WebGlLogo.prototype.getVertexBuffer = function () {
  var positionBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
  var vertices = new Float32Array([
    -1.0, -0.8,  0.0,
    -1.1,  1.0,  0.0,
     0.0, -1.0,  1.0,

     0.0, -1.0,  1.0,
    -1.1,  1.0,  0.0,
     0.0,  1.0,  1.0,

     0.0, -1.0,  1.0,
     0.0,  1.0,  1.0,
     1.0, -0.8,  0.0,

     1.0, -0.8,  0.0,
     0.0,  1.0,  1.0,
     1.1,  1.0,  0.0
  ]);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
  positionBuffer.itemSize = 3;
  positionBuffer.numItems = vertices.length / positionBuffer.itemSize;
  return positionBuffer;
};

WebGlLogo.prototype.getTextureBuffer = function() {
  var textureBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureBuffer);
  var textureCoords = new Float32Array([
    0.0, 0.1,
    0.0, 1.0,
    0.5, 0.0,

    0.5, 0.0,
    0.0, 1.0,
    0.5, 1.0,

    0.5, 0.0,
    0.5, 1.0,
    1.0, 0.1,

    1.0, 0.1,
    0.5, 1.0,
    1.0, 1.0
  ]);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, textureCoords, this.gl.STATIC_DRAW);
  textureBuffer.itemSize = 2;
  textureBuffer.numItems = textureCoords.length / textureBuffer.itemSize;
  return textureBuffer;
};

WebGlLogo.prototype.loadTexture = function(path, callback) {
  this.texture = this.gl.createTexture();
  this.texture.image = new Image();
  var self = this;
  this.texture.image.addEventListener('load', function() {
    self.onTextureLoaded();
    callback(self.texture);
  });
  this.texture.image.src = path;
};

WebGlLogo.prototype.onTextureLoaded = function() {
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
  this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,
                     this.gl.UNSIGNED_BYTE, this.texture.image);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER,
                        this.gl.LINEAR);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER,
                        this.gl.LINEAR);
};

WebGlLogo.prototype.tick = function(time) {
  this.draw();
  if (this.running) {
    webkitRequestAnimationFrame(this.tick.bind(this), this.canvas);
  }
};

WebGlLogo.prototype.stop = function() {
  this.running = false;
};
