angular.module('app.controllers').controller('HeaderController', [	'$scope',
																	'$rootScope',
																	'$state',
																	'Auth',
																	'Project',
																	'UserConversations',
																	'UserNotifications', 	function(	$scope,
																										$rootScope,
																										$state,
																										Auth,
																										Project,
																										UserConversations,
																										UserNotifications	) {

	$scope.projects_left 			= {};
	$scope.projects_right			= {};
	$scope.notifications_returned 	= false;

	$rootScope.$watch('current_project', function(new_value) {
		$scope.current_project 		= new_value;
	});

	$rootScope.$watchCollection('user_data', function(new_value) {
		if (new_value) {
			$scope.user_data 			= new_value;
		} else {
			$scope.user_data 			= Auth.getCredential('user_data');
		}
	});

	$rootScope.$watchCollection('user_projects', function(new_value) {
		if (new_value) {
			var half_length				= Math.ceil(new_value.length / 2);
			$scope.projects_left		= new_value.slice(0, half_length);
			$scope.projects_right		= new_value.slice(half_length);
		} else {
			Project.query().$promise
				.then(function(response) {
					$rootScope.user_projects 	= response.data;
				});
		}
	});

	UserConversations.get({})
		.$promise.then(function(response) {
			$scope.unread_conversation_count 	= response.unread;
			$scope.latest_conversations 		= response.latest;
		});

	UserNotifications.get({option:'recent'})
		.$promise.then(function(response) {
			$scope.unread_notification_count 	= response.data.unread_count;
			$scope.recent_notifications 		= response.data.recent_notifications;
			$scope.notifications_returned 		= true;
		});

}]);