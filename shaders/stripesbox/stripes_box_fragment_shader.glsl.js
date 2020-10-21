export default /*glsl 锯齿问题 平滑渐变 共面闪烁 局部渐变 打磨该着色器作为一类白膜的风格*/`
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_height;
    uniform vec3 u_color;
    varying vec3 iPosition;

    void main() {                      
        const float unit = 3.0;         
        float l = u_height / unit * 1.; 
        float times  = l;
        vec3 v_color =  vec3(1.0,1.0,1.0);
        vec3 c = vec3(1.0,1.0,1.0);
        float alpha = 1.0;

        float m = abs(iPosition.z) / u_height; // 归一化

        // if((m > 0.0 && m < 0.1) || m == 0.0 || m ==0.1){
        //     v_color = u_color;
        //     alpha = 0.25;
        // }
        // if(m > 0.2 && m < 0.3){
        //     v_color = u_color;
        //     alpha = 0.5;
        // }

        // if(m > 0.4 && m < 0.5){
        //     v_color = u_color;
        //     alpha = 0.75;
        // }

        // if(m > 0.6 && m < 0.7){
        //     v_color = u_color;
        //     alpha = 0.5;
        // }

        // if((m > 0.8 && m < 0.9)  || m == 0.9 || m == 0.8){
        //     v_color = u_color;
        //     alpha = 0.25;
        // }

        // 思考：通过循环代替上述代码
        for(float i = 0.0;i<1.0;i+=0.005){
            float tmp = i * 1000.0;
            if(mod (iPosition.z, tmp)  == 0.0){
                v_color = u_color;                
            }else{
                v_color = c;
            }
        }
        gl_FragColor = vec4(v_color,1);
    }
`;