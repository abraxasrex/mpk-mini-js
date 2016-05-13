
var wavesAudio = require('waves-audio');
var audioContext = wavesAudio.audioContext;
var loader = new wavesLoaders.AudioBufferLoader(); // instantiate loader

var audioFile = './drumkit/kick.WAV';
// load audio file
loader.load(audioFile).then(function(loaded) {
  // get scheduler and create scheduled granular engine
  var scheduler = wavesAudio.getScheduler();
  var scheduledGranularEngine = new wavesAudio.GranularEngine({
    buffer: loaded
  });
  scheduledGranularEngine.connect(audioContext.destination);

  // create transport with play control and transported granular engine
  var transportedGranularEngine = new wavesAudio.GranularEngine({
    buffer: loaded,
    cyclic: true
  });
  var playControl = new wavesAudio.PlayControl(transportedGranularEngine);
  transportedGranularEngine.connect(audioContext.destination);

  // create GUI elements
  new wavesBasicControllers.Title("Granular Engine in Scheduler", containerId);

  new wavesBasicControllers.Toggle("Enable", false, containerId, function(value) {
    if (value)
      scheduler.add(scheduledGranularEngine);
    else
      scheduler.remove(scheduledGranularEngine);
  });

  new wavesBasicControllers.Slider("Position", 0, 20.6, 0.010, 0, "sec", 'large', containerId, function(value) {
    scheduledGranularEngine.position = value;
  });

  new wavesBasicControllers.Title("Granular Engine with Play Control", containerId);

  new wavesBasicControllers.Toggle("Play", false, containerId, function(value) {
    if (value)
      playControl.start();
    else
      playControl.stop();
  });

  var speedSlider = new wavesBasicControllers.Slider("Speed", -2, 2, 0.01, 1, "", '', containerId, function(value) {
    playControl.speed = value;
    speedSlider.value = playControl.speed;
  });

  new wavesBasicControllers.Title("Common Parameters", containerId);

  new wavesBasicControllers.Slider("Position Var", 0, 0.200, 0.001, 0.003, "sec", '', containerId, function(value) {
    scheduledGranularEngine.positionVar = value;
    transportedGranularEngine.positionVar = value;
  });

  new wavesBasicControllers.Slider("Period", 0.001, 0.500, 0.001, 0.010, "sec", '', containerId, function(value) {
    scheduledGranularEngine.periodAbs = value;
    transportedGranularEngine.periodAbs = value;
  });

  new wavesBasicControllers.Slider("Duration", 0.010, 0.500, 0.001, 0.100, "sec", '', containerId, function(value) {
    scheduledGranularEngine.durationAbs = value;
    transportedGranularEngine.durationAbs = value;
  });

  new wavesBasicControllers.Slider("Resampling", -2400, 2400, 1, 0, "cent", '', containerId, function(value) {
    scheduledGranularEngine.resampling = value;
    transportedGranularEngine.resampling = value;
  });

  new wavesBasicControllers.Slider("Resampling Var", 0, 1200, 1, 0, "cent", '', containerId, function(value) {
    scheduledGranularEngine.resamplingVar = value;
    transportedGranularEngine.resamplingVar = value;
  });

});
