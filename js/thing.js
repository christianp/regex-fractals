$(function() {
	var width = Math.pow(2,6);

	var grid = document.createElement('table');
	for(var y=0;y<width;y++) {
		var row = document.createElement('tr');
		grid.appendChild(row);
		for(var x=0;x<width;x++) {
			var cell = document.createElement('td');
			row.appendChild(cell);
		}
	}
	$('#grid').append(grid);

	function address(x,y,width,path) {
		if(width==1) {
			var cell = $('#grid tr').eq(y).find('td').eq(x);
			cell.data('address',path);
			cell.attr('address',path);
		}
		else {
			width /= 2;
			address(x+width,y,width,path+'1');
			address(x,y,width,path+'2');
			address(x,y+width,width,path+'3');
			address(x+width,y+width,width,path+'4');
		}
	}
	address(0,0,width,'');

	function makeColour(c) {
		c = c ? 1/c.length : 1;
		if(c==Infinity)
			return 0;
		return Math.floor(255*(1-c));
	}
	function light() {
		var regex_source = $('#regex').val();
		try {
			var regex = new RegExp(regex_source);
			var url = window.location.origin+window.location.pathname+(regex_source.length ? '?'+encodeURIComponent(regex_source) : '');
			$('#link').text(url).attr('href',url);

		}
		catch(e) {
			$('td').removeClass('on');
			return;
		}
		$('td').each(function() {
			var match = regex.exec($(this).data('address'));
			$(this).toggleClass('on',match!==null);
			if(match) {
				var col = 'rgb('+makeColour(match[1])+','+makeColour(match[2])+','+makeColour(match[2])+')';
				$(this).css('background-color',col);
			}
			else {
				$(this).css('background-color','');
			}
		});
	}
	$('#regex').on('change keyup',light);
	var regex_source = decodeURIComponent(location.search.slice(1)) || '(.*)1(.*)';
	$('#regex').val(regex_source);
	light();

	$('.examples a').on('click',function(e) {
		e.preventDefault();
		var regex_source = $(this).text();
		$('#regex').val(regex_source).change();
	});
});
