
/** -*- compile-command: "jslint-cli OpenSceneGraph.js" -*-
 *
 * Copyright (C) 2010 Cedric Pinson
 *
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Authors:
 *  Cedric Pinson <cedric.pinson@plopbyte.net>
 *
 */

var gl;
var OpenSceneGraph = {
    version: '0.0.1',
    copyright: 'Cedric Pinson - cedric.pinson@plopbyte.net',
    instance: 0,
    verbose: 0,

    init: function() {
        if (Float32Array.set === undefined) {
            Float32Array.prototype.set = function(array) {
                var l = array.length;
                for (var i = 0; i < l; ++i ) {
                    this[i] = array[i];
                }
            };
        }
        if (Int32Array.set === undefined) {
            Int32Array.prototype.set = function(array) {
                var l = array.length;
                for (var i = 0; i < l; ++i ) {
                    this[i] = array[i];
                }
            };
        }
    }
};

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        OpenSceneGraph.init();

    } catch(e) {

    }

    if (!gl) {
        console.log("Could not initialise WebGL, sorry :-(");
    }
}

function Uniform() { this.transpose = false;}
Uniform.prototype = {
    set: function(array) {
        this.data = array;
        this.dirty = true;
    },
    apply: function(location) {
        if (this.dirty) {
            this.glData.set(this.data);
        }
        this.glCall(location, this.glData);
    },
    applyMatrix: function(location) {
        if (this.dirty) {
            this.glData.set(this.data);
        }
        this.glCall(location, this.transpose, this.glData);
    }
};

Uniform.createFloat1 = function(value, name) {
    var uniform = new Uniform();
    uniform.data = [value];
    uniform.glCall = function (location, glData) {
        gl.uniform1fv(location, glData);
    };
    uniform.glData = new Float32Array(uniform.data);
    uniform.dirty = false;
    uniform.name = name;
    return uniform;
};
Uniform.createFloat2 = function(vec2, name) {
    var uniform = new Uniform();
    uniform.data = vec2;
    uniform.glCall = function (location, glData) {
        gl.uniform2fv(location, glData);
    };
    uniform.glData = new Float32Array(uniform.data);
    uniform.dirty = false;
    uniform.name = name;
    return uniform;
};
Uniform.createFloat3 = function(vec3, name) {
    var uniform = new Uniform();
    uniform.data = vec3;
    uniform.glCall = function (location, glData) {
        gl.uniform3fv(location, glData);
    };
    uniform.glData = new Float32Array(uniform.data);
    uniform.dirty = false;
    uniform.name = name;
    return uniform;
};
Uniform.createFloat4 = function(vec4, name) {
    var uniform = new Uniform();
    uniform.data = vec4;
    uniform.glCall = function (location, glData) {
        gl.uniform4fv(location, glData);
    };
    uniform.glData = new Float32Array(uniform.data);
    uniform.dirty = false;
    uniform.name = name;
    return uniform;
};
Uniform.createInt1 = function(value, name) {
    var uniform = new Uniform();
    uniform.data = [value];
    uniform.glCall = function (location, glData) {
        gl.uniform1iv(location, glData);
    };
    uniform.glData = new Int32Array(uniform.data);
    uniform.dirty = false;
    uniform.name = name;
    return uniform;
};
Uniform.createInt2 = function(vec2, name) {
    var uniform = new Uniform();
    uniform.data = vec2;
    uniform.glCall = function (location, glData) {
        gl.uniform2iv(location, glData);
    };
    uniform.glData = new Int32Array(uniform.data);
    uniform.dirty = false;
    uniform.name = name;
    return uniform;
};
Uniform.createInt3 = function(vec3, name) {
    var uniform = new Uniform();
    uniform.data = vec3;
    uniform.glCall = function (location, glData) {
        gl.uniform3iv(location, glData);
    };
    uniform.glData = new Int32Array(uniform.data);
    uniform.dirty = false;
    uniform.name = name;
    return uniform;
};
Uniform.createInt4 = function(vec4, name) {
    var uniform = new Uniform();
    uniform.data = vec4;
    uniform.glCall = function (location, glData) {
        gl.uniform4iv(location, glData);
    };
    uniform.glData = new Int32Array(uniform.data);
    uniform.dirty = false;
    uniform.name = name;
    return uniform;
};
Uniform.createMatrix2 = function(mat2, name) {
    var uniform = new Uniform();
    uniform.data = mat2;
    uniform.glCall = function (location, transpose, glData) {
        gl.uniformMatrix2fv(location, transpose, glData);
    };
    uniform.apply = uniform.applyMatrix;
    uniform.transpose = false;
    uniform.glData = new Float32Array(uniform.data);
    uniform.dirty = false;
    uniform.name = name;
    return uniform;
};
Uniform.createMatrix3 = function(mat3, name) {
    var uniform = new Uniform();
    uniform.data = mat3;
    uniform.glCall = function (location, transpose, glData) {
        gl.uniformMatrix3fv(location, transpose, glData);
    };
    uniform.apply = uniform.applyMatrix;
    uniform.transpose = false;
    uniform.glData = new Float32Array(uniform.data);
    uniform.dirty = false;
    uniform.name = name;
    return uniform;
};
Uniform.createMatrix4 = function(mat4, name) {
    var uniform = new Uniform();
    uniform.data = mat4;
    uniform.glCall = function (location, transpose, glData) {
        gl.uniformMatrix4fv(location, transpose, glData);
    };
    uniform.apply = uniform.applyMatrix;
    uniform.transpose = false;
    uniform.glData = new Float32Array(uniform.data);
    uniform.dirty = false;
    uniform.name = name;
    return uniform;
};


function Stack() {}
Stack.create = function()
{
    var a = [];
    a.globalDefault = undefined;
    a.lastApplied = undefined;
    a.back = function () {
        return this[this.length -1];
    };
    return a;
};


ShaderGeneratorType = {
    VertexInit: 0,
    VertexFunction: 1,
    VertexMain: 2,
    FragmentInit: 3,
    FragmentMain: 5
};

function Shader() {}
Shader.prototype = {
    compile: function() {
        this.shader = gl.createShader(this.type);
        gl.shaderSource(this.shader, this.text);
        gl.compileShader(this.shader);
        if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
            if (console !== undefined) {
                console.log("can't compile shader:\n" + this.text + "\n");
                var tmpText = "\n" + this.text;
                var splittedText = tmpText.split("\n");
                var newText = "\n";
                for (var i = 0; i < splittedText.length; ++i ) {
                    newText += i + " " + splittedText[i] + "\n";
                }
                console.log(newText);
                console.log(gl.getShaderInfoLog(this.shader));
                debugger;
            } else {
                alert(gl.getShaderInfoLog(this.shader));
            }
        }
    }
};
Shader.create = function( type, text )
{
    var shader = new Shader(type);
    shader.type = type;
    shader.text = text;
    return shader;
};


function Program() {}
Program.prototype = {

    attributeType: "Program",
    cloneType: function() {return Program.create(); },
    getType: function() { return this.attributeType;},
    getTypeMember: function() { return this.attributeType;},
    apply: function(state) {
        if (!this.program || this.dirty)
        {
            if (!this.vertex.shader) {
                this.vertex.compile();
            }
            if (!this.fragment.shader) {
                this.fragment.compile();
            }
            this.program = gl.createProgram();
            gl.attachShader(this.program, this.vertex.shader);
            gl.attachShader(this.program, this.fragment.shader);
            gl.linkProgram(this.program);
            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                if (console !== undefined) {
                    console.log("can't link program\n" + this.vertex.text + this.fragment.text);
                    console.log(gl.getProgramInfo(this.program));
                    debugger;
                } else {
                    alert("Could not initialise shaders");
                }
                return null;
            }
            this.dirty = false;
        }
        gl.useProgram(this.program);
    }

};

Program.create = function(vShader, fShader) {
    var program = new Program();
    program.program = null;
    program.vertex = vShader;
    program.fragment = fShader;
    program.dirty = true;
    return program;
};


function ShaderGenerator() {}
ShaderGenerator.prototype = {

    createTextureAttributeMapList: function(attributes, attributeKeys) {
        var textureAttributeMapList = [];
        var element;
        if (attributes) {
            jQuery.each(attributes, function(index, attributesForUnit) {
                            if (attributesForUnit === undefined) {
                                return;
                            }
                            if (textureAttributeMapList[index] === undefined) {
                                textureAttributeMapList[index] = {};
                            }

                            jQuery.each(attributesForUnit, function(key, attributeStack) {
                                            if (attributeStack === undefined) {
                                                return;
                                            }
                                            if (attributeStack.length === 0) {
                                                element = attributeStack.globalDefault;
                                            } else {
                                                element = attributeStack.back();
                                            }
                                            // do not take invalid texture
                                            if (!element.textureObject) {
                                                return;
                                            }
                                            textureAttributeMapList[index][key] = element;
                                            attributeKeys[element.getType() + index] = true;
                                        }
                                       );
                        }
                       );
        }
        return textureAttributeMapList;
    },

    createAttributeMap: function(attributes, attributeKeys) {
        var attributeMap = {};
        var element;
        if (attributes) {
            jQuery.each(attributes, function(key, attributeStack) {
                            if (attributeStack === undefined) {
                                return;
                            }
                            if (attributeStack.length === 0) {
                                element = attributeStack.globalDefault;
                            } else {
                                element = attributeStack.back();
                            }
                            attributeMap[key] = element;
                            attributeKeys[key] = true;
                        }
                       );
        }
        return attributeMap;
    },

    createAttributes: function(attributes) {
        var attributeKeys = {};
        return {
            'textureAttributeMapList': this.createTextureAttributeMapList(attributes.textureAttributeMapList, attributeKeys),
            'attributeMap': this.createAttributeMap(attributes.attributeMap, attributeKeys),
            'attributeKeys': attributeKeys
        };
    },

    getOrCreateProgram: function(attributes) {

        var modes = this.createAttributes(attributes);

        for (var i = 0; i < this.cache.length; ++i) {
            if (this.compareAttributeMap(modes.attributeKeys, this.cache[i].attributeKeys) === 0) {
                return this.cache[i];
            }
        }


        var vertexshader = this.getOrCreateVertexShader(modes);
        var fragmentshader = this.getOrCreateFragmentShader(modes);

        var program = Program.create(
            Shader.create(gl.VERTEX_SHADER, vertexshader),
            Shader.create(gl.FRAGMENT_SHADER, fragmentshader));

        var attributeKeys = {};
        jQuery.each(modes.attributeMap, function(key, element) {
                        attributeKeys[key] = true;
                    });
        var textureLenght = modes.textureAttributeMapList.length;
        var operator = function(key, element) {
                            attributeKeys[element.getType() + textureUnit] = true;
        };
        for (var textureUnit = 0; textureUnit < textureLenght; ++textureUnit) {
            jQuery.each(modes.textureAttributeMapList[textureUnit], operator);
        }
        program.attributeKeys = attributeKeys;

        if (console !== undefined) {
            console.log(program.vertex.text);
            console.log(program.fragment.text);
        }

        this.cache.push(program);
        return program;
    },

    compareAttributeMap: function(attributeKeys0, attributeKeys1) {
        var key;
        for (key in attributeKeys0) {
            if (attributeKeys1[key] === undefined) {
                return 1;
            }
        }
        for (key in attributeKeys1) {
            if (attributeKeys0[key] === undefined) {
                return false;
            }
        }
        return 0;
    },

    fillTextureShader: function (attributeMapList, mode) {
        var shader = "";
        var instanciedTypeShader = {};
        jQuery.each(attributeMapList, function(unit, unitMap) {
                        // process the array
                        jQuery.each( unitMap, function(key, element) {
                                         if (element.writeShaderInstance && instanciedTypeShader[element.getType()] === undefined) {
                                             element.writeShaderInstance(unit, mode);
                                             instanciedTypeShader[element.getType()] = true;
                                         }

                                         if (element.writeToShader) {
                                             shader += element.writeToShader(unit, mode);
                                         }
                                     }
                                   );
                    }
        );
        return shader;
    },

    fillShader: function (attributeMap, mode) {
        var shader = "";
        var instanciedTypeShader = {};
        // process the array
        jQuery.each( attributeMap, function(key, element) {
                         if (element.writeShaderInstance && !instanciedTypeShader[element.getType()]) {
                             shader += element.writeShaderInstance(mode);
                             instanciedTypeShader[element.getType()] = true;
                         }
                         if (element.writeToShader) {
                             shader += element.writeToShader(mode);
                         }
                     }
                   );
        return shader;
    },

    getOrCreateVertexShader: function (attributes) {
        var i;
        var mode = ShaderGeneratorType.VertexInit;
        var shader = [
            "",
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "attribute vec3 Vertex;",
            "attribute vec3 Normal;",
            "uniform mat4 ModelViewMatrix;",
            "uniform mat4 ProjectionMatrix;",
            "uniform mat4 NormalMatrix;",
            ""
        ].join('\n');


        if (attributes.textureAttributeMapList) {
            shader += this.fillTextureShader(attributes.textureAttributeMapList, mode);
        }

        if (attributes.attributeMap) {
            shader += this.fillShader(attributes.attributeMap, mode);
        }

        mode = ShaderGeneratorType.VertexFunction;
        var func = [
            "",
            "vec4 ftransform() {",
            "return ProjectionMatrix * ModelViewMatrix * vec4(Vertex, 1.0);",
            "}"].join('\n');

        shader += func;
        if (attributes.textureAttributeMapList) {
            shader += this.fillTextureShader(attributes.textureAttributeMapList, mode);
        }

        if (attributes.attributeMap) {
            shader += this.fillShader(attributes.attributeMap, mode);
        }

        var body = [
            "",
            "void main(void) {",
            "gl_Position = ftransform();",
            ""
            ].join('\n');

        shader += body;

        mode = ShaderGeneratorType.VertexMain;

        if (attributes.textureAttributeMapList) {
            shader += this.fillTextureShader(attributes.textureAttributeMapList, mode);
        }
        if (attributes.attributeMap) {
            shader += this.fillShader(attributes.attributeMap, mode);
        }

        shader += [
            "}",
            ""
        ].join('\n');

        return shader;
    },

    getOrCreateFragmentShader: function (attributes) {
        var i;
        var shader = [
            "",
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "vec4 fragColor;",
            ""
            ].join("\n");
        var mode = ShaderGeneratorType.FragmentInit;

        if (attributes.textureAttributeMapList) {
            shader += this.fillTextureShader(attributes.textureAttributeMapList, mode);
        }
        if (attributes.attributeMap) {
            shader += this.fillShader(attributes.attributeMap, mode);
        }

        shader += [
            "void main(void) {",
            "fragColor = vec4(1.0, 1.0, 1.0, 1.0);",
            ""
            ].join('\n');

        mode = ShaderGeneratorType.FragmentMain;
        if (attributes.textureAttributeMapList) {
            var result = this.fillTextureShader(attributes.textureAttributeMapList, mode);
            shader += result;

            for (i = 0; i < attributes.textureAttributeMapList.length; ++i) {
                var textureUnit = attributes.textureAttributeMapList[i];
                if (textureUnit.Texture !== undefined ) {
                    shader += "fragColor = fragColor * texColor" + i + ";\n";
                }
            }
        }
        if (attributes.attributeMap) {
            shader += this.fillShader(attributes.attributeMap, mode);
        }

        shader += [
            "",
            "gl_FragColor = fragColor;",
            "}"
        ].join('\n');

        return shader;
    }
};

