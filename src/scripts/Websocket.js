import Emitter from 'https://cdn.jsdelivr.net/gh/JadsonLucena/Emitter.mjs@2.0.0/src/Emitter.js'

export default class WS {
	#emitter
	#webSocket

	constructor(websocketURL) {
		this.#emitter = new Emitter()
		this.websocketURL = websocketURL
	}

	async start() {
		this.#webSocket = new WebSocket(websocketURL)
		this.#webSocket.onclose = e => this.#emitter.emit('close', e)
		this.#webSocket.onmessage = e => this.#emitter.emit('message', e)

		await new Promise((resolve, reject) => {
			this.#webSocket.onopen = e => {
				resolve(e)
				this.#emitter.emit('open', e)
			}
			this.#webSocket.onerror = e => {
				reject(e)
				this.#emitter.emit('error', e)
			}
		})
	}

	send(message) {
		this.#webSocket.send(message)
	}

	on(event, listener) {
		this.#emitter.on(event, listener)
	}
}