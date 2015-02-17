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
	$scope.projects_returned 		= false;

	$rootScope.$watch('current_project', function(new_value) {
		$scope.current_project 		= new_value;
	});

	$rootScope.$watch('user_data', function(new_value) {
		if (new_value) {
			$scope.user_data 			= new_value;
		} else {
			$scope.user_data 			= Auth.getCredential('user_data');
		}
	});

	$rootScope.$watch('user_has_network', function(new_value) {
		if (new_value) {
			$scope.user_has_network 	= new_value;
		} else {
			$scope.user_has_network 	= Auth.getCredential('user_has_network');
		}
	});

	$rootScope.$watch('user_projects', function(new_value) {
		if (new_value) {
			var half_length				= Math.ceil(new_value.length / 2);
			$scope.projects_left		= new_value.slice(0, half_length);
			$scope.projects_right		= new_value.slice(half_length);
			$scope.projects_returned 	= true;
		} else {
			if ($scope.user_data) {
				$scope.getProjects();
			}
		}
	});

	$scope.init						= function() {
		$scope.getUserConversations();
		$scope.getUserNotifications();
	}

	$scope.getUserConversations 	= function() {
		UserConversations.get({})
			.$promise.then(function(response) {
				$scope.unread_conversation_count 	= response.unread;
				$scope.latest_conversations 		= response.latest;
			});
	}

	$scope.getUserNotifications 	= function() {
		UserNotifications.get({option:'recent'})
			.$promise.then(function(response) {
				$scope.unread_notification_count 	= response.data.unread_count;
				$scope.recent_notifications 		= response.data.recent_notifications;
				$scope.notifications_returned 		= true;
			});
	}

	$scope.getProjects				= function() {
		if ($rootScope.user_projects == null) {
			Project.query().$promise
				.then(function(response) {
					$rootScope.user_projects 	= response.data;
				});
		}
	}

}]);