ShaderGenerator.create = function ()
{
    var sg = new ShaderGenerator();
    sg.cache = [];
    return sg;
};


function State() {}
State.prototype = {

    applyModelViewAndProjectionMatrix: function(modelview, projection) {
        this.modelViewMatrix.set(modelview.elements);
        this.projectionMatrix.set(projection.elements);
        var normal = modelview.copy().setTrans(Vec3.create().set(0, 0, 0)).invert();
        this.normalMatrix.set(normal.elements);
        this.getLastProgramApplied();
    },

    pushStateSet: function(stateset) {
        this.stateSets.push(stateset);

        if (stateset.attributeMap) {
            this.pushAttributeMap(this.attributeMap, stateset.attributeMap);
        }
        if (stateset.textureAttributeMapList) {
            var list = stateset.textureAttributeMapList;
            for (var textureUnit = 0; textureUnit < list.length; textureUnit++)
            {
                if (list[textureUnit] === undefined) {
                    continue;
                }
                if (!this.textureAttributeMapList[textureUnit]) {
                    this.textureAttributeMapList[textureUnit] = {};
                }
                this.pushAttributeMap(this.textureAttributeMapList[textureUnit], list[textureUnit]);
            }
        }

        if (stateset.uniforms) {
            this.pushUniformsList(this.uniforms, stateset.uniforms);
        }
    },

    applyStateSet: function(stateset) {
        this.pushStateSet();
        this.apply();
    },

    popStateSet: function() {
        var stateset = this.stateSets.pop();
        if (stateset.program) {
            this.programs.pop();
        }
        if (stateset.attributeMap) {
            this.popAttributeMap(this.attributeMap, stateset.attributeMap);
        }
        if (stateset.textureAttributeMapList) {
            var list = stateset.textureAttributeMapList;
            for (var textureUnit = 0; textureUnit < list.length; textureUnit++)
            {
                if (list[textureUnit] === undefined) {
                    continue;
                }
                this.popAttributeMap(this.textureAttributeMapList[textureUnit], list[textureUnit]);
            }
        }

        if (stateset.uniforms) {
            this.popUniformsList(this.uniforms, stateset.uniforms);
        }
    },

    getLastProgramApplied: function() {
        return this.programs.lastApplied;
    },

    pushGeneratedProgram: function() {
        var program;
        if (this.attributeMap.Program !== undefined) {
            program = this.attributeMap.Program.back();
            if (program !== undefined) {
                this.programs.push(program);
            }
            return program;
        }

        var attributes = {
            'textureAttributeMapList': this.textureAttributeMapList,
            'attributeMap': this.attributeMap
        };

        program = this.shaderGenerator.getOrCreateProgram(attributes);
        this.programs.push(program);
        return program;
    },

    popGeneratedProgram: function() {
        this.programs.pop();
    },

    apply: function() {
        var program = this.programs.back();
        if (this.programs.lastApplied !== program) {
            program.apply(this);
            this.programs.lastApplied = program;
        }

        this.applyAttributeMap(this.attributeMap);
        this.applyTextureAttributeMapList(this.textureAttributeMapList);
        this.applyUniformsMap(this.uniforms);
    },

    applyUniformsMap: function(uniformMap) {
        var program = this.getLastProgramApplied();
        var programObject = program.program;
        var name;
        var location;
        var uniformStack;
        var uniform;

        var operator = function(key, uniformStack) {
            if (uniformStack.length === 0) {
                uniform = uniformStack.globalDefault;
            } else {
                uniform = uniformStack.back();
            }
            location = gl.getUniformLocation(programObject, uniform.name);
            if (location === null || location === -1) {
                return;
            }
            uniform.apply(location);
        };
        jQuery.each(uniformMap, operator);
    },

    applyAttributeMap: function(attributeMap) {
        var program = this.getLastProgramApplied();
        var programObject = program.program;
        var location;
        var uniformName;
        jQuery.each(attributeMap, function(key, attributeStack) {
                        if (attributeStack === undefined) {
                            return;
                        }
                        var attribute;
                        if (attributeStack.length === 0) {
                            attribute = attributeStack.globalDefault;
                        } else {
                            attribute = attributeStack.back();
                        }
                        if (attributeStack.lastApplied !== attribute) {
                            if (attribute.apply) {
                                attribute.apply(state);
                            }
                            attributeStack.lastApplied = attribute;
                        }

                        // apply uniform if the program use it
                        if ( (program.attributeKeys !== undefined &&
                            program.attributeKeys[key] !== undefined) || program.attributeKeys === undefined ) {

                            if (attributeStack.lastApplied.getOrCreateUniforms !== undefined) {
                                var applyUniform = function(key, element) {
                                    uniformName = element.name;
                                    location = gl.getUniformLocation(programObject, uniformName);
                                    if (location === null || location === -1) {
                                        //debugger;
                                        return;
                                    }
                                    element.apply(location);
                                };
                                jQuery.each(attributeStack.lastApplied.getOrCreateUniforms(), applyUniform);
                            }
                        }

                    }
                   );
    },

    pushUniformsList: function(uniformMap, uniformList) {
        var uniform;
        var name;
        var uniformLenght = uniformList.length;
        for (uniform = 0; uniform < uniformLenght; uniform++)
        {
            name = uniformList[uniform].name;
            if (!uniformMap[name]) {
                uniformMap[name] = Stack.create();
                uniformMap[name].globalDefault = uniformList[uniform];
            }
            uniformMap[ name ].push(uniformList[uniform]);
        }
    },
    popUniformsList: function(uniformMap, uniformList) {
        var uniform;
        var uniformLenght = uniformList.length;
        for (uniform = 0; uniform < uniformLenght; uniform++)
        {
            uniformMap[ uniformList[uniform].name ].pop();
        }
    },

    applyTextureAttributeMapList: function(textureAttributesMapList) {
        var textureAttributeMap;
        var operator = function(key, attributeStack) {
            if (attributeStack === undefined) {
                return;
            }
            var attribute;
            if (attributeStack.length === 0) {
                attribute = attributeStack.globalDefault;
            } else {
                attribute = attributeStack.back();
            }
            if (attributeStack.lastApplied !== attribute) {
                gl.activeTexture(gl.TEXTURE0 + textureUnit);
                attribute.apply(state);
                attributeStack.lastApplied = attribute;
            }
        };

        for (var textureUnit = 0; textureUnit < textureAttributesMapList.length; textureUnit++)
        {
            textureAttributeMap = textureAttributesMapList[textureUnit];
            if (textureAttributeMap === undefined) {
                continue;
            }
            jQuery.each(textureAttributeMap, operator);
        }
    },

    setGlobalDefaultValue: function(attribute) {
        var key = attribute.getTypeMember();
        if (this.attributeMap[key]) {
            this.attributeMap[key].globalDefault = attribute;
        } else {
            this.attributeMap[key] = Stack.create();
            this.attributeMap[key].globalDefault = attribute;
        }
    },

    pushAttributeMap: function(attributeMap,  attributeList) {
        var attributeStack;
        jQuery.each(attributeList, function(type, attribute) {
                        if (attributeMap[type] === undefined) {
                            attributeMap[type] = Stack.create();
                            attributeMap[type].globalDefault = attribute.cloneType();
                        }
                        attributeStack = attributeMap[type];
                        attributeStack.push(attribute);
                    }
                   );
    },

    popAttributeMap: function(attributeMap,  attributeList) {
        var attributeStack;
        jQuery.each(attributeList, function(type, attribute) {
                        attributeStack = attributeMap[type];
                        attributeStack.pop(attribute);
                    }
                   );
    },


    disableVertexAttribsExcept: function(indexList) {
        var that = indexList;
        var disableArray = this.vertexAttribList.filter(function (element, index, array) {
            return (that.indexOf(element) < 0 );
        });

        disableArray.forEach(function (element, index, array) {
            gl.disableVertexAttribArray(element);
        });

        this.vertexAttribList = indexList;
    },


    applyTexture: function(unit, texture) {
        if (this.currentVBO !== array) {
            if (!array.buffer) {
                array.init();
            }
            gl.bindBuffer(array.type, array.buffer);
            this.currentVBO = array;
        }
        if (array.dirty) {
            array.compile();
        }
        this.vertexAttribList.push(attrib);
        gl.enableVertexAttribArray(attrib);
        gl.vertexAttribPointer(attrib, array.itemSize, gl.FLOAT, normalize, 0, 0);
    },

    setIndexArray: function(array) {
        if (this.currentIndexVBO !== array) {
            if (!array.buffer) {
                array.init();
            }
            gl.bindBuffer(array.type, array.buffer);
            this.currentIndexVBO = array;
        }
        if (array.dirty) {
            array.compile();
        }
    },

    setVertexAttribArray: function(attrib, array, normalize) {
        if (this.currentVBO !== array) {
            if (!array.buffer) {
                array.init();
            }
            gl.bindBuffer(array.type, array.buffer);
            this.currentVBO = array;
        }
        if (array.dirty) {
            array.compile();
        }
        this.vertexAttribList.push(attrib);
        gl.enableVertexAttribArray(attrib);
        gl.vertexAttribPointer(attrib, array.itemSize, gl.FLOAT, normalize, 0, 0);
    },
    getUniformMap: function() { return this.uniforms; }

};

State.create = function() {
    var state = new State();
    state.currentVBO = null;
    state.vertexAttribList = [];
    state.programs = Stack.create();
    state.stateSets = Stack.create();
    state.uniforms = {};

    state.textureAttributeMapList = [];

    state.attributeMap = {};
    state.modeMap = {};

    state.shaderGenerator = ShaderGenerator.create();

    state.modelViewMatrix = Uniform.createMatrix4(Matrix.identity().elements, "ModelViewMatrix");
    state.projectionMatrix = Uniform.createMatrix4(Matrix.identity().elements, "ProjectionMatrix");
    state.normalMatrix = Uniform.createMatrix4(Matrix.identity().elements, "NormalMatrix");

    gl.hint(gl.NICEST, gl.GENERATE_MIPMAP_HINT);
    return state;
};



Float32Array.prototype.set = function(valueArray) {
    var that = this;
    var operator = function(key, element) {
        that[key] = valueArray[key];
    };
    jQuery.each(valueArray, operator);
    return this;
};


function StateSet() { this.id = OpenSceneGraph.instance++; }
StateSet.prototype = {
    addUniform: function (uniform) {
        if (!this.uniforms) {
            this.uniforms = [];
        }
        this.uniforms.push(uniform);
    },
    setTextureAttribute: function (unit, attribute) {
        if (!this.textureAttributeMapList) {
            this.textureAttributeMapList = [];
        }
        if (this.textureAttributeMapList[unit] === undefined) {
            this.textureAttributeMapList[unit] = {};
        }
        this.textureAttributeMapList[unit][attribute.getTypeMember()] = attribute;
    },
    setTexture: function(unit, attribute) {
        this.setTextureAttribute(unit,attribute);
    },

    setAttribute: function (attribute) {
        if (!this.attributeMap) {
            this.attributeMap = {};
        }
        this.attributeMap[attribute.getTypeMember()] = attribute;
    }
};

StateSet.create = function() {
    var ss = new StateSet();
    return ss;
};

function Node() {}
Node.prototype = {
    addChild: function (child) {
        return this.children.push(child);
    },

    traverse: function (visitor) {
        this.children.forEach(function(element, index, array) {
            visitor.apply(element);
        });
    }
};
Node.create = function() {
    var node = new Node();
    node.children = [];
    node.name = "none";
    return node;
};

var MatrixTransform = {};
MatrixTransform.create = function() {
    var mt = Node.create();
    mt.matrix = Matrix.identity();
    return mt;
};

function Projection() {}
Projection.create = function() {
    var projection = MatrixTransform.create();
    delete projection.matrix;
    projection.projection = Matrix.identity();
    return projection;
};



function Texture() {}
Texture.prototype = {
    attributeType: "Texture",
    cloneType: function() { return Texture.create(undefined);},
    getType: function() { return this.attributeType;},
    getTypeMember: function() { return this.attributeType; },

    init: function() {
        if (!this.textureObject) {
            this.textureObject = gl.createTexture();
            this.dirty = true;
        }
    },

    setImage: function(img) {
        this.image = img;
        this.dirty = true;
    },

    compile: function() {
        var image = this.image;
        if (image && image.complete) {
            if (typeof image.naturalWidth !== "undefined" &&  image.naturalWidth === 0) {
                return;
            }
            //gl.texImage2D(gl.TEXTURE_2D, 0, this.image, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.mag_filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.min_filter);
            gl.generateMipmap(gl.TEXTURE_2D);
            this.dirty = false;
        }
    },

    apply: function(state) {
        if (!this.textureObject && this.image) {
            this.init();
        }
        if (!this.textureObject) {
            gl.bindTexture(gl.TEXTURE_2D, null);
        } else {
            gl.bindTexture(gl.TEXTURE_2D, this.textureObject);
            if (this.dirty) {
                this.compile();
            }
        }
    },

    writeToShader: function(unit, type)
    {
        var str = "";
        switch (type) {
        case ShaderGeneratorType.VertexInit:
            str = "attribute vec2 TexCoord"+unit+";\n";
            str += "varying vec2 FragTexCoord"+unit+";\n";
            break;
        case ShaderGeneratorType.VertexMain:
            str = "FragTexCoord"+unit+" = TexCoord" + unit + ";\n";
            break;
        case ShaderGeneratorType.FragmentInit:
            str = "varying vec2 FragTexCoord" + unit +";\n";
            str += "uniform sampler2D TexUnit" + unit +";\n";
            str += "vec4 texColor" + unit + ";\n";
            break;
        case ShaderGeneratorType.FragmentMain:
            str = "texColor" + unit + " = texture2D( TexUnit" + unit + ", FragTexCoord" + unit + ".xy );\n";
            break;
        }
        return str;
    }

};

Texture.create = function(imageSource) {
    var a = new Texture();
    a.dirty = true;
    if (imageSource !== undefined) {
        var img = new Image();
        img.src = imageSource;
        a.setImage(img);
    }
    a.mag_filter = gl.LINEAR;
    a.min_filter = gl.LINEAR_MIPMAP_NEAREST;
    return a;
};
Texture.createFromImg = function(img) {
    var a = new Texture();
    a.dirty = true;
    a.setImage(img);
    a.mag_filter = gl.LINEAR;
    a.min_filter = gl.LINEAR_MIPMAP_NEAREST;
    return a;
};



function Material() {}
Material.prototype = {
    attributeType: "Material",

    cloneType: function() {return Material.create(); },
    getType: function() { return this.attributeType;},
    getTypeMember: function() { return this.attributeType;},
    getOrCreateUniforms: function() {
        if (Material.uniforms === undefined) {
            Material.uniforms = { "ambient": Uniform.createFloat4([ 0, 0, 0, 0], 'MaterialAmbient') ,
                                  "diffuse": Uniform.createFloat4([ 0, 0, 0, 0], 'MaterialDiffuse') ,
                                  "specular": Uniform.createFloat4([ 0, 0, 0, 0], 'MaterialSpecular') ,
                                  "emission": Uniform.createFloat4([ 0, 0, 0, 0], 'MaterialEmission') ,
                                  "shininess": Uniform.createFloat1([ 0], 'MaterialShininess')
                                };
        }
        return Material.uniforms;
    },

    apply: function(state)
    {
        var uniforms = this.getOrCreateUniforms();
        uniforms.ambient.set(this.ambient);
        uniforms.diffuse.set(this.diffuse);
        uniforms.specular.set(this.specular);
        uniforms.emission.set(this.emission);
        uniforms.shininess.set(this.shininess);
    },

    writeToShader: function(type)
    {
        var str = "";
        switch (type) {
        case ShaderGeneratorType.VertexInit:
            str =  [ "uniform vec4 MaterialAmbient;",
                     "uniform vec4 MaterialDiffuse;",
                     "uniform vec4 MaterialSpecular;",
                     "uniform vec4 MaterialEmission;",
                     "uniform float MaterialShininess;",
                     "vec4 Ambient;",
                     "vec4 Diffuse;",
                     "vec4 Specular;",
                     ""].join('\n');
            break;
        case ShaderGeneratorType.VertexMain:
            break;
        }
        return str;
    }
};
Material.create = function() {
    var a = new Material();
    a.ambient = [ 0.2, 0.2, 0.2, 1.0 ];
    a.diffuse = [ 0.8, 0.8, 0.8, 1.0 ];
    a.specular = [ 0.0, 0.0, 0.0, 1.0 ];
    a.emission = [ 0.0, 0.0, 0.0, 1.0 ];
    a.shininess = 0.0;
    return a;
};


function Light() { }
Light.prototype = {
    attributeType: "Light",
    cloneType: function() {return Light.create(); },
    getType: function() { return this.attributeType; },
    getTypeMember: function() { return this.attributeType + this.light_unit;},
    getOrCreateUniforms: function() {
        if (Light.uniforms === undefined) {
            Light.uniforms = {};
        }
        if (Light.uniforms[this.getTypeMember()] === undefined) {
            Light.uniforms[this.getTypeMember()] = { "ambient": Uniform.createFloat4([ 0.2, 0.2, 0.2, 1], this.getParameterName("ambient")) ,
                                                     "diffuse": Uniform.createFloat4([ 0.8, 0.8, 0.8, 1], this.getParameterName('diffuse')) ,
                                                     "specular": Uniform.createFloat4([ 0.2, 0.2, 0.2, 1], this.getParameterName('specular')) ,
                                                     "direction": Uniform.createFloat3([ 0, 0, 1], this.getParameterName('direction')),
                                                     "constant_attenuation": Uniform.createFloat1([ 0], this.getParameterName('constant_attenuation')),
                                                     "linear_attenuation": Uniform.createFloat1([ 0], this.getParameterName('linear_attenuation')),
                                                     "quadratic_attenuation": Uniform.createFloat1([ 0], this.getParameterName('quadratic_attenuation')),
                                                     "enable": Uniform.createInt1([ 0], this.getParameterName('enable')),
                                                     "matrix": Uniform.createMatrix4([Matrix.identity()], this.getParameterName('matrix'))
                                                   };
        }
        return Light.uniforms[this.getTypeMember()];
    },

    getPrefix: function() {
        return this.getType() + this.light_unit;
    },

    getParameterName: function (name) {
        return this.getPrefix()+ "_" + name;
    },

    applyPositionedUniform: function(matrix, state) {
        var uniform = this.getOrCreateUniforms();
        uniform.matrix.set(matrix);
    },

    apply: function(state)
    {
        var light = this.getOrCreateUniforms();

        light.ambient.set(this.ambient);
        light.diffuse.set(this.diffuse);
        light.specular.set(this.specular);
        light.direction.set(this.direction);
        light.constant_attenuation.set(this.constant_attenuation);
        light.linear_attenuation.set(this.linear_attenuation);
        light.quadratic_attenuation.set(this.quadratic_attenuation);
        light.enable.set(this.enable);
    },

    writeShaderInstance: function(type) {
        var str = "";
        switch (type) {
        case ShaderGeneratorType.VertexInit:
            str = [ "",
                    "varying vec4 Color;",
                    "vec3 EyeVector;",
                    "vec3 NormalComputed;",
                    "",
                    "" ].join('\n');
            break;
        case ShaderGeneratorType.VertexFunction:
            str = [ "",
                    "vec3 computeNormal() {",
                    "   return vec3(NormalMatrix * vec4(Normal, 0.0));",
                    "}",
                    "",
                    "vec3 computeEyeDirection() {",
                    "   return vec3(ModelViewMatrix * vec4(Vertex,1.0));",
                    "}",
                    "",
                    "void directionalLight(in vec3 lightDirection, in vec3 lightHalfVector, in float constantAttenuation, in float linearAttenuation, in float quadraticAttenuation, in vec4 ambient, in vec4 diffuse,in vec4 specular, in vec3 normal)",
                    "{",
                    "   float nDotVP;         // normal . light direction",
                    "   float nDotHV;         // normal . light half vector",
                    "   float pf;             // power factor",
                    "",
                    "   nDotVP = max(0.0, dot(normal, normalize(lightDirection)));",
                    "   nDotHV = max(0.0, dot(normal, lightHalfVector));",
                    "",
                    "   if (nDotVP == 0.0)",
                    "   {",
                    "       pf = 0.0;",
                    "   }",
                    "   else",
                    "   {",
                    "       pf = pow(nDotHV, MaterialShininess);",
                    "",
                    "   }",
                    "   Ambient  += ambient;",
                    "   Diffuse  += vec4(diffuse.xyz * nDotVP, diffuse.w);",
                    "   Specular += vec4(specular.xyz * pf, specular.w);",
                    "}",
                    "",
                    "void flight(in vec3 lightDirection, in float constantAttenuation, in float linearAttenuation, in float quadraticAttenuation, in vec4 ambient, in vec4 diffuse, in vec4 specular, in vec3 normal)",
                    "{",
                    "    vec4 localColor;",
                    "    vec3 lightHalfVector = normalize(EyeVector-lightDirection);",
                    "    // Clear the light intensity accumulators",
                    "    Ambient  = vec4 (0.0);",
                    "    Diffuse  = vec4 (0.0);",
                    "    Specular = vec4 (0.0);",
                    "",
                    "    directionalLight(lightDirection, lightHalfVector, constantAttenuation, linearAttenuation, quadraticAttenuation, ambient, diffuse, specular, normal);",
                    "",
                    "    vec4 sceneColor = vec4(0,0,0,1);",
                    "    localColor = sceneColor +",
                    "      Ambient  * MaterialAmbient +",
                    "      Diffuse  * MaterialDiffuse;",
                    "    //localColor += Specular * MaterialSpecular;",
                    "    localColor = clamp( localColor, 0.0, 1.0 );",
                    "    Color += localColor;",
                    "",
                    "}" ].join('\n');
            break;
        case ShaderGeneratorType.VertexMain:
            str = [ "",
                    "EyeVector = computeEyeDirection();",
                    "NormalComputed = computeNormal();",
                    "Color = vec4(0,0,0,0);",
                    "" ].join('\n');
            break;
        case ShaderGeneratorType.FragmentInit:
            str = [ "varying vec4 Color;",
                    ""
                  ].join('\n');
            break;
        case ShaderGeneratorType.FragmentMain:
            str = [ "",
                    "fragColor *= Color;"
                  ].join('\n');
            break;
        }
        return str;
    },

    writeToShader: function(type)
    {
        var str = "";
        switch (type) {
        case ShaderGeneratorType.VertexInit:
            str = [ "",
                    "uniform bool " + this.getParameterName('enabled') + ";",
                    "uniform vec4 " + this.getParameterName('ambient') + ";",
                    "uniform vec4 " + this.getParameterName('diffuse') + ";",
                    "uniform vec4 " + this.getParameterName('specular') + ";",
                    "uniform vec3 " + this.getParameterName('direction') + ";",
                    "uniform float " + this.getParameterName('constantAttenuation') + ";",
                    "uniform float " + this.getParameterName('linearAttenuation') + ";",
                    "uniform float " + this.getParameterName('quadraticAttenuation') + ";",
                    "",
                    "" ].join('\n');
            break;
        case ShaderGeneratorType.VertexMain:
            var lightNameDirection = this.getParameterName('direction');
            var lightNameDirectionTmp = this.getParameterName('directionNormalized');
            var NdotL = this.getParameterName("NdotL");
            str = [ "",
                    "//if (" + this.getParameterName('enabled') + ") {",
                    "if (true) {",
                    "  vec3 " + lightNameDirectionTmp + " = normalize(" + lightNameDirection + ");",
                    "  float " + NdotL + " = max(dot(Normal, " + lightNameDirectionTmp + "), 0.0);",
                    "  flight(" +lightNameDirectionTmp +", "+ this.getParameterName("constantAttenuation") + ", " + this.getParameterName("linearAttenuation") + ", " + this.getParameterName("quadraticAttenuation") + ", " + this.getParameterName("ambient") + ", " + this.getParameterName("diffuse") + ", " + this.getParameterName("specular") + ", NormalComputed );",
                    "}",
                    "" ].join('\n');
            break;
        }
        return str;
    }
};

Light.create = function() {
    var l = new Light();
    l.ambient = [ 0.2, 0.2, 0.2, 1.0 ];
    l.diffuse = [ 0.8, 0.8, 0.8, 1.0 ];
    l.specular = [ 0.0, 0.0, 0.0, 1.0 ];
    l.direction = [ 0.0, 0.0, 1.0 ];
    l.constant_attenuation = 1.0;
    l.linea_attenuation = 1.0;
    l.quadratic_attenuation = 1.0;
    l.light_unit = 0;
    l.enabled = true;
    return l;
};


