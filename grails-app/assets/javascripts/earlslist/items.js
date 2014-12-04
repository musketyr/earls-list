angular.module('earlslist.items', []).value('apiRoot', '').factory('items', function($http, $q, apiRoot){

    var items, unwrapOrReject, enhance, enhanceItem;

    items = {
        list: function(start) {
            return $http({url: apiRoot + "/item/", method: 'GET', params: start ? {offset: start } : {}}).then(unwrapOrReject).then(enhance);
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
        }
    };

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
        var updateItem = function(updated) {
            angular.extend(item, updated)
        };

        item.remove = function() { return items.remove(item) };
        item.update = function() { return items.update(item).then(updateItem) };
        item.cross  = function() {
            item.crossed = true;
            return items.update(item).then(updateItem)
        };
        item.redo   = function() {
            item.crossed = false;
            return items.update(item).then(updateItem)
        };
        return item;
    };

    enhance = function(listOfItems) {
        angular.forEach(listOfItems, enhanceItem);
        return listOfItems;
    };

    return items;
});
