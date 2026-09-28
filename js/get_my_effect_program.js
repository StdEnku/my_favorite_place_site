/*
  波のようなシェーダーエフェクトのシェーダーをコンパイルして
  リンクしたプログラムオブジェクトのIDを返す関数
*/
function GetMyEffectProgram() {
  const vertexShaderSource = `#version 300 es
    in vec2 a_position;
    out vec2 varyingVPos;
    
    void main() {
      varyingVPos = a_position * 0.5 + 0.5;// -1~1までを0~1までに修正
      gl_Position = vec4(a_position, 0.0, 1.0);// 頂点情報として次のパイプラインに渡す。
    }
  `;

  const fragmentShaderSource = `#version 300 es
    precision mediump float;
    
    uniform float u_time;
    uniform vec2 u_mousepos;
    in vec2 varyingVPos;
    out vec4 outColor;

    void main() {
      const vec3 bgColor = vec3(0.01, 0.01, 0.02); // わずかに青みがかった黒
      const vec3 prColor = vec3(0.05, 0.15, 0.40); // 紺

      /*----------------------------------------------------
        ↓ここからマウスの位置と画面の横軸から振幅を計算していく
      ----------------------------------------------------*/
      vec2 actualMousePos = vec2(u_mousepos.x, 1.0 - u_mousepos.y);// openglのy軸とjsのy軸が逆なので合わせた本当のマウスポジション
      const float ampOffset = 0.3;// 振幅オフセット
      const float ampWeight = 0.4;// 振幅重み
      const float effectW = 0.4;// エフェクトの幅(0~1)

      float distX = abs(varyingVPos.x - actualMousePos.x);// ピクセルとマウスのx軸が近いほど0に近くなる値
      float amp = 1.0 - smoothstep(0.0, effectW, distX);// 振幅の幅を急にする処理
      amp = ampOffset + amp * ampWeight;// 画面の横位置とマウスの横位置が近いほど大きくなる振幅

      /*-------------------------------------
        ↓ここから実際の正弦波のy軸を計算していく
      --------------------------------------*/
      // 波の高さ
      const float freqW = 4.0;// 周波数の重み
      const float radW = 1.5;// 位相の重み
      
      // y = A * sin(2πf + θ)
      float waveY = sin(varyingVPos.x * freqW + u_time * radW) * amp;
      float waveYNormed =  0.5 + waveY * 0.5;// -1~1までの振幅を0~1までに正規化

      /*---------------------------
        波の高さから実際のピクセルの色を計算する部分
      ----------------------------*/
      const float colorChangeRegionW = 0.02;// 色変化領域の重み 

      float distY = abs(varyingVPos.y - waveYNormed);// 振幅とピクセルの高さとの差
      float colorW = smoothstep(colorChangeRegionW, 0.0, distY);// 色変化を急なものに
      vec3 finalColor = mix(bgColor, prColor, colorW);// 背景色と線の色をアナログ的に切り替える
      outColor = vec4(finalColor, 1.0);
    }
  `;
  
    const vertexShaderId = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);// 頂点シェーダーコンパイル
    const fragmentShaderId = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);// フラグメントシェーダーコンパイル
    const programId = createProgram(gl, vertexShaderId, fragmentShaderId);// リンクしてGPUで動かせるプログラムオブジェクトの作成
    return programId;
}