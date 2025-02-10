import { ref } from 'vue';

export const useS3ImageUpload = () => {
  const isUploading = ref(false);
  const errorMessage = ref<string | null>(null);

  const uploadImageToS3 = async (imageBlob: Blob, preSignedUrl: string | URL) => {
    isUploading.value = true;
    errorMessage.value = null;

    try {
      const response = await fetch(preSignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': imageBlob.type,
        },
        body: imageBlob,
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      console.log('Image uploaded successfully');
    } catch (error: any) {
      errorMessage.value = `Error uploading image: ${error.message}`;
      console.error(errorMessage.value);
    } finally {
      isUploading.value = false;
    }
  };

  return {
    isUploading,
    errorMessage,
    uploadImageToS3,
  };
};
