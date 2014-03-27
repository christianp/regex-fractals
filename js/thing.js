var grid_width = Math.pow(2,9);

function makeGrid() {
	var canvas = document.getElementById('grid');
	canvas.setAttribute('width',grid_width);
	canvas.setAttribute('height',grid_width);
	var context = canvas.getContext('2d');

	var addresses = [];
	for(var y=0;y<grid_width;y++) {
		var row = [];
		addresses.push(row);
		for(var x=0;x<grid_width;x++) {
			row.push('');
		}
	}

	return {
		context: context,
		addresses: addresses
	};
}

$(function() {

	var d = makeGrid();
	var context = d.context;
	var addresses = d.addresses;

	var data = context.createImageData(grid_width,grid_width);
	var pixels = data.data;

	function address(x,y,width,path) {
		if(width==1) {
			addresses[y][x] = path;
			pixels[(y*grid_width+x)*4+3] = 255;
		}
		else {
			width /= 2;
			address(x+width,y,width,path+'1');
			address(x,y,width,path+'2');
			address(x,y+width,width,path+'3');
			address(x+width,y+width,width,path+'4');
		}
	}
	address(0,0,grid_width,'');

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
			return;
		}

		for(var y=0;y<grid_width;y++) {
			for(var x=0;x<grid_width;x++) {
				var address = addresses[y][x];
				var match = regex.exec(address);
				var pos = (y*grid_width+x)*4;
				if(match) {
					var r = makeColour(match[1]);
					var g = makeColour(match[2]);
					var b = makeColour(match[3]);
					pixels[pos] = r;
					pixels[pos+1] = g;
					pixels[pos+2] = b;
				}
				else {
					pixels[pos] = 255;
					pixels[pos+1] = 255;
					pixels[pos+2] = 255;
				}
			}
		}

		context.putImageData(data,0,0);
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
