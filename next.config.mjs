// env validation
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
await jiti.import("./env.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

export default nextConfig;