function BufferArray() {}
BufferArray.prototype = {
    init: function() {
        if (!this.buffer && this.elements.length > 0 ) {
            this.buffer = gl.createBuffer();
            this.buffer.itemSize = this.itemSize;
            this.buffer.numItems = this.elements.length / this.itemSize;
        }
    },

    compile: function() {
        if (this.dirty) {
            if (this.type === gl.ELEMENT_ARRAY_BUFFER) {
                gl.bufferData(this.type, new Uint16Array(this.elements), gl.STATIC_DRAW);
            } else {
                gl.bufferData(this.type, new Float32Array(this.elements), gl.STATIC_DRAW);
            }
            this.dirty = false;
        }
    }
};

BufferArray.create = function(type, elements, itemSize) {
    var a = new BufferArray();
    a.elements = elements;
    a.itemSize = itemSize;
    a.type = type;
    a.dirty = true;
    return a;
};


function DrawArray() {}
DrawArray.prototype = {
    draw: function(state) {
        gl.drawArrays(this.mode, this.first, this.count);
    }
};
DrawArray.create = function(mode, first, count) {
    var d = new DrawArray();
    d.mode = mode;
    d.first = first;
    d.count = count;
    return d;
};



function DrawElements() {}
DrawElements.prototype = {
    draw: function(state) {
        if (this.count > this.indices.numItems || this.count < 0) {
            this.count = this.indices.numItems;
        }
        state.setIndexArray(this.indices);
        gl.drawElements(this.mode, this.count, gl.UNSIGNED_SHORT, this.offset );
    }
};

DrawElements.create = function(mode, indices) {
    var d = new DrawElements();
    d.mode = mode;
    d.indices = indices;
    d.count = indices.elements.length;
    d.offset = 0;
    return d;
};


function Geometry() {}
Geometry.prototype = {
    drawImplementation: function(state) {
        var program = state.getLastProgramApplied().program;
        var i;
        var attribute;
        var attributeList = [];
        var operator = function(key, element) {
            attribute = gl.getAttribLocation(program, key);
            if (attribute !== -1) {
                attributeList.push(attribute);
                state.setVertexAttribArray(attribute, element, false);
            }
        };
        jQuery.each(this.attributes, operator);

        state.disableVertexAttribsExcept(attributeList);
        this.primitives.forEach(function(element, index, array) {
            element.draw(state);
        });
    }
};
Geometry.create = function() {
    var g = new Geometry();
    g.primitives = [];
    g.attributes = {};
    return g;
};

function NodeVisitor() {}
NodeVisitor.prototype = {
    apply: function ( node ) {
        this.traverse(node);
    },

    traverse: function ( node ) {
        node.traverse(this);
    }
};
NodeVisitor.create = function () {
    var nv = new NodeVisitor();
    return nv;
};


function StateGraph() {}
StateGraph.prototype = {
    findOrInsert: function (stateset)
    {
        var sg;
        if (!this.children[stateset.id]) {
            sg = StateGraph.create();
            sg.parent = this;
            sg.depth = this.depth + 1;
            sg.stateset = stateset;
            this.children[stateset.id] = sg;
        } else {
            sg = this.children[stateset.id];
        }
        return sg;
    },
    moveStateGraph: function(state, sg_current, sg_new)
    {
        var stack;
        var i;
        var stackLength;
        if (sg_new === sg_current || sg_new === undefined) {
            return;
        }

        if (sg_current === undefined) {
            stack = [];
            // push stateset from sg_new to root, and apply
            // stateset from root to sg_new
            do {
                if (sg_new.stateset !== undefined) {
                    stack.push(sg_new.stateset);
                }
                sg_new = sg_new.parent;
            } while (sg_new);

            stack.reverse();
            stackLength = stack.length;
            for (i = 0; i < stackLength; ++i) {
                state.pushStateSet(stack[i]);
            }
            return;
        } else if (sg_current.parent === sg_new.parent) {
            // first handle the typical case which is two state groups
            // are neighbours.

            // state has changed so need to pop old state.
            if (sg_current.stateset !== undefined) {
                state.popStateSet();
            }
            // and push new state.
            if (sg_new.stateset !== undefined) {
                state.pushStateSet(sg_new.stateset);
            }
            return;
        }

        // need to pop back up to the same depth as the new state group.
        while (sg_current.depth > sg_new.depth)
        {
            if (sg_current.stateset !== undefined) {
                state.popStateSet();
            }
            sg_current = sg_current.parent;
        }

        // use return path to trace back steps to sg_new.
        stack = [];

        // need to pop back up to the same depth as the curr state group.
        while (sg_new.depth > sg_current.depth)
        {
            if (sg_new.stateset !== undefined) {
                stack.push(sg_new.stateset);
            }
            sg_new = sg_new.parent;
        }

        // now pop back up both parent paths until they agree.

        // DRT - 10/22/02
        // should be this to conform with above case where two StateGraph
        // nodes have the same parent
        while (sg_current !== sg_new)
        {
            if (sg_current.stateset !== undefined) {
                state.popStateSet();
            }
            sg_current = sg_current.parent;

            if (sg_new.stateset !== undefined) {
                stack.push(sg_new.stateset);
            }
            sg_new = sg_new.parent;
        }

        stack.reverse();
        stackLength = stack.length;
        for( i = 0; i < stackLength; ++i) {
            state.pushStateSet(stack[i]);
        }
    }
};
StateGraph.create = function()
{
    var sg = new StateGraph();
    sg.depth = 0;
    sg.children = {};
    sg.leafs = [];
    sg.stateset = undefined;
    sg.parent = undefined;
    return sg;
};

function RenderBin(stateGraph) {
    this.leafs = [];
    this.stateGraph = stateGraph;
    this.positionedAttribute = [];
}
RenderBin.prototype = {
    applyPositionedAttribute: function(state, positionedAttibutes) {
        // the idea is to set uniform 'globally' in uniform map.
        jQuery.each(positionedAttibutes, function(index, element) {
                        // add or set uniforms in state
                        var stateAttribute = element[1];
                        var matrix = element[0];
                        state.setGlobalDefaultValue(stateAttribute);
                        stateAttribute.applyPositionedUniform(matrix, state);
                    }
                   );
    },

    drawImplementation: function(state) {
        var stateList = this.stateGraph;
        var stackLength = stateList.length;
        var leafs = this.leafs;
        var leafsLength = this.leafs.length;
        var normalUniform;
        var modelViewUniform;
        var projectionUniform;
        var program;
        var stateset;
        var leaf;
        var previousLeaf;

        if (this.positionedAttribute) {
            this.applyPositionedAttribute(state, this.positionedAttribute);
        }

        for (var i = 0; i < leafsLength; i++) {
//            debugger;
            leaf = leafs[i];
            var push = false;
            if (previousLeaf !== undefined) {

                // apply state if required.
                var prev_rg = previousLeaf.parent;
                var prev_rg_parent = prev_rg.parent;
                var rg = leaf.parent;
                if (prev_rg_parent !== rg.parent)
                {
                    rg.moveStateGraph(state, prev_rg_parent, rg.parent);

                    // send state changes and matrix changes to OpenGL.
                    state.pushStateSet(rg.stateset);
                    push = true;
                }
                else if (rg !== prev_rg)
                {

                    // send state changes and matrix changes to OpenGL.
                    state.pushStateSet(rg.stateset);
                    push = true;
                }

            } else {
                leaf.parent.moveStateGraph(state, undefined, leaf.parent.parent);
                state.pushStateSet(leaf.parent.stateset);
                push = true;
            }

            if (push) {
                state.pushGeneratedProgram();
                state.apply();
            }

            program = state.getLastProgramApplied().program;
            modelViewUniform = gl.getUniformLocation(program, state.modelViewMatrix.name);
            projectionUniform = gl.getUniformLocation(program, state.projectionMatrix.name);
            normalUniform = gl.getUniformLocation(program, state.normalMatrix.name);

            if (modelViewUniform !== null && modelViewUniform !== -1) {
                state.modelViewMatrix.set(leaf.modelview.elements);
                state.modelViewMatrix.apply(modelViewUniform);
            }
            if (projectionUniform !== null && projectionUniform != -1) {
                state.projectionMatrix.set(leaf.projection.elements);
                state.projectionMatrix.apply(projectionUniform);
            }
            if (normalUniform !== null && normalUniform !== -1 ) {
                var normal = leaf.modelview.copy().setTrans(Vec3.create().set(0, 0, 0)).invert().transpose();
                state.normalMatrix.set(normal);
                state.normalMatrix.apply(normalUniform);
            }

            leaf.geometry.drawImplementation(state);

            if (push) {
                state.popGeneratedProgram();
            }

            if (push === true) {
                state.popStateSet();
            }

            previousLeaf = leaf;
        }
    }
};


function CullVisitor() {}
CullVisitor.create = function()
{
    var cv = NodeVisitor.create();
    cv.modelviewMatrixStack = [Matrix.identity()];
    cv.projectionMatrixStack = [Matrix.identity()];
    cv.stateGraph = StateGraph.create();
    cv.stateGraph.stateset = StateSet.create();
    cv.currentStateGraph = cv.stateGraph;
    cv.renderBin = new RenderBin(cv.stateGraph);

    cv.addPositionedAttribute = function (attribute) {
        var sg = cv.stateGraph;
        while (sg.parent !== undefined) {
            sg = sg.parent;
        }
        var matrix = this.modelviewMatrixStack[this.modelviewMatrixStack.length - 1];
        this.renderBin.positionedAttribute.push([matrix.elements, attribute]);
    };

    cv.pushStateSet = function (stateset) {
        this.currentStateGraph = this.currentStateGraph.findOrInsert(stateset);
    };

    cv.popStateSet = function () {
        this.currentStateGraph = this.currentStateGraph.parent;
    };

    cv.pushModelviewMatrix = function (matrix) {
        var computeMatrix;
        var lastMatrix;
        lastMatrix = this.modelviewMatrixStack[this.modelviewMatrixStack.length-1].copy();
        computeMatrix = lastMatrix.multiply(matrix);
        this.modelviewMatrixStack.push(computeMatrix);
    };

    cv.popModelviewMatrix = function () {
        this.modelviewMatrixStack.pop();
    };

    cv.pushProjectionMatrix = function (matrix) {
        var computeMatrix;
        var lastMatrix;
        lastMatrix = this.projectionMatrixStack[this.projectionMatrixStack.length-1].copy();
        computeMatrix = lastMatrix.multiply(matrix);
        this.projectionMatrixStack.push(computeMatrix);
    };

    cv.popProjectionMatrix = function () {
        this.projectionMatrixStack.pop();
    };

    cv.apply = function( node ) {

        if (node.matrix) {
            this.pushModelviewMatrix(node.matrix);
        }
        if (node.projection) {
            this.pushProjectionMatrix(node.projection);
        }
        if (node.stateset) {
            this.pushStateSet(node.stateset);
        }
        if (node.light) {
            this.addPositionedAttribute(node.light);
        }
        if (node.drawImplementation) {
            var leafs = this.renderBin.leafs;
            leafs.push(
                {
                    "parent": this.currentStateGraph,
                    "modelview": this.modelviewMatrixStack[this.modelviewMatrixStack.length-1],
                    "projection": this.projectionMatrixStack[this.projectionMatrixStack.length-1],
                    "geometry": node
                }
            );
        }

        if (node.traverse) {
            this.traverse(node);
        }

        if (node.stateset) {
            this.popStateSet();
        }
        if (node.matrix) {
            this.popModelviewMatrix();
        }
        if (node.projection) {
            this.popProjectionMatrix();
        }
    };
    return cv;
};


function ParseSceneGraph(node)
{
    var newnode;
    if (node.primitives) {
        newnode = Geometry.create();
        jQuery.extend(newnode, node);
        node = newnode;

        var i;
        for ( i in node.primitives) {
            if (node.primitives[i].indices) {
                var array = node.primitives[i].indices;
                array = BufferArray.create(gl[array.type], array.elements, array.itemSize );
                var mode;
                if (!node.primitives[i].mode) {
                    mode = gl.TRIANGLES;
                } else {
                    mode = gl[node.primitives[i].mode];
                }
                node.primitives[i] = DrawElements.create(mode, array);
            }
        }
    }


    if (node.attributes) {
        jQuery.each(node.attributes, function( key, element) {
                        var attributeArray = node.attributes[key];
                        node.attributes[key] = BufferArray.create(gl[attributeArray.type], attributeArray.elements, attributeArray.itemSize );
                    }
                   );
    }

    if (node.stateset) {
        var newstateset = StateSet.create();
        if (node.stateset.textures) {
            var textures = node.stateset.textures;
            for (var t = 0; t < textures.length; t++) {
                if (textures[t] === undefined) {
                    continue;
                }
                if (!textures[t].file) {
                    if (console !== undefined) {
                        console.log("no 'file' field for texture " + textures[t]);
                    }
                }
                var tex = Texture.create(textures[t].file);
                newstateset.setTexture(t, tex);
                newstateset.addUniform(Uniform.createInt1(t,"TexUnit" + t));
            }
        }
        if (node.stateset.material) {
            var material = node.stateset.material;
            var newmaterial = Material.create();
            jQuery.extend(newmaterial, material);
            newstateset.setAttribute(newmaterial);
        }
        node.stateset = newstateset;
    }

    var matrix;
    if (node.matrix) {
        matrix = Matrix.create().set(node.matrix);
        node.matrix = matrix;
    }

    if (node.projection) {
        matrix = Matrix.create().set(node.projection);
        node.projection = matrix;
    }

    if (node.children) {
        newnode = Node.create();
        jQuery.extend(newnode, node);
        node = newnode;

        var child;
        var childLength = node.children.length;
        for (child = 0; child < childLength; child++) {
            node.children[child] = ParseSceneGraph(node.children[child]);
        }
    }

    return node;
}




