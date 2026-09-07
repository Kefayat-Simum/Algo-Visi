import { delay } from '../utils/helpers.js';

export class AnimationController {
  constructor() {
    this.isPlaying = false;
    this.isPaused = false;
    this.speed = 500; // Default animation delay in ms
    this.currentStep = 0;
    this.steps = [];
  }

  // Set execution steps array
  setSteps(steps) {
    this.steps = steps;
    this.currentStep = 0;
  }

  // Set animation speed based on slider input
  setSpeed(speedVal) {
    // Inverse speed: higher slider value = lower delay
    this.speed = 1010 - speedVal;
  }

  // Start or resume execution
  async play(renderCallback) {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.isPaused = false;

    while (this.currentStep < this.steps.length && this.isPlaying && !this.isPaused) {
      renderCallback(this.steps[this.currentStep]);
      this.currentStep++;
      await delay(this.speed);
    }

    if (this.currentStep >= this.steps.length) {
      this.isPlaying = false;
    }
  }

  // Pause execution
  pause() {
    this.isPaused = true;
    this.isPlaying = false;
  }

  // Step forward manually
  stepForward(renderCallback) {
    if (this.currentStep < this.steps.length) {
      this.pause();
      renderCallback(this.steps[this.currentStep]);
      this.currentStep++;
    }
  }

  // Step backward manually
  stepBackward(renderCallback) {
    if (this.currentStep > 0) {
      this.pause();
      this.currentStep--;
      renderCallback(this.steps[this.currentStep]);
    }
  }

  // Reset playback state
  reset() {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentStep = 0;
    this.steps = [];
  }
}