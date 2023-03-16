export class Components {
	elementName: string
	elements:
		| { [key: string]: any }
		| { [key: string]: Element }
		| { [key: string]: HTMLElement }
		| { [key: string]: HTMLElement[] }
		| { [key: string]: HTMLFormElement }
		| { [key: string]: HTMLFormElement[] }
		| { [key: string]: HTMLInputElement }
		| { [key: string]: HTMLInputElement[] }

	constructor(elementName: string, elementDatas: {}) {
		this.elementName = elementName
		this.elements = this.#getElements(elementDatas[this.elementName])
	}

	#getElements(childrens) {
		const elements = {}
		for (const keys in childrens) {
			const value = childrens[keys]

			if (value instanceof Object) {
				elements[keys] = this.#getElements(value)
			} else {
				elements[keys] = [...document.querySelectorAll(value)]
				if (elements[keys].length === 0) {
					elements[keys] = null
				} else if (elements[keys].length === 1) {
					elements[keys] = document.querySelector(value)
				}
			}
		}

		return elements
	}
}
