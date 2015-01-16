angular.module('app.controllers').controller('HeaderController', [	'$scope',
																	'$state',
																	'Auth',
																	'UserConversations',
																	'UserNotifications', 	function(	$scope,
																										$state,
																										Auth,
																										UserConversations,
																										UserNotifications	) {
	$scope.user_data 			= Auth.getCredential('user_data');

	$scope.init = function() {
		$scope.getRecentConversations();
		$scope.getRecentNotifications();
	}

	$scope.getRecentConversations = function() {
		UserConversations.get({})
			.$promise.then(function(response) {
				$scope.unread_conversation_count 	= response.unread;
				$scope.latest_conversations 		= response.latest;
			});
	}

	$scope.getRecentNotifications = function() {
		UserNotifications.get({option:'recent'})
			.$promise.then(function(response) {
				$scope.unread_notification_count 	= response.unread_count;
				$scope.recent_notifications 		= response.recent_notifications;
			});
	}

}]);