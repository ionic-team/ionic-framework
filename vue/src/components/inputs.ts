import Vue from 'vue';

/**
 * Create a wrapped input component that captures typical ionic input events
 * and emits core ones so v-model works.
 * @param {} name the vue name of the component
 * @param {*} coreTag the actual tag to render (such as ion-datetime)
 */
export function createInputComponent(name: string, coreTag: string, modelEvent = 'ionChange', valueProperty = 'value') {
  return Vue.component(name, {
    model: {
      event: modelEvent,
      prop: valueProperty
    },
    render(createElement: any) {
      // Vue types have a bug accessing member properties:
      // https://github.com/vuejs/vue/issues/8721
      const cmp: any = this;

      return createElement(coreTag, {
        'attrs': cmp.attrs,
        'on': {
          'ionChange': cmp.handleChange,
          'ionInput': cmp.handleInput,
          'ionBlur': cmp.handleBlur,
          'ionFocus': cmp.handleFocus
        }
      }, this.$slots.default);
    },
    methods: {
      handleChange($event: any) {
        if (modelEvent === 'ionChange') {
          // Vue expects the value to be sent as the argument for v-model, not the
          // actual event object
          this.$emit('ionChange', $event.target[valueProperty]);
        } else {
          this.$emit('ionChange', $event);
        }
      },
      handleInput($event: any) {
        if (modelEvent === 'ionInput') {
          // Vue expects the value to be sent as the argument for v-model, not the
          // actual event object
          this.$emit('ionInput', $event.target[valueProperty]);
        } else {
          this.$emit('ionInput', $event);
        }
      },
      handleBlur($event: any) {
        this.$emit('ionBlur', $event);
      },
      handleFocus($event: any) {
        this.$emit('ionFocus', $event);
      }
    }
  });
}
