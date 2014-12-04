package org.example.todo

import grails.test.spock.IntegrationSpec

import javax.servlet.http.HttpServletResponse

/**
 * Specification for RestErrorController.
 *
 * Instead of forwarding the frontend application to the view, render the JSON errors array.
 */
class RestErrorControllerSpec extends IntegrationSpec {

    RestErrorController controller = new RestErrorController()

    void "got 500 and a error message"() {
        controller.request.exception = new NullPointerException("Very common...")

        when:
        controller.index()

        def result = controller.response.json

        then:
        controller.response.status == 500
        result
        result.errors
        result.errors[0].message == RestErrorController.ERR_MESSAGE
    }
}
