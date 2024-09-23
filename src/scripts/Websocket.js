import Emitter from 'https://cdn.jsdelivr.net/gh/JadsonLucena/Emitter.mjs@2.0.0/src/Emitter.js'

export default class WS {
	#emitter
	#webSocket

	constructor(websocketURL) {
		this.#emitter = new Emitter()
		this.#webSocket = new WebSocket(websocketURL)
		this.#webSocket.onclose = e => this.#emitter.emit('close', e)
		this.#webSocket.onerror = e => this.#emitter.emit('error', e)
		this.#webSocket.onopen = e => this.#emitter.emit('open', e)
		this.#webSocket.onmessage = e => this.#emitter.emit('message', e)

	}

	// async close() {
	// 	this.#webSocket.close()
	// }

	send(message) {
		this.#webSocket.send(message)
	}

	on(event, listener) {
		this.#emitter.on(event, listener)
	}
}