function createRenderGeometry()
{
    var geom = Geometry.create();
    var elements = [];
    elements.push(0, 0, 0);
    elements.push(0, 1, 0);
    elements.push(1, 1, 0);
    elements.push(0, 0, 0);
    elements.push(1, 1, 0);
    elements.push(1, 0, 0);

    var uvs = [];
    uvs.push(0, 0);
    uvs.push(0, 1);
    uvs.push(1, 1);
    uvs.push(0, 0);
    uvs.push(1, 1);
    uvs.push(1, 0);

    geom.attributes.Vertex = BufferArray.create(gl.ARRAY_BUFFER, elements, 3 );
    geom.attributes.TexCoord0 = BufferArray.create(gl.ARRAY_BUFFER, uvs, 2 );
    geom.primitives.push(DrawArray.create(gl.TRIANGLES,0,elements.length/3));
    return geom;
}

function ComputeSpawnBuffer() {
    this.scene = undefined;
    this.stateSet = undefined;
}

ComputeSpawnBuffer.prototype = {
    init: function() {
        var node = Node.create();
        node.projection =  Matrix.create().makeOrtho(0,1,0,1,-1,1);

        var geom = createRenderGeometry();
        geom.stateset = StateSet.create();
        node.children.push(geom);

        var vertexshader = [
            "",
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "attribute vec3 Vertex;",
            "attribute vec2 TexCoord0;",
            "uniform mat4 ProjectionMatrix;",
            "varying vec2 FragTexCoord0;",
            "void main(void) {",
            "  vec2 uv = vec2(Vertex.x, Vertex.y);",
            "  gl_Position = ProjectionMatrix * vec4(Vertex, 1.0);",
            "  FragTexCoord0 = TexCoord0;",
            "}",
            ""
        ].join('\n');

        var fragmentshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "varying vec2 FragTexCoord0;",
            "uniform sampler2D TexUnit0;",
            "uniform sampler2D TexUnit1;",
            "uniform int bits;",
            "void main(void) {",
            "   vec4 final;",
            "   if (bits == 0)",
            "      final = texture2D( TexUnit0, vec2(FragTexCoord0.x, FragTexCoord0.y));",
            "   else",
            "      final = texture2D( TexUnit1, vec2(FragTexCoord0.x, FragTexCoord0.y));",
            "   gl_FragColor = final;",
            "}",
            ""
        ].join('\n');
        // low = color / 256 * 256
        // high = color / 256 * 65536
        // final = high + low
        var program = Program.create(
            Shader.create(gl.VERTEX_SHADER, vertexshader),
            Shader.create(gl.FRAGMENT_SHADER, fragmentshader));
        geom.stateset.setAttribute(program);
        this.lowUniform = Uniform.createInt1(0, "bits");
        geom.stateset.addUniform(this.lowUniform);
        geom.stateset.addUniform(Uniform.createInt1(0, "TexUnit0"));
        geom.stateset.addUniform(Uniform.createInt1(1, "TexUnit1"));

        this.scene = node;
        this.stateSet = geom.stateset;
    },

    setLow: function(low) {
        this.lowUniform.set([low]);
    },

    setMesh: function(textures) {
        this.stateSet.setTextureAttribute(0, textures[0]);
        this.stateSet.setTextureAttribute(1, textures[1]);
    }
};

ComputeSpawnBuffer.create = function() {
    var cp = new ComputeSpawnBuffer();
    cp.init();
    return cp;
};


function ComputeParticlesMotion() {
    this.scene = undefined;
    this.stateSet = undefined;
}
ComputeParticlesMotion.prototype = {
    init: function() {
        var node = Node.create();
        node.projection = Matrix.create().makeOrtho(0,1,0,1,-1,1);

        var geom = Geometry.create();
        var elements = [];
        elements.push(0, 0, 0);
        elements.push(0, 1, 0);
        elements.push(1, 1, 0);
        elements.push(0, 0, 0);
        elements.push(1, 1, 0);
        elements.push(1, 0, 0);

        var uvs = [];
        uvs.push(0, 0);
        uvs.push(0, 1);
        uvs.push(1, 1);
        uvs.push(0, 0);
        uvs.push(1, 1);
        uvs.push(1, 0);

        geom.attributes.Vertex = BufferArray.create(gl.ARRAY_BUFFER, elements, 3 );
        geom.attributes.TexCoord0 = BufferArray.create(gl.ARRAY_BUFFER, uvs, 2 );
        geom.primitives.push(DrawArray.create(gl.TRIANGLES,0,elements.length/3));
        geom.stateset = StateSet.create();
        node.children.push(geom);

        var vertexshader = [
            "",
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "attribute vec3 Vertex;",
            "attribute vec2 TexCoord0;",
            "uniform mat4 ProjectionMatrix;",
            "varying vec2 FragTexCoord0;",
            "void main(void) {",
            "  vec2 uv = vec2(Vertex.x, Vertex.y);",
            "  gl_Position = ProjectionMatrix * vec4(Vertex, 1.0);",
            "  FragTexCoord0 = TexCoord0;",
            "}",
            ""
        ].join('\n');

        var fragmentshaderGravity = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "uniform float time;",
            "uniform float restoreTime;",
            "uniform int physics;",
            "uniform float deltaTime;",
            "varying vec2 FragTexCoord0;",
            "uniform sampler2D TexUnit0;",
            "uniform sampler2D TexUnit1;",
            "uniform sampler2D TexUnit2;",
            "uniform sampler2D TexUnit3;",
            "uniform sampler2D TexUnit4;",
            "uniform sampler2D TexUnit5;",
            "uniform sampler2D TexUnit6;",
            "uniform vec2 mousePosition;",
            "uniform int explode;",
            "uniform int absorb;",
            "uniform int restore;",
            "uniform int remain;",
            "uniform int bits;",
            "uniform int bufferNo;",
            "float scale = 0.75;",
            "float alpha = 1.0;",
            "vec3 getSource() {",
            "   vec4 p0 = texture2D( TexUnit4, vec2(FragTexCoord0.x, FragTexCoord0.y));",
            "   vec4 p1 = texture2D( TexUnit5, vec2(FragTexCoord0.x, FragTexCoord0.y));",
            "   return ((p1 * 65280.0 + p0*256.0) / 65535.0).xyz;",
            "}",
            "vec3 verlet2(vec3 currentGlobalSpace, vec3 prevGlobalSpace, vec3 force, float dt) {",
            "   vec3 velocity = currentGlobalSpace-prevGlobalSpace;",
            "   vec3 current = currentGlobalSpace - vec3(0.5, 0.5, -0.5);",
            "   vec3 acceleration = vec3( 0.0, -9.81, 0.0);",
            "   if (restore == 0 && explode == 1) {",
            "      float maxRadiusSqr = 0.25;",
            "      vec3 mouse3d = vec3( mousePosition.x, mousePosition.y, current.z);",
            "      vec3 dcenter = mouse3d - current.xyz;",
            "      float strength = 0.0;",
            "      vec3 counterForce = vec3(0.0, 0.0, 0.0);",
            "      if (dot(dcenter, dcenter) < maxRadiusSqr) { ",
            "          strength = (maxRadiusSqr - dot(dcenter, dcenter)) / maxRadiusSqr;",
            "          vec3 dir = normalize(-dcenter);",
            "          if (dir.y < 0.0)",
            "             dir.y = -dir.y;",
            "          counterForce = strength * 80.0 * dir;",
            "      }",
            "      acceleration = acceleration + counterForce;",
            "   }",
            "   vec3 ori = vec3( 0.5, 0.5, 0.5) + scale * (-vec3( 0.5, 0.5, 0.5) + getSource());",
            "   if (restore==0 && absorb == 1) {",
            "      vec3 dist = ori - currentGlobalSpace;",
            "      acceleration = acceleration + dist * (dot(dist,dist)) * 100.0;",
            "   }",
            "   if (remain == 1) {",
            "      acceleration.y+= 5.81;",
            "      vec3 dist = ori - (currentGlobalSpace + velocity + (acceleration * (dt*dt)));",
            "      velocity += dist*0.2*dt;",
            "   }",
            "   if (restore == 1) {",
            "      acceleration.y+= 4.0;",
            "      //acceleration = vec3(0.0,0.0,0.0);",
            "      vec3 dist = (ori - currentGlobalSpace);",
            "      float ratio = 1.0;",
            "      vec4 color = texture2D( TexUnit6, vec2(FragTexCoord0.x, FragTexCoord0.y));",

            "      float duration = 10.0 * ( 1.0 + 2.0*( (abs(0.5- FragTexCoord0.x) + (5.0*abs(0.5-FragTexCoord0.y)))) );",
            "      if (restoreTime < duration) {",
            "         ratio = 1.0 - (duration - restoreTime)/duration;",
            "      } else {",
            "         return ori;",
            "      }",
            "      // have a try to change how ratio evolve to 1.0",
            "      //ratio = ratio;",
            "      //ratio = ratio*ratio;",
            "      ratio = ratio*ratio*ratio;",
            "      //ratio = sin(ratio*3.14*.5);",
            "      vec3 tt = (1.0-ratio)*(currentGlobalSpace + velocity + (acceleration * (dt*dt))) + ori*ratio;",
            "      return tt;",
            "   }",
            "   velocity.y *= 0.99;",
            "   vec3 result = currentGlobalSpace + velocity + (acceleration * (dt*dt));",
            "   return result;",
            "}",
            "void main(void) {",
            "   float lifeScale = 10.0;",
            "   vec4 p0 = texture2D( TexUnit0, vec2(FragTexCoord0.x, FragTexCoord0.y));",
            "   vec4 p1 = texture2D( TexUnit1, vec2(FragTexCoord0.x, FragTexCoord0.y));",
            "   vec4 position = ((p1 * 65280.0 + p0*256.0) / 65535.0);",
            "   vec4 pp0 = texture2D( TexUnit2, vec2(FragTexCoord0.x, FragTexCoord0.y));",
            "   vec4 pp1 = texture2D( TexUnit3, vec2(FragTexCoord0.x, FragTexCoord0.y));",
            "   vec4 previousPosition = ((pp1 * 65280.0 + pp0*256.0) / 65535.0);",
            "",
            "   vec3 vcenter = vec3( 0.5, 0.5, 0.5) - position.xyz;",
            "   vec3 newPosition;",
            "   if (physics == 1) {",
            "     float d2 = dot(vcenter,vcenter);",
            "     vec3 force = 1.0 * vcenter * 0.005/(0.9 * d2);",
            "     newPosition = verlet2(position.xyz, previousPosition.xyz, force , deltaTime);",
            "   } else {",
            "     newPosition = position.xyz;",
            "   }",
            "   float life = position.w;",
            "   life = life - deltaTime/lifeScale;",
            "   if (time < 0.001 && bufferNo < 3) {",
            "      newPosition =  vec3( 0.5, 0.5, 0.5) + scale * (-vec3( 0.5, 0.5, 0.5) + getSource());",
            "      //newPosition =  0.5 * getSource() + vec3(0.25,0.25,0.25);",
            "      vec3 vc2 = vec3( 0.5, 0.5, 0.5) - newPosition.xyz;",
            "      float d = dot(vc2,vc2);",
            "      float v = abs(FragTexCoord0.x*.0049) * 0.04/sqrt(d);",
            "      vec3 vc = normalize(vc2);",
            "      vec3 vf = cross(vec3( 0.0, 1.0, 0.0), vc);",
            "      //newPosition += vf * bufferNo * v;",
            "      life = 0.5 + abs(FragTexCoord0.x*.49);",
            "   }",
            "",
            "   vec4 highValue0 = vec4(newPosition,alpha ) * 65535.0 / 256.0;",
            "   vec4 frag;",
            "   if (bits == 0) {",
            "      vec4 lowValue = (highValue0 - floor(highValue0));",
            "      frag = lowValue;",
            "   } else {",
            "      vec4 highValue = floor(highValue0) / 255.0;",
            "      frag = highValue;",
            "   }",
            "   gl_FragColor = frag;",
            "}",
            ""
        ].join('\n');

        var program2 = Program.create(
            Shader.create(gl.VERTEX_SHADER, vertexshader),
            Shader.create(gl.FRAGMENT_SHADER, fragmentshaderGravity));


        geom.stateset.setAttribute(program2);
        this.timeUniform = Uniform.createFloat1(0.0, "time");
        this.deltaTime = Uniform.createFloat1(0.01, "deltaTime");
        this.lowUniform = Uniform.createInt1(0, "bits");
        this.bufferNo = Uniform.createInt1(0, "bufferNo");
        this.pinch = Uniform.createInt1(0, "explode");
        this.absorb = Uniform.createInt1(1, "absorb");
        this.remain = Uniform.createInt1(0, "remain");
        this.restore = Uniform.createInt1(0, "restore");
        this.restoreTime = Uniform.createFloat1(0, "restoreTime");
        this.physics = Uniform.createInt1(0, "physics");
        this.mouse = Uniform.createFloat2([0,0], "mousePosition");

        geom.stateset.addUniform(this.deltaTime);
        geom.stateset.addUniform(this.timeUniform);
        geom.stateset.addUniform(this.lowUniform);
        geom.stateset.addUniform(this.bufferNo);
        geom.stateset.addUniform(this.pinch);
        geom.stateset.addUniform(this.physics);
        geom.stateset.addUniform(this.mouse);
        geom.stateset.addUniform(this.absorb);
        geom.stateset.addUniform(this.remain);
        geom.stateset.addUniform(this.restore);
        geom.stateset.addUniform(this.restoreTime);

        geom.stateset.addUniform(Uniform.createInt1(0, "TexUnit0"));
        geom.stateset.addUniform(Uniform.createInt1(1, "TexUnit1"));
        geom.stateset.addUniform(Uniform.createInt1(2, "TexUnit2"));
        geom.stateset.addUniform(Uniform.createInt1(3, "TexUnit3"));
        geom.stateset.addUniform(Uniform.createInt1(4, "TexUnit4"));
        geom.stateset.addUniform(Uniform.createInt1(5, "TexUnit5"));
        geom.stateset.addUniform(Uniform.createInt1(6, "TexUnit6"));

        this.scene = node;
        this.stateSet = geom.stateset;
    },
    setSpawnPosition: function(textures) {
        this.stateSet.setTextureAttribute(4, textures[0]);
        this.stateSet.setTextureAttribute(5, textures[1]);
    },
    setSourcePositionTexture: function(textures) {
        this.stateSet.setTextureAttribute(0, textures[0]);
        this.stateSet.setTextureAttribute(1, textures[1]);
    },
    setColorTexture: function(texture) {
        this.stateSet.setTextureAttribute(6, texture);
    },
    setSourcePreviousPositionTexture: function(textures) {
        this.stateSet.setTextureAttribute(2, textures[0]);
        this.stateSet.setTextureAttribute(3, textures[1]);
    },
    setLow: function(low) {
        this.lowUniform.set([low]);
    },
    setBufferNo: function(no) {
        this.bufferNo.set([no]);
    },
    setPinch: function(value) {
        this.pinch.set([value]);
    },
    setAbsorb: function(value) {
        this.absorb.set([value]);
    },
    setRemain: function(value) {
        this.remain.set([value]);
    },
    setPhysics: function(value) {
        this.physics.set([value]);
    },
    setMouse: function(value) {
        this.mouse.set(value);
    },
    setRestoreTime: function(value) {
        this.restore.set([1]);
        this.restoreTime.set([value]);
    },

    update: function() {
        var date = new Date();
        var currentTime = date.getTime()/1000.0;
        if (!this.previousTime) {
            this.firstTime = currentTime;
            this.previousTime = currentTime;
        }
        //this.deltaTime.set([currentTime - this.previousTime]);
        this.timeUniform.set([currentTime - this.firstTime]);
        this.previousTime = currentTime;
        //console.log("dt " + this.deltaTime.data[0]);
    }

};
ComputeParticlesMotion.create = function() {
    var cp = new ComputeParticlesMotion();
    cp.init();
    return cp;
};

