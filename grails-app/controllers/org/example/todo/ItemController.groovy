package org.example.todo

import grails.rest.RestfulController


/**
 * Controller for Items.
 */
class ItemController extends RestfulController<Item> {

    /**
     * Only JSON formats are supported by this controller.
     */
    def responseFormats = ['json']

    /**
     * You need to create your own constructor without parameters and supply the domain class which are we building
     * the controller for.
     */
    ItemController() {
        super(Item)
    }

    /**
     * This simplification makes the tests and code easier as we only accept JSON requests.
     * @return request.JSON
     */
    @Override
    protected Object getObjectToBind() {
        request.JSON
    }
}
