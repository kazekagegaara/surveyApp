(function () {

'use strict';
	
	//Load controller
  	angular.module('surveyApp').service('activeData', function(){
  		
      this.questions = [];
      this.surveyID = '';
      
      this.setSurveyQuestions = function(questions){
        this.questions = questions;
      };     
  		
      this.getSurveyQuestions = function(){
        return this.questions;
      };

      this.setSurveyID = function(id){
        this.surveyID = id;
      };

      this.getSurveyID = function(){
        return this.surveyID;
      };
  		
  	});

})();