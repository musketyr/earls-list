import org.springframework.http.HttpMethod

class UrlMappings {

	static mappings = {
        // map every method we expose to the frontend
        // these should be covered by tests
        "/item/"    controller: 'item', action: 'index',   method: HttpMethod.GET
        "/item/"    controller: 'item', action: 'save',    method: HttpMethod.POST
        "/item/$id" controller: 'item', action: 'update',  method: HttpMethod.PUT
        "/item/$id" controller: 'item', action: 'delete',  method: HttpMethod.DELETE

        // keep the index page, here we'll build our SPA
        "/"     view:"/index"

        // render errors in JSON formats
        "500"   controller: 'restError', action: 'index'
	}
}
