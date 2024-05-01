import {
    GLTF,
    GLTFLoader,
    GLTFParser,
} from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMUtils, VRMLoaderPlugin } from "@pixiv/three-vrm";

export const getVRM = async (url: string) => {
    const loader = new GLTFLoader();

    // @ts-ignore
    loader.register((parser) => new VRMLoaderPlugin(parser));

    return loader.loadAsync(url).then((gltf: any) => {
        const vrm = gltf.userData.vrm; // `VRM` is loaded inside `gltf.userData.vrm`
        // have to add animation from here

        VRMUtils.rotateVRM0(vrm); // rotate the vrm around y axis if the vrm is VRM0.0

        return vrm;
    });
};
