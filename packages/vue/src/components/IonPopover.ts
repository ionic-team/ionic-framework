import { defineComponent, h, ref, onMounted } from 'vue';

export const IonPopover = defineComponent({
  name: 'IonPopover',
  setup(_, { attrs, slots }) {
    const isOpen = ref(false);
    const elementRef = ref();

    onMounted(() => {
      elementRef.value.addEventListener('will-present', () => isOpen.value = true);
      elementRef.value.addEventListener('did-dismiss', () => isOpen.value = false);
    });

    return () => {
      return h(
        'ion-popover',
        { ...attrs, ref: elementRef },
        (isOpen.value) ? slots : undefined
      )
    }
  }
});
