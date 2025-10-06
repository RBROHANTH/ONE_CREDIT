import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { convertFileToBase64, validateImageFile, convertToEmbedUrl } from '../utils/helpers';

const AddCourse = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    description: '',
    duration: '',
    level: 'Beginner',
    category: '',
    videoUrl: '',
    thumbnail: '',
    modules: [
      {
        title: '',
        description: '',
        videoUrl: '',
        duration: '',
        order: 1,
        content: ''
      }
    ]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, thumbnail: validation.error }));
      return;
    }

    setUploadingThumbnail(true);
    setErrors(prev => ({ ...prev, thumbnail: '' }));

    try {
      const base64 = await convertFileToBase64(file);
      setFormData(prev => ({ ...prev, thumbnail: base64 }));
      setThumbnailPreview(base64);
    } catch (error) {
      setErrors(prev => ({ ...prev, thumbnail: 'Error uploading image. Please try again.' }));
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const removeThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnail: '' }));
    setThumbnailPreview(null);
    // Reset file input
    const fileInput = document.getElementById('thumbnail-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleModuleChange = (moduleIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, index) => 
        index === moduleIndex ? { ...module, [field]: value } : module
      )
    }));
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: '',
          description: '',
          videoUrl: '',
          duration: '',
          order: prev.modules.length + 1,
          content: ''
        }
      ]
    }));
  };

  const removeModule = (moduleIndex) => {
    if (formData.modules.length > 1) {
      setFormData(prev => ({
        ...prev,
        modules: prev.modules.filter((_, index) => index !== moduleIndex)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Course title is required';
    if (!formData.instructor.trim()) newErrors.instructor = 'Instructor name is required';
    if (!formData.description.trim()) newErrors.description = 'Course description is required';
    if (!formData.duration.trim()) newErrors.duration = 'Course duration is required';
    if (!formData.category.trim()) newErrors.category = 'Course category is required';
    if (!formData.videoUrl.trim()) newErrors.videoUrl = 'Course video URL is required';
    
    // Validate modules
    formData.modules.forEach((module, mIndex) => {
      if (!module.title.trim()) {
        newErrors[`module_${mIndex}_title`] = 'Module title is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('admin_token');
      console.log('Admin token:', adminToken ? 'Token exists' : 'No token found');
      
      if (!adminToken) {
        setErrors({ submit: 'No authentication token found. Please login again.' });
        setIsSubmitting(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success) {
        alert('Course created successfully!');
        navigate('/admin/dashboard');
      } else {
        console.error('Error creating course:', result.message);
        setErrors({ submit: result.message || 'Failed to create course' });
      }
    } catch (error) {
      console.error('Error adding course:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Course</h1>
          <p className="text-gray-600">Create a new course with modules and lectures.</p>
          
          {/* Debug info */}
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">
              <strong>Debug Info:</strong> Admin Token: {localStorage.getItem('admin_token') ? 'Found' : 'Not Found'}
            </p>
            {localStorage.getItem('admin_data') && (
              <p className="text-sm text-red-700">
                Admin: {JSON.parse(localStorage.getItem('admin_data')).email}
              </p>
            )}
            <button 
              type="button"
              onClick={() => {
                const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTMzZTg3M2NiOTc1ZDFkODRiOGZiMyIsImlhdCI6MTc1OTcyNzE4MywiZXhwIjoxNzYyMzE5MTgzfQ.tfpvPGmz-ve6vMkD7JzjlOd1wHLkF3zyKMC8nLbKroc';
                localStorage.setItem('admin_token', testToken);
                window.location.reload();
              }}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
            >
              Set Test Token
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Display */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {errors.submit}
            </div>
          )}
          
          {/* Basic Course Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Course Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter course title"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor Name *
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.instructor ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter instructor name"
                />
                {errors.instructor && <p className="text-red-500 text-xs mt-1">{errors.instructor}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.duration ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 8 weeks"
                />
                {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Programming, Data Science, etc."
                />
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Video URL *
                </label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.videoUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://youtube.com/watch?v=..."
                />
                {errors.videoUrl && <p className="text-red-500 text-xs mt-1">{errors.videoUrl}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Description *
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe what students will learn in this course"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Course Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Thumbnail
              </label>
              <div className="space-y-4">
                {/* Upload Area */}
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <input
                      id="thumbnail-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className={`cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors ${
                        uploadingThumbnail 
                          ? 'border-gray-300 bg-gray-50' 
                          : 'border-gray-300 hover:border-primary-500 hover:bg-primary-50'
                      }`}
                    >
                      {uploadingThumbnail ? (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                          <p className="text-sm text-gray-600">Uploading...</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-600">
                            <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                  
                  {/* Preview */}
                  {thumbnailPreview && (
                    <div className="relative">
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                
                {errors.thumbnail && <p className="text-red-500 text-xs">{errors.thumbnail}</p>}
                <p className="text-xs text-gray-500">
                  Upload a course thumbnail to make your course more attractive to students.
                </p>
              </div>
            </div>
          </div>

          {/* Course Materials - Removed for MongoDB compatibility */}

          {/* Course Modules */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Course Modules
            </h3>
            
            {formData.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-800">Module {moduleIndex + 1}</h4>
                  {formData.modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeModule(moduleIndex)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove Module
                    </button>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module Title *
                  </label>
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors[`module_${moduleIndex}_title`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Module title"
                  />
                  {errors[`module_${moduleIndex}_title`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`module_${moduleIndex}_title`]}</p>
                  )}
                </div>

                {/* Module Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Module Description
                    </label>
                    <textarea
                      value={module.description}
                      onChange={(e) => handleModuleChange(moduleIndex, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Describe what this module covers"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Module Video URL
                      </label>
                      <input
                        type="url"
                        value={module.videoUrl}
                        onChange={(e) => handleModuleChange(moduleIndex, 'videoUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Module Duration
                      </label>
                      <input
                        type="text"
                        value={module.duration}
                        onChange={(e) => handleModuleChange(moduleIndex, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g., 2 hours"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Module Content
                    </label>
                    <textarea
                      value={module.content}
                      onChange={(e) => handleModuleChange(moduleIndex, 'content', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Additional content, notes, or materials for this module"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addModule}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              + Add Module
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Course...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddCourse;