function initUi() {

    $('body').removeClass('no-js');
    
    var $imgs = $('div.img-container');
    
    $imgs.hover(function(){
        console.log('hover');
       $(this).next('canvas').toggleClass('highlight');
    });

}