import Constants from "expo-constants";

// In dev, follow the machine Metro is served from, so the phone on the same Wi-Fi reaches the
// laptop's server and Supabase. `hostUri` looks like "192.168.1.8:8081".
export function metroHost(): string | undefined {
  return Constants.expoConfig?.hostUri?.split(":")[0] || undefined;
}

/** A service on the dev laptop given as localhost, made reachable from the phone through Metro's host. */
export function reachableInDev(url: string): string {
  if (!__DEV__) return url;
  const host = metroHost();
  return host ? url.replace(/\/\/(localhost|127\.0\.0\.1)(?=[:/]|$)/, `//${host}`) : url;
}
