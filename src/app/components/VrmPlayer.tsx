import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
    OrbitControls,
    useGLTF,
    useHelper,
    Html,
    useProgress,
} from "@react-three/drei";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRM, VRMUtils, VRMLoaderPlugin } from "@pixiv/three-vrm";
import THREE, { Object3D } from "three";

function ModelLoadering() {
    const { progress } = useProgress();
    return (
        <Html center style={{ width: "90px" }}>
            {Number(progress).toFixed()} %
        </Html>
    );
}

const Avatar = ({ url }: { url: string }) => {
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

const getVRM = async (url: string) => {
    const loader = new GLTFLoader();

    loader.register((parser: any) => new VRMLoaderPlugin(parser)); // here we are installing VRMLoaderPlugin

    return loader.loadAsync(url).then((gltf) => {
        const vrm = gltf.userData.vrm; // `VRM` is loaded inside `gltf.userData.vrm`

        VRMUtils.rotateVRM0(vrm); // rotate the vrm around y axis if the vrm is VRM0.0

        return vrm;
    });
};

interface FileType {
    url: string;
}

const VrmPlayer = (props: FileType) => {
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
                <Suspense fallback={<ModelLoadering />}>
                    <Avatar url={props.url} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default VrmPlayer;
