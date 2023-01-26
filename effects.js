const effects = {
  vis1: {
    title: "Audio Visualizer 1",
    description: "Audio Visualizer using fftsize of 64",
  },
  vis2: {
    title: "Audio Visualizer 2",
    description:
      "Audio Visualizer using fftsize of 2048 and storing it in a binned array of 32 values with each value being the highest value of the bin",
  },
  vis3: {
    title: "Audio Visualizer 3",
    description:
      "Audio Visualizer using fftsize of 2048 and storing it in a binned array of 32 values with each value being an average of the values in the bin",
  },
  clock: {
    title: "Clock",
    description: "A clock effect that takes the clock time from your computer",
  },
};

module.exports = effects;
