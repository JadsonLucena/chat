export default class Chat {
	constructor(roomName, cryptoRSA) {
		this.roomName = roomName
		this.cryptoRSA = cryptoRSA

		const messages = sessionStorage.getItem(`chat:messages:${roomName}`)
		this.messages = messages ? JSON.parse(messages) : []

		this.#loadMessages()
	}

	messageCommand(message, {
		targetUserId = undefined,
		sourceMessageId = this.me.id
	} = {}) {
		return {
			type: 'chat',
			roomName: this.roomName,
			sourceMessageId,
			sourceUserId: this.me.id,
			targetUserId,
			data: this.cryptoRSA.encrypt(JSON.stringify({
				id: crypto.randomUUID(),
				type: 'text/plain',
				payload: message,
				timestamp: Date.now()
			}))
		}
	}

	async attachmentCommand(file, {
		targetUserId = undefined,
		sourceMessageId,
		description
	} = {}) {
		return {
			type: 'chat',
			roomName: this.roomName,
			sourceMessageId,
			sourceUserId: this.me.id,
			targetUserId,
			data: this.cryptoRSA.encrypt(JSON.stringify({
				id: crypto.randomUUID(),
				type: file.type,
				payload: await this.#loadFileAsBase64(file),
				name: file.name,
				description,
				timestamp: Date.now()
			})),
		}
	}

	exec(message) {
		if (this.#validateMessage(message)) {
			message.data = JSON.parse(this.cryptoRSA.decrypt(message.data))

			this.messages[message.id] = message

			sessionStorage.setItem(`chat:messages:${roomName}`, JSON.stringify(this.messages))

			this.#showMessage(message)
		}
	}

	#loadMessages() {
		const sortedMessages = Object.values(this.messages).sort((a, b) => a.data.timestamp - b.data.timestamp)

		for (const message of sortedMessages) {
			this.#showMessage(message)
		}
	}

	#showMessage(message) {
		const user = this.users[message.sourceUserId.trim()]

		const channels = message.targetUserId?.trim() ? `ul.channels[class~='${message.targetUserId?.trim()}']` : `ul[class='channels']`

		document.querySelector(channels).insertAdjacentHTML('afterbegin', `<li id="${message.data.id.trim()}" class="${me.id == message.sourceUserId.trim() ? 'me': message.sourceUserId.trim()}">
			<header>
				<figure title="${user.name}">
					<img src="${user.thumb}" alt="${user.name}">
					<figcaption>${user.name}</figcaption>
				</figure>
				<span title="Menu">:</span>
			</header>
			<section>${message.data.payload.trim()}</section>
			<footer>${new Date(message.data.timestamp).toLocaleString()}</footer>
		</li>`)
	}

	#loadFileAsBase64(file) {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader()
			fileReader.onload = e => resolve(e.target.result)
			fileReader.onerror = e => reject(e.target.error)
			fileReader.readAsDataURL(file)
		})
	}

	#validateMessage(message) {}
}