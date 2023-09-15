const searchParams = new URLSearchParams(location.search);

const roomName = searchParams.get('roomName') || prompt("What's the room's name?");

document.title = roomName;

var me = localStorage.getItem('chat-user');

if (!me) {

	me = {
		id: searchParams.get('userId') || crypto.randomUUID(),
		name: searchParams.get('userName') || prompt("What's your name?"),
		thumb: searchParams.get('userThumb'),
	};

} else {

	me = JSON.parse(me);

	if (searchParams.has('userId') && searchParams.get('userId') != me.id) {

		me.id = searchParams.get('userId');

	}

	if (searchParams.has('userName') && searchParams.get('userName') != me.name) {

		me.name = searchParams.get('userName');

	}

	if (searchParams.has('userThumb') && searchParams.get('userThumb') != me.thumb) {

		me.thumb = searchParams.get('userThumb');

	}

}

localStorage.setItem('chat-user', JSON.stringify(me));

var users = [];

const form = document.querySelector('body > footer > form');
const attachment = document.querySelector('body > footer > form > label > input#attachment');
const message = document.querySelector('body > footer > form > div#message')
const send = document.querySelector('body > footer > form > button#send');


function showMessage(data) {

	try {
		
		let user = users[data.fromId.trim()];

		document.querySelector(`body > main > ul[class="${data.toId?.trim()}"]`).insertAdjacentHTML('afterbegin', `<li id="${data.message.id.trim()}" class="${me.id == data.fromId.trim() ? 'me': data.fromId.trim()}">

			<header>
				<figure title="${user.name}">
					<img src="${user.thumb}" alt="${user.name}">
					<figcaption>${user.name}</figcaption>
				</figure>
				<span title="Menu">:</span>
			</header>
			<section>${data.message.payload.trim()}</section>
			<footer>${new Date(data.dateTime.trim()).toLocaleString()}</footer>

		</li>`);

	} catch(err) {

		console.error(err);

	}

}


attachment.addEventListener('input', e => {

	var fileReader = new FileReader();
	fileReader.onload = e => {

		const message = JSON.stringify({
			type: 'message',
			roomName,
			fromId: me.id,
			toId: document.querySelector('header > ol > li.selected').getAttribute('id'),
			message: {
				id: crypto.randomUUID(),
				payload: fileReader.result
			},
			dateTime: Date.now()
		});

		window.parent.postMessage(message, '*');

		if (webSocket) {

			webSocket.binaryType = 'arraybuffer';

			webSocket.send(message);

		}

	};
	fileReader.readAsArrayBuffer(e.target.files.item(0));

});

form.addEventListener('submit', e => { e.preventDefault();

	const message = JSON.stringify({
		type: 'message',
		roomName,
		fromId: me.id,
		toId: document.querySelector('header > ol > li.selected').getAttribute('id'),
		message: {
			id: crypto.randomUUID(),
			payload: message.innerHTML
		},
		dateTime: Date.now()
	});

	window.parent.postMessage(message, '*');

	if (webSocket) {

		webSocket.binaryType = 'blob';

		webSocket.send(message);

	}

});