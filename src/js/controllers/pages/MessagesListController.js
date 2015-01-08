angular.module('app.controllers').controller('MessagesListController', [	'$scope',
																			'$state',
																			'$window',
																			'$http',
																			'Auth',
																			'Conversations', function(	$scope,
																										$state,
																										$window,
																										$http,
																										Auth,
																										Conversations 	) {
	$scope.conversations = {}

	$scope.init = function() {
 		$scope.getConversations();
	}

	$scope.getConversations = function() {
		$scope.conversations = Conversations.query();
	}

}]);