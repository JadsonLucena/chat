import WS from './Websocket.js'
import ME from './MessageEvent.js'
import Chat from './Chat.js'

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
} else {
	messageBroker = new ME()
}

const chat = new Chat({ messageBroker, roomName })