// useWindowSize.js
// Reads the browser viewport size once (on mount) and does NOT update
// afterward, so a fullscreen canvas keeps a stable size even if the
// window is resized later.

import { useState } from "react";

export default function useWindowSize() {
    const [size] = useState({
        width: typeof window !== "undefined" ? window.innerWidth : 1280,
        height: typeof window !== "undefined" ? window.innerHeight : 720,
    });

    return size;
}