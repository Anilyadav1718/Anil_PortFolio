const fs = require('fs');
const path = require('path');

try {
  // 1. Sync app-paths-manifest.json
  const routesManifestPath = path.join(process.cwd(), '.next', 'app-path-routes-manifest.json');
  const appPathsPath = path.join(process.cwd(), '.next', 'server', 'app-paths-manifest.json');

  if (fs.existsSync(routesManifestPath) && fs.existsSync(appPathsPath)) {
    const routesManifest = JSON.parse(fs.readFileSync(routesManifestPath, 'utf8'));
    const appPaths = JSON.parse(fs.readFileSync(appPathsPath, 'utf8'));

    let updated = false;
    for (const key of Object.keys(routesManifest)) {
      if (!appPaths[key]) {
        const filePath = 'app' + (key.startsWith('/') ? key : '/' + key) + '.js';
        appPaths[key] = filePath;
        updated = true;
      }
    }

    if (updated) {
      fs.writeFileSync(appPathsPath, JSON.stringify(appPaths, null, 2), 'utf8');
      console.log('✓ Synced all routes into app-paths-manifest.json');
    }
  }

  // 2. Ensure server chunks are mirrored to .next/server for standalone execution
  const chunksDir = path.join(process.cwd(), '.next', 'server', 'chunks');
  const serverDir = path.join(process.cwd(), '.next', 'server');

  if (fs.existsSync(chunksDir)) {
    const files = fs.readdirSync(chunksDir);
    for (const file of files) {
      const src = path.join(chunksDir, file);
      const dest = path.join(serverDir, file);
      if (!fs.existsSync(dest) && fs.statSync(src).isFile()) {
        fs.copyFileSync(src, dest);
      }
    }
    console.log('✓ Mirrored server chunks for reliable execution');
  }
} catch (err) {
  console.warn('Postbuild script warning (non-fatal):', err);
}

