app.controller('MailController', [	'$scope', function(	$scope	) {
	$scope.folds = [
		{name: 'Inbox', filter:''},
		{name: 'Starred', filter:'starred'},
		{name: 'Archived', filter:'archived'}
	];

	$scope.addLabel = function(){
		$scope.labels.push(
			{
				name: $scope.newLabel.name,
				filter: angular.lowercase($scope.newLabel.name),
				color: '#ccc'
			}
		);
		$scope.newLabel.name = '';
	}

	$scope.labelClass = function(label) {
		return {
			'b-l-info': angular.lowercase(label) === 'angular',
			'b-l-primary': angular.lowercase(label) === 'bootstrap',
			'b-l-warning': angular.lowercase(label) === 'client',
			'b-l-success': angular.lowercase(label) === 'work'
		};
	};

}]);

angular.module('app').directive('labelColor', function(){
	return function(scope, $el, attrs){
		$el.css({'color': attrs.color});
	}
});