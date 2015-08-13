/* global $ */


$(document).ready(function(){
	console.log('Hello')
	$('#add-treatment').on('submit', function(e){
		e.preventDefault();
		
		$.ajax({
			utl: '/api/addtreatment', 
			data: {category : elem.val()} 
			function(returnData){
			
		});
		
	})
	
});