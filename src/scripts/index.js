import WS from './Websocket.js'
import ME from './MessageEvent.js'
import Chat from './Chat.js'
import TextEditor from './TextEditor.js'
import User from './User.js'
import CryptoRSA from './CryptoRSA.js'

const searchParams = new URLSearchParams(location.search)

const roomName = searchParams.get('roomName') || prompt("What's the room's name?")
const webSocketConnection = searchParams.get('websocketURL')

document.title = roomName

const form = document.querySelector('body > footer > form')
const attachment = document.querySelector('body > footer > form > label > input#attachment')
const message = document.querySelector('body > footer > form > div#message')
const send = document.querySelector('body > footer > form > button#send')

let messageBroker
if (webSocketConnection) {
	messageBroker = new WS(webSocketConnection)
	await messageBroker.start()
} else {
	messageBroker = new ME()
}

const textEditor = new TextEditor(message)
await textEditor.start()

const user = new User()

const cryptoRSA = new CryptoRSA()
await cryptoRSA.start()

const chat = new Chat(roomName, cryptoRSA)

messageBroker.send(JSON.stringify(this.user.inviteCommand(cryptoRSA)))

messageBroker.on('message', e => {
	let message = JSON.parse(e.data)

	switch(message.type) {
		case 'participant':
			user.exec(message.data)
		break
		case 'chat':
			chat.exec(message.data)
		break
		case 'user:settings':
		
		break
		case 'chat:settings':
		
		break
	}
})

form.addEventListener('submit', async e => {
	e.preventDefault()

	messageBroker.send(JSON.stringify(chat.messageCommand(textEditor.getMessage())))

	textEditor.clean()
})

attachment.addEventListener('change', e => {
	e.preventDefault()

	messageBroker.send(JSON.stringify(chat.attachmentCommand(attachment.files[0], {
		description: textEditor.getMessage()
	})))

	textEditor.clean()
	form.reset()
})