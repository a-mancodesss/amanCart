import { unstable_cache as nextCache } from "next/cache";//all stuffs in next caching
import { cache as reactCache } from "react";//for request memoization
type callBack = (...args: any[]) => Promise<any>;
export function cache<T extends callBack>(
  cb: T,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] } = {}
) {
    return nextCache(reactCache(cb),keyParts,options)
}
