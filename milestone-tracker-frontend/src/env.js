const viteEnv = import.meta.env
export const env = { ...viteEnv, ...window['env'] }