angular.module('app.controllers').controller('ProjectUsersSettingsController', [ 	'$scope',
																					'$stateParams',
																					'ProjectUsers',
																					'$modal',
																					'toaster',  	function(   $scope,
																												$stateParams,
																												ProjectUsers,
																												$modal,
																												toaster ) {
	ProjectUsers.get({id:$stateParams.id})
		.$promise.then(function(res) {
			$scope.projectUsers     = res.data.users;
			$scope.potential_users  = res.data.potential_users;
		});

	$scope.removeUser = function(user_index) {
		var _user = $scope.projectUsers[user_index];
		var r = confirm("Are you sure you want to delete " + _user.fullname + "?");
		if (r == true) {
			$('.btn-remove.user-'+_user.id).html('<i class="fa fa-fw fa-spin fa-refresh"></i>');
			$('.btn-remove.user-'+_user.id).removeClass('btn-danger btn-default');
			$('.btn-remove.user-'+_user.id).addClass('btn-default');            
			ProjectUsers.delete({id:$stateParams.id, userId: _user.id})
				.$promise.then(function(response) {
					$scope.projectUsers.splice(user_index, 1);                  
					toaster.pop('success', 'User deleted', '.');
					$scope.potential_users = response.data.potential_users;
				});
		}
	}

	$scope.addUsersModal = function() {
		$('.add-users-modal-btn').prop('disabled', true);       
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/add_users.html',
			controller: 'ProjectAddUsersModalController',
			resolve: {
				potential_users: function () {
					return $scope.potential_users;
				}
			}
		});

		modalInstance.result.then(function(selected_users) {
			$('.add-users-modal-btn').removeClass('text-center btn-danger btn-primary');
			$('.add-users-modal-btn').addClass('text-center btn-primary');
			$('.add-users-modal-btn').html('<i class="fa fa-fw fa-refresh fa-spin"></i>');          
			ProjectUsers.save({"id":$stateParams.id},{"users":selected_users})
				.$promise.then(function(response) {
					$('.add-users-modal-btn').removeClass('text-center btn-danger btn-primary');
					$('.add-users-modal-btn').addClass('btn-primary');
					$('.add-users-modal-btn').html('<i class="fa fa-fw fa-plus"></i>&nbsp;&nbsp;Add Users');                    
					$('.add-users-modal-btn').prop('disabled', false);
					toaster.pop('success', 'Users added', '');
					$scope.projectUsers     = response.data.users;
					$scope.potential_users  = response.data.potential_users;
				}, function(response) {
					$('.add-users-modal-btn').removeClass('text-center btn-danger btn-primary');
					$('.add-users-modal-btn').addClass('btn-danger');
					$('.add-users-modal-btn').html('<i class="fa fa-fw fa-plus"></i>&nbsp;&nbsp;Add users');
					$('.add-users-modal-btn').prop('disabled', false);
				});
		});
	};

}]);