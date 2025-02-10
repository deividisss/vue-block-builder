import { ref } from 'vue';

export function usePreSignedUrl(API_URL_GENERATE_IMG: string) {
  const preSignedUrl = ref<string | null>(null);
  const isGeneratingImageUrl = ref(false);
  const error = ref<string | null>(null);
  const success = ref(false); // Add success state

  const getPreSignedUrl = async (fileName: string, fileType: string): Promise<string | null> => {
    isGeneratingImageUrl.value = true;
    error.value = null;
    preSignedUrl.value = null;
    success.value = false; // Reset success on new request

    try {
      console.log('Requesting pre-signed URL with:', { fileName, fileType });

      const response = await fetch(API_URL_GENERATE_IMG, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, fileType }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to get pre-signed URL: ${response.status} - ${errorBody}`);
      }

      const data = await response.json();
      if (!data.preSignedUrl) throw new Error('Response did not contain preSignedUrl');

      console.log('Received pre-signed URL:', data.preSignedUrl);
      preSignedUrl.value = data.preSignedUrl;
      success.value = true;
      return data.preSignedUrl;
    } catch (err) {
      console.error('Error getting pre-signed URL:', err);
      error.value = (err as Error).message;
      return null;
    } finally {
      isGeneratingImageUrl.value = false;
    }
  };

  return {
    preSignedUrl,
    isGeneratingImageUrl,
    error,
    success,
    getPreSignedUrl,
  };
}
