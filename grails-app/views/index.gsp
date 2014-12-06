<!DOCTYPE html>
<html>
	<head>
		<title>Earl's List</title>
		<asset:stylesheet src="earlslist/items.css"/>
		<asset:javascript src="earlslist/index.js"/>
		<script type="text/javascript">
			angular.module('earlslist.apiRoot', []).value('apiRoot', '${request.contextPath ?: ''}');
		</script>
	</head>
	<body ng-app="earlslist">
		<div class="container">
			<div class="jumbotron" ng-controller="earlslist.itemsCtrl">
				<div class="row" >
					<h1 class="col-md-12">Earl's List</h1>

					<form ng-submit="addItem()" class="col-md-12 form">
						<div class="alert alert-danger" ng-repeat="error in errors">
							<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
							{{error.message}}
						</div>
						<input id="task" class="form-control input-lg" ng-model="newItemText" ng-disabled="loading" placeholder="write your next task here...">
					</form>
					<h2 ng-repeat="item in items" class="col-md-12 item">
						<span class="glyphicon" ng-click="toggle(item)" ng-class="{'glyphicon-unchecked': !item.crossed, 'glyphicon-check': item.crossed, 'text-muted': item.crossed}"></span>
						<span class="item-description" ng-class="{crossed: item.crossed, 'text-muted': item.crossed}" ng-click="toggle(item)">{{item.description}}</span>
						<span class="remove-item text-muted pull-right glyphicon glyphicon-trash" ng-click="remove(item)"></span>
					</h2>
				</div>
			</div>
		</div>
	</body>
</html>
