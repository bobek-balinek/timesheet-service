(function(){

	$(document).ready(function(){

		$('.add-more').on('click', function(event){
			event.preventDefault();

			/** Take the last element of the list which contains input elements,
					clone them and append with empty values **/
			var $newElement = $('.jobs').find('tbody tr:eq(-1)').clone();
			$newElement.find('input').val("");

			$('.jobs').find('tbody').append($newElement);
		});

	});

})(jQuery, window);
