import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchBooks = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await axios.get(`${apiUrl}/book`);
  return res.data;
};

const updateBookStatus = async ({ bookId, status }) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await axios.put(`${apiUrl}/book/${bookId}`, { status });
  return res.data;
};

const ReadForm = ({ onClose }) => {
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('plan');

  const queryClient = useQueryClient();

  const { data: books, isLoading: booksLoading } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateBookStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
      alert('Book status updated successfully!');
      onClose();
    },
    onError: (error) => {
      console.error('Error updating book status:', error);
      alert('Failed to update book status');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedBook) {
      alert('Please select a book');
      return;
    }

    updateStatusMutation.mutate({ 
      bookId: selectedBook, 
      status: selectedStatus 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white border-4 border-black p-8 rounded-none shadow-[8px_8px_0_0_#111] w-[350px]">
        <h2 className="text-2xl font-black mb-4 text-black">Update Reading Status</h2>
        <form onSubmit={handleSubmit}>
          <select 
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="w-full mb-4 px-3 py-2 border-2 border-black bg-[#eee] text-black  focus:outline-none focus:bg-white"
            required
          >
            <option value="">Pilih Buku</option>
            {booksLoading ? (
              <option disabled>Loading books...</option>
            ) : (
              books?.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title} - {book.author?.author}
                </option>
              ))
            )}
          </select>

          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full mb-4 px-3 py-2 border-2 border-black bg-[#eee] text-black  focus:outline-none focus:bg-white"
          >
            <option value="plan">Plan to Read</option>
            <option value="read">Currently Reading</option>
            <option value="readed">Finished</option>
          </select>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-300 border-2 border-black px-4 py-1 font-black text-black hover:bg-gray-400 transition"
              onClick={onClose}
              disabled={updateStatusMutation.isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-yellow-400 border-2 border-black px-4 py-1 font-black text-black hover:bg-yellow-500 transition disabled:opacity-50"
              disabled={updateStatusMutation.isLoading}
            >
              {updateStatusMutation.isLoading ? 'Updating...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReadForm;