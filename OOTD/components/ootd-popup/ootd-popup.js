Component({
  properties: {
    result: {
      type: Object,
      value: null,
    },
  },

  data: {
    slideIndex: 0,
  },

  methods: {
    close() {
      this.triggerEvent('close');
    },

    preventBackgroundScroll() {},

    updateSlide(event) {
      if (event.detail.source === 'touch') {
        this.setData({ slideIndex: event.detail.current });
      }
    },

    selectSlide(event) {
      this.setData({ slideIndex: Number(event.currentTarget.dataset.slide) });
    },

    stepSlide(event) {
      const count = this.data.result.images.length;
      const step = Number(event.currentTarget.dataset.step);
      this.setData({ slideIndex: (this.data.slideIndex + step + count) % count });
    },
  },
});
