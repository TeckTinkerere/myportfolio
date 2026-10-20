// Web NFC (https://w3c.github.io/web-nfc/). Chrome on Android only, and not
// yet in TypeScript's DOM lib, so the parts this app uses are declared here.

interface NDEFRecordInit {
  recordType: string
  mediaType?: string
  id?: string
  encoding?: string
  lang?: string
  data?: string | BufferSource | NDEFMessageInit
}

interface NDEFMessageInit {
  records: NDEFRecordInit[]
}

interface NDEFRecord {
  readonly recordType: string
  readonly mediaType?: string
  readonly id?: string
  readonly data?: DataView
  readonly encoding?: string
  readonly lang?: string
}

interface NDEFMessage {
  readonly records: ReadonlyArray<NDEFRecord>
}

interface NDEFReadingEvent extends Event {
  readonly serialNumber: string
  readonly message: NDEFMessage
}

declare class NDEFReader extends EventTarget {
  constructor()
  onreading: ((this: NDEFReader, event: NDEFReadingEvent) => void) | null
  onreadingerror: ((this: NDEFReader, event: Event) => void) | null
  scan(options?: { signal?: AbortSignal }): Promise<void>
  write(message: string | NDEFMessageInit, options?: { overwrite?: boolean; signal?: AbortSignal }): Promise<void>
  makeReadOnly(options?: { signal?: AbortSignal }): Promise<void>
}
