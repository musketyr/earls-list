angular.module('earlslist.items', ['earlslist.apiRoot']).factory('items', ['$http', '$q', 'apiRoot', function($http, $q, apiRoot){

    var items, unwrapOrReject, enhanceAll, enhanceItem;

    unwrapOrReject = function(response){
        if (response.data) {
            if (response.data.errors) {
                return $q.reject(response.data)
            }
            return response.data
        }
        return response
    };

    enhanceItem = function(item) {
        var updateItem = function(self) {
            return function(updated) {
                angular.extend(self, updated);
                return self;
            }
        };

        item.remove = function() { return items.remove(item) };
        item.update = function() { return items.update(item).then(updateItem(this)) };
        item.cross  = function() {
            return items.update({id: item.id, crossed: true}).then(updateItem(this));
        };
        item.redo   = function() {
            return items.update({id: item.id, crossed: false}).then(updateItem(this));
        };
        return item;
    };

    enhanceAll = function(listOfItems) {
        angular.forEach(listOfItems, enhanceItem);
        return listOfItems;
    };

    items = {
        list: function(start) {
            return $http({url: apiRoot + "/item/", method: 'GET', params: start ? {offset: start } : {}}).then(unwrapOrReject).then(enhanceAll);
        },
        save: function(data) {
            return $http({url: apiRoot + "/item/", method: 'POST', data: data}).then(unwrapOrReject).then(enhanceItem);
        },
        update:  function(data) {
            if (!data.id) {
                throw "Id not set for " + data + "!"
            }
            return $http({url: apiRoot + "/item/" + data.id, method: 'PUT', data: data}).then(unwrapOrReject).then(enhanceItem);
        },
        remove :  function(data) {
            if (!data.id) {
                throw "Id not set for " + data + "!"
            }
            return $http({url: apiRoot + "/item/" + data.id, method: 'DELETE'}).then(unwrapOrReject);
        },
        enhance: {
            item: enhanceItem,
            list: enhanceAll
        }
    };

    return items;
}]);
