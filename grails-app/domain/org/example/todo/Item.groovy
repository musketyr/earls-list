package org.example.todo

/**
 * Domain class for storing item to be done.
 */
class Item {

    /**
     * Text description of the item.
     */
    String description

    /**
     * Whether the item has been already crossed (i.e. completed)
     */
    Boolean crossed = Boolean.FALSE

    static constraints = {
        // always set max. size for String fields otherwise database defaults applies causing runtime errors
        description size: 1..255
    }
}
