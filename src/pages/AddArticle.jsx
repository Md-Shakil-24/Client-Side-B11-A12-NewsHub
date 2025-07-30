import { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import Select from "react-select";
import { AuthContext } from "../provider/AuthProvider";
import { imageUpload } from "../api/utils";
import { Helmet } from 'react-helmet';

const AddArticle = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setError,
    clearErrors,
    watch
  } = useForm();

  const selectedImage = watch("image");

 
  const { data: publishers = [], isLoading: isPublishersLoading } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/publishers`);
        return (res?.data || []).map(p => ({
          value: p?.name || '',
          label: p?.name || ''
        }));
      } catch (error) {
        toast.error("Failed to load publishers");
        return [];
      }
    },
  });

  const tagOptions = [
    { value: "politics", label: "Politics" },
    { value: "technology", label: "Technology" },
    { value: "sports", label: "Sports" },
    { value: "entertainment", label: "Entertainment" },
    { value: "business", label: "Business" },
    { value: "health", label: "Health" },
  ];

  const { mutate, isPending } = useMutation({
    mutationFn: async (articleData) => {
      try {
        const token = await user?.getIdToken();
        if (!token) throw new Error("Not authenticated");

        return await axios.post(`${import.meta.env.VITE_API_URL}/articles`, articleData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        throw new Error(error?.response?.data?.error || "Failed to add article");
      }
    },
    onSuccess: () => {
      toast.success("Article submitted for review!");
      reset();
      setUploadProgress(0);
      queryClient.invalidateQueries({ queryKey: ["myArticles"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data) => {
    try {
      clearErrors("image");

      if (!data?.image?.[0]) {
        setError("image", { type: "required", message: "Image is required" });
        return;
      }

      const file = data.image[0];

      if (!file?.type?.startsWith("image/")) {
        setError("image", { type: "filetype", message: "Only image files are allowed" });
        return;
      }

      if (file?.size > 5 * 1024 * 1024) {
        setError("image", { type: "filesize", message: "Image must be smaller than 5MB" });
        return;
      }

      if (!data.publisher) {
        setError("publisher", { type: "required", message: "Publisher is required" });
        return;
      }

      setUploadProgress(10);
      const imageUrl = await imageUpload(file);
      setUploadProgress(100);

      const articleData = {
        title: data.title || "",
        description: data.description || "",
        publisher: data.publisher.value,
        tags: (data.tags || []).map(t => t.value).filter(Boolean),
        image: imageUrl || "https://i.ibb.co/4TD0b1v/news-default.jpg",
        isPremium: !!data.isPremium,
      };

      mutate(articleData);
    } catch (error) {
      console.error("Submission error:", error);
      setUploadProgress(0);
      setError("image", {
        type: "upload",
        message: error?.message || "Failed to upload image"
      });
      toast.error(error?.message || "Error submitting article");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">


<Helmet>
        <title>Add-Article | NewsHub</title>
        <meta name="description" content="Learn more about MyApp and what we do." />
        <meta property="og:title" content="About Us - MyApp" />
      </Helmet>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-3xl font-bold">Create New Article</h1>
          <p className="opacity-90 mt-1">Share your news with the world</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
         
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-700">Title *</span>
            </label>
            <input
              type="text"
              placeholder="Enter article title"
              className={`input input-bordered w-full ${errors?.title ? 'input-error' : 'focus:ring-2 focus:ring-blue-500'}`}
              {...register("title", { required: "Title is required" })}
            />
            {errors?.title && (
              <span className="text-red-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.title.message}
              </span>
            )}
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Publisher *</span>
              </label>
              {isPublishersLoading ? (
                <div className="skeleton h-10 w-full rounded-lg"></div>
              ) : (
                <Controller
                  name="publisher"
                  control={control}
                  rules={{ required: "Publisher is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={publishers}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Select publisher"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: errors?.publisher ? '#ef4444' : '#e5e7eb',
                          minHeight: '3rem',
                          '&:hover': {
                            borderColor: errors?.publisher ? '#ef4444' : '#9ca3af'
                          }
                        })
                      }}
                    />
                  )}
                />
              )}
              {errors?.publisher && (
                <span className="text-red-500 text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.publisher.message}
                </span>
              )}
            </div>

          
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Tags</span>
              </label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    options={tagOptions}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select tags (max 3)"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '3rem'
                      })
                    }}
                  />
                )}
              />
            </div>
          </div>

        
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-700">Description *</span>
            </label>
            <textarea
              className={`textarea textarea-bordered h-40 ${errors?.description ? 'textarea-error' : 'focus:ring-2 focus:ring-blue-500'}`}
              placeholder="Write your article content here..."
              {...register("description", { required: "Description is required" })}
            />
            {errors?.description && (
              <span className="text-red-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.description.message}
              </span>
            )}
          </div>

         
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-700">Featured Image *</span>
            </label>
            <div className={`border-2 border-dashed rounded-lg p-4 ${errors?.image ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-500'}`}>
              <input
                type="file"
                className="hidden"
                id="image-upload"
                accept="image/*"
                {...register("image", { required: "Image is required" })}
              />
              <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center">
                {selectedImage?.[0] ? (
                  <>
                    <img
                      src={URL.createObjectURL(selectedImage[0])}
                      alt="Preview"
                      className="max-h-48 rounded-lg mb-3 object-cover"
                      onLoad={() => URL.revokeObjectURL(selectedImage[0])}
                    />
                    <span className="text-blue-600 font-medium">Change Image</span>
                  </>
                ) : (
                  <>
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-blue-600 font-medium">Click to upload</span>
                    <span className="text-gray-500 text-sm mt-1">PNG, JPG up to 5MB</span>
                  </>
                )}
              </label>
            </div>
            {errors?.image && (
              <span className="text-red-500 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.image.message}
              </span>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <progress className="progress progress-primary w-full h-2" value={uploadProgress} max="100" />
              </div>
            )}
          </div>

       
          <div className="form-control">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                {...register("isPremium")}
              />
              <span className="label-text font-medium text-gray-700">Mark as Premium Content</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">Premium articles are only visible to subscribed users</p>
          </div>

         
          <div className="pt-4">
            <button
              type="submit"
              className="btn btn-primary w-full py-3 px-6 rounded-lg text-lg font-medium shadow-md hover:shadow-lg transition-all"
              disabled={isPending || uploadProgress > 0}
            >
              {isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : uploadProgress > 0 ? (
                "Uploading..."
              ) : (
                "Publish Article"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddArticle;