export type Message = {
  id: string
  user: string
  text: string
  ts: number
  type?: 'user' | 'system'
}
