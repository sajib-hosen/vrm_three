"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ModelRenderar from "./ModelRenderar";
import ModelLoaderingUi from "./ModelLoadingUi";

interface FileType {
    url: string;
}

const VRMPlayBox = (props: FileType) => {
    return (
        <div
            style={{
                width: "100%",
                height: "600px",
                borderRadius: "10px",
                border: "1px solid lightgray",
            }}
        >
            <Canvas
                shadows
                camera={{
                    position: [0, 0, -10],
                    fov: 13,
                }}
            >
                <OrbitControls enableZoom={true} />
                <spotLight position={[0, 2, -1]} intensity={0.4} />
                <ambientLight intensity={0.65} />
                <Suspense fallback={<ModelLoaderingUi />}>
                    <ModelRenderar url={props.url} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default VRMPlayBox;
