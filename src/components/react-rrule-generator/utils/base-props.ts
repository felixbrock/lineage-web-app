export interface BaseProps {
  id: string,
  handleChange: (event: any) => any,
  translations: object | (() => any)
}