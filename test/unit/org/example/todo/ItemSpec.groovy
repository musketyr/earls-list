package org.example.todo

import grails.test.mixin.TestFor
import spock.lang.Specification
import spock.lang.Unroll


@TestFor(Item)
class ItemSpec extends Specification {


    @Unroll
    void "item created from #params has #errorCount errors"() {
        Item item  = new Item(params)

        when:
        item.save()

        then:
        item.errors.errorCount == errorCount

        where:
        errorCount  | params
        1           | [description: '']
        0           | [description: 'Do IT']
        0           | [description: 'Done', crossed: true]
        1           | [description: 'x' * 256]

    }
}
