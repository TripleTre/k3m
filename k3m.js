const vertexShader = `
  attribute vec4 a_position;

  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;

  void main()
  {
    gl_Position = a_position;
    v_texCoord = a_texCoord;
  }
`;

const fragShader = `
  precision mediump float;

  uniform sampler2D u_sampler;
  varying vec2 v_texCoord;

  void main()
  {
    const float DISTANCE = 1.0;
    const vec3 refer = vec3(0.5, 0.5, 0.5);
    vec4 color = texture2D(u_sampler, v_texCoord);
    float distance = abs(refer.r - color.r) + abs(refer.g - color.g) + abs(refer.b - color.b);
    vec4 displayColor;

    if (distance < DISTANCE) {
      displayColor = vec4(1.0, 1.0, 1.0, 1.0); // #ffffff
    } else {
      displayColor = vec4(0.0, 0.0, 0.0, 1.0);
    }

    gl_FragColor = displayColor;
  }
`;

export function setupGLProgram(gl) {
  const gl_vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(gl_vertexShader, vertexShader);
  gl.compileShader(gl_vertexShader);
  if (!gl.getShaderParameter(gl_vertexShader, gl.COMPILE_STATUS)) {
    console.warn(`vertex shader failed to compile. error: ${gl.getShaderInfoLog(gl_vertexShader)}`);
  }

  const gl_fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(gl_fragShader, fragShader);
  gl.compileShader(gl_fragShader);

  if (!gl.getShaderParameter(gl_fragShader, gl.COMPILE_STATUS)) {
    console.warn(`fragment shader failed to compile. error: ${gl.getShaderInfoLog(gl_fragShader)}`);
  }

  const program = gl.createProgram();

  gl.attachShader(program, gl_fragShader);
  gl.attachShader(program, gl_vertexShader);
  gl.linkProgram(program);

  gl.useProgram(program);

  return program;
}

export function initTexture(gl, program, image) {
  const texture = gl.createTexture();
  const gl_sampler = gl.getUniformLocation(program, 'u_sampler');

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(gl_sampler, 0);
}

export function initVertices(gl, program, vertices) {
  const verticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const gl_a_position = gl.getAttribLocation(program, 'a_position');

  gl.vertexAttribPointer(gl_a_position, 2, gl.FLOAT, false, vertices.BYTES_PER_ELEMENT * 4, 0);
  gl.enableVertexAttribArray(gl_a_position);

  const gl_texCoord = gl.getAttribLocation(program, 'a_texCoord');
  gl.vertexAttribPointer(gl_texCoord, 2, gl.FLOAT, false, vertices.BYTES_PER_ELEMENT * 4, vertices.BYTES_PER_ELEMENT * 2);
  gl.enableVertexAttribArray(gl_texCoord);
}