function RenderParticles() {}
RenderParticles.prototype = {
    init: function() {
        var node = Node.create();
        var geom = Geometry.create();
        var elements = [];
        var y = 0;
        var sizex = 512;
        var sizey = 512;
        var i;
        for (i = 0; i < sizex; i++) {
            for (var j = 0; j < sizey; j++) {
                elements.push(i/sizex, j/sizey, 0);
            }
        }

        geom.attributes.Vertex = BufferArray.create(gl.ARRAY_BUFFER, elements, 3 );
        geom.primitives.push(DrawArray.create(gl.POINTS,0,elements.length/3));
        geom.stateset = StateSet.create();
        node.children.push(geom);

        var vertexshader = [
            "",
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "attribute vec3 Vertex;",
            "uniform mat4 ModelViewMatrix;",
            "uniform mat4 ProjectionMatrix;",
            "uniform sampler2D TexUnit0;",
            "uniform sampler2D TexUnit1;",
            "uniform sampler2D TexUnit2;",
            "uniform vec4 test[2];",
            "varying vec4 color;",
            "void main(void) {",
            "  vec2 uv = vec2(Vertex.x, Vertex.y);",
            "  vec4 p0 = texture2D( TexUnit0, uv);",
            "  vec4 p1 = texture2D( TexUnit1, uv);",
            "  vec4 p = (p1 * 65280.0 + p0 * 256.0) / 65535.0;",
            "  vec4 v;",
            "  v[0] = (p[0] - 0.5) * 5.0;",
            "  v[1] = (p[1] - 0.5) * 5.0;",
            "  v[2] = (p[2] - 0.5) * 5.0;",
            "  v[3] = 1.0;",
            "  gl_Position = ProjectionMatrix * ModelViewMatrix * v;",
            "  int idx = int(mod(floor(Vertex.x*4.0), 2.0));",
            "  color = texture2D( TexUnit2, uv);",
            "  color *= color.a * p.w;",
            "  gl_PointSize = 1.0;",
            "}",
            ""
        ].join('\n');

        var fragmentshader = [
            "",
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "varying vec4 color;",
            "void main(void) {",
            "vec4 c = color;",
            "c *= 0.8;",
            "gl_FragColor = c;",
            "}",
            ""
        ].join('\n');

        var program = Program.create(
            Shader.create(gl.VERTEX_SHADER, vertexshader),
            Shader.create(gl.FRAGMENT_SHADER, fragmentshader));
        geom.stateset.setAttribute(program);

        var array = [];
        array.push(0.1,0.1,0.4,1);
        array.push(0.1,0.1,0.4,1);

        geom.stateset.addUniform(Uniform.createFloat4(array, "test"));

        geom.stateset.addUniform(Uniform.createInt1(0,"TexUnit0"));
        geom.stateset.addUniform(Uniform.createInt1(1,"TexUnit1"));
        geom.stateset.addUniform(Uniform.createInt1(2,"TexUnit2"));

        this.stateSet = geom.stateset;
        this.scene = node;
    },

    setPositionTexture: function(textures) {
        this.stateSet.setTexture(0, textures[0]);
        this.stateSet.setTexture(1, textures[1]);
    },

    setColorTexture: function(texture) {
        this.stateSet.setTexture(2, texture);
    }
};
RenderParticles.create = function()
{
    var particles = new RenderParticles();
    particles.init();
    return particles;
};

var MotionEnabled=0;
var DefaultImage;

function Particles() {
    this.currentTexture = 0;
    this.textures = [];
    this.rttFramebuffers = [];

    this.textureWidth = 512;
    this.textureHeight = 512;
    this.imageReady = {};
    this.defaultImage = undefined;
}
Particles.prototype = {

    createTexture: function() {
        var texture = Texture.createFromImg(DefaultImage);
        texture.mag_filter = gl.NEAREST;
        texture.min_filter = gl.NEAREST;
        return texture;
    },

    imageAreReady: function() {
        if (this.imageReady['particles/file_low.png'] === true &&
            this.imageReady['particles/file_high.png'] === true) {
            return true;
        }
        return false;
    },

    getTextureFromName: function(name) {
        var img = new Image();
        var that = this;
        img.onload = function() {
            //alert("loaded");
            that.imageReady[name] = true;
        };
        img.src = name;
        var texture = Texture.createFromImg(img);
        texture.mag_filter = gl.NEAREST;
        texture.min_filter = gl.NEAREST;
        return texture;
    },

    createRttCamera: function(texture) {
        var cam = new Camera.create();
        cam.init();
        cam.setRenderTargetImplementation(RenderTargetImplementationType.FRAME_BUFFER_OBJECT);
        cam.setRenderTarget(texture);
        return cam;
    },

    createRttFrameBuffer: function(texture) {
        texture.apply(undefined);

        var rttFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.textureObject, 0);

        rttFramebuffer.width = this.textureWidth;
        rttFramebuffer.height = this.textureHeight;

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return rttFramebuffer;
    },

    createPostEffectScene: function() {
        var node = Node.create();
        node.projection = Matrix.create().makeOrtho(0,1,0,1,-1,1);

        var geom = Geometry.create();
        var elements = [];
        elements.push(0, 0, 0);
        elements.push(0, 1, 0);
        elements.push(1, 1, 0);
        elements.push(0, 0, 0);
        elements.push(1, 1, 0);
        elements.push(1, 0, 0);

        geom.attributes.Vertex = BufferArray.create(gl.ARRAY_BUFFER, elements, 3 );
        geom.primitives.push(DrawArray.create(gl.TRIANGLES,0,elements.length/3));
        geom.stateset = StateSet.create();
        node.children.push(geom);

        var vertexshader = [
            "",
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "attribute vec3 Vertex;",
            "uniform mat4 ProjectionMatrix;",
            "void main(void) {",
            "  gl_Position = ProjectionMatrix * vec4(Vertex, 1.0);",
            "}",
            ""
        ].join('\n');

        var fragmentshader = [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "void main(void) {",
            "   gl_FragColor = vec4( 0.0, 0.0, 0.0, 0.4);",
            "}",
            ""
        ].join('\n');

        var program = Program.create(
            Shader.create(gl.VERTEX_SHADER, vertexshader),
            Shader.create(gl.FRAGMENT_SHADER, fragmentshader));


        geom.stateset.setAttribute(program);
        return node;
    },

    init: function() {
        this.computeParticles = ComputeParticlesMotion.create();
        this.renderParticles = RenderParticles.create();
        this.computeSpawnBuffer = ComputeSpawnBuffer.create();
        this.postEffect = this.createPostEffectScene();

        root.addChild(this.renderParticles.scene);


        // double buffer create 16 bits buffers and rtt
        for (var i = 0; i < 3; ++i) {
            var low = this.createTexture();
            var fblow = this.createRttFrameBuffer(low);

            var high = this.createTexture();
            var fbhigh = this.createRttFrameBuffer(high);

            this.textures.push([low, high]);
            this.rttFramebuffers.push([fblow, fbhigh]);
        }

        // create 16 bits spawn buffer
        var spawnLow = this.createTexture();
        var spawnHigh = this.createTexture();
        var fbSpawnLow = this.createRttFrameBuffer(spawnLow);
        var fbSpawnHigh = this.createRttFrameBuffer(spawnHigh);
        this.spawnTextures = [spawnLow, spawnHigh];
        this.spawnFrameBuffers = [fbSpawnLow, fbSpawnHigh];
        this.spawnSources = [ this.getTextureFromName("particles/file_low.png"),    
                              this.getTextureFromName("particles/file_high.png")];
        this.sourceColorTexture = this.getTextureFromName("particles/chrome-a_512.png");
        this.computeParticles.setColorTexture(this.sourceColorTexture);
    },

    update: function() {
        this.currentTexture = (this.currentTexture + 1) % this.textures.length;
    },

    renderToFrameBuffer16Bits: function(fbs, classObject) {
        var fb;
        for (var i = 0; i < 2; ++i) {
            fb = fbs[i];
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

            gl.viewport(0, 0, fb.width, fb.height);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.disable(gl.DEPTH_TEST);

            classObject.setLow(i);
            // draw quad to generate texture
            var cull = CullVisitor.create();
            cull.apply(classObject.scene);
            cull.renderBin.drawImplementation(state);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    },

    initComputeBuffers: function() {
        for (var i = 0; i < 3; ++i) {
            this.computeParticles.setBufferNo(i);
            this.computeInternal(i);
        }
        this.computeParticles.setBufferNo(4);
    },

    computeInternal: function(currentIndex) {
        gl.disable(gl.BLEND);
        //this.generateSpawnBuffer();
        //this.computeParticles.setSpawnPosition(this.spawnTextures);
        this.computeParticles.setSpawnPosition(this.spawnSources);
        // set previous texture
        var previousPositionTexture = this.textures[(currentIndex + this.textures.length - 2) % this.textures.length];
        var currentPositionTexture = this.textures[(currentIndex + this.textures.length - 1) % this.textures.length];

        this.computeParticles.setSourcePreviousPositionTexture(previousPositionTexture);
        this.computeParticles.setSourcePositionTexture(currentPositionTexture);
        var rttFramebuffers = this.rttFramebuffers[currentIndex % this.textures.length];
        this.renderToFrameBuffer16Bits(rttFramebuffers,this.computeParticles);
    },

    compute: function() {
        this.computeParticles.update();
        this.computeInternal(this.currentTexture);
    },

    generateSpawnBuffer: function() {
        this.computeSpawnBuffer.setMesh(this.spawnSources);
        this.renderToFrameBuffer16Bits(this.spawnFrameBuffers, this.computeSpawnBuffer);
    },

    render: function() {
        this.renderParticles.setPositionTexture(this.textures[this.currentTexture]);
        this.renderParticles.setColorTexture(this.sourceColorTexture);
        gl.enable(gl.BLEND);
        //gl.enable(gl.DEPTH_TEST);
        gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
        var cull;
        if (MotionEnabled == 1) {
            gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
            cull = CullVisitor.create();
            cull.apply(this.postEffect);
            cull.renderBin.drawImplementation(state);
        } else {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }

        gl.blendFunc(gl.SRC_ALPHA,gl.DST_ALPHA);
        cull = CullVisitor.create();
        cull.apply(root);
        cull.renderBin.drawImplementation(state);
        gl.blendFunc(gl.ONE,gl.ZERO);
    }
};
Particles.create = function() {
    var c = new Particles();
    c.init();
    return c;
};


