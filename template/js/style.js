(function($){
	$.fn.tableSearch = function(options){
		if(!$(this).is('table')){
			return;
		}
		var tableObj = $(this),
			divObj = $('<div style="float:right; padding-right:10px; padding-top:40px">Rechercher : </div><br/><br/>'),
			inputObj = $('<input style="margin-right:20px" type="text" placeholder="Utilisateur" />'),
			caseSensitive = (options.caseSensitive===true)?true:false,
			searchFieldVal = '',
			pattern = '';
		inputObj.off('keyup').on('keyup', function(){
			searchFieldVal = $(this).val();
			pattern = (caseSensitive)?RegExp(searchFieldVal):RegExp(searchFieldVal, 'i');
			tableObj.find('tbody tr').hide().each(function(){
				var currentRow = $(this);
				currentRow.find('td').each(function(){
					if(pattern.test($(this).html())){
						currentRow.show();
						return false;
					}
				});
			});
		});
		tableObj.before(divObj.append(inputObj));
		return tableObj;
	}
}(jQuery));

$(document).ready(function(){
    $('table.search-table').tableSearch({
        searchText:'Search Table',
        searchPlaceHolder:'Input Value'
    });
});

function show_comments(table,messageshow,messagehide) {
	if (document.getElementById(table).style.display == 'none') {
		document.getElementById(messageshow).style.display = 'none';
		document.getElementById(messagehide).style.display = 'block';
		document.getElementById(table).style.display = 'table';
	}
	else {
		document.getElementById(messagehide).style.display = 'none';
		document.getElementById(messageshow).style.display = 'block';
		document.getElementById(table).style.display = 'none';
	}
}