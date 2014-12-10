//= require items

angular
  .module('earlslist.itemsCtrl', ['earlslist.items'])
  .controller('earlslist.itemsCtrl', ['$scope', 'items', function($scope, items){
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
  }])
    // don' use this in your code, write the following snippet in CoffeeScript which supports multiline strings
  .run(['$templateCache', function($templateCache){
        $templateCache.put('earlslist/items.html',
            '<div class="row" ng-controller="earlslist.itemsCtrl">' +
                '<h1 class="col-md-12">Earl\'s List</h1>' +
                '<form ng-submit="addItem()" class="col-md-12 form">' +
                    '<div class="alert alert-danger" ng-repeat="error in errors">' +
                    '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '{{error.message}}' +
                    '</div>' +
                '<input id="task" class="form-control input-lg" ng-model="newItemText" ng-disabled="loading" placeholder="How did you upset the Karma?">' +
                '</form>' +
                '<h2 ng-repeat="item in items" class="col-md-12 item">' +
                    '<span class="glyphicon" ng-click="toggle(item)" ng-class="{\'glyphicon-unchecked\': !item.crossed, \'glyphicon-check\': item.crossed, \'text-muted\': item.crossed}"></span>' +
                    '<span class="item-description" ng-class="{crossed: item.crossed, \'text-muted\': item.crossed}" ng-click="toggle(item)">{{item.description}}</span>' +
                    '<span class="remove-item text-muted pull-right glyphicon glyphicon-trash" ng-click="remove(item)"></span>' +
                '</h2>' +
            '</div>');
  }]);
