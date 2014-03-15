(function(){

	$(document).ready(function(){

		$('.add-more').on('click', function(event){
			event.preventDefault();

			var $newElement = $('.jobs').find('tbody tr:eq(0)').clone();
			$newElement.find('input').val("");

			$('.jobs').find('tbody').append($newElement);
		});

	});

})(jQuery, window);
