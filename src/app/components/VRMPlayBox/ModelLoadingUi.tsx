"use client";

import React from "react";
import { Html, useProgress } from "@react-three/drei";

function ModelLoaderingUi() {
    const { progress } = useProgress();
    return (
        <Html center style={{ width: "90px" }}>
            {Number(progress).toFixed()} %
        </Html>
    );
}

export default ModelLoaderingUi;
