//= require items

angular.module('earlslist.itemsCtrl', ['earlslist.items']).controller('earlslist.itemsCtrl', ['$scope', 'items', function($scope, items){
    $scope.items = [];
    $scope.errors = [];
    $scope.loading = true;
    $scope.newItemText = '';

    var load = function(newList){
        angular.forEach(newList, function(item){
            $scope.items.push(item);
        });
        if (newList.length == 10) {
            items.list($scope.items.length).then(load);
        } else {
            $scope.loading = false;
        }
    };

    items.list().then(load);


    $scope.addItem = function() {
        items.save({description: $scope.newItemText}).then(function(newItem){
            $scope.newItemText = '';
            $scope.items.unshift(newItem);
            $scope.errors = [];
        }).catch(function(response){
            $scope.errors = response.data.errors;
        });
    };

    $scope.toggle = function(item) {
        if (item.crossed) {
            item.redo();
        } else {
            item.cross();
        }
    };

    $scope.remove = function(item) {
      item.remove().then(function(){
          var index = $scope.items.indexOf(item);
          $scope.items.splice(index, 1);
      });
    };
}]);
