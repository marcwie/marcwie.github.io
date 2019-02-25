var isrunning = false;
var timerID;
var speed = 3000;
var duration = 500;
var isslow = true;

$(document).ready( function () {

  $("#slow").on("click", function () {

      clearInterval(timerID);
      isrunning = true;
      $(this).prop("disabled", true)
      $("#stopreset").text("Stop")
      $("#fast").prop("disabled", false)

      rewiringProbability = $("#rewiring").val();
      isslow = true;
      speed = 3000;
      duration = 500;

      $(".rewiringslider").prop("disabled", true)
      updateDynamics()
      timerID = setInterval(updateDynamics, speed);
  });

  $("#fast").on("click", function () {

      clearInterval(timerID);
      isrunning = true;
      $(this).prop("disabled", true)
      $("#stopreset").text("Stop")
      $("#slow").prop("disabled", false)

      rewiringProbability = $("#rewiring").val();
      isslow = false;
      speed = 20;
      duration = 0;

      $(".rewiringslider").prop("disabled", true)
      updateDynamics()
      timerID = setInterval(updateDynamics, speed);
  });

  $("#stopreset").on("click", function() {
    if (isrunning == false) {
      reset();
    }
    else
    {
      clearInterval(timerID);
      isrunning = false;
      $(this).text("Reset")
      $("#slow").prop("disabled", false)
      $("#fast").prop("disabled", false)
      $(".rewiringslider").prop("disabled", false)
  }});
});
