import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import Model from "./Model";
import Model2 from "./Model2";
import Model3 from "./Model3";
import Model4 from "./Model4";

const ModelViewer = ({ action, model }) => {
  const model1Ref = useRef()
  const model2Ref = useRef()
  const model3Ref = useRef()
  const model4Ref = useRef()

  return (
    <Canvas style={{
      height: '25vh',
      width: 'auto',
      aspectRatio: '1/1'

    }} className=" h-2/5 w-auto aspect-square" camera={{ position: [0, 0.08, 0.55], fov: 75 }} onClick={action}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Suspense fallback={null}>
        <group position={model == 1 ? [0, 0, 0] : [-1000, -1000, -1000]} ref={model1Ref}>
          <Model />
        </group>
        <group position={model == 2 ? [0, 0, 0] : [-1000, -1000, -1000]} ref={model2Ref}>
          <Model2 />
        </group>
        <group position={model == 3 ? [0, 0, 0] : [-1000, -1000, -1000]} ref={model3Ref}>
          <Model3 />
        </group>
        <group position={model == 4 ? [0, 0, 0] : [-1000, -1000, -1000]} ref={model4Ref}>
          <Model4 />
        </group>
      </Suspense>
      <OrbitControls enableRotate={false} enableZoom={false} />
    </Canvas>
  );
};

export default ModelViewer;  