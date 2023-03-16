import { $ } from '@roger.b/functions'
import { ValidatorInterface } from '@roger.b/types'
import { NotFoundError } from '../Errors'

export class Validator {
	formElement: HTMLFormElement
	inputs: HTMLInputElement[]
	validationObject: ValidatorInterface
	private validationCount: number
	private count: number
	callback: CallableFunction

	constructor(formElement: HTMLFormElement, validationObject: ValidatorInterface, callback: CallableFunction) {
		this.formElement = formElement
		this.validationObject = Object.assign({}, validationObject)
		this.validationCount = 0
		this.count = 0
		this.callback = callback
		this.init()
	}

	init() {
		this.eventListener()
	}

	fieldsHandler() {
		const { fields } = this.validationObject
		this.count = 0
		this.validationCount = 0

		fields.forEach((field) => {
			//set useful var
			const input = $(`[name='${field.fieldName}']`) as HTMLInputElement
			const value: string = input.value
			const errorWrapper = input.parentNode?.querySelector(field.errorWrapper)

			//if validation is not set do nothing
			if (!field.validator) return

			//field empty validation condition
			if (field.validator.notEmpty && errorWrapper) {
				let isValid: number = 0
				if (value === '') {
					errorWrapper.textContent = field.validator.notEmpty.message
				} else {
					isValid++
				}
				if (isValid !== 0) {
					this.validationCount++
					errorWrapper.textContent = ''
				}
			}

			//email validation condition
			if (field.validator.regexp && field.validator.regexp.regexp && errorWrapper) {
				const userRegexp: boolean | RegExp = field.validator.regexp.regexp
				const defaultRegexp: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
				let validation: boolean = false
				let isValid: number = 0

				if (typeof userRegexp === 'boolean') {
					validation = defaultRegexp.test(value)
					if (!validation) {
						errorWrapper.textContent = field.validator.regexp.message
					} else {
						isValid++
					}
				} else if (userRegexp.constructor === RegExp) {
					validation = userRegexp.test(value)
					if (!validation) {
						errorWrapper.textContent = field.validator.regexp.message
					} else {
						isValid++
					}
				}

				if (isValid !== 0) {
					this.validationCount++
					errorWrapper.textContent = ''
				}
			}

			//Verified is two field is same
			if (field.validator.isSameWith && errorWrapper) {
				let isValid: number = 0
				const otherField: HTMLInputElement = field.validator.isSameWith.fieldToCompare
				let otherFieldValue: string

				if (!otherField) {
					this.showError(otherField, `Impossible de trouver un élément HTML liée à : ${field.validator.isSameWith.fieldToCompare}`)
					return
				}
				otherFieldValue = otherField.value
				if (value !== otherFieldValue) {
					errorWrapper.textContent = field.validator.isSameWith.message
				} else {
					isValid++
				}
				if (isValid !== 0) {
					this.validationCount++
					errorWrapper.textContent = ''
				}
			}

			if (this.validationCount === Object.keys(field.validator).length) {
				this.count++
			}

			this.validationCount = 0
		})
	}

	isValid() {
		return this.count === this.formElement.length - 1
	}

	onSumbit(e: Event) {
		e.preventDefault()
		this.fieldsHandler()
		console.log(e, this.isValid())
		if (!this.isValid()) return
		this.callback(this.formElement, this.formElement.action)
	}

	showError(element: HTMLElement, message: string) {
		const error = new NotFoundError({ message: message, element: element })
		console.error(error.message + error.stack)
	}

	eventListener() {
		this.formElement.addEventListener('submit', this.onSumbit.bind(this))
	}
}
