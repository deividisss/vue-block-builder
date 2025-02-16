// useSticky.ts
import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export function useSticky(elementRef: Ref<HTMLElement | null>) {
  const isSticky = ref(false);

  const checkSticky = () => {
    if (elementRef.value) {
      const rect = elementRef.value.getBoundingClientRect();
      isSticky.value = rect.top <= 0;
    }
  };

  onMounted(() => {
    window.addEventListener('scroll', checkSticky);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', checkSticky);
  });

  return { isSticky };
}
