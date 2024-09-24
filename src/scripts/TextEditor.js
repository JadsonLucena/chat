import BalloonEditor from 'https://cdn.ckeditor.com/ckeditor5/41.4.2/balloon/ckeditor.js'

export default class TextEditor {
	constructor(field) {
		this.field = field
	}

	async start() {
		this.editor = await BalloonEditor.create(this.field, {
			placeholder: 'Message',
			toolbar: [
				'heading', 'paragraph', '|',
				'bold', 'italic', 'link', '|',
				'bulletedList', 'numberedList', 'todoList', '|',
				'code', 'codeBlock', 'blockQuote', '|',
				'undo', 'redo'
			]
		})

		await editor.focus()
	}

	getMessage() {
		return this.editor.getData()
	}

	clean() {
		this.editor.setData('')
	}
}