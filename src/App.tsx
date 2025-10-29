const emotions = ["Calm", "Happy", "Stressed", "Angry", "Neutral"];

export function getAIStatus() {
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  return {
    active: true,
    emotion: randomEmotion,
  };
}
