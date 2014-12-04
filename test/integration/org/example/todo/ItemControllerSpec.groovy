package org.example.todo

import grails.test.spock.IntegrationSpec

import javax.servlet.http.HttpServletResponse

/**
 * Specification for ItemController.
 *
 * 1) Must be integration specification, REST tests doesn't work well otherwise
 * 2) Always set the response format at the beginning
 * 3) Always set the request method if not GET
 */
class ItemControllerSpec extends IntegrationSpec {

    ItemController controller = new ItemController()

    def setup() {
        17.times {
            new Item(description: "Item #$it", crossed: it < 5).save(failOnError: true)
        }

        controller.response.format = 'json'
    }

    void "obtain the list of items in json format"() {
        when:
        controller.index(10)

        def result = controller.response.json

        then:
        result?.size() == 10
        result[0].description =~ /Item #\d+/
    }

    void "create new item"() {
        when:
        controller.request.json = [description: 'Write more tests!']
        controller.request.method = 'POST'
        controller.save()

        def result = controller.response.json

        then:
        result
        result.description == 'Write more tests!'

    }

    void "fail to create invalid item"() {
        when:
        controller.request.json = [description: 'x' * 256]
        controller.request.method = 'POST'
        controller.save()

        def result = controller.response.json

        then:
        result
        result.errors
        result.errors.any { it.field == 'description' }

    }

    void "update existing item"() {
        when:
        controller.params.id = Item.findByDescription('Item #10').id
        controller.request.json = [description: 'Write even more tests!', crossed: true]
        controller.request.method = 'PUT'
        controller.update()

        def result = controller.response.json

        then:
        result
        result.description == 'Write even more tests!'
        result.crossed == true

    }

    void "fail to update existing item"() {
        when:
        controller.params.id = Item.findByDescription('Item #11').id
        controller.request.json = [description: 'x' * 256, crossed: true]
        controller.request.method = 'PUT'
        controller.update()

        def result = controller.response.json

        then:
        result
        result.errors
        result.errors.any { it.field == 'description' }
    }

    void "delete one item"() {
        controller.response.format = 'json'

        when:
        controller.params.id = Item.findByDescription('Item #12').id
        controller.request.method = 'DELETE'
        controller.delete()

        then:
        // NO CONTENT returned when everything goes well
        controller.response.status == HttpServletResponse.SC_NO_CONTENT
        // we can no longer find the item
        !Item.findByDescription('Item #12')
    }
}
