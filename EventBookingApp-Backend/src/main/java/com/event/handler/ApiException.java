package com.event.handler;

public class ApiException extends RuntimeException {
    private final int statusCode;
    private final Object errors;

    public ApiException(int statusCode, String message) {
        super(message);
        this.statusCode = statusCode;
        this.errors = null;
    }

    public ApiException(int statusCode, String message, Object errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
    }

    public int getStatusCode() { return statusCode; }
    public Object getErrors() { return errors; }
}
