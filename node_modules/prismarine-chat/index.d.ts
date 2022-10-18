declare const loader: (registryOrVersion) => typeof ChatMessage

declare class ChatMessage {
  // for export
  static MessageBuilder: typeof MessageBuilder

  /**
   * @param message content of ChatMessage
   */
  constructor(
    message: string | number | MessageBuilder | MessageBuilder[],
    displayWarning?: boolean
  )

  public readonly json: any

  /**
   * Append one or more ChatMessages
   */
  append(...messages: object[] | string[]): void

  /**
   * Returns a clone of the ChatMessage
   */
  clone(): ChatMessage
  
  /**
   * Optional info with no guarantee for form or shape.
   */
  extra?: Array<ChatMessage>

  translate?: string

  /**
   * Flattens the message into plain-text, without style.
   */
  toString(language?: Language): string

  /**
   * Flattens the message into text containing `§x` style codes.
   */
  toMotd(language?: Language, parent?: object): string

  /**
   * Flattens the message into text styled with ANSI escape sequences.
   * Useful for printing to the console.
   * See also https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters
   */
  toAnsi(language?: Language): string

  /**
   * Returns the count of text extras and child ChatMessages.
   * Does not count recursively in to the children.
   */
  length(): number

  /**
   * Returns a text part from the message.
   * @param idx Index of the part
   */
  getText(idx: number, language?: Language): string

  /**
   * Flattens the message into plain-text, without style.
   */
  valueOf(): string

  static fromNotch(str: string): ChatMessage
}

declare class MessageBuilder {
  with: string[]
  extra: string[]
  bold?: boolean
  italic?: boolean
  underlined?: boolean
  strikethrough?: boolean
  obfuscated?: boolean
  color?: string
  text?: string
  font?: string
  translate?: string
  insertion?: string
  keybind?: string
  score?: { name: string; objective: string }
  clickEvent?: object
  hoverEvent?: object

  setBold(val: boolean): this

  setItalic(val: boolean): this

  setUnderlined(val: boolean): this

  setStrikethrough(val: boolean): this

  setObfuscated(val: boolean): this

  setColor(val: Color): this

  setText(val: string): this

  /**
   * The resource location of the font for this component in the resource pack within `assets/<namespace>/font`.
   * @param {string} val Defaults to `minecraft:default`
   */
  setFont(val?: string): this

  /**
   * When used, it's expected that all slots for text will be filled using .addWith()
   */
  setTranslate(val: string): this

  /**
   * text shown when shift clicked on message
   */
  setInsertion(val: string): this

  /**
   * Overrode by .setText()
   * @example
   * builder.setKeybind('key.inventory')
   */
  setKeybind(val: string): this

  /**
   * Displays a score holder's current score in an objective.
   * Displays nothing if the given score holder or the given objective do not exist, or if the score holder is not tracked in the objective.
   * @param {string} name if '*', show reader their own score. Otherwise, this is the player's score shown. Can be a selector string, but must never select more than one entity.
   * @param {string} objective The internal name of the objective to display the player's score in.
   */
  setScore(name: string, objective: string): this

  /**
   * @example
   * builder.setClickEvent('open_url', 'https://google.com')
   * builder.setClickEvent('run_command', '/say Hi!') // for signs, the slash doesn't need to be there
   * builder.setClickEvent('suggest_command', '/say ')
   * builder.setClickEvent('change_page', '/say Hi!') // Can only be used in written books
   * builder.setClickEvent('copy_to_clipboard', 'welcome to your clipboard')
   */
  setClickEvent(
    action:
      | "open_url"
      | "run_command"
      | "suggest_command"
      | "change_page"
      | "copy_to_clipboard",
    value: string | number
  ): this

  setHoverEvent(
    action: "show_text",
    data: MessageBuilder,
    type?: "contents" | "value"
  ): this
  setHoverEvent(
    action: "show_entity",
    data: { displayName: string; name: string; uuid: string },
    type?: "contents"
  ): this
  setHoverEvent(
    action: "show_item",
    data: { name: string; count: number; nbt: any },
    type?: "contents" | "value"
  ): this

  /**
   * appended to the end of this message object with the existing formatting.
   * formatting can be overridden in child messagebuilder
   */
  addExtra(...args: Array<MessageBuilder | string>): this

  /**
   * requires .translate to be set for this to be used
   */
  addWith(...args: Array<MessageBuilder | string>): this

  resetFormatting(): void

  toJSON(): object

  toString(): string
  /**
   * fromString('&aHello').toJSON() => { text: 'Hello', color: 'aqua' }
   */
  static fromString(
    str: string,
    args?: { colorSeparator?: string }
  ): MessageBuilder

  // 1.19+
  static fromNetwork (messageType: number, parameters: Record<string, Object>): MessageBuilder
}

export default loader
export {
  ChatMessage
}

type Language = { [key: string]: string }

type Color =
  | "black"
  | "dark_blue"
  | "dark_green"
  | "dark_aqua"
  | "dark_red"
  | "dark_purple"
  | "gold"
  | "gray"
  | "dark_gray"
  | "blue"
  | "green"
  | "aqua"
  | "red"
  | "light_purple"
  | "yellow"
  | "white"
  | "obfuscated"
  | "bold"
  | "strikethrough"
  | "underlined"
  | "italic"
  | "reset"
