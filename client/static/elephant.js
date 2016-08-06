// Channel selection
$(".channels-item").click(function(){
  if ( !$(this).hasClass("channels-item-active") ) {
    $("channels-item").each(function(index,el){
      alert( "This el is " + el + " and blah");
      if ( $(el).hasClass("channels-item-active") ) {
        $(el).removeClass("channels-item-active");
      }
    });
    $(this).addClass("channels-item-active").addClass("active");
  }
});
