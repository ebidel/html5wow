function initReflections() {
    $('canvas').each(function() {
        var canvas = $(this)[0],
            src = $(this).prev().find('img').attr('src');
        
        initReflection(canvas, src); 
    });
}

function initReflection(canvas, imgsrc) {
	var ctx = canvas.getContext("2d"),
	    img = new Image(),
	    w = 290,
	    h = 100,
	    lingrad = ctx.createLinearGradient(0,0,0,h);

    lingrad.addColorStop(0, 'rgba(33,33,33,0.5)');
    lingrad.addColorStop(0.3, 'rgba(33, 33, 33, 0.9)');
    lingrad.addColorStop(1, '#212121');

    img.onload = function() {  
            console.log("loaded");
            ctx.fillStyle = lingrad;
            ctx.save();
            ctx.scale(1, -1);
            ctx.translate(0, -h);
            ctx.drawImage(img, 0, 0, w, h);
            ctx.restore();
            ctx.fillRect(0, 0, w, h);                        
    };

	img.src = imgsrc;
}