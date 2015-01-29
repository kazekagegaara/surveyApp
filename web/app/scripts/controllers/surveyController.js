(function () {

'use strict';
	
	//Load controller
  	angular.module('surveyApp').controller('surveyController', ['$scope','$location','activeData',function($scope,$location,activeData) {
      	
  		$scope.title = "Survey";  
  		$scope.questions = [];	  		
  		$scope.questionCounter = 0;
      $scope.answers = []
      $scope.selectedAnswer;

  		$scope.controllerInit = function(){  			
  			$scope.questions = activeData.getSurveyQuestions();   
        if($scope.questionCounter === 0)
          $("#prev").addClass("disabled"); 					
  			$scope.populateQuestions();
  		};

  		$scope.populateQuestions = function(){
  			console.log($scope.questions[$scope.questionCounter]);
  			var questionText = $scope.questions[$scope.questionCounter].questionText;
  			$scope.question = questionText;
        if($scope.questions[$scope.questionCounter].questionType === "multiChoice"){
          $("#optionsTwo").hide();
          $("#optionsOne").show();          
        }
        else if($scope.questions[$scope.questionCounter].questionType === "bodyPain"){
          $("#optionsOne").hide();
          $("#optionsTwo").show();
        }
        $scope.populateAnswers();
  		};

      $scope.populateAnswers = function(){
        $scope.answers = [];
        angular.forEach($scope.questions[$scope.questionCounter].answerOptions, function(value, key) {
          console.log(value.answerText);
          $scope.answers.push(value);
        });        
        console.log($scope.answers);
      };

      $scope.goPrev = function(){
        $scope.questionCounter--;
        if($scope.questionCounter === 0)
          $("#prev").addClass("disabled");        
        $("#next").removeClass("disabled");
        $scope.populateQuestions();
      };

      $scope.goNext = function(){
        console.log($scope.selectedAnswer);
        $scope.questionCounter++;
        if($scope.questionCounter > 0)
          $("#prev").removeClass("disabled");
        if($scope.questionCounter === $scope.questions.length-1)
          $("#next").addClass("disabled");
        $scope.populateQuestions();
      };

      $scope.changePage = function(path){                                     
          $location.path(path);       
      };


      //body part IDs
      var parts=["frontFaceFill", "frontChestFill", "frontRightHandFill", "frontAbdomenFill", "frontLeftHandFill", "frontRightLegFill", "frontLeftLegFill", "backHeadFill", "backFill", "backLeftLegFill", "backRightLegFill", "backRightHandFill", "backLeftHandFill","backLowerFill"];

      //body part names that will be printed in the text area
      var partNames=["Front Head Area", "Chest Area", "Right Hand Front", "Abdomen Area", "Left Hand Front", "Right Leg Front", "Left Leg Front", "Head Back Area", "Back", "Left Leg Back", "Right Leg Back", "Right Hand Back", "Left Hand Back", "Lower Back"];

      var position;
      var idName;
      var svgElement;
      var sliderElement;
      var tempSVGelement;
      var lastSelectedPart;
      var currSelectedPart;
      var noPartSelected=true;
      //add event listeners to all body parts
      for (var i = parts.length - 1; i >= 0; i--) {
        svgElement=document.getElementById(parts[i]);
        svgElement.addEventListener("click", onClickParts);
      };

      //add event listeners to slider
      sliderElement=document.getElementById("painIntensitySlider");
      sliderElement.addEventListener("change", sliderFunc);
      sliderElement.addEventListener("drag", sliderFunc);
      sliderElement.addEventListener("dragstart", sliderFunc);

      //update pain intensity textbox
      function sliderFunc(){
        var textBox=document.getElementById("painIntensityTextArea");
        textBox.value=this.value;
      }

      function onClickParts(){
        var textBox=document.getElementById("part");
        position=parts.indexOf(this.id);
        //currSelectedPart=document.getElementById([parts[position]]);
        /*
        if(textBox.value==""){
          textBox.value=partNames[position];
        }
        else{
          textBox.value=textBox.value+"+ "+partNames[position];
        }*/
        //clear out other parts
        if(lastSelectedPart!=this){ //hightlight currSelectedPart and update label
          if(typeof lastSelectedPart!=="undefined"){
            lastSelectedPart.style.fill='#ffffff';
          }
          this.style.fill='#e74c3c';
          noPartSelected=false;
        }
        else{//toggle status according to noPartSelected
              if(noPartSelected){
                  this.style.fill='#e74c3c';
                  noPartSelected=false;
              }
              else{
                  this.style.fill='#ffffff';
                  textBox.value='';
                  noPartSelected=true;
              }
        }
        if(noPartSelected){
          textBox.value="No Part Selected";
        }
        else{
          textBox.value=partNames[position];
        }

        //update lastSelectedPart 
        lastSelectedPart=this;
      }


  		$scope.controllerInit();

    }
  ]);

})();