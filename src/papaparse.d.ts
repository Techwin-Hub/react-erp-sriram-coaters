declare module 'papaparse' {
  export function parse(file: File, options: any): any;
  export function unparse(data: any[]): string;
}