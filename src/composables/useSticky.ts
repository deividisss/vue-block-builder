import { throttle } from '@/utils/commonUtils';
import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export function useSticky(elementRef: Ref<HTMLElement | null>) {
  const isSticky = ref(false);

  const checkSticky = throttle(() => {
    if (elementRef.value) {
      const rect = elementRef.value.getBoundingClientRect();
      isSticky.value = rect.top <= 0;
    }
  }, 50);

  onMounted(() => {
    window.addEventListener('scroll', checkSticky);
    checkSticky();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', checkSticky);
  });

  return { isSticky };
}