RenderTargetImplementationType = {
    FRAME_BUFFER_OBJECT: 0,
    FRAME_BUFFER: 1
};

function Camera() {}
Camera.prototype = {

    init: function() {
        this.renderTargetImplementation = RenderTargetImplementationType.FRAME_BUFFER;
    },

    setViewport: function(x ,y, width, height) {
        this.viewport = [x, y, width, height];
    },

    setClearColor: function(color) {
        this.clearColor = color;
    },

    setClearMask: function(clearBits) {
        this.clearBits = clearBits;
    },

    setViewMatrix: function(matrix) {
        this.modelviewMatrix = matrix;
    },

    setProjectionMatrix: function(matrix) {
        this.projectionMatrix = matrix;
    },

    setRenderTargetImplementation: function(implementation) {
        this.renderTargetImplementation = implementation;
    },

    setRenderTarget: function(target) {
        this.renderTarget = target;
    },

    createFrameBufferObject: function(texture) {
        texture.apply(undefined);
        var rttFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.textureObject, 0);

        rttFramebuffer.width = this.textureWidth;
        rttFramebuffer.height = this.textureHeight;

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return rttFramebuffer;
    }
};

Camera.create = function() {
    var cam = new Camera();
    cam.setViewport(0, 0, 800, 600);
    cam.setClearColor([0, 0, 0, 0]);
    cam.setClearMask(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    cam.setViewMatrix(Matrix.identity());
    cam.setProjectionMatrix(Matrix.identity());
    return a;
};




var particlesSystem;
var NoFrame = 0;
var firstTime = true;
var PinchFrame = 0;
var AbsorbFrame = 0;
var EnableRemain;
var DisableRemain;
var NotReady=true;
var Ready=false;
var RestoreLogoTime=15.0;
var StartTime;

function drawScene()
{
    if (NotReady) {
        DefaultImage = new Image();
        DefaultImage.onload = function() {
            Ready = true;
        };
        DefaultImage.src="particles/file_low.png";
        NotReady=false;
    }
    if (!Ready) {
        return;
    }

    if (!particlesSystem) {
        //gl.enable(gl.SAMPLE_COVERAGE);

        particlesSystem = Particles.create();

        if (!DisableRemain) {
            DisableRemain = function() {
                particlesSystem.computeParticles.setRemain(0);
                setTimeout(EnableRemain, 20000);
            };
        }
        if (!EnableRemain) {
            EnableRemain = function() {
                particlesSystem.computeParticles.setRemain(1);
                setTimeout(DisableRemain, 20000);
            };
        }

        setTimeout(EnableRemain, 20000);
    }

    if (firstTime === true && particlesSystem.imageAreReady() === true) {
        StartTime = (new Date).getTime();
        particlesSystem.initComputeBuffers();
        particlesSystem.render();
        var myObject = document.querySelector("canvas");
        jQuery(myObject).click(
            function(e) {
                var posx = 0;
	        var posy = 0;
	        if (!e) {
                    e = window.event;
                }
	        if (e.pageX || e.pageY) {
		    posx = e.pageX;
		    posy = e.pageY;
	        }
	        else if (e.clientX || e.clientY) {
		    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		    posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	        }

                var divGlobalOffset = function ElementPosition(obj) {
                    var x=0, y=0;
                    x = obj.offsetLeft;
                    y = obj.offsetTop;
                    var body = document.getElementsByTagName('body')[0];
                    while (obj.offsetParent && obj!=body){
                        x += obj.offsetParent.offsetLeft;
                        y += obj.offsetParent.offsetTop;
                        obj = obj.offsetParent;
                    }
                    return [x,y];
                };
	        // posx and posy contain the mouse position relative to the document
	        // Do something with this information
                var globalOffset = divGlobalOffset(myObject);
                posx = (posx - globalOffset[0]) / myObject.width - 0.5;
                posy = -0.6 * ((posy - globalOffset[1] ) / myObject.height - 0.5);

                particlesSystem.computeParticles.setPinch(1);
                particlesSystem.computeParticles.setPhysics(1);
                PinchFrame = NoFrame;
                jQuery("#mousex").text(posx);
                jQuery("#mousey").text(posy);
                particlesSystem.computeParticles.setMouse([posx, posy]);

                if (MotionEnabled === 0) {
                    MotionEnabled=1;
                }

                if (PinchFrame === 0 ) {
                    setTimeout(function() {
                        particlesSystem.computeParticles.setPinch(1);
                    }, 1000);
                }
            });

        firstTime = false;
    }

    if (particlesSystem.imageAreReady() === true) {
        particlesSystem.update();
        particlesSystem.compute();
        particlesSystem.render();

        if (PinchFrame + 2 < NoFrame ) {
            particlesSystem.computeParticles.setPinch(0);
        }


        var current = (new Date).getTime() - StartTime;
        if (current > RestoreLogoTime * 1000) {
            var t = (current/1000.0) - RestoreLogoTime;
            jQuery("#restoreTime").text(t);
            particlesSystem.computeParticles.setRestoreTime(t);
        }
    }

    NoFrame++;
}



function Matrix() { this.elements = Array(16); }

Matrix.prototype = {
    set: function(array) {
        var i;
        for (i = 0; i < 16; i++)
            this.elements[i] = array[i];
        return this;
    },
    setRow: function(row, v0, v1, v2, v3) {
        var rowIndex = row*4;
        this.elements[rowIndex + 0 ] = v0;
        this.elements[rowIndex + 1 ] = v1;
        this.elements[rowIndex + 2 ] = v2;
        this.elements[rowIndex + 3 ] = v3;
    },
    innerProduct: function(a, b, r, c) {
        var rIndex = r * 4;
        return ((a[rIndex + 0] * b[0 + c]) + (a[rIndex + 1] * b[4 + c]) + (a[rIndex +2] * b[8 + c]) + (a[rIndex + 3] * b[12 + c]));
    },

    get: function(row, col) {
        return this.elements[row * 4 + col];
    },

    makeIdentity: function() {
        this.setRow(0,    1, 0, 0, 0 );
        this.setRow(1,    0, 1, 0, 0 );
        this.setRow(2,    0, 0, 1, 0 );
        this.setRow(3,    0, 0, 0, 1 );
        return this;
    },

    makeTranslate: function(x, y, z) {
        this.setRow(0,    1, 0, 0, 0 );
        this.setRow(1,    0, 1, 0, 0 );
        this.setRow(2,    0, 0, 1, 0 );
        this.setRow(3,    x, y, z, 1 );
        return this;
    },

    setTrans: function( vector) {
        this.elements[12] = vector.elements[0];
        this.elements[13] = vector.elements[1];
        this.elements[14] = vector.elements[2];
        return this;
    },

    preMult: function(other) {
        var t = Array(4);
        for (var col = 0; col < 4; col++) {
            t[0] = this.innerProduct(other.elements, this.elements, 0, col);
            t[1] = this.innerProduct(other.elements, this.elements, 1, col);
            t[2] = this.innerProduct(other.elements, this.elements, 2, col);
            t[3] = this.innerProduct(other.elements, this.elements, 3, col);
            this.elements[0 + col] = t[0];
            this.elements[4 + col] = t[1];
            this.elements[8 + col] = t[2];
            this.elements[12 + col] = t[3];
        }
        return this;
    },

    postMult: function(other) {
        var t = Array(4);
        for (var row = 0; row < 4; row++) {
            t[0] = this.innerProduct(this.elements, other.elements, row, 0);
            t[1] = this.innerProduct(this.elements, other.elements, row, 1);
            t[2] = this.innerProduct(this.elements, other.elements, row, 2);
            t[3] = this.innerProduct(this.elements, other.elements, row, 3);
            this.setRow(row, t[0], t[1], t[2], t[3]);
        }
        return this;
    },

    multiply: function(right) {
        return this.preMult(right);
    },

    makeRotate: function (angle, x, y, z) {
        var mag = Math.sqrt(x*x + y*y + z*z);
        var sinAngle = Math.sin(angle * Math.PI / 180.0);
        var cosAngle = Math.cos(angle * Math.PI / 180.0);

        if (mag > 0) {
            var xx, yy, zz, xy, yz, zx, xs, ys, zs;
            var oneMinusCos;
            var rotMat;
            mag = 1.0/mag;

            x *= mag;
            y *= mag;
            z *= mag;

            xx = x * x;
            yy = y * y;
            zz = z * z;
            xy = x * y;
            yz = y * z;
            zx = z * x;
            xs = x * sinAngle;
            ys = y * sinAngle;
            zs = z * sinAngle;
            oneMinusCos = 1.0 - cosAngle;

            this.elements[0] = (oneMinusCos * xx) + cosAngle;
            this.elements[1] = (oneMinusCos * xy) - zs;
            this.elements[2] = (oneMinusCos * zx) + ys;
            this.elements[3] = 0.0;

            this.elements[4] = (oneMinusCos * xy) + zs;
            this.elements[5] = (oneMinusCos * yy) + cosAngle;
            this.elements[6] = (oneMinusCos * yz) - xs;
            this.elements[7] = 0.0;

            this.elements[8] = (oneMinusCos * zx) - ys;
            this.elements[9] = (oneMinusCos * yz) + xs;
            this.elements[10] = (oneMinusCos * zz) + cosAngle;
            this.elements[11] = 0.0;

            this.elements[12] = 0.0;
            this.elements[13] = 0.0;
            this.elements[14] = 0.0;
            this.elements[15] = 1.0;

            return this;
        }

        return this;
    },

    transform3: function(vector) {
        var d = 1.0/(this.elements[12] * vector.x() + this.elements[13] * vector.y() * this.elements[14] * vector.z() + this.elements[15]);
        return Vec3.translate((this.elements[0] * vector.x() + this.elements[1] * vector.y() + this.elements[2] * vector.z() + this.element[3]) * d,
                              (this.elements[4] * vector.x() + this.elements[5] * vector.y() + this.elements[6] * vector.z() + this.element[7]) * d,
                              (this.elements[8] * vector.x() + this.elements[9] * vector.y() + this.elements[10] * vector.z() + this.element[11]) * d);
    },

    transform4: function(vector) {
        return Vec4.create().set((this.elements[0] * vector.x() + this.elements[1] * vector.y() + this.elements[2] * vector.z() + this.element[3]*vector.w()),
                              (this.elements[4] * vector.x() + this.elements[5] * vector.y() + this.elements[6] * vector.z() + this.element[7]*vector.w()),
                              (this.elements[8] * vector.x() + this.elements[9] * vector.y() + this.elements[10] * vector.z() + this.element[11]*vector.w()),
                              (this.elements[12] * vector.x() + this.elements[13] * vector.y() + this.elements[14] * vector.z() + this.element[15]*vector.w()));
    },

    copy: function() {
        var tmp = new Matrix();
        for (var i = 0; i < 16; i++) {
            tmp.elements[i] = this.elements[i];
        }
        return tmp;
    },

    inverse: function() {
        var tmp = this.copy();
        return tmp.invert();
    },

    transpose: function() {
        var tmp = this.copy();
        var i,j;
        for (i = 0; i < 4; i++)
            for (j = 0; j < 4; j++)
                tmp.elements[j*4 +i] = this.elements[i*4 +j];
        return tmp;
    },

    makePerspective: function(fovy, aspect, znear, zfar)
    {
        var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
        var ymin = -ymax;
        var xmin = ymin * aspect;
        var xmax = ymax * aspect;

        return this.makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
    },

    makeFrustum: function(left, right,
                          bottom, top,
                          znear, zfar) {
        var X = 2*znear/(right-left);
        var Y = 2*znear/(top-bottom);
        var A = (right+left)/(right-left);
        var B = (top+bottom)/(top-bottom);
        var C = -(zfar+znear)/(zfar-znear);
        var D = -2*zfar*znear/(zfar-znear);
        this.setRow(0, X, 0, 0, 0);
        this.setRow(1, 0, Y, 0, 0);
        this.setRow(2, A, B, C, -1);
        this.setRow(3, 0, 0, D, 0);
        return this;
    },

    makeOrtho: function(left, right, bottom, top, znear, zfar)
    {
        var tx = - (right + left) / (right - left);
        var ty = - (top + bottom) / (top - bottom);
        var tz = - (zfar + znear) / (zfar - znear);

        this.setRow(0, 2 / (right - left), 0, 0, 0);
        this.setRow(1, 0 , 2 / (top - bottom), 0, 0);
        this.setRow(2, 0, 0, -2 / (zfar - znear), 0);
        this.setRow(3, tx, ty, tz, 1);
        return this;
    },

    invert: function () {
        var tmp_0 = this.get(2,2) * this.get(3,3);
        var tmp_1 = this.get(3,2) * this.get(2,3);
        var tmp_2 = this.get(1,2) * this.get(3,3);
        var tmp_3 = this.get(3,2) * this.get(1,3);
        var tmp_4 = this.get(1,2) * this.get(2,3);
        var tmp_5 = this.get(2,2) * this.get(1,3);
        var tmp_6 = this.get(0,2) * this.get(3,3);
        var tmp_7 = this.get(3,2) * this.get(0,3);
        var tmp_8 = this.get(0,2) * this.get(2,3);
        var tmp_9 = this.get(2,2) * this.get(0,3);
        var tmp_10 = this.get(0,2) * this.get(1,3);
        var tmp_11 = this.get(1,2) * this.get(0,3);
        var tmp_12 = this.get(2,0) * this.get(3,1);
        var tmp_13 = this.get(3,0) * this.get(2,1);
        var tmp_14 = this.get(1,0) * this.get(3,1);
        var tmp_15 = this.get(3,0) * this.get(1,1);
        var tmp_16 = this.get(1,0) * this.get(2,1);
        var tmp_17 = this.get(2,0) * this.get(1,1);
        var tmp_18 = this.get(0,0) * this.get(3,1);
        var tmp_19 = this.get(3,0) * this.get(0,1);
        var tmp_20 = this.get(0,0) * this.get(2,1);
        var tmp_21 = this.get(2,0) * this.get(0,1);
        var tmp_22 = this.get(0,0) * this.get(1,1);
        var tmp_23 = this.get(1,0) * this.get(0,1);

        var t0 = ((tmp_0 * this.get(1,1) + tmp_3 * this.get(2,1) + tmp_4 * this.get(3,1)) -
                  (tmp_1 * this.get(1,1) + tmp_2 * this.get(2,1) + tmp_5 * this.get(3,1)));
        var t1 = ((tmp_1 * this.get(0,1) + tmp_6 * this.get(2,1) + tmp_9 * this.get(3,1)) -
                  (tmp_0 * this.get(0,1) + tmp_7 * this.get(2,1) + tmp_8 * this.get(3,1)));
        var t2 = ((tmp_2 * this.get(0,1) + tmp_7 * this.get(1,1) + tmp_10 * this.get(3,1)) -
                  (tmp_3 * this.get(0,1) + tmp_6 * this.get(1,1) + tmp_11 * this.get(3,1)));
        var t3 = ((tmp_5 * this.get(0,1) + tmp_8 * this.get(1,1) + tmp_11 * this.get(2,1)) -
                  (tmp_4 * this.get(0,1) + tmp_9 * this.get(1,1) + tmp_10 * this.get(2,1)));

        var d = 1.0 / (this.get(0,0) * t0 + this.get(1,0) * t1 + this.get(2,0) * t2 + this.get(3,0) * t3);

        var out_00 = d * t0;
        var out_01 = d * t1;
        var out_02 = d * t2;
        var out_03 = d * t3;

        var out_10 = d * ((tmp_1 * this.get(1,0) + tmp_2 * this.get(2,0) + tmp_5 * this.get(3,0)) -
                          (tmp_0 * this.get(1,0) + tmp_3 * this.get(2,0) + tmp_4 * this.get(3,0)));
        var out_11 = d * ((tmp_0 * this.get(0,0) + tmp_7 * this.get(2,0) + tmp_8 * this.get(3,0)) -
                          (tmp_1 * this.get(0,0) + tmp_6 * this.get(2,0) + tmp_9 * this.get(3,0)));
        var out_12 = d * ((tmp_3 * this.get(0,0) + tmp_6 * this.get(1,0) + tmp_11 * this.get(3,0)) -
                          (tmp_2 * this.get(0,0) + tmp_7 * this.get(1,0) + tmp_10 * this.get(3,0)));
        var out_13 = d * ((tmp_4 * this.get(0,0) + tmp_9 * this.get(1,0) + tmp_10 * this.get(2,0)) -
                          (tmp_5 * this.get(0,0) + tmp_8 * this.get(1,0) + tmp_11 * this.get(2,0)));

        var out_20 = d * ((tmp_12 * this.get(1,3) + tmp_15 * this.get(2,3) + tmp_16 * this.get(3,3)) -
                          (tmp_13 * this.get(1,3) + tmp_14 * this.get(2,3) + tmp_17 * this.get(3,3)));
        var out_21 = d * ((tmp_13 * this.get(0,3) + tmp_18 * this.get(2,3) + tmp_21 * this.get(3,3)) -
                          (tmp_12 * this.get(0,3) + tmp_19 * this.get(2,3) + tmp_20 * this.get(3,3)));
        var out_22 = d * ((tmp_14 * this.get(0,3) + tmp_19 * this.get(1,3) + tmp_22 * this.get(3,3)) -
                          (tmp_15 * this.get(0,3) + tmp_18 * this.get(1,3) + tmp_23 * this.get(3,3)));
        var out_23 = d * ((tmp_17 * this.get(0,3) + tmp_20 * this.get(1,3) + tmp_23 * this.get(2,3)) -
                          (tmp_16 * this.get(0,3) + tmp_21 * this.get(1,3) + tmp_22 * this.get(2,3)));

        var out_30 = d * ((tmp_14 * this.get(2,2) + tmp_17 * this.get(3,2) + tmp_13 * this.get(1,2)) -
                          (tmp_16 * this.get(3,2) + tmp_12 * this.get(1,2) + tmp_15 * this.get(2,2)));
        var out_31 = d * ((tmp_20 * this.get(3,2) + tmp_12 * this.get(0,2) + tmp_19 * this.get(2,2)) -
                          (tmp_18 * this.get(2,2) + tmp_21 * this.get(3,2) + tmp_13 * this.get(0,2)));
        var out_32 = d * ((tmp_18 * this.get(1,2) + tmp_23 * this.get(3,2) + tmp_15 * this.get(0,2)) -
                          (tmp_22 * this.get(3,2) + tmp_14 * this.get(0,2) + tmp_19 * this.get(1,2)));
        var out_33 = d * ((tmp_22 * this.get(2,2) + tmp_16 * this.get(0,2) + tmp_21 * this.get(1,2)) -
                          (tmp_20 * this.get(1,2) + tmp_23 * this.get(2,2) + tmp_17 * this.get(0,2)));

        this.elements[0*4+0] = out_00;
        this.elements[0*4+1] = out_01;
        this.elements[0*4+2] = out_02;
        this.elements[0*4+3] = out_03;
        this.elements[1*4+0] = out_10;
        this.elements[1*4+1] = out_11;
        this.elements[1*4+2] = out_12;
        this.elements[1*4+3] = out_13;
        this.elements[2*4+0] = out_20;
        this.elements[2*4+1] = out_21;
        this.elements[2*4+2] = out_22;
        this.elements[2*4+3] = out_23;
        this.elements[3*4+0] = out_30;
        this.elements[3*4+1] = out_31;
        this.elements[3*4+2] = out_32;
        this.elements[3*4+3] = out_33;
        return this;
    }
};

Matrix.create = function() {
    return new Matrix();
};
Matrix.identity = function() {
    var tmp = new Matrix();
    tmp.makeIdentity();
    return tmp;
};
Matrix.translate = function(x, y, z) {
    var tmp = new Matrix();
    tmp.makeTranslate(x, y, z);
    return tmp;
};


function Vec3() { this.elements = Array(3); }
Vec3.prototype = {
    cross: function(other) {
        return Vec3.create(this.elements[1]*other.elements[2]-this.elements[2]*other.elements[1],
                           this.elements[2]*other.elements[0]-this.elements[0]*other.elements[2] ,
                           this.elements[0]*other.elements[1]-this.elements[1]*other.elements[0]);
    },

    lenght: function() {
        return Math.sqrt( this.elements[0]*this.elements[0] + this.elements[1]* this.elements[1] + this.elements[2]*this.elements[2] );
    },

    normalize: function() {
        var tmp = this.lenght();
        if (norm > 0.0) {
            var inv = 1.0/norm;
            this.elements[0] *= inv;
            this.elements[1] *= inv;
            this.elements[2] *= inv;
        }
        return norm;
    },

    dot: function(other) {
        return this.elements[0]*other.elements[0]+this.elements[1]*other.elements[1]+this.elements[2]*other.elements[2];
    },

    sub: function(other) {
        this.elements[0] -= other.elements[0];
        this.elements[1] -= other.elements[1];
        this.elements[2] -= other.elements[2];
        return this;
    },

    add: function(other) {
        this.elements[0] += other.elements[0];
        this.elements[1] += other.elements[1];
        this.elements[2] += other.elements[2];
        return this;
    },

    negative: function() {
        return Vec3.create().set(-this.elements[0], -this.elements[1], -this.elements[2]);
    },

    x: function() { return this.elements[0]; },
    y: function() { return this.elements[1]; },
    z: function() { return this.elements[2]; },

    copy: function() {
        return Vec3.create(this.elements[0], this.elements[1], this.elements[2]);
    },

    set: function(x, y, z) {
        this.elements[0] = x;
        this.elements[1] = y;
        this.elements[2] = z;
        return this;
    }


};

Vec3.create = function() {
    return new Vec3();
};



function Vec4() { this.elements = Array(4); }
Vec4.prototype = {
    set: function(x, y, z, w) {
        this.elements[0] = x;
        this.elements[1] = y;
        this.elements[2] = z;
        this.elements[3] = w;
        return this;
    },
    x: function() { return this.elements[0]; },
    y: function() { return this.elements[1]; },
    z: function() { return this.elements[2]; },
    w: function() { return this.elements[3]; },

    dot: function(other) {
        return this.elements[0]*other.elements[0]+this.elements[1]*other.elements[1]+this.elements[2]*other.elements[2] + this.elements[3]*other.elements[3];
    },

    sub: function(other) {
        this.elements[0] -= other.elements[0];
        this.elements[1] -= other.elements[1];
        this.elements[2] -= other.elements[2];
        this.elements[3] -= other.elements[3];
        return this;
    },

    add: function(other) {
        this.elements[0] += other.elements[0];
        this.elements[1] += other.elements[1];
        this.elements[2] += other.elements[2];
        this.elements[3] += other.elements[3];
        return this;
    },

    negative: function() {
        return Vec4.create().set(-this.elements[0], -this.elements[1], -this.elements[2], -this.elements[3]);
    }
};

Vec4.create = function() {
    return new Vec4();
};
/** -*- compile-command: "jslint-cli OpenSceneGraph.js" -*-
 */
var controller;
function CameraController(element) {
    this.onchange = null;
    this.xRot = 0;
    this.yRot = 0;
    this.scaleFactor = 3.0;
    this.dragging = false;
    this.curX = 0;
    this.curY = 0;
    this.deltaX = 0;
    this.deltaY = 0;
    var that = this;
    var id = 2;

    jQuery(element).bind( { mousedown: function(ev) {
                                that.dragging = true;
                                that.curX = ev.clientX;
                                that.curY = ev.clientY;
                            },
                            mouseup: function(ev) {
                                that.dragging = false;
                                var curX = ev.clientX;
                                var curY = ev.clientY;
                                that.deltaX = (that.curX - curX) / that.scaleFactor;
                                that.deltaY = (that.curY - curY) / that.scaleFactor;
                                that.curX = curX;
                                that.curY = curY;
                            },
                            mousemove: function(ev) {
                                if (that.dragging) {
                                    // Determine how far we have moved since the last mouse move
                                    // event.
                                    var curX = ev.clientX;
                                    var curY = ev.clientY;
                                    that.deltaX = (that.curX - curX) / that.scaleFactor;
                                    that.deltaY = (that.curY - curY) / that.scaleFactor;
                                    that.curX = curX;
                                    that.curY = curY;
                                    that.yRot = (that.yRot + that.deltaX) % 360;
                                    that.xRot = (that.xRot + that.deltaY);
                                    that.deltaX = 0;
                                    that.deltaY = 0;
                                }
                            }
                          }
    );

    that.compute = function() {
        // Update the X and Y rotation angles based on the mouse motion.
        that.yRot = (that.yRot + that.deltaX) % 360;
        that.xRot = (that.xRot + that.deltaY);
        // Clamp the X rotation to prevent the camera from going upside
        // down.
        if (that.xRot < -90) {
            that.xRot = -90;
        } else if (that.xRot > 90) {
            that.xRot = 90;
        }
        // Send the onchange event to any listener.
        if (that.onchange != null) {
            // disable view change
            //that.onchange(that.xRot, that.yRot);
        }
    };
}


// shim layer with setTimeout fallback by paul IRISHSHSHSH
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(/* function */ callback, /* DOMElement */ element){
              window.setTimeout(callback, 1000 / 60);
            };
  })();


 

