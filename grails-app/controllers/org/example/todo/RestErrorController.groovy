package org.example.todo

import grails.converters.JSON

/**
 * Controller for rendering errors for the frontend.
 */
class RestErrorController {

    static final String ERR_MESSAGE = 'Application error happened, see log for details'

    /**
     * Renders the universal application error.
     * @return universal application error as JSON
     */
    def index() {
        log.error("Error happened and propagated to the user", request.exception)
        render(text: ([errors: [[message: ERR_MESSAGE]]] as JSON).toString(true), status: 500)
    }
}
