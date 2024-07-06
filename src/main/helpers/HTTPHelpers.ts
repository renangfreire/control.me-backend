interface HttpErrorResponse {
    status: number,
    body: Error
}

export const conflict = (error: Error) : HttpErrorResponse => {
    return {
        status: 409,
        body: error
    }
}

export const unauthorized = (error: Error): HttpErrorResponse => {
    return {
        status: 401,
        body: error
    }
}

export const badRequest = (error: Error): HttpErrorResponse => {
    return {
        status: 400,
        body: error
    }
}

export const serverError = (error: Error): HttpErrorResponse => {
    return {
        status: 500,
        body: error
    }
}