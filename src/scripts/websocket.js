var webSocket;

if (searchParams.has('websocketURL')) {

	webSocket = new WebSocket(searchParams.get('websocketURL'));

	webSocket.onclose = e => alert('WebSocket Closed');

	webSocket.onerror = e => alert(`WebSocket Error`);

	webSocket.onopen = e => {

		webSocket.onmessage = async e => {

			let data = JSON.parse(e.data);

			if (validateMessage(data)) {
				
				switch(data.type) {
					case 'participant':

						users[date.id] = {
							name: date.name,
							thumb: date.thumb || './images/person.svg'
						}

					break;
					case 'message':

						showMessage(data);

					break;
					case 'user:settings':
					
					break;
					case 'message:settings':
					
					break;
				}

			}

		};

	};

	webSocket.send(JSON.stringify({
		type: 'participant',
		roomName,
		id: me.id,
		name: me.name,
		thumb: me.thumb
	}));

}