$(".resizer").draggable();

$(".resizer").each(function() {
    var width = parseInt($(this).css("left")+15);
    var height = parseInt($(this).css("top")+15);
    $(this).closest("#lessons").css("width", width);
    $(this).closest("#lessons").css("height", height);
});                   
