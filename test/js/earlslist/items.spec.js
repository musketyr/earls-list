angular.module('earlslist.apiRoot', []).value('apiRoot', '');

describe('List service should provide basic functionality', function(){
    beforeEach(module('earlslist.items'));

    it('should list all items', inject(function(items, $httpBackend){
        var list = null;

        $httpBackend.expectGET('/item/').respond(angular.copy(fixtures.item.list));

        items.list().then(function(fetched){
           list = fetched;
        });

        expect(list).toBeNull();

        $httpBackend.flush();

        expect(list).toBeDefined();
        expect(list.length).toBe(10);
    }));

    it('should create new item', inject(function(items, $httpBackend){
        var item = null;

        $httpBackend.expectPOST('/item/', fixtures.item.validSaveInput).respond(angular.copy(fixtures.item.validSave));

        items.save(fixtures.item.validSaveInput).then(function(created){
            item = created;
        });

        expect(item).toBeNull();

        $httpBackend.flush();

        expect(item).toBeDefined();
        expect(item.id).toBe(35);
    }));


    it('should not create invalid item', inject(function(items, $httpBackend){
        var item = null;
        var errResp = null;

        $httpBackend.expectPOST('/item/', fixtures.item.invalidSaveInput).respond(angular.copy(fixtures.item.invalidSave));

        items.save(fixtures.item.invalidSaveInput).then(function(created){
            item = created;
        }, function(response){
            errResp = response;
        });

        expect(item).toBeNull();
        expect(errResp).toBeNull();

        $httpBackend.flush();

        expect(item).toBeNull();
        expect(errResp).toBeDefined();
        expect(errResp.errors).toBeDefined();
        expect(errResp.errors.length).toBe(1);
    }));


    it('should update existing item', inject(function(items, $httpBackend){
        var item = null;
        var payload = angular.copy(fixtures.item.updateValidInput);
        payload.id = fixtures.item.updateValid.id;

        $httpBackend.expectPUT('/item/' + payload.id, payload).respond(angular.copy(fixtures.item.updateValid));

        items.update(payload).then(function(updated){
            item = updated;
        });

        expect(item).toBeNull();

        $httpBackend.flush();

        expect(item).toBeDefined();
        expect(item.id).toBe(fixtures.item.updateValid.id);
    }));


    it('should not update with invalid data', inject(function(items, $httpBackend){
        var item = null;
        var errResp = null;
        var payload = angular.copy(fixtures.item.updateInvalidInput);
        payload.id = 1;

        $httpBackend.expectPUT('/item/1', payload).respond(angular.copy(fixtures.item.updateInvalid));

        items.update(payload).then(function(created){
            item = created;
        }, function(response){
            errResp = response;
        });

        expect(item).toBeNull();
        expect(errResp).toBeNull();

        $httpBackend.flush();

        expect(item).toBeNull();
        expect(errResp).toBeDefined();
        expect(errResp.errors).toBeDefined();
        expect(errResp.errors.length).toBe(1);
    }));

    it('should delete item', inject(function(items, $httpBackend){
        var resp = null;
        var payload = angular.copy(fixtures.item.updateValidInput);
        payload.id = fixtures.item.updateValid.id;

        $httpBackend.expectDELETE('/item/' + payload.id).respond(204);

        items.remove(payload).then(function(response){
            resp = response;
        });

        expect(resp).toBeNull();

        $httpBackend.flush();

        expect(resp).toBeDefined();
        expect(resp.status).toBeDefined(204);
    }));

});
