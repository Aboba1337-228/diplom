import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useAnimations, useGLTF, useTexture } from '@react-three/drei';

function Model() {
  const group = useRef()
  const { scene, animations } = useGLTF('/models/untitled3.gltf');
  const { actions } = useAnimations(animations, group);

  const texture1 = useTexture('/textures/Bunny_BaseColor_11.png');
  const texture3 = useTexture('/textures/Bunny_BaseColor_12.png');
  const texture2 = useTexture('/textures/Face_12.png');

  scene.traverse((object) => { 
    if (object.isMesh) { 
      console.log(object.name);
      object.castShadow = true;
      object.receiveShadow = true;

      if (object.name === 'Bunny003') {
        object.material.map = texture1;
      }
      if (object.name === 'Bunny006') {
        object.material.map = texture3;
      }
      if (object.name === 'Face_1002') {
        object.material.map = texture2;
      }
      if (object.name === 'Face_1007') {
        object.material.map = texture2;
      }
    }
  });

  useEffect(() => {
    if (actions) {
      // actions['metarigAction'].play();
      // actions['FaceRIGAction'].play();
      // actions['PlaneAction.001'].play();
      // actions['PlaneAction'].play();
      // actions['PlaneAction.003'].play();
    }
  }, [actions]);

  return <primitive ref={group} object={scene} scale={0.5} />;
}

const ModelViewer5 = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

export default ModelViewer5;
