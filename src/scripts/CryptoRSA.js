export default class CryptoRSA {
	#privateKey
	#publicKey
	constructor() {
		this.#privateKey = undefined
		this.#publicKey = undefined
	}
	get publicKey() {
		return this.#publicKey
	}

	async start() {
		this.#privateKey = sessionStorage.getItem('crypto:privateKey')
		this.#publicKey = sessionStorage.getItem('crypto:publicKey')

		if (!this.#privateKey || !this.#publicKey) {
			const keyPair = await crypto.subtle.generateKey({
				name: 'RSA-OAEP',
				modulusLength: 2048,
				publicExponent: new Uint8Array([1, 0, 1]),
				hash: 'SHA-256'
			}, true, ['encrypt', 'decrypt'])

			this.#privateKey = keyPair.privateKey
			this.#publicKey = keyPair.publicKey

			sessionStorage.setItem('crypto:privateKey', this.#privateKey)
			sessionStorage.setItem('crypto:publicKey', this.#publicKey)
		}
	}

	encrypt(message) {
		return crypto.subtle.encrypt({
			name: 'RSA-OAEP'
		}, this.#publicKey, new TextEncoder().encode(message))
	}
	decrypt(message) {
		return crypto.subtle.decrypt({
			name: 'RSA-OAEP'
		}, this.#privateKey, message)
	}
}