var root;
var state;
function webGLStart(elem) {

    var canvas = elem;

    initGL(canvas);
    state = State.create();

    controller = new CameraController(canvas);
    controller.onchange = function(xRot, yRot) {
        var rotx = controller.xRot; // / 180 *3.14;
        var roty = controller.yRot; // / 180 *3.14;

        var rotation = Matrix.create().makeRotate(roty, 0,0,1).multiply(Matrix.create().makeRotate(rotx, 1, 0, 0));

        root.matrix = rotation.multiply(Matrix.create().makeTranslate(0, 0, 3));
        root.matrix = root.matrix.inverse();
    };

    root = Projection.create();
    var ratio = canvas.width/canvas.height;
    root.projection = Matrix.create().makePerspective(60, ratio, 0.1, 100.0);
    root.matrix = Matrix.identity(); // camera
    //controller.xRot = 20;
    controller.onchange(0,0);

    //var scene = createScene();
    //root.addChild(scene);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clearDepth(1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    
    (function animloop(){
      frame();
      window.rAFid = requestAnimFrame(animloop, canvas);
    })();


}





var numberFrame = 0;
var startTime;
function frame() {
    if (numberFrame === 0) {
        startTime = (new Date).getTime();
    }

    controller.compute();

    drawScene();

    numberFrame++;

    if (numberFrame % 60 === 0.0) {
        /* Run a test. */
        var nd = (new Date).getTime();
        var diff = nd - startTime;

        jQuery("#fps").text(numberFrame/(diff/1000));
        startTime = nd;
        numberFrame = 0;
    }

}
