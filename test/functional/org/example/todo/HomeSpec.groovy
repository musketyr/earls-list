package org.example.todo

import geb.spock.GebReportingSpec
import org.openqa.selenium.Keys
import spock.lang.Stepwise

@Stepwise
class HomeSpec extends GebReportingSpec {

    def "go to home page and enter new task"() {
        when:
        to HomePage

        then:
        at HomePage

        expect:
        !items.size()

        when:
        task = 'Test with Geb'
        task << Keys.ENTER

        then:
        waitFor {
            items.size() == 1
        }
    }

    def "enter invalid value and show error"() {
        expect:
        errors.size() == 0

        when:
        task = "x" * 256
        task << Keys.ENTER

        then:
        waitFor {
            errors.size() == 1
        }

        when:
        task = "x" * 256
        closeError.click()

        then:
        waitFor {
            errors.size() == 0
        }
    }

    def "toggle task"() {
        expect:
        !itemsTexts[0].hasClass('crossed')

        when:
        itemsTexts[0].click()

        then:
        waitFor {
            itemsTexts[0].hasClass('crossed')
        }

        when:
        itemsTexts[0].click()

        then:
        !itemsTexts[0].hasClass('crossed')
    }

    def "delete task"() {
        expect:
        items.size() == 1

        when:
        items[0].find('.remove-item').click()

        then:
        waitFor {
            items.size() == 0
        }
    }

}
