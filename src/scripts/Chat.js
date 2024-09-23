export default class Chat {
	constructor({ messageBroker, roomName, status = 'online' }) {
		this.messageBroker = messageBroker
		this.roomName = roomName
		
		this.me = this.getMe()
		this.users = []

		this.messages = []

		sessionStorage.setItem('chat-user', JSON.stringify(me))

		messageBroker.on('message', e => {
			let data = JSON.parse(e.data)

			if (this.validateMessage(data)) {
				switch(data.type) {
					case 'participant':
						this.addUser(data)
					break
					case 'message':
						this.addMessage(data)
					break
					case 'user:settings':
					
					break
					case 'message:settings':
					
					break
				}
			}
		})

		this.addUser({
			...this.me,
			status
		})
	}

	addMessage(message) {
		this.messages.push(message)

		this.showMessage(message)
	}

	addUser({
		id,
		name,
		thumb,
		status
	}) {
		users[id] = {
			name,
			thumb,
			status
		}

		this.messageBroker.send(JSON.stringify({
			type: 'participant',
			roomName,
			data: {
				id: id,
				name: name,
				thumb: thumb,
				status
			}
		}))
	}

	showMessage(message) {
		const user = users[message.sourceUserId.trim()]

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
			<footer>${new Date(message.dateTime.trim()).toLocaleString()}</footer>
		</li>`)
	}

	getMe() {
		const me = sessionStorage.getItem('chat-user')

		if (
			!me ||
			(
				searchParams.has('userId') && searchParams.get('userId') != me.id ||
				searchParams.has('userName') && searchParams.get('userName') != me.name ||
				searchParams.has('userThumb') && searchParams.get('userThumb') != me.thumb
			)
		) {
			return {
				id: searchParams.get('userId') || crypto.randomUUID(),
				name: searchParams.get('userName') || prompt(`What's your name?`),
				thumb: searchParams.get('userThumb'),
			}
		}

		return JSON.parse(me)
	}

	sendMessage(message, {
		targetUserId,
		sourceMessageId
	}) {
		this.messageBroker.send(JSON.stringify({
			type: 'message',
			roomName: this.roomName,
			sourceMessageId,
			sourceUserId: this.me.id,
			targetUserId,
			data: {
				id: crypto.randomUUID(),
				type: 'text/plain',
				payload: message
			},
			dateTime: Date.now()
		}))
	}

	async sendFile(targetUserId, file, {
		sourceMessageId,
		description
	}) {
		this.messageBroker.send(JSON.stringify({
			type: 'chat',
			roomName: this.roomName,
			sourceMessageId,
			sourceUserId: this.me.id,
			targetUserId,
			data: {
				id: crypto.randomUUID(),
				type: file.type,
				payload: await this.loadFileAsBase64(file),
				name: file.name,
				description
			},
			dateTime: Date.now()
		}))
	}

	loadFileAsBase64(file) {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader()
			fileReader.onload = e => resolve(e.target.result)
			fileReader.onerror = e => reject(e.target.error)
			fileReader.readAsDataURL(file)
		})
	}

	validateMessage(message) {
		// this.verifySignature(message)
	}
	verifySignature(message) {}
}