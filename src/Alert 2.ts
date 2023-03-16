import { $, createHTMLelement } from '@roger.b/functions'

export class Alert {
	message: string
	type: string
	self!: HTMLElement
	elementNodeRoot!: HTMLElement

	constructor(message: string, type: string) {
		this.message = message
		this.type = type
		this.init()
	}

	init() {
		this.create()
		this.self = $('.alert')
	}

	create() {
		this.elementNodeRoot = createHTMLelement('DIV', '', ['alert'])
		if (this.type === 'success') this.elementNodeRoot.classList.add('alert__success')
		else this.elementNodeRoot.classList.add('alert__error')

		const wrapper = createHTMLelement('DIV', '', ['alert__wrapper'])
		const content = createHTMLelement('DIV', '', ['alert__content'])
		const icon = createHTMLelement('SPAN', '', ['alert__icon'])
		const message = createHTMLelement('P', '', ['alert__message'])
		message.innerText = this.message

		const closeIcon = createHTMLelement('SPAN', '', ['alert__closeIcon'])
		const i = createHTMLelement('I', '', ['rob-close'])

		closeIcon.append(i)
		closeIcon.onclick = () => {
			this.hide()
			this.destroy()
		}

		// appned child
		content.append(icon, message)
		wrapper.append(content, closeIcon)
		this.elementNodeRoot.append(wrapper)
		document.body.prepend(this.elementNodeRoot)
		this.self = this.elementNodeRoot
		this.hide()
	}

	show() {
		setTimeout(() => {
			this.self.style.right = '.5rem'
		}, 1000)
	}

	hide() {
		this.self.style.right = '-100%'
		this.self.style.transition = 'right .6s'
	}

	destroy() {
		document.body.removeChild(this.elementNodeRoot)
	}
}
