angular.module('app.controllers').controller('ProjectViewGanttController', [	'$scope',
																				'$stateParams',
																				'Auth',
																				'Project',
																				'ProjectGantt',
																				'Node',
																				'toaster',
																				'NodeDependencies',
																				'$http',	function(	$scope,
																										$stateParams,
																										Auth,
																										Project,
																										ProjectGantt,
																										Node,
																										toaster,
																										NodeDependencies,
																										$http	) {

	$scope.gantt_data = {
		'data':[],
		'links':[]
	};

	$scope.projectId = $stateParams.id;

	var link, dataNode;
	ProjectGantt.get({id:$scope.projectId})
		.$promise.then(function(res) {
			$scope.project 			= res.data.project;
			$scope.gantt_data_raw 	= res.data;

			for (var i = 0; i < $scope.gantt_data_raw.data.length; i++){
				var type;
				// var start_date = $scope.gantt_data_raw.data[i].start_date.substring(8,10) + "-" +
				// $scope.gantt_data_raw.data[i].start_date.substring(5,7) + "-" +
				// $scope.gantt_data_raw.data[i].start_date.substring(0,4);
				if($scope.gantt_data_raw.data[i].is_leaf){
					type = gantt.config.types.task;
				} else {
					type = gantt.config.types.project;
				}

				dataNode = {
					"id": $scope.gantt_data_raw.data[i].id,
					"text": $scope.gantt_data_raw.data[i].name,
					"start_date": $scope.gantt_data_raw.data[i].gantt_start_date,
					"duration": $scope.gantt_data_raw.data[i].duration,
					"parent": $scope.gantt_data_raw.data[i].parent,
					"type": type,
					"progress": (parseInt($scope.gantt_data_raw.data[i].progress,10)/100)
				}
				// if parent node doesnt exist, clear parent field
				if ($scope.gantt_data_raw.data[i].parent === null || $scope.gantt_data_raw.data[i].parent === 0) {
					delete (dataNode.parent);
				}
				$scope.gantt_data.data.push(dataNode);
			}

			for (var j = 0; j < $scope.gantt_data_raw.links.length; j++) {
				link = {
					"id": 		j,
					"source": 	$scope.gantt_data_raw.links[j].target,
					"target":  	$scope.gantt_data_raw.links[j].source,
					"type":  	$scope.gantt_data_raw.links[j].type
				}
				$scope.gantt_data.links.push(link);
			}
			console.log('ganta data');
			console.log($scope.gantt_data);
			$scope.refreshProgressGantt();
			gantt_data = $scope.gantt_data;
		});

	gantt.attachEvent("onAfterTaskUpdate", function(id,item) {
		var updatedNode 		= {}
		console.log(id,item);
		updatedNode.id 			= item.id;
		updatedNode.name 		= item.text;
		updatedNode.duration 	= item.duration;
		updatedNode.progress 	= ''+(item.progress * 100);
		updatedNode.start_date 	= moment(item.start_date).format("YYYY-MM-DD 00:00:00");
		updatedNode.end_date 	= moment(item.end_date).format("YYYY-MM-DD 00:00:00");
		Node.update(updatedNode,function(u, putResponseHeaders) {
			toaster.pop('success', 'Saved', updatedNode.name);
		});
	});
	gantt.attachEvent("onBeforeTaskDelete", function(id,item) {
		console.log(id,item);
		var r = confirm("Deleting this task will delete all its Permits and Long Lead items, continue ?");
		if (r == true) {
			Node.delete({id:item.id},function(u, putResponseHeaders) {
				toaster.pop('success', 'Deleted', item.text);
				return true;
			});
		} else {
			return false;
		}
	});
	gantt.attachEvent("onTaskOpened", function(id) {
		console.log(id);
		var task 				= _.find($scope.gantt_data.data,{"id":parseInt(id,10)});
		task.open 				= true;
	});
	gantt.attachEvent("onTaskClosed", function(id) {
		console.log(id);
		var task 				= _.find($scope.gantt_data.data,{"id":parseInt(id,10)});
		task.open 				= false;
	});
	gantt.attachEvent("onBeforeTaskAdd", function(id, item) {
		var newNode 			= item;
		var parentId 			= newNode.parent;
		var parentNodeIndex 	= _.findIndex($scope.gantt_data.data,{"id":parseInt(newNode.parent,10)});
		var parentNode 			= $scope.gantt_data.data[parentNodeIndex];
    var todaysDate        = moment().format("YYYY-MM-DD 00:00:00");

      if (parentNode && parentNode.type === "task"){
        var r = confirm("Creating a new task will convert " + parentNode.text + " into a folder, and lose all links, permits and long leads - continue ?");
        if (r == false) {
          return false;
        }
      }

      newNode.duration = 100;
      newNode.parent_id = parseInt(parentId,10);
      newNode.name  = newNode.text;

      if (typeof parentNode === "undefined"){
        // you're trying to create a root node
        // so set the start date to today
        newNode.start_date = todaysDate;
        newNode.parent_id = 0;
      } else {
        parentNode.open = true;
        parentNode.duration = 100;
        parentNode.type = "project";
        newNode.start_date = parentNode.start_date;
      }

      console.log(newNode.start_date)

      // save new node
      delete(newNode.id);
      delete(newNode.end_date);
      delete(newNode.text);
      delete(newNode.parent);

      $http.post('http://api.metinet.co/projects/' + $scope.projectId + '/nodes', {
        headers: {'Authorization': 'Basic amVtaW1hLnNjb3R0QGZha2VyZW1haWwuY29tOnRlc3QxMjM0'},
        name: newNode.name,
        start_date: newNode.start_date,
        duration: newNode.duration,
        parent_id: newNode.parent_id
      })
      .then(function(response) {
        var dataNode = {
          "id": response.data.data.id,
          "text": response.data.data.name,
          "start_date": response.data.data.gantt_start_date,
          "duration": response.data.data.duration,
          "parent": response.data.data.parent,
          "type": "task",
          "progress": (parseInt(response.data.data.progress,10)/100)
        };

        $scope.gantt_data.data.push(dataNode);
        gantt.parse($scope.gantt_data);
        console.log('resp',response);
        toaster.pop('success', 'Created new Task', '.');

        if ( response.status === 200 ) {
          // user logged in
        } else {

        }

		}, function(response) {
			if ( response.status === 403 ) {

			} else {

			}
		});

		// loop through links, find links on previous node and delete those
		_.each($scope.gantt_data.links,function(obj, i){
			if(typeof obj !== "undefined" && (obj.source === parseInt(parentId,10) || obj.target === parseInt(newNode.parent,10))){
				delete($scope.gantt_data.links[i]);
				console.log('== start_date', moment(parentNode.start_date).format("DD-MM-YYYY"));
				console.log('== end_date', moment(parentNode.start_date).add(200, 'day').format("DD-MM-YYYY"));
				// var updatedNode = {};
				// updatedNode.id = parentNode.id;
				// updatedNode.type = "project";
				// Node.update(updatedNode,function(u, putResponseHeaders) {
				//   toaster.pop('success', 'Saved', updatedNode.name);
				// });
				// }
			}
		});
		$scope.refreshProgressGantt();
		return true;
	});
	gantt.attachEvent("onAfterLinkUpdate", function(id,item){
		console.log(id,item);
		item.node_id = item.source;
		delete(item.id);
		NodeDependencies.save(item,function(u, putResponseHeaders) {
		toaster.pop('success', 'Updated link', '.');
		$scope.refreshProgressGantt();
		});
	});
	gantt.attachEvent("onAfterLinkDelete", function(id,item){
		console.log(id,item);
		NodeDependencies.delete({node_id:item.source,id:item.id},function(u, putResponseHeaders) {
		toaster.pop('success', 'Deleted link', '.');
			$scope.refreshProgressGantt();
		});
	});
	gantt.attachEvent("onAfterLinkAdd", function(id,item){
		console.log(id,item);
		delete(item.id);
		item.node_id = item.source;
		NodeDependencies.save(item,function(u, putResponseHeaders) {
		toaster.pop('success', 'Saved new link', '.');
			$scope.refreshProgressGantt();
		});
	});

	$scope.refreshProgressGantt = function() {
		gantt.parse($scope.gantt_data);
	}

}]);