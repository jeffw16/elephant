// Room selection
$(".rooms-item").click(function(){
  if ( !$(this).hasClass("rooms-item-active") ) {
    $(".rooms-item").each(function(index,el){
      if ( $(el).hasClass("rooms-item-active") ) {
        $(el).removeClass("rooms-item-active").removeClass("active");
      }
    });
    $(this).addClass("rooms-item-active").addClass("active");
  }
});

// Question selection
$(".questions-item").click(function(){
  if ( !$(this).hasClass("questions-item-active") ) {
    $(".questions-item").each(function(index,el){
      if ( $(el).hasClass("questions-item-active") ) {
        $(el).removeClass("questions-item-active").removeClass("active");
      }
    });
    $(this).addClass("questions-item-active").addClass("active");
  }
  // pull content for selected question into the pane
  $("#question-pane").html("<p>hi</p>");
});
