declare module "*.sql?raw" {
  const source: string;
  export default source;
}

declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {}
}
