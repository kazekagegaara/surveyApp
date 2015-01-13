(function () {

'use strict';
	
	//Load controller
  	angular.module('surveyApp').controller('homeController', ['$scope','$location',function($scope,$location) {
      	$scope.test = "Testing...";

      	$scope.goToSurvey = function(path){   			    		
      		console.log("here in home controller");
      		$location.path(path);    		
  		};

    }
  ]);

})();