import { defineRailway, github, project, service } from "railway/iac";

// The API server (dev/guides/backend.md §2). Railway builds apps/server/Dockerfile from the repo
// root on every push to master that touches a watch path. Apply changes here with
// `railway config plan` / `railway config apply`; Railway doesn't read this file on deploy.
export default defineRailway(() => {
  const server = service("nha-minh-server", {
    source: github("khacbac/nha-minh", { branch: "master", checkSuites: false }),
    build: {
      buildCommand: "",
      buildEnvironment: "V3",
      builder: "DOCKERFILE",
      dockerfilePath: "apps/server/Dockerfile",
      watchPatterns: [
        "apps/server/**",
        "packages/types/**",
        "package.json",
        "pnpm-lock.yaml",
        "pnpm-workspace.yaml",
        "tsconfig.base.json",
        ".railway/**",
      ],
    },
    healthcheck: "/health",
    healthcheckTimeout: 30,
    replicas: { "asia-southeast1-eqsg3a": 1 },
  });

  return project("nha-minh", {
    // SUPABASE_URL / SUPABASE_SECRET_KEY are set with `railway variables`, not kept here.
    variables: { managed: false },
    resources: [server],
  });
});
