export class NotFoundError extends Error{
	constructor(errorObject : {message: string, property?: string, element: any}) {
		super(errorObject.message)
		this.name = "NotFoundError"
	}
}
