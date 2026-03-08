'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function MetaballBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.OrthographicCamera;
    renderer?: THREE.WebGLRenderer;
    material?: THREE.ShaderMaterial;
    clock?: THREE.Clock;
    animationId?: number;
  }>({});

  useEffect(() => {
    if (!containerRef.current) return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    const clock = new THREE.Clock();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? 'default' : 'high-performance',
    });

    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    containerRef.current.appendChild(renderer.domElement);

    // Green theme colors
    const settings = {
      backgroundColor: new THREE.Color(0x001000),
      sphereColor: new THREE.Color(0x002200),
      lightColor: new THREE.Color(0x00ff88),
      cursorGlowColor: new THREE.Color(0x00ff66),
    };

    // Shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uMousePosition: { value: new THREE.Vector2(0.5, 0.5) },
        uCursorSphere: { value: new THREE.Vector3(0, 0, 0) },
        uBackgroundColor: { value: settings.backgroundColor },
        uSphereColor: { value: settings.sphereColor },
        uLightColor: { value: settings.lightColor },
        uCursorGlowColor: { value: settings.cursorGlowColor },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMousePosition;
        uniform vec3 uCursorSphere;
        uniform vec3 uBackgroundColor;
        uniform vec3 uSphereColor;
        uniform vec3 uLightColor;
        uniform vec3 uCursorGlowColor;
        
        varying vec2 vUv;
        
        const float PI = 3.14159265359;
        const float EPSILON = 0.001;
        const float MAX_DIST = 100.0;
        
        float smin(float a, float b, float k) {
          float h = max(k - abs(a - b), 0.0) / k;
          return min(a, b) - h * h * k * 0.25;
        }
        
        float sdSphere(vec3 p, float r) {
          return length(p) - r;
        }
        
        vec3 screenToWorld(vec2 normalizedPos) {
          vec2 uv = normalizedPos * 2.0 - 1.0;
          uv.x *= uResolution.x / uResolution.y;
          return vec3(uv * 2.0, 0.0);
        }
        
        float sceneSDF(vec3 pos) {
          float result = MAX_DIST;
          
          // Fixed spheres
          vec3 topLeftPos = screenToWorld(vec2(0.08, 0.92));
          float topLeft = sdSphere(pos - topLeftPos, 0.8);
          
          vec3 bottomRightPos = screenToWorld(vec2(0.92, 0.08));
          float bottomRight = sdSphere(pos - bottomRightPos, 0.9);
          
          float t = uTime * 0.6;
          
          // Moving spheres
          for (int i = 0; i < 6; i++) {
            float fi = float(i);
            float speed = 0.4 + fi * 0.12;
            float radius = 0.12 + mod(fi, 3.0) * 0.06;
            float orbitRadius = 0.3 + mod(fi, 3.0) * 0.15;
            float phaseOffset = fi * PI * 0.35;
            
            vec3 offset = vec3(
              sin(t * speed + phaseOffset) * orbitRadius * 0.8,
              cos(t * speed * 0.85 + phaseOffset * 1.3) * orbitRadius * 0.6,
              sin(t * speed * 0.5 + phaseOffset) * 0.3
            );
            
            float movingSphere = sdSphere(pos - offset, radius);
            result = smin(result, movingSphere, 0.3);
          }
          
          // Cursor sphere
          float cursorBall = sdSphere(pos - uCursorSphere, 0.12);
          
          result = smin(result, topLeft, 0.3);
          result = smin(result, bottomRight, 0.3);
          result = smin(result, cursorBall, 0.4);
          
          return result;
        }
        
        vec3 calcNormal(vec3 p) {
          float eps = 0.001;
          return normalize(vec3(
            sceneSDF(p + vec3(eps, 0, 0)) - sceneSDF(p - vec3(eps, 0, 0)),
            sceneSDF(p + vec3(0, eps, 0)) - sceneSDF(p - vec3(0, eps, 0)),
            sceneSDF(p + vec3(0, 0, eps)) - sceneSDF(p - vec3(0, 0, eps))
          ));
        }
        
        float rayMarch(vec3 ro, vec3 rd) {
          float t = 0.0;
          for (int i = 0; i < 48; i++) {
            vec3 p = ro + rd * t;
            float d = sceneSDF(p);
            if (d < EPSILON) return t;
            if (t > 5.0) break;
            t += d * 0.9;
          }
          return -1.0;
        }
        
        vec3 lighting(vec3 p, vec3 rd, float t) {
          if (t < 0.0) return vec3(0.0);
          
          vec3 normal = calcNormal(p);
          vec3 viewDir = -rd;
          vec3 baseColor = uSphereColor;
          
          vec3 ambient = uLightColor * 0.03;
          
          vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
          float diff = max(dot(normal, lightDir), 0.0);
          vec3 diffuse = uLightColor * diff * 0.8;
          
          vec3 reflectDir = reflect(-lightDir, normal);
          float spec = pow(max(dot(viewDir, reflectDir), 0.0), 8.0);
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 1.5);
          vec3 specular = uLightColor * spec * 1.5 * fresnel;
          
          vec3 color = baseColor + ambient + diffuse + specular;
          color = pow(color, vec3(1.8));
          color = color / (color + vec3(0.8));
          
          return color;
        }
        
        float calculateCursorGlow(vec3 worldPos) {
          float dist = length(worldPos.xy - uCursorSphere.xy);
          float glow = 1.0 - smoothstep(0.0, 1.5, dist);
          return pow(glow, 2.0) * 0.6;
        }
        
        void main() {
          vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.xy;
          uv.x *= uResolution.x / uResolution.y;
          
          vec3 ro = vec3(uv * 2.0, -1.0);
          vec3 rd = vec3(0.0, 0.0, 1.0);
          
          float t = rayMarch(ro, rd);
          vec3 p = ro + rd * t;
          vec3 color = lighting(p, rd, t);
          
          float cursorGlow = calculateCursorGlow(ro);
          vec3 glowContribution = uCursorGlowColor * cursorGlow;
          
          if (t > 0.0) {
            float fogAmount = 1.0 - exp(-t * 0.12);
            color = mix(color, uBackgroundColor.rgb, fogAmount * 0.3);
            color += glowContribution * 0.3;
            gl_FragColor = vec4(color, 1.0);
          } else {
            if (cursorGlow > 0.01) {
              gl_FragColor = vec4(glowContribution, cursorGlow * 0.8);
            } else {
              gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            }
          }
        }
      `,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
      
      const x = clientX / window.innerWidth;
      const y = 1.0 - clientY / window.innerHeight;
      
      const uv_x = x * 2.0 - 1.0;
      const uv_y = y * 2.0 - 1.0;
      const aspect = window.innerWidth / window.innerHeight;
      
      material.uniforms.uCursorSphere.value.set(uv_x * aspect * 2.0, uv_y * 2.0, 0.0);
      material.uniforms.uMousePosition.value.set(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    animate();

    // Store refs
    sceneRef.current = { scene, camera, renderer, material, clock };

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      if (sceneRef.current.renderer) {
        sceneRef.current.renderer.dispose();
      }
      
      if (sceneRef.current.material) {
        sceneRef.current.material.dispose();
      }
      
      geometry.dispose();
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
}
