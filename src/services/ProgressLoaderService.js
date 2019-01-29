import axios from 'axios';

class ProgressLoader {
  constructor(elements) {
    this.location = window.location.origin;
    this.elements = elements;
    this.requests = [];
    this.progressEvents = [];
    this.completeEvents = [];
    this.totalProgress = 0;

    this.init();
  }

  init() {
    this.elements.forEach(element => {
      this.requests.push({
        // element: this.location + element,
        element: element,
        progress: 0
      });
    });
    

    this.requests.forEach((request, index) => {
      axios.get(request.element, {
        onDownloadProgress: progressEvent => {
          const percent = Math.round(
            progressEvent.loaded / progressEvent.total * 100
          );

          this.updateProgress(index, percent, );
        }
      });
    });
  }

  updateProgress(index, progress, ) {
    this.requests[index].progress = progress;
    const total = this.requests.reduce(
      (value, request) => value + request.progress,
      0
    );

    const currentProgress = Math.floor(total / this.requests.length);

    if (currentProgress > this.totalProgress) {
      this.totalProgress = currentProgress;

      if (this.totalProgress === 100) {
        this.progressEventsCall();
        this.completeEventsCall();
      } else {
        this.progressEventsCall();
      }
    }
  }

  progressEventsCall() {
    this.progressEvents.forEach(({ callback }) => {
      callback(this.totalProgress);
    });
  }

  completeEventsCall() {
    this.completeEvents.forEach(({ callback }) => {
      callback();
    });
  }

  on(event, callback) {
    switch (event) {
      case 'progress':
        this.progressEvents.push({ callback });
        break;

      case 'complete':
        this.completeEvents.push({ callback });
        break;

      default:
        break;
    }
  }
}

export default ProgressLoader;
