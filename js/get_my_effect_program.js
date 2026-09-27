/*
  波のようなシェーダーエフェクトのシェーダーをコンパイルして
  リンクしたプログラムオブジェクトのIDを返す関数
*/
function GetMyEffectProgram() {
  const vertexShaderSource = `#version 300 es
    in vec2 a_position;
    out vec2 varyingVPos;
    void main() {
      varyingVPos = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `#version 300 es
    precision mediump float;
    
    uniform float u_time;
    uniform vec2 u_mousepos;
    in vec2 varyingVPos;
    out vec4 outColor;

    void main() {
      vec3 bgColor = vec3(0.01, 0.01, 0.02); // わずかに青みがかった黒
      vec3 prColor = vec3(0.05, 0.15, 0.40); // 紺

      // openglのy軸とjsのy軸が逆なので合わせた本当のマウスポジション
      vec2 actualMousePos = vec2(u_mousepos.x, 1.0 - u_mousepos.y);

      // 画面の横位置と、マウスの横位置がどれくらい離れているか
      float distToMouseX = abs(varyingVPos.x - actualMousePos.x);
      
      // マウスから 0.4 以内の距離なら 1.0、遠ければ 0.0 になるマスクを作る
      float mouseEffect = 1.0 - smoothstep(0.0, 0.4, distToMouseX);

      float amp = 0.3 + mouseEffect * 0.4;

      float waveY = 0.5 + sin(varyingVPos.x * 4.0 + u_time * 1.5) * 0.5 * amp;

      float lineDist = abs(varyingVPos.y - waveY);
      float line = smoothstep(0.02, 0.0, lineDist);

      vec3 finalColor = mix(bgColor, prColor, line);

      outColor = vec4(finalColor, 1.0);
    }
  `;
  
    const vertexShaderId = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);// 頂点シェーダーコンパイル
    const fragmentShaderId = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);// フラグメントシェーダーコンパイル
    const programId = createProgram(gl, vertexShaderId, fragmentShaderId);// リンクしてGPUで動かせるプログラムオブジェクトの作成
    return programId;
}