export default class User {
	constructor(roomName) {
		this.me = this.#getMe()
		
		sessionStorage.setItem(`chat:users:me:${roomName}`, JSON.stringify(this.me))
		
		const users = sessionStorage.getItem(`chat:users:${roomName}`)
		this.users = users ? JSON.parse(users) : []
	}

	exec(message) {
		if (this.#validateMessage(message)) {
			this.users[message.data.id] = message.data

			sessionStorage.setItem(`chat:users:${roomName}`, JSON.stringify(this.users))
		}
	}

	inviteCommand(publicKey) {
		return {
			type: 'participant',
			roomName: this.roomName,
			data: {
				id: undefined,
				name: this.me.name,
				thumb: this.me.thumb,
				status: this.me.status,
				publicKey,
				timestamp: Date.now()
			}
		}
	}

	changeStatus(status) {
		// enum
		this.me.status = status
		sessionStorage.setItem(`chat:users:me:${roomName}`, JSON.stringify(this.me))
	}

	#getMe() {
		const me = sessionStorage.getItem(`chat:users:me:${roomName}`)
		const searchParams = new URLSearchParams(location.search)

		if (
			!me ||
			(
				searchParams.has('user_id') && searchParams.get('user_id') != me.id ||
				searchParams.has('user_name') && searchParams.get('user_name') != me.name ||
				searchParams.has('user_thumb') && searchParams.get('user_thumb') != me.thumb ||
				searchParams.has('user_status') && searchParams.get('user_status') != me.status
			)
		) {
			return {
				id: searchParams.get('user_id') || crypto.randomUUID(),
				name: searchParams.get('user_name') || prompt(`What's your name?`),
				thumb: searchParams.get('user_thumb'),
				status: searchParams.get('user_status') || 'online'
			}
		}

		return JSON.parse(me)
	}

	#validateMessage(message) {}
}