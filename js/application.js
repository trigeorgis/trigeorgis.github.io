//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require jquery
//= require bootstrap-sprockets

var app = angular.module('AngularApp', []);

window.gotoPos = function(y){
    var el = $('.content-wrapper');
    el.scrollTop(y);    
}

app.service('anchorSmoothScroll', function(){
    
    this.scrollTo = function(eID) {
        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("gotoPos("+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("gotoPos("+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
        
        function currentYPosition() {
            return $('.content-wrapper').scrollTop();
        }
        
        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };
    
});

app.controller('ScrollCtrl', ['$scope', '$location', 'anchorSmoothScroll', function($scope, $location, anchorSmoothScroll) {
    
    $scope.gotoElement = function (eID){
      // set the location.hash to the id of
      // the element you wish to scroll to.
      // $location.hash(eID);

      console.log('here ' + eID);
    
      // call $anchorScroll()
      anchorSmoothScroll.scrollTo(eID);
      
    };
  }]);


var showPhotos = function(){
    $('.image-container').empty().justifiedImages({
        images : photos,
        rowHeight: 200,
        maxRowHeight: 400,
        thumbnailPath: function(photo, width, height){
            var purl = photo.url_s;
            if( photo.url_n && (width > photo.width_s * 1.2 || height > photo.height_s * 1.2) ) purl = photo.url_n;
            if( photo.url_m && (width > photo.width_n * 1.2 || height > photo.height_n * 1.2) ) purl = photo.url_m;
            if( photo.url_z && (width > photo.width_m * 1.2 || height > photo.height_m * 1.2) ) purl = photo.url_z;
            if( photo.url_l && (width > photo.width_z * 1.2 || height > photo.height_z * 1.2) ) purl = photo.url_l;
            return purl;
        },
        getSize: function(photo){
            return {width: photo.width_s, height: photo.height_s};
        },
        margin: 4
    });
};

app.controller('paperCtrl', ['$scope', function ($scope) {
   $scope.hideBibtex = true;
   window.scope = $scope;
}]);

function getFlickrPictures(){
    $.ajax({
        url : 'https://api.flickr.com/services/rest/?jsoncallback=?',
        method: 'get',
        data : {
            method : 'flickr.photos.search',
            api_key : '00be8f6ce87e11b4859952369e11c51d',
            format : 'json',
            user_id: 'gtrig',
            extras : 'url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l',
            per_page : 10
        },
        dataType: 'json',
        success : function(data){
            window.photos = data.photos.photo;
            showPhotos();
        }
    });

}

$(function(){
	var content = document.querySelector('.content-wrapper .content');
	var duplicate = content.cloneNode(true);
	var contentBlurred = document.createElement('div');
	contentBlurred.className = 'content-blurred';
	contentBlurred.appendChild(duplicate);

	var header = document.querySelector('headerperm');
	header.appendChild(contentBlurred);

	var contentWrapper = document.querySelector('.content-wrapper'),
	translation;

	contentWrapper.addEventListener('scroll',function(){
	  translation = 'translate3d(0,' + (-this.scrollTop + 'px') + ',0)';
	  duplicate.style['-webkit-transform'] = translation;
	  duplicate.style['-moz-transform'] = translation;
	  duplicate.style['transform'] = translation;
	})

	$('nav.navbar.navbar-default').resize(function(){
		$('div.heightdiv').height($(this).height());
	});

	// offset to demo blurring
	contentWrapper.scrollTop = 100;

	getFlickrPictures();

    $(window).resize(function(){
        showPhotos();
    })
});




