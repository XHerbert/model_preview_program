export default /*glsl*/`
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_height;
    uniform vec3 u_color;
    varying vec3 iPosition;

    void main() {             
        //float m = abs(iPosition.y) / 40.0;
        //gl_FragColor = vec4(m,iPosition.x/80.0,1.0,1.0);
        vec2 st = gl_FragCoord.xy/u_resolution;
        gl_FragColor = vec4(st.x,st.y,0.0,1.0);
    }
`;