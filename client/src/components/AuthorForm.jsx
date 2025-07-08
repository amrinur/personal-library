import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const createAuthor = async (authorData) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await axios.post(`${apiUrl}/author`, authorData);
  return res.data;
};

const AuthorForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    author: ''
  });

  const queryClient = useQueryClient();

  const createAuthorMutation = useMutation({
    mutationFn: createAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries(['authors']);
      onClose();
    },
    onError: (error) => {
      console.error('Error creating author:', error);
      alert('Failed to add author');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.author.trim()) {
      alert('Please enter author name');
      return;
    }
    createAuthorMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 max-w-md w-full mx-4 border border-gray-300">
        <h2 className="text-xl font-medium text-gray-900 mb-6">Add Author</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">Author Name</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
              placeholder="Enter author name"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              disabled={createAuthorMutation.isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 disabled:opacity-50"
              disabled={createAuthorMutation.isLoading}
            >
              {createAuthorMutation.isLoading ? 'Adding...' : 'Add Author'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthorForm;