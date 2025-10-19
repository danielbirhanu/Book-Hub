import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateBookMutation,
  useUploadImageMutation,
} from "../../redux/api/books";
import { useFetchGenresQuery } from "../../redux/api/genre";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

const CreateBook = () => {
  const navigate = useNavigate();

  const [bookData, setBookData] = useState({
    name: "",
    author: "",
    year: "",
    detail: "",
    rating: 0,
    image: null,
    genre: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [
    createBook,
    { isLoading: isCreatingBook, error: _createBookErrorDetail },
  ] = useCreateBookMutation();

  const [
    uploadImage,
    { isLoading: isUploadingImage },
  ] = useUploadImageMutation();

  const { data: genres, isLoading: isLoadingGenres } = useFetchGenresQuery();

  useEffect(() => {
    if (genres && genres.length > 0) {
      setBookData((prevData) => ({
        ...prevData,
        genre: genres[0]._id,
      }));
    }
  }, [genres]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    
    try {
      // Validate all required fields
      if (!bookData.name.trim()) {
        toast.error("Please enter a book title");
        return;
      }
      if (!bookData.author.trim()) {
        toast.error("Please enter an author name");
        return;
      }
      if (!bookData.year) {
        toast.error("Please enter a publication year");
        return;
      }
      if (!bookData.detail.trim()) {
        toast.error("Please enter a description");
        return;
      }
      if (!bookData.genre) {
        toast.error("Please select a genre");
        return;
      }
      if (!selectedImage) {
        toast.error("Please upload a book cover image");
        return;
      }

      // Upload image
      const formData = new FormData();
      formData.append("image", selectedImage);
      const uploadImageResponse = await uploadImage(formData).unwrap();
      
      if (!uploadImageResponse?.image) {
        toast.error("Image upload failed - please try again");
        return;
      }

      // Create book with the uploaded image path
      await createBook({
        ...bookData,
        image: uploadImageResponse.image,
      }).unwrap();

      // Reset form
      setBookData({
        name: "",
        author: "",
        year: "",
        detail: "",
        rating: 0,
        image: null,
        genre: genres?.[0]?._id || "",
      });
      setSelectedImage(null);
      setImagePreview(null);

      // Navigate and show success
      navigate("/admin/books-list");
      toast.success("Book added successfully!");
      
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error?.data?.message || "Failed to create book. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 text-black">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2c3e50]">Add New Book</h1>
          <p className="text-[#7f8c8d]">Fill in the book details below</p>
        </div>

        <form onSubmit={handleCreateBook} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#1e2a36]">
                Book Title *
              </label>
              <input
                type="text"
                name="name"
                value={bookData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#bdc3c7] rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#1e2a36]">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={bookData.author}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#bdc3c7] rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#1e2a36]">
                Publication Year *
              </label>
              <input
                type="number"
                name="year"
                value={bookData.year}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#bdc3c7] rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#1e2a36]">
                Genre *
              </label>
              <select
                name="genre"
                value={bookData.genre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#bdc3c7] rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                required
              >
                {isLoadingGenres ? (
                  <option>Loading genres...</option>
                ) : (
                  genres?.map((genre) => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#1e2a36]">
              Description *
            </label>
            <textarea
              name="detail"
              value={bookData.detail}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-[#bdc3c7] rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#1e2a36]">
              Book Cover *
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#bdc3c7] border-dashed rounded-lg cursor-pointer hover:bg-[#f8f9fa]">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 text-[#7f8c8d]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-sm text-[#7f8c8d]">
                    {selectedImage ? selectedImage.name : "Click to upload"}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </label>
              {imagePreview && (
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-[#bdc3c7]">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isCreatingBook || isUploadingImage}
              className="w-full py-3 px-4 bg-[#3498db] text-white font-medium rounded-lg hover:bg-[#2980b9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2"
            >
              {(isCreatingBook || isUploadingImage) ? (
                <Loader className="mx-auto" />
              ) : (
                "Add Book"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBook;