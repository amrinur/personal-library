import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchAuthors = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await axios.get(`${apiUrl}/author`);
  return res.data;
};

const createBook = async (bookData) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await axios.post(`${apiUrl}/book`, bookData);
  return res.data;
};

const updateBook = async ({ bookId, bookData }) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await axios.put(`${apiUrl}/book/${bookId}`, bookData);
  return res.data;
};

const BookForm = ({ onClose, editingBook = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    pages: '',
    year: '',
    genre: '',
    status: 'plan',
    image: '',
    favorite: false
  });

  const queryClient = useQueryClient();

  // Populate form data when editing
  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title || '',
        author: editingBook.author?._id || '',
        pages: editingBook.pages || '',
        year: editingBook.year || '',
        genre: editingBook.genre || '',
        status: editingBook.status || 'plan',
        image: editingBook.image || '',
        favorite: editingBook.favorite
      });
    }
  }, [editingBook]);

  const { data: authors, isLoading: authorsLoading } = useQuery({
    queryKey: ['authors'],
    queryFn: fetchAuthors
  });

  const createBookMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      onClose();
    },
    onError: (error) => {
      console.error('Error creating book:', error);
      alert('Failed to add book');
    }
  });

  const updateBookMutation = useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      onClose();
    },
    onError: (error) => {
      console.error('Error updating book:', error);
      alert('Failed to update book');
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.pages || !formData.year || !formData.genre) {
      alert('Please fill all required fields');
      return;
    }

    if (editingBook) {
      // Update existing book
      updateBookMutation.mutate({
        bookId: editingBook._id,
        bookData: formData
      });
    } else {
      // Create new book
      createBookMutation.mutate(formData);
    }
  };

  const isLoading = createBookMutation.isLoading || updateBookMutation.isLoading;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 max-w-md w-full mx-4 border border-gray-300 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-medium text-gray-900 mb-6">
          {editingBook ? 'Edit Book' : 'Add Book'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Author *</label>
            <select
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
              required
            >
              <option value="">Select Author</option>
              {authorsLoading ? (
                <option disabled>Loading authors...</option>
              ) : (
                authors?.map((author) => (
                  <option key={author._id} value={author._id}>
                    {author.author}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Pages *</label>
              <input
                type="number"
                name="pages"
                value={formData.pages}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Year *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Genre *</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
            >
              <option value="plan">Plan to Read</option>
              <option value="read">Currently Reading</option>
              <option value="readed">Finished</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>


          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (editingBook ? 'Updating...' : 'Adding...') : (editingBook ? 'Update Book' : 'Add Book')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;