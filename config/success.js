module.exports = {
    success: {
        OK: {
            code: 'OK',
            message: 'The operation was executed successfully.',
            status: 200
        },

        CREATED: {
            code: 'CREATED',
            message: 'A new resource was created succesfully.',
            status: 201
        },

        ACCEPTED: {
            code: 'ACCEPTED',
            message: 'The request was accepted but is not processed yet.',
            status: 202
        },

        NO_CONTENT: {
            code: 'NO_CONTENT',
            message: 'The operation was executed successfully.',
            status: 204
        },

        PARTIAL_CONTENT: {
            code: 'PARTIAL_CONTENT',
            message: 'The requested resource was delivered partially.',
            status: 206
        },
    }
}