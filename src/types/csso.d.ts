declare module 'csso' {
  interface MinifyResult {
    css: string
    map?: object
  }

  export function minify(css: string, options?: {
    sourceMap?: boolean
    filename?: string
    debug?: boolean
  }): MinifyResult
} 