"use strict";

/**
 * Configuration file where you can store error codes for responses
 *
 * It's just a storage where you can define your custom API errors and their description.
 * You can call then in your action res.ok(data, sails.config.errors.USER_NOT_FOUND);
 */

module.exports = {
  errors: {
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


    // Client Errors

    BAD_REQUEST: {
      code: 'E_BAD_REQUEST',
      message: 'The request cannot be fulfilled due to bad syntax.',
      status: 400
    },

    UNAUTHORIZED: {
      code: 'E_UNAUTHORIZED',
      message: 'The authentication token is missing or invalid.',
      status: 401
    },

    USER_NOT_FOUND: {
      code: 'E_USER_NOT_FOUND',
      message: 'An user with specified credentials was not found.',
      status: 401
    },

    FORBIDDEN: {
      code: 'E_FORBIDDEN',
      message: 'The user is not authorized to access the requested resource.',
      status: 403
    },

    NOT_FOUND: {
      code: 'E_NOT_FOUND',
      message: 'The requested resource could not be found.',
      status: 404
    },

    NOT_ALLOWED: {
      code: 'E_NOT_ALLOWED',
      message: 'The user is not allowed to perform the attempted operation.',
      status: 405
    },

    NOT_ACCEPTABLE: {
      code: 'E_NOT_ACCEPTABLE',
      message: 'The requested resource is not available in the specified format.',
      status: 406
    },

    GONE: {
      code: 'E_GONE',
      message: 'The requested resource is not available anymore.',
      status: 410
    },

    UNSUPPORTED_MEDIA_TYPE: {
      code: 'E_UNSUPPORTED_MEDIA_TYPE',
      message: 'The format provided is not supported.',
      status: 415
    },


    // Server Errors

    SERVER_ERROR: {
      code: 'E_INTERNAL_SERVER_ERROR',
      message: 'Something bad happened on the server.',
      status: 500
    },

    NOT_IMPLEMENTED: {
      code: 'E_NOT_IMPLEMENTED',
      message: 'The attempted operation is not supported.',
      status: 501
    }
  }
};