angular.module('app.controllers').controller('ProjectDiscussionController', [  	'$scope',
																				'$stateParams',
																				'Auth',
																				'ProjectDiscussions',	function(	$scope,
																													$stateParams,
																													Auth,
																													ProjectDiscussions	) {


	var user_data						= Auth.getCredential('user_data');
	$scope.requested_post 				= {
		created_data: {
			user: {
				fullname: user_data.fullname,
			},
		},
	}
	$scope.nodes_returned				= false;

	ProjectDiscussions.get({	//	Get this discussion
		project_id:$stateParams.project_id,
		discussion_id:$stateParams.discussion_id
	}).$promise.then(function(response) {
			$scope.discussion 			= response.data;
			executeUserPanel();
		});

	ProjectDiscussions.get({	//	Get the nodes & possible nodes associated with this discussion
		project_id:$stateParams.project_id,
		discussion_id:$stateParams.discussion_id,
		action:'nodes'
	}).$promise.then(function(response) {
			$scope.discussion_nodes		= response.data.discussion_nodes;
			$scope.possible_nodes		= response.data.possible_nodes;
			$scope.nodes_returned		= true;
		});

	$scope.requestUpdates				= function() {
		$scope.updates_request_processing	= true;
		ProjectDiscussions.save({	//	Tell API to attach the node to this discussion
			project_id:$stateParams.project_id,
			discussion_id:$stateParams.discussion_id,
			action:'users',
			action_id:user_data.id
		}, {}).$promise.then(function(response) {
				$scope.discussion.user_receiving_updates 		= true;

				$scope.discussion.users 						= response.data;
				executeUserPanel();
				$scope.updates_request_processing				= false;
			}, function(response) {
				$scope.discussion.user_receiving_updates	 	= false;
				$scope.updates_request_processing				= false;
			});
	}

	$scope.stopUpdates						= function() {
		$scope.updates_request_processing	= true;
		ProjectDiscussions.remove({	//	Tell API to attach the node to this discussion
			project_id:$stateParams.project_id,
			discussion_id:$stateParams.discussion_id,
			action:'users',
			action_id:user_data.id
		}, {}).$promise.then(function(response) {
				$scope.discussion.user_receiving_updates 		= false;

				$scope.discussion.users 						= response.data;
				executeUserPanel();
				$scope.updates_request_processing				= false;
			}, function(response) {
				$scope.discussion.user_receiving_updates	 	= true;
				$scope.updates_request_processing				= false;
			});
	}

	$scope.addNode						= function(item, model) {
		$scope.selected_node	= '';
		$scope.possible_nodes.splice(item, 1);
		var new_index = $scope.discussion_nodes.push(item) - 1;
		ProjectDiscussions.save({	//	Tell API to attach the node to this discussion
			project_id:$stateParams.project_id,
			discussion_id:$stateParams.discussion_id,
			action:'nodes',
			action_id:item.id
		}, {}).$promise.then(function(response) {
				// Success Handler
			}, function(response) {
				$scope.discussion_nodes.splice(new_index, 1);
				$scope.possible_nodes.push(item);
			});
	}

	$scope.detachNode					= function(task_index) {
		var node = $scope.discussion_nodes[task_index];
		$scope.discussion_nodes.splice(task_index, 1);
		var new_index = $scope.possible_nodes.push(node) - 1;
		ProjectDiscussions.delete({project_id:$stateParams.project_id, discussion_id:$stateParams.discussion_id, action:'nodes', action_id:node.id}, {})
			.$promise.then(function(response) {
				//	Success Handler
			}, function(response) {
				$scope.discussion_nodes.push(node);
				$scope.possible_nodes.splice(new_index, 1);
			});
	}

	$scope.sendPost						= function() {
		var new_index	= $scope.discussion.posts.push($scope.requested_post) - 1;
		ProjectDiscussions.save({	//	Tell API to attach the node to this discussion
			project_id:$stateParams.project_id,
			discussion_id:$stateParams.discussion_id,
			action:'posts'
		}, {post: $scope.requested_post}).$promise.then(function(response) {
				$scope.discussion.posts[new_index]	= response.data;
				$scope.requested_post.message		= '';
			}, function(response) {
				$scope.discussion.posts.splice(new_index, 1);
			});
	}

	var executeUserPanel				= function() {
		var small_users_no			= 4;
		$scope.total_user_count		= $scope.discussion.users.length - small_users_no;
		$scope.small_users			= $scope.discussion.users.slice(0, small_users_no);
	}

}]);