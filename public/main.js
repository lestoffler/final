/* global $ */


$(document).ready(function(){
	// console.log('Hello')
	$('.plusone').on('click', function() {
		var $this = $(this)
		$.ajax({
			url: '/rating/plusone',
			method: 'POST', 
			data: {name : $(this).attr('data-which')},
			success : function(returnData){
				console.log(returnData)
				console.log($this)
				$this.closest('.treatment').find('.total-score').text("Total Usefulness Score: " + returnData.totalScore)
			}
			
		});
	
	})
	$('.minusone').on('click', function() {
		var $this = $(this)
		$.ajax({
			url: '/rating/minusone',
			method: 'POST', 
			data: {name : $(this).attr('data-which')},
			success : function(returnData){
				$this.closest('.treatment').find('.total-score').text("Total Usefulness Score: " + returnData.totalScore)
			}
			
		});		

	})
});