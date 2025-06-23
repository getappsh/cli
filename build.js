// build.js
const { buildSync } = require("esbuild");
const packageInfo = require('./package.json');

console.log(`Building ${packageInfo.name} v${packageInfo.version}`);

buildSync({
  entryPoints: ["src/GetAppCLI.ts"], // Entry point of your CLI
  outfile: "dist/GetAppCLI.js",       // Output file
  bundle: true,                  // Bundle all files
  platform: "node",              // Target Node.js
  target: "node16",              // Specify Node.js version
  sourcemap: false,               // Disable sourcemaps for simplicity
  minify: false,                  // Minify the output
  define: {                      // Define environment variables
    "process.env.VERSION": JSON.stringify(packageInfo.version),
  },
});

console.log("Build complete: dist/GetAppCLI.js");
