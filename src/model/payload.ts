import { State } from "./state"

export class App {
  key: keyof State.App
  value?: any
  constructor(key: keyof State.App, value: any) {
    this.key = key
    this.value = value
  }
}