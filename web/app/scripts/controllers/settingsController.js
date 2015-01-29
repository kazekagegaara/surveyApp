(function () {

'use strict';
	
	//Load controller
  	angular.module('surveyApp').controller('settingsController', ['$scope','$location',function($scope,$location) {

  		$scope.title = "Settings";            

      $scope.initModels = function(){
        if(localStorage.surveyAppPin){
          $scope.pin = localStorage.surveyAppPin;
        }
        if(localStorage.surveyAppServerSettings){
          $scope.serverSettings = localStorage.surveyAppServerSettings;
        }
      };

  		$scope.changePage = function(path){   			    		      		          
      		$location.path(path);    		
  		};

  		$scope.saveSettings = function(){                  
          if($scope.pin !== undefined)
            localStorage.surveyAppPin = $scope.pin;          
          if($scope.serverSettings !== undefined)
            localStorage.surveyAppServerSettings = $scope.serverSettings;          
      		$scope.changePage('/home');	
  		};

      $scope.initModels();

  	}    
  ]);

})();