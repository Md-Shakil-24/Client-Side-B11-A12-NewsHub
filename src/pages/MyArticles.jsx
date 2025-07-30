import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { imageUpload } from "../api/utils";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

const MyArticles = () => {
  const { user } = useContext(AuthContext);
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { 
    register: registerEdit, 
    handleSubmit: handleEditSubmit,
    control: controlEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
    setError: setEditError,
    clearErrors: clearEditErrors,
    watch: watchEdit
  } = useForm();

  const selectedEditImage = watchEdit("image");

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

  const {
    data: articles = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myArticles", user?.email],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-articles/${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { mutate: deleteArticle } = useMutation({
    mutationFn: async (id) => {
      const token = await user.getIdToken();
      return axios.delete(`${import.meta.env.VITE_API_URL}/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Article deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete article");
    },
  });

  const { mutate: updateArticle, isLoading: isUpdating } = useMutation({
    mutationFn: async (updatedData) => {
      const token = await user.getIdToken();
      return axios.put(
        `${import.meta.env.VITE_API_URL}/articles/${updatedData._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Article updated successfully");
      setShowEditModal(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to update article");
    },
  });

  const openDetailsModal = (article) => {
    setCurrentArticle(article);
    setShowDetailsModal(true);
  };

  const openEditModal = (article) => {
    setCurrentArticle(article);
    resetEdit({
      title: article.title,
      description: article.description,
      publisher: { value: article.publisher, label: article.publisher },
      tags: article.tags?.map(tag => ({ value: tag, label: tag })),
      isPremium: article.isPremium,
      image: null
    });
    setShowEditModal(true);
  };

  const handleEditSave = async (data) => {
    try {
      clearEditErrors("image");

      let imageUrl = currentArticle.image;
      
      if (data?.image?.[0]) {
        const file = data.image[0];
        
        if (!file?.type?.startsWith("image/")) {
          setEditError("image", { type: "filetype", message: "Only image files are allowed" });
          return;
        }

        if (file?.size > 5 * 1024 * 1024) {
          setEditError("image", { type: "filesize", message: "Image must be smaller than 5MB" });
          return;
        }

        setUploadProgress(10);
        imageUrl = await imageUpload(file);
        setUploadProgress(100);
      }

      const articleData = {
        _id: currentArticle._id,
        title: data.title,
        description: data.description,
        publisher: data.publisher.value,
        tags: (data.tags || []).map(t => t.value).filter(Boolean),
        image: imageUrl,
        isPremium: !!data.isPremium,
      };

      updateArticle(articleData);
    } catch (error) {
      console.error("Edit error:", error);
      setUploadProgress(0);
      toast.error(error?.message || "Error updating article");
    }
  };

  const showDeclineReason = (article) => {
    Swal.fire({
      title: 'Article Declined',
      html: `
        <div class="text-left">
          <p class="mb-2"><strong>Status:</strong> <span class="badge badge-error">Declined</span></p>
          <p class="mb-2"><strong>Title:</strong> ${article.title}</p>
          <p class="mb-2"><strong>Reason:</strong></p>
          <div class="bg-gray-100 p-3 rounded mb-4">${article.declineReason || 'No reason provided'}</div>
          <p class="text-sm text-gray-500">Please review the feedback, make necessary changes, and resubmit your article.</p>
        </div>
      `,
      icon: 'error',
      confirmButtonText: 'Okay',
      showCancelButton: true,
      // cancelButtonText: 'Edit Article',
      focusConfirm: false,
      preConfirm: () => {},
      didOpen: () => {
        const cancelButton = Swal.getCancelButton();
        cancelButton.addEventListener('click', () => {
          openEditModal(article);
          Swal.close();
        });
      }
    });
  };

  if (!user?.email) return <p className="text-center mt-10">Loading user...</p>;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    console.error("My Articles Fetch Error", error);
    return (
      <div className="alert alert-error">
        <span>Error loading articles: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Articles</h1>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Articles</div>
              <div className="stat-value">{articles.length}</div>
            </div>
          </div>
        </div>


         <Helmet>
                      <title>My-Articles | NewsHub</title>
                      <meta name="description" content="Learn more about MyApp and what we do." />
                      <meta property="og:title" content="About Us - MyApp" />
                    </Helmet>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">You haven't posted any articles yet.</div>
            <Link to="/dashboard/add-article" className="btn btn-primary mt-4">
              Create Your First Article
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Premium</th>
                  <th>Views</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article, index) => (
                  <tr key={article._id}>
                    <th>{index + 1}</th>
                    <td className="font-medium">{article.title}</td>
                    <td>
                      <div className="flex items-center">
                        <span
                          className={`badge ${
                            article.status === "approved"
                              ? "badge-success"
                              : article.status === "declined"
                              ? "badge-error"
                              : "badge-warning"
                          }`}
                        >
                          {article.status}
                        </span>
                        {article.status === "declined" && (
                          <button 
                            onClick={() => showDeclineReason(article)}
                            className="ml-2 btn btn-circle btn-xs btn-ghost"
                            aria-label="View decline reason"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      {article.isPremium ? (
                        <span className="badge badge-primary">Yes</span>
                      ) : (
                        <span className="badge badge-ghost">No</span>
                      )}
                    </td>
                    <td>{article.viewCount || 0}</td>
                    <td className="flex gap-2">
                      <Link to={`/article/${article._id}`}>
                        <button className="btn btn-sm btn-info">
                          Details
                        </button>
                      </Link>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => openEditModal(article)}
                        disabled={article.status === "declined"}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => {
                          Swal.fire({
                            title: 'Delete Article?',
                            text: "You won't be able to revert this!",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes, delete it!'
                          }).then((result) => {
                            if (result.isConfirmed) {
                              deleteArticle(article._id);
                            }
                          });
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showDetailsModal && currentArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <h2 className="text-2xl font-bold">{currentArticle.title}</h2>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <span className="badge badge-lg">
                    {currentArticle.publisher}
                  </span>
                  <span className="text-sm opacity-90">
                    {new Date(currentArticle.postedAt).toLocaleDateString()}
                  </span>
                  {currentArticle.isPremium && (
                    <span className="badge badge-lg badge-primary">
                      Premium
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img
                      src={currentArticle.image || "https://i.ibb.co/4TD0b1v/news-default.jpg"}
                      alt={currentArticle.title}
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg">Status</h3>
                      <p className="capitalize">
                        <span className={`badge ${
                          currentArticle.status === "approved"
                            ? "badge-success"
                            : currentArticle.status === "declined"
                            ? "badge-error"
                            : "badge-warning"
                        }`}>
                          {currentArticle.status}
                        </span>
                        {currentArticle.status === "declined" && currentArticle.declineReason && (
                          <div className="mt-2">
                            <h4 className="font-bold">Reason:</h4>
                            <p>{currentArticle.declineReason}</p>
                          </div>
                        )}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">Tags</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentArticle.tags?.map((tag, index) => (
                          <span key={index} className="badge badge-outline">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">Views</h3>
                      <p>{currentArticle.viewCount || 0}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg">Description</h3>
                  <p className="mt-2 whitespace-pre-line">
                    {currentArticle.description}
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    className="btn btn-outline"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditModal && currentArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <h2 className="text-2xl font-bold">Edit Article</h2>
                <p className="opacity-90 mt-1">Update your article details</p>
              </div>

              <form onSubmit={handleEditSubmit(handleEditSave)} className="p-6 space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">Title *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter article title"
                    className={`input input-bordered w-full ${editErrors?.title ? 'input-error' : 'focus:ring-2 focus:ring-blue-500'}`}
                    {...registerEdit("title", { required: "Title is required" })}
                  />
                  {editErrors?.title && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {editErrors.title.message}
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
                        control={controlEdit}
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
                                borderColor: editErrors?.publisher ? '#ef4444' : '#e5e7eb',
                                minHeight: '3rem',
                                '&:hover': {
                                  borderColor: editErrors?.publisher ? '#ef4444' : '#9ca3af'
                                }
                              })
                            }}
                          />
                        )}
                      />
                    )}
                    {editErrors?.publisher && (
                      <span className="text-red-500 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {editErrors.publisher.message}
                      </span>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-gray-700">Tags</span>
                    </label>
                    <Controller
                      name="tags"
                      control={controlEdit}
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
                    className={`textarea textarea-bordered h-40 ${editErrors?.description ? 'textarea-error' : 'focus:ring-2 focus:ring-blue-500'}`}
                    placeholder="Write your article content here..."
                    {...registerEdit("description", { required: "Description is required" })}
                  />
                  {editErrors?.description && (
                    <span className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {editErrors.description.message}
                    </span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">Featured Image</span>
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 ${editErrors?.image ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-500'}`}>
                    <input
                      type="file"
                      className="hidden"
                      id="edit-image-upload"
                      accept="image/*"
                      {...registerEdit("image")}
                    />
                    <label htmlFor="edit-image-upload" className="cursor-pointer flex flex-col items-center justify-center">
                      {selectedEditImage?.[0] ? (
                        <>
                          <img
                            src={URL.createObjectURL(selectedEditImage[0])}
                            alt="Preview"
                            className="max-h-48 rounded-lg mb-3 object-cover"
                            onLoad={() => URL.revokeObjectURL(selectedEditImage[0])}
                          />
                          <span className="text-blue-600 font-medium">Change Image</span>
                        </>
                      ) : (
                        <>
                          <img
                            src={currentArticle.image || "https://i.ibb.co/4TD0b1v/news-default.jpg"}
                            alt="Current"
                            className="max-h-48 rounded-lg mb-3 object-cover"
                          />
                          <span className="text-blue-600 font-medium">Click to upload new image</span>
                          <span className="text-gray-500 text-sm mt-1">PNG, JPG up to 5MB</span>
                        </>
                      )}
                    </label>
                  </div>
                  {editErrors?.image && (
                    <span className="text-red-500 text-sm mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {editErrors.image.message}
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
                      {...registerEdit("isPremium")}
                    />
                    <span className="label-text font-medium text-gray-700">Mark as Premium Content</span>
                  </label>
                  <p className="text-sm text-gray-500 mt-1">Premium articles are only visible to subscribed users</p>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowEditModal(false)}
                    disabled={isUpdating || uploadProgress > 0}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isUpdating || uploadProgress > 0}
                  >
                    {isUpdating ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                    ) : uploadProgress > 0 ? (
                      "Uploading..."
                    ) : (
                      "Update Article"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyArticles;