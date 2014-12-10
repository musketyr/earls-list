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
			<div class="jumbotron" ng-include="'earlslist/items.html'"></div>
		</div>
	</body>
</html>
