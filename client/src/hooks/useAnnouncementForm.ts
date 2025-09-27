    featured: initialData?.featured || false,
    published: initialData?.published || false,
  });

  const [errors, setErrors] = useState<Record<keyof AnnouncementFormData, string>>({
    title: '',
    content: '',
    mediaFile: '',
    featured: '',
    published: '',
  });

  const validate = useCallback((): boolean => {
    const newErrors = { ...errors };
    let isValid = true;

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
      isValid = false;
    } else {
      newErrors.title = '';
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
      isValid = false;
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters long';
      isValid = false;
    } else {
      newErrors.content = '';
    }

    // Media file validation
    if (formData.mediaFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
      if (!allowedTypes.includes(formData.mediaFile.type)) {
        newErrors.mediaFile = 'Invalid file type. Only images and MP4 videos are allowed.';
        isValid = false;
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (formData.mediaFile.size > maxSize) {
        newErrors.mediaFile = 'File size must be less than 10MB';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [formData, errors]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));

      // Clear error when user starts typing
      if (errors[name as keyof typeof errors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [errors]
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Basic file type validation
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          mediaFile: 'Invalid file type. Only images and MP4 videos are allowed.'
        }));
        return;
      }
      
      // File size validation (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          mediaFile: 'File size must be less than 10MB'
        }));
        return;
      }
      
      setFormData((prev) => ({
        ...prev,
        mediaFile: file,
      }));
      
      // Clear any previous file errors
      setErrors(prev => ({
        ...prev,
        mediaFile: ''
      }));
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      title: initialData?.title || '',
      content: initialData?.content || '',
      mediaFile: null,
      featured: initialData?.featured || false,
      published: initialData?.published || false,
    });
    setErrors({
      title: '',
      content: '',
      mediaFile: '',
      featured: '',
      published: '',
    });
  }, [initialData]);

  const getFormData = useCallback((): FormData => {
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('content', formData.content);
    formDataObj.append('featured', String(formData.featured));
    formDataObj.append('published', String(formData.published));
    
    if (formData.mediaFile) {
      formDataObj.append('media', formData.mediaFile);
    }
    
    return formDataObj;
  }, [formData]);

  return {
    formData,
    errors,
    handleChange,
    handleFileChange,
    validate,
    resetForm,
    getFormData,
    setFormData,
  };
};

export default useAnnouncementForm;
