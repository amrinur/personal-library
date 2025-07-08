import { useState } from "react";
import AuthorForm from "../components/AuthorForm";
import BookForm from "../components/BookForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchBooks = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await axios.get(`${apiUrl}/book`);
  return res.data;
};

const fetchAuthors = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await axios.get(`${apiUrl}/author`);
  return res.data;
};

const deleteBook = async (bookId) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await axios.delete(`${apiUrl}/book/${bookId}`);
  return res.data;
};

const deleteAuthor = async (authorId) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await axios.delete(`${apiUrl}/author/${authorId}`);
  return res.data;
};

const Dict = () => {
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null); // State untuk book yang sedang diedit
  const [activeTab, setActiveTab] = useState('books');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const updateBookStatus = async ({ bookId, status }) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await axios.put(`${apiUrl}/book/${bookId}`, { status });
  return res.data;
    };

  const updateStatusMutation = useMutation({
      mutationFn: updateBookStatus,
      onSuccess: () => {
        queryClient.invalidateQueries(['books']);
      },
      onError: (error) => {
        console.error('Error updating status:', error);
        alert('Failed to update status');
      }
  });
  
  const handleStatusChange = (bookId, newStatus) => {
      updateStatusMutation.mutate({ bookId, status: newStatus });
  };

  const { data: books, isLoading: booksLoading, error: booksError } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks
  });

  const { data: authors, isLoading: authorsLoading, error: authorsError } = useQuery({
    queryKey: ['authors'],
    queryFn: fetchAuthors
  });

  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
    }
  });

  const deleteAuthorMutation = useMutation({
    mutationFn: deleteAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries(['authors']);
    }
  });

  const handleDeleteBook = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBookMutation.mutate(bookId);
    }
  };

  const handleDeleteAuthor = (authorId) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      deleteAuthorMutation.mutate(authorId);
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowBookForm(true);
  };

  const handleCloseBookForm = () => {
    setShowBookForm(false);
    setEditingBook(null);
  };

  const filteredBooks = books?.filter(book =>
    (book.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.author?.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.genre || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAuthors = authors?.filter(author =>
    (author.author || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {showAuthorForm && <AuthorForm onClose={() => setShowAuthorForm(false)} />}
      {showBookForm && (
        <BookForm 
          onClose={handleCloseBookForm} 
          editingBook={editingBook}
        />
      )}
      
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-normal text-gray-900 mb-2">dictionary</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAuthorForm(true)}
              className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 transition-colors"
            >
              Add Author
            </button>
            <button
              onClick={() => setShowBookForm(true)}
              className="border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              Add Book
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mb-8">
          <button
            onClick={() => setActiveTab('books')}
            className={`pb-2 border-b-2 text-sm ${
              activeTab === 'books'
                ? 'border-gray-900 text-gray-900 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Books ({books?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('authors')}
            className={`pb-2 border-b-2 text-sm ${
              activeTab === 'authors'
                ? 'border-gray-900 text-gray-900 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Authors ({authors?.length || 0})
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Content */}
        {activeTab === 'books' ? (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 pb-2 mb-4 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
              <div className="col-span-3">Title</div>
              <div className="col-span-2">Author</div>
              <div className="col-span-2">Genre</div>
              <div className="col-span-1">Year</div>
              <div className="col-span-1">Pages</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Books List */}
            {booksLoading ? (
              <div className="py-8 text-center text-gray-500">Loading books...</div>
            ) : booksError ? (
              <div className="py-8 text-center text-red-500">Error loading books</div>
            ) : filteredBooks && filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div key={book._id} className="grid grid-cols-12 gap-4 py-3 hover:bg-gray-50 group">
                  <div className="col-span-3">
                    <div className="font-medium text-gray-900">{book.title}</div>
                  </div>
                  <div className="col-span-2 text-gray-700">{book.author?.author || 'Unknown'}</div>
                  <div className="col-span-2 text-gray-600">{book.genre}</div>
                  <div className="col-span-1 text-gray-600">{book.year}</div>
                  <div className="col-span-1 text-gray-600">{book.pages}</div>
                  <div className="col-span-2">
                  <select
                    value={book.status}
                    onChange={(e) => handleStatusChange(book._id, e.target.value)}
                    disabled={updateStatusMutation.isLoading}
                    className={`text-xs px-2 py-1 rounded border-0 font-medium ${
                      book.status === 'readed' ? 'bg-green-100 text-green-800' : 
                      book.status === 'read' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'
                    } ${updateStatusMutation.isLoading ? 'opacity-50' : 'cursor-pointer'}`}
                  >
                    <option value="plan">Plan</option>
                    <option value="read">Reading</option>
                    <option value="readed">Finished</option>
                  </select>
                  </div>
                  <div className="col-span-1">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditBook(book)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        disabled={deleteBookMutation.isLoading}
                        className="text-red-600 hover:text-red-800 text-xs disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-500">
                <div className="mb-2">No books found</div>
                <button
                  onClick={() => setShowBookForm(true)}
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  Add your first book
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 pb-2 mb-4 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
              <div className="col-span-6">Author Name</div>
              <div className="col-span-3">Books Count</div>
              <div className="col-span-3">Actions</div>
            </div>

            {/* Authors List */}
            {authorsLoading ? (
              <div className="py-8 text-center text-gray-500">Loading authors...</div>
            ) : authorsError ? (
              <div className="py-8 text-center text-red-500">Error loading authors</div>
            ) : filteredAuthors && filteredAuthors.length > 0 ? (
              filteredAuthors.map((author) => (
                <div key={author._id} className="grid grid-cols-12 gap-4 py-3 hover:bg-gray-50 group">
                  <div className="col-span-6">
                    <div className="font-medium text-gray-900">{author.author}</div>
                  </div>
                  <div className="col-span-3 text-gray-600">
                    {books?.filter(book => book.author?._id === author._id).length || 0} books
                  </div>
                  <div className="col-span-3">
                    <button
                      onClick={() => handleDeleteAuthor(author._id)}
                      disabled={deleteAuthorMutation.isLoading}
                      className="text-red-600 hover:text-red-800 text-xs disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-500">
                <div className="mb-2">No authors found</div>
                <button
                  onClick={() => setShowAuthorForm(true)}
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  Add your first author
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dict