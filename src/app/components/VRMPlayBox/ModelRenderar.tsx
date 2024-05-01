"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

import { VRM, VRMUtils } from "@pixiv/three-vrm";
import THREE, { Object3D } from "three";
import { getVRM } from "./threeDUtilities";

const ModelRenderar = ({ url }: { url: string }) => {
    const { scene, camera } = useThree();
    const gltf = useGLTF(url);
    const avatar = useRef<VRM>();
    const [bonesStore, setBones] = useState<{ [part: string]: Object3D }>({});

    useEffect(() => {
        const loadVRM = async (url: string) => {
            if (gltf) {
                VRMUtils.removeUnnecessaryJoints(gltf.scene);
                const vrm = await getVRM(url);
                avatar.current = vrm;
                vrm.lookAt.target = camera;

                // vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Hips).rotation.y =
                //   Math.PI;

                // const bones = {
                //   neck: vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Neck),
                //   hips: vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Hips),
                //   LeftShoulder: vrm.humanoid.getBoneNode(
                //     VRMSchema.HumanoidBoneName.LeftShoulder
                //   ),
                //   RightShoulder: vrm.humanoid.getBoneNode(
                //     VRMSchema.HumanoidBoneName.RightShoulder
                //   ),
            }
            // setBones(bones);
            // }
        };

        loadVRM(url);
    }, [scene, gltf, camera, url]);

    useFrame(({ clock }, delta) => {
        if (avatar.current) {
            avatar.current.update(delta);
        }

        if (bonesStore.neck) {
            const t = clock.getElapsedTime();
            bonesStore.neck.rotation.y = (Math.PI / 4) * Math.sin(t * Math.PI);
        }
    });

    return <primitive object={gltf.scene} position={[0, -0.55, 0]}></primitive>;
};

export default ModelRenderar;
