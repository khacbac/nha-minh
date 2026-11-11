const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch workspace packages used by mobile (not the entire monorepo)
config.watchFolders = [
  path.resolve(workspaceRoot, "packages"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Limit transformer workers to reduce memory pressure
config.maxWorkers = 2;

// Let Metro know where to resolve packages from
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Prevent duplicate React instances with pnpm hoisting
config.resolver.disableHierarchicalLookup = true;

// Force React singletons from workspace root to avoid hook errors
config.resolver.extraNodeModules = {
  react: path.resolve(workspaceRoot, "node_modules/react"),
  "react-native": path.resolve(workspaceRoot, "node_modules/react-native"),
  "react-dom": path.resolve(workspaceRoot, "node_modules/react-dom"),
};

// Exclude nested node_modules in workspace packages from bundling
config.resolver.blockList = [/packages\/.*\/node_modules\/.*/];

// Workspace packages (@sonha/*) resolve to their TypeScript source. Their source uses
// ESM-style ".js" specifiers, which Metro doesn't map to ".ts" on its own. Rewrite
// ".js" -> "" for relative imports inside packages/ so Metro finds the .ts source.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName.startsWith(".") &&
    moduleName.endsWith(".js") &&
    context.originModulePath.includes(`${path.sep}packages${path.sep}`)
  ) {
    return context.resolveRequest(context, moduleName.slice(0, -3), platform);
  }
  return (originalResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
};

// NativeWind defaults native rem to 14; pin it to 16 so scale classes match Tailwind and the
// design (`px-4` = 16, not 14).
module.exports = withNativeWind(config, { input: "./src/global.css", inlineRem: 16 });
