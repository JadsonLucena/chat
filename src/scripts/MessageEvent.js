import Emitter from 'https://cdn.jsdelivr.net/gh/JadsonLucena/Emitter.mjs@2.0.0/src/Emitter.js'

export default class ME {
	#emitter

	constructor(crypto) {
		this.#emitter = new Emitter()
		this.crypto = crypto

		window.addEventListener('message', e => this.#emitter.emit('message', e))
	}

	send(message) {
		window.parent.postMessage(message, '*')
	}

	on(event, listener) {
		this.#emitter.on(event, listener)
	}
}