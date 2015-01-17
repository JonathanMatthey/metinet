angular.module('app.controllers').controller('ProfileViewController', [ '$scope',
																		'$stateParams',
																		'Auth',
																		'Profile',
																		'Networks',
																		'UserAwards',
																		'UserConnections',
																		'UserExperiences',
																		'UserEducations',
																		'UserProjects',	function(	$scope,
																									$stateParams,
																									Auth,
																									Profile,
																									Networks,
																									UserAwards,
																									UserConnections,
																									UserExperiences,
																									UserEducations,
																									UserProjects ) {

	$scope.profile 						= {};
	$scope.profile_loaded 				= false;
	$scope.show_create_new_experience	= false;
	$scope.show_create_new_education	= false;
	$scope.show_create_new_award		= false;
	$scope.current_user_data			= Auth.getCredential('user_data');
	$scope.can_edit 					= false;

	$scope.new_experience 				= {};
	$scope.new_education 				= {};
	$scope.new_award 					= {};

	if ($scope.current_user_data.id == $stateParams.id) {
		$scope.can_edit 		= true;
	}

	Profile.get({id:$stateParams.id})
		.$promise.then(function(response) {
			if(typeof response.data ==="undefined"){
				$scope.profile 				= response;
			} else {
				$scope.profile 				= response.data;
			}
			$scope.profile_loaded 		= true;
		});

	UserConnections.query({id:$stateParams.id})
		.$promise.then(function(data) {
		  $scope.profile.connections 	= data;
		});

	UserProjects.query({id:$stateParams.id})
		.$promise.then(function(data) {
		  $scope.profile.projects 		= data;
		});

	Networks.get({id:$scope.current_user_data.network.id})
		.$promise.then(function(response) {
			$scope.network_data = response.data;
		}, function(response) {

		});

	Networks.get()
		.$promise.then(function(response) {
			$scope.networks = response.data;
		}, function(response) {

		});

	$scope.updateProfile = function() {
		Profile.update({id:$scope.current_user_data.id}, $scope.profile)
			.$promise.then(function(response) {
				$scope.profile = response.data;
			}, function(response) {

			});
	}

	$scope.createExperience = function() {

		$('.create-btn.experience').html('<i class="fa fa-spin fa-refresh"></i>&nbsp;&nbsp;Adding...');
		$('.create-btn.experience').removeClass('btn-primary btn-success btn-danger');
		$('.create-btn.experience').addClass('btn-primary');

		UserExperiences.store({user_id:$scope.current_user_data.id}, $scope.new_experience)
			.$promise.then(function(response) {
				$scope.profile.experience 			= response.data;
				$scope.show_create_new_experience 	= false;
				$scope.new_experience 				= {};
			}, function(response) {
				$('.edit-btn.experience').html('<i class="fa fa-times"></i>&nbsp;&nbsp;Failed');
				$('.edit-btn.experience').removeClass('btn-primary btn-success btn-danger');
				$('.edit-btn.experience').addClass('btn-danger');
			});
	}

	$scope.cancelNewExperience = function() {
		$scope.show_create_new_experience 	= false;
		$scope.new_experience 				= {};
	}

	$scope.updateExperience = function(experience_index) {
		var _exp_id	= $scope.profile.experience[experience_index].id;

		$('.edit-btn.experience-'+_exp_id).html('<i class="fa fa-spin fa-refresh"></i>');
		$('.edit-btn.experience-'+_exp_id).removeClass('btn-primary btn-success btn-danger');
		$('.edit-btn.experience-'+_exp_id).addClass('btn-primary');

		UserExperiences.update({user_id:$scope.current_user_data.id, exp_id:_exp_id}, $scope.profile.experience[experience_index])
			.$promise.then(function(response) {
				$scope.profile.experience[experience_index] = response.data;
				$('.edit-btn.experience-'+_exp_id).html('<i class="fa fa-check"></i>');
				$('.edit-btn.experience-'+_exp_id).removeClass('btn-primary btn-success btn-danger');
				$('.edit-btn.experience-'+_exp_id).addClass('btn-success');
			}, function(response) {
				$('.edit-btn.experience-'+_exp_id).html('<i class="fa fa-times"></i>');
				$('.edit-btn.experience-'+_exp_id).removeClass('btn-primary btn-success btn-danger');
				$('.edit-btn.experience-'+_exp_id).addClass('btn-danger');
			});
	}

	$scope.deleteExperience = function(experience_index) {
		var _exp_id	= $scope.profile.experience[experience_index].id;

		$('.delete-btn.experience-'+_exp_id).html('<i class="fa fa-spin fa-refresh"></i>');
		$('.delete-btn.experience-'+_exp_id).removeClass('btn-primary btn-success btn-danger');
		$('.delete-btn.experience-'+_exp_id).addClass('btn-primary');

		UserExperiences.delete({user_id:$scope.current_user_data.id, exp_id:_exp_id}, $scope.profile.experience[experience_index])
			.$promise.then(function(response) {
				$scope.profile.experience.splice(experience_index, 1);
				$('.delete-btn.experience-'+_exp_id).html('<i class="fa fa-check"></i>');
				$('.delete-btn.experience-'+_exp_id).removeClass('btn-primary btn-success btn-danger');
				$('.delete-btn.experience-'+_exp_id).addClass('btn-success');
			}, function(response) {
				$('.delete-btn.experience-'+_exp_id).html('<i class="fa fa-times"></i>&nbsp;&nbsp;Failed');
				$('.delete-btn.experience-'+_exp_id).removeClass('btn-primary btn-success btn-danger');
				$('.delete-btn.experience-'+_exp_id).addClass('btn-danger');
			});
	}

	$scope.createEducation = function() {

		console.log($scope.new_education);

		$('.create-btn.education').html('<i class="fa fa-spin fa-refresh"></i>&nbsp;&nbsp;Adding...');
		$('.create-btn.education').removeClass('btn-primary btn-success btn-danger');
		$('.create-btn.education').addClass('btn-primary');

		UserEducations.store({user_id:$scope.current_user_data.id}, $scope.new_education)
			.$promise.then(function(response) {
				$scope.profile.education 			= response.data;
				$scope.show_create_new_education 	= false;
				$scope.new_education 				= {};
			}, function(response) {
				$('.edit-btn.education').html('<i class="fa fa-times"></i>&nbsp;&nbsp;Failed');
				$('.edit-btn.education').removeClass('btn-primary btn-success btn-danger');
				$('.edit-btn.education').addClass('btn-danger');
			});
	}

	$scope.cancelNewEducation = function() {
		$scope.show_create_new_education 	= false;
		$scope.new_education 				= {};
	}

	$scope.updateEducation = function(education_index) {
		var _exp_id	= $scope.profile.education[education_index].id;

		$('.edit-btn.education-'+_exp_id).html('<i class="fa fa-spin fa-refresh"></i>');
		$('.edit-btn.education-'+_exp_id).removeClass('btn-primary btn-success btn-danger');
		$('.edit-btn.education-'+_exp_id).addClass('btn-primary');

		UserEducations.update({user_id:$scope.current_user_data.id, exp_id:_exp_id}, $scope.profile.education[education_index])
			.$promise.then(function(response) {
				$scope.profile.education[education_index] = response.data;
			}, function(response) {
				$('.edit-btn.education-'+_exp_id).html('<i class="fa fa-times"></i>');
				$('.edit-btn.education-'+_exp_id).removeClass('btn-primary btn-success btn-danger');
				$('.edit-btn.education-'+_exp_id).addClass('btn-danger');
			});
	}

	$scope.deleteEducation = function(education_index) {
		var _edu_id	= $scope.profile.education[education_index].id;

		$('.delete-btn.education-'+_edu_id).html('<i class="fa fa-spin fa-refresh"></i>');
		$('.delete-btn.education-'+_edu_id).removeClass('btn-primary btn-success btn-danger');
		$('.delete-btn.education-'+_edu_id).addClass('btn-primary');

		UserEducations.delete({user_id:$scope.current_user_data.id, exp_id:_edu_id}, $scope.profile.education[education_index])
			.$promise.then(function(response) {
				$scope.profile.education.splice(education_index, 1);
			}, function(response) {
				$('.delete-btn.education-'+_edu_id).html('<i class="fa fa-times"></i>&nbsp;&nbsp;Failed');
				$('.delete-btn.education-'+_edu_id).removeClass('btn-primary btn-success btn-danger');
				$('.delete-btn.education-'+_edu_id).addClass('btn-danger');
			});
	}

	$scope.createAward = function() {

		$('.create-btn.award').html('<i class="fa fa-spin fa-refresh"></i>&nbsp;&nbsp;Adding...');
		$('.create-btn.award').removeClass('btn-primary btn-success btn-danger');
		$('.create-btn.award').addClass('btn-primary');

		UserAwards.store({user_id:$scope.current_user_data.id}, $scope.new_award)
			.$promise.then(function(response) {
				$scope.profile.awards 			= response.data;
				$scope.show_create_new_award 	= false;
				$scope.new_award 				= {};
			}, function(response) {
				$('.edit-btn.award').html('<i class="fa fa-times"></i>&nbsp;&nbsp;Failed');
				$('.edit-btn.award').removeClass('btn-primary btn-success btn-danger');
				$('.edit-btn.award').addClass('btn-danger');
			});
	}

	$scope.cancelNewAward = function() {
		$scope.show_create_new_award 	= false;
		$scope.new_award 				= {};
	}

	$scope.updateAward = function(award_index) {
		var _award_id	= $scope.profile.awards[award_index].id;

		$('.edit-btn.award-'+_award_id).html('<i class="fa fa-spin fa-refresh"></i>');
		$('.edit-btn.award-'+_award_id).removeClass('btn-primary btn-success btn-danger');
		$('.edit-btn.award-'+_award_id).addClass('btn-primary');

		UserAwards.update({user_id:$scope.current_user_data.id, exp_id:_award_id}, $scope.profile.awards[award_index])
			.$promise.then(function(response) {
				$scope.profile.awards[award_index] = response.data;
				$('.edit-btn.award-'+_award_id).html('<i class="fa fa-check"></i>');
				$('.edit-btn.award-'+_award_id).removeClass('btn-primary btn-success btn-danger');
				$('.edit-btn.award-'+_award_id).addClass('btn-success');
			}, function(response) {
				$('.edit-btn.award-'+_award_id).html('<i class="fa fa-times"></i>');
				$('.edit-btn.award-'+_award_id).removeClass('btn-primary btn-success btn-danger');
				$('.edit-btn.award-'+_award_id).addClass('btn-danger');
			});
	}

	$scope.deleteAward = function(award_index) {
		var _award_id	= $scope.profile.awards[award_index].id;

		$('.delete-btn.award-'+_award_id).html('<i class="fa fa-spin fa-refresh"></i>');
		$('.delete-btn.award-'+_award_id).removeClass('btn-primary btn-success btn-danger');
		$('.delete-btn.award-'+_award_id).addClass('btn-primary');

		UserAwards.delete({user_id:$scope.current_user_data.id, exp_id:_award_id}, $scope.profile.awards[award_index])
			.$promise.then(function(response) {
				$scope.profile.awards.splice(award_index, 1);
			}, function(response) {
				$('.delete-btn.award-'+_award_id).html('<i class="fa fa-times"></i>&nbsp;&nbsp;Failed');
				$('.delete-btn.award-'+_award_id).removeClass('btn-primary btn-success btn-danger');
				$('.delete-btn.award-'+_award_id).addClass('btn-danger');
			});
	}

	$scope.showCreateNew = function(action) {
		if (action == 'experience') {
			$scope.show_create_new_experience 	= true;
		}
		if (action == 'education') {
			$scope.show_create_new_education 	= true;
		}
		if (action == 'award') {
			$scope.show_create_new_award 		= true;
		}
	}

}]);