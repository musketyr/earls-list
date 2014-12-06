describe('Controller should provide uselful methods for the template', function () {
    var $scope, items;

    beforeEach(module('earlslist.itemsCtrl'));

    beforeEach(inject(function ($rootScope, $controller, _items_, $q) {
        var listCallCounter = 0, saveOrUpdateFunction;

        items = _items_;

        $scope = $rootScope.$new();

        saveOrUpdateFunction = function(valid, invalid) {
            return function (payload) {
                if (payload && payload.description && (payload.description.length < 1 || payload.description.length > 255)) {
                    return $q.reject({data: angular.copy(invalid)});
                }
                return $q.when(items.enhance.item(angular.extend(angular.copy(valid), payload)));
            }
        };

        spyOn(items, 'save').and.callFake(saveOrUpdateFunction(fixtures.item.validSave, fixtures.item.invalidSave));
        spyOn(items, 'update').and.callFake(saveOrUpdateFunction(fixtures.item.updateValid, fixtures.item.updateInvalid));
        spyOn(items, 'remove').and.callFake(function(){
            return $q.when({status: 204});
        });
        spyOn(items, 'list').and.callFake(function () {
            listCallCounter++;

            if (listCallCounter == 1) {
                return $q.when(items.enhance.list(angular.copy(fixtures.item.list)));
            }
            if (listCallCounter == 2) {
                return $q.when(items.enhance.list(angular.copy(fixtures.item.list).slice(0, 3)));
            }
            return $q.when([]);
        });


        $controller('earlslist.itemsCtrl', {$scope: $scope, items: items});
    }));

    it('should list all items', function(){
        expect($scope.errors.length).toBe(0);
        expect($scope.items.length).toBe(0);
        expect($scope.loading).toBe(true);

        $scope.$digest();

        expect($scope.errors.length).toBe(0);
        expect($scope.items.length).toBe(13);
        expect($scope.loading).toBe(false);
    });

    it('should create an item', function(){
        $scope.$digest();

        expect($scope.items.length).toBe(13);

        $scope.newItemText = 'New Item Text';
        $scope.addItem();

        $scope.$digest();

        expect($scope.items.length).toBe(14);
        expect($scope.items[0].description).toBe('New Item Text')
    });

    it('should not create invalid item', function(){
        $scope.$digest();

        expect($scope.items.length).toBe(13);

        $scope.newItemText = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
        $scope.addItem();

        $scope.$digest();

        expect($scope.items.length).toBe(13);
        expect($scope.errors.length).toBe(1);
        expect($scope.errors[0].field).toBe('description');
    });

    it('should toggle the item', function(){
        var crossed, item;

        $scope.$digest();

        expect($scope.items.length).toBe(13);

        item = $scope.items[0];
        crossed = item.crossed;

        $scope.toggle(item);
        $scope.$digest();

        expect(item.crossed).not.toBe(crossed);

        $scope.toggle(item);
        $scope.$digest();

        expect(item.crossed).toBe(crossed);
    });

    it('should delete the item', function(){
        $scope.$digest();

        expect($scope.items.length).toBe(13);

        $scope.remove($scope.items[0]);
        $scope.$digest();

        expect($scope.items.length).toBe(12);
    });

});
