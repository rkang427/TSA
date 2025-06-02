"use client";

import dynamic from "next/dynamic";

const ImpactMapClientInner = dynamic(() => import("./ImpactMapClientInner"), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default ImpactMapClientInner;
