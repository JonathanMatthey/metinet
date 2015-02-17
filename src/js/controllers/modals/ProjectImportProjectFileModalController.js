angular.module('app.controllers').controller('ProjectImportProjectFileModalController', [	'$scope',
																							'$rootScope',
																							'$window',
																							'$modalInstance',
																							'$http',
																							'Auth',
																							'FileUploader',
																							'project', 	function(	$scope,
																													$rootScope,
																													$window,
																													$modalInstance,
																													$http,
																													Auth,
																													FileUploader,
																													project	) {

	var auth_data			= Auth.getCredential('authdata');

	var uploader 			= $scope.uploader = new FileUploader({
		url: $rootScope.api_url_version+'/projects/'+project.id+'/import-project-file',
		method: 'POST',
		headers: {
			Authorization: 'Basic ' + auth_data
		},
		formData: [{
			overwrite: true,
		}]
	});

	// FILTERS

	uploader.filters.push({
		name: 'customFilter',
		fn: function(item /*{File|FileLikeObject}*/, options) {
			return this.queue.length < 10;
		}
	});

	// CALLBACKS

	uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
		console.info('onWhenAddingFileFailed', item, filter, options);
	};
	uploader.onAfterAddingFile = function(fileItem) {
		$scope.fileItem = fileItem;
	};
	uploader.onBeforeUploadItem = function(item) {
		$scope.uploading 	= true;
		$('.btn-upload').html('<i class="fa fa-fw fa-spin fa-refresh"></i>');
	};
	uploader.onSuccessItem = function(fileItem, response, status, headers) {
		$modalInstance.close();
	};
	uploader.onErrorItem = function(fileItem, response, status, headers) {
		$('.btn-upload').html('<i class="fa fa-fw fa-times"></i>');
		$('.btn-upload').removeClass('btn-primary');
		$('.btn-upload').addClass('btn-danger');
	};

	$scope.ok 	= function () {
		console.log($scope.overwrite);
		$scope.fileItem.upload();
	};

	$scope.cancel 	= function () {
		$modalInstance.close('cancel');
	};

}]);