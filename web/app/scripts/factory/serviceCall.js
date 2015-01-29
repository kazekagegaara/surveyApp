(function () {

'use strict';
	
	//Load controller
  	angular.module('surveyApp').factory('serviceCall', function($http){

  		var url = {};
      
  		// constructor to set up certain defaults
  		function serviceCall(serviceName,callMethod){  		
        /*jshint validthis: true */	
  			this.url = {
  				domain : localStorage.surveyAppServerSettings,
  				method : callMethod,
  				name : serviceName 
  			};  			
  		}

  		serviceCall.prototype.call = function(payload,success,error,mockURL){
  			var serviceURL = mockURL || this.url.domain + "/" + this.url.name;  			
  			console.log(serviceURL);
  			console.log(this.url.method);
  			console.log(payload);
  			$http(
			    { 
			      method: this.url.method,		      
			      url: serviceURL,
			      data: payload
			    }
	  		).
	    	success(function(data, status, headers, config) {
	      		success(data, status, headers, config);
	    	}).
	    	error(function(data, status, headers, config) {
	      		error(data, status, headers, config);
	    	});
  		};

  		return serviceCall;
  	});

})();