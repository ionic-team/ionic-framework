import { defineComponent, h, ref, onMounted } from 'vue';

export const IonModal = defineComponent({
  name: 'IonModal',
  setup(_, { attrs, slots }) {
    const isOpen = ref(false);
    const elementRef = ref();

    onMounted(() => {
      elementRef.value.addEventListener('will-present', () => isOpen.value = true);
      elementRef.value.addEventListener('did-dismiss', () => isOpen.value = false);
    });

    return () => {
      return h(
        'ion-modal',
        { ...attrs, ref: elementRef },
        (isOpen.value) ? slots : undefined
      )
    }
  }
});
