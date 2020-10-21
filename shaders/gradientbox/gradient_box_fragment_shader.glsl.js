export default /*glsl*/`
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_height;
    uniform vec3 u_color;
    uniform float u_opacity;
    varying vec3 iPosition;

    void main() {             
        //gl_FragCoord 适用于屏幕固定点颜色设置
        //gl_FragColor = vec4(gl_FragCoord.x/150.0,gl_FragCoord.y/150.0,  gl_FragCoord.y/u_height,1.0);

        // float positionOpacity =  iPosition.y/3000.0;
        float positionOpacity =  (abs(iPosition.y - 25.0))/50.0;
        gl_FragColor = vec4(u_color,positionOpacity);
        //gl_FragColor = vec4(u_color,iPosition.y /u_height * 1.0  + 0.01);
        //gl_FragColor = vec4(1.0,1.0,1.0,iPosition.z/u_height * 10.0 * abs(sin(u_time)) + 0.06);
    }
`;