package org.example.todo

import geb.Page

class HomePage extends Page {

    static url = "#/"
    static at = { heading.text() == "Earl's List" }
    static content = {
        heading { $("h1") }
        task { $("#task") }
        items(required: false) { $(".item") }
        itemsTexts(required: false) { items.find('.item-description') }
        errors(required: false) { $(".alert-danger") }
        closeError(required: false) { $(".close") }
    }

}
