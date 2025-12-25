declare module 'pdfjs-dist' {
  export function getDocument(src: any, options?: any): {
    promise: Promise<{
      numPages: number
      getPage: (pageNumber: number) => Promise<{
        getViewport: (options: { scale: number }) => {
          width: number
          height: number
        }
        render: (options: {
          canvasContext: CanvasRenderingContext2D
          viewport: { width: number; height: number }
        }) => {
          promise: Promise<void>
        }
      }>
    }>
  }>
  export const GlobalWorkerOptions: {
    workerSrc: string
  }
  export type PDFDocumentProxy = any
}

