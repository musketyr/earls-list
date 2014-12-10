import grails.test.mixin.Mock
import grails.test.mixin.TestFor
import junit.framework.AssertionFailedError
import org.codehaus.groovy.grails.commons.GrailsControllerClass
import org.codehaus.groovy.grails.web.mapping.UrlMappingsHolder
import org.example.todo.ItemController
import spock.lang.Specification

@TestFor(UrlMappings) @Mock(ItemController)
class UrlMappingSpec extends Specification {

    void "test item rest endpoints ready"() {
        expect:
        assertRestForwardUrlMapping(method, url,
                controller: "item",
                action: action, paramsToCheck)

        where:
        method      | action   | url       | paramsToCheck
        "GET"       | "index"  | "/item/"  | {}
        "POST"      | "save"   | "/item/"  | {}
        "PUT"       | "update" | "/item/1" | { id = "1" }
        "DELETE"    | "delete" | "/item/1" | { id = "1" }
    }

    /**
     * Sadly this is not in standard test API, its similar to assertForwardUrlMapping method but includes also
     * assertion about the method.
     *
     * @param assertions assertions such as controller and action
     * @param method HTTP method
     * @param url tested url
     * @param paramAssertions parameter assertions
     */
    private void assertRestForwardUrlMapping(Map assertions, String method, String url, Closure paramAssertions) {
        UrlMappingsHolder mappingsHolder = applicationContext.getBean("grailsUrlMappingsHolder", UrlMappingsHolder)
        if (assertions.action && !assertions.controller) {
            throw new AssertionFailedError("Cannot assert action for url mapping without asserting controller")
        }

        if (assertions.controller) assertController(assertions.controller, url)
        if (assertions.action) assertAction(assertions.controller, assertions.action, url)
        if (assertions.view) assertView(assertions.controller, assertions.view, url)

        def mappingInfos
        if (url instanceof Integer) {
            mappingInfos = []
            def mapping = mappingsHolder.matchStatusCode(url)
            if (mapping) mappingInfos << mapping
        }
        else {
            mappingInfos = mappingsHolder.matchAll(url, method)
        }

        if (mappingInfos.size() == 0) throw new AssertionFailedError("url '$url' did not match any mappings")

        def mappingMatched = mappingInfos.any {mapping ->
            mapping.configure(webRequest)
            for (key in assertionKeys) {
                if (assertions.containsKey(key)) {
                    def expected = assertions[key]
                    def actual = mapping."${key}Name"

                    switch (key) {
                        case "controller":
                            if (actual && !getControllerClass(actual)) return false
                            break
                        case "view":
                            if (actual[0] == "/") actual = actual.substring(1)
                            if (expected[0] == "/") expected = expected.substring(1)
                            break
                        case "action":
                            if (key == "action" && actual == null) {
                                final controllerClass = getControllerClass(assertions.controller)
                                actual = controllerClass?.defaultAction
                            }
                            break
                    }

                    assert expected == actual
                }
            }
            if (paramAssertions) {
                def params = [:]
                paramAssertions.delegate = params
                paramAssertions.resolveStrategy = Closure.DELEGATE_ONLY
                paramAssertions.call()
                params.each {name, value ->
                    assert value == mapping.params[name]
                }
            }
            return true
        }

        if (!mappingMatched) throw new IllegalArgumentException("url '$url' did not match any mappings")
    }

    // used by method above
    private assertionKeys = ["controller", "action", "view"]

    private GrailsControllerClass getControllerClass(controller) {
        return grailsApplication.getArtefactByLogicalPropertyName(org.codehaus.groovy.grails.commons.ControllerArtefactHandler.TYPE, controller)
    }

}
