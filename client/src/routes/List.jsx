import Navbar from "../components/Navbar"
import { useState } from "react";
import ReadForm from "../components/ReadForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios"

const fetchBooks = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await axios.get(`${apiUrl}/book`)
  return res.data;
};

const updateBookFavorite = async ({ bookId, favorite }) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await axios.put(`${apiUrl}/book/${bookId}`, { favorite });
  return res.data;
};

const List = () => {
  const [showReadForm, setShowReadForm] = useState(false);
  const [showFavoriteDropdown, setShowFavoriteDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const queryClient = useQueryClient();
  
  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks
  });

  const updateFavoriteMutation = useMutation({
    mutationFn: updateBookFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
    },
    onError: (error) => {
      console.error('Error updating favorite:', error);
      alert('Failed to update favorite');
    }
  });

  const handleFavoriteToggle = (bookId, currentFavorite) => {
    updateFavoriteMutation.mutate({ bookId, favorite: !currentFavorite });
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  // Filter books based on search term
  const filteredBooks = books?.filter(book =>
    (book.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.author?.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.genre || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort books
  const sortedBooks = filteredBooks?.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'title':
        aValue = a.title?.toLowerCase() || '';
        bValue = b.title?.toLowerCase() || '';
        break;
      case 'author':
        aValue = a.author?.author?.toLowerCase() || '';
        bValue = b.author?.author?.toLowerCase() || '';
        break;
      case 'year':
        aValue = a.year || 0;
        bValue = b.year || 0;
        break;
      case 'pages':
        aValue = a.pages || 0;
        bValue = b.pages || 0;
        break;
      case 'genre':
        aValue = a.genre?.toLowerCase() || '';
        bValue = b.genre?.toLowerCase() || '';
        break;
      default:
        aValue = a.title?.toLowerCase() || '';
        bValue = b.title?.toLowerCase() || '';
    }

    if (typeof aValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortOrder === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {showReadForm && <ReadForm onClose={() => setShowReadForm(false)} />}
      
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-normal text-gray-900 mb-2">reading list</h1>
          </div>
          <div className="text-right relative">
            <div className="text-xs text-gray-500 mb-2">
              Current books: {books?.length || 0}
            </div>
            <button 
              onClick={() => setShowFavoriteDropdown(!showFavoriteDropdown)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              manage favorites
            </button>
            
            {/* Favorite Dropdown */}
            {showFavoriteDropdown && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 shadow-lg z-50 max-h-80 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs text-gray-500 mb-2 px-2">Manage favorite books:</div>
                  {books && books.length > 0 ? (
                    books.map((book) => (
                      <div key={book._id} className="flex items-center justify-between p-2 hover:bg-gray-50">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate flex items-center">
                            {book.title}

                          </div>
                        </div>
                        <div className="ml-3 flex-shrink-0">
                          {book.favorite ? (
                            <button
                              onClick={() => handleFavoriteToggle(book._id, book.favorite)}
                              disabled={updateFavoriteMutation.isLoading}
                              className="text-xs px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              onClick={() => handleFavoriteToggle(book._id, book.favorite)}
                              disabled={updateFavoriteMutation.isLoading}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">No books available</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="search ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Books List */}
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 pb-2 mb-4 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
            <div 
              className="col-span-4 cursor-pointer hover:text-gray-900"
              onClick={() => handleSortChange('title', sortBy === 'title' && sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
            </div>
            <div 
              className="col-span-3 cursor-pointer hover:text-gray-900"
              onClick={() => handleSortChange('author', sortBy === 'author' && sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              Author {sortBy === 'author' && (sortOrder === 'asc' ? '↑' : '↓')}
            </div>
            <div 
              className="col-span-2 cursor-pointer hover:text-gray-900"
              onClick={() => handleSortChange('genre', sortBy === 'genre' && sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              Genre {sortBy === 'genre' && (sortOrder === 'asc' ? '↑' : '↓')}
            </div>
            <div 
              className="col-span-1 cursor-pointer hover:text-gray-900"
              onClick={() => handleSortChange('year', sortBy === 'year' && sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              Year {sortBy === 'year' && (sortOrder === 'asc' ? '↑' : '↓')}
            </div>
            <div className="col-span-2">Status</div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">Loading books...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">Error loading books: {error.message}</div>
          ) : sortedBooks && sortedBooks.length > 0 ? (
            sortedBooks.map((book) => (
              <div key={book._id} className="grid grid-cols-12 gap-4 py-3 hover:bg-gray-50 group">
                <div className="col-span-4">
                  <div className="font-medium text-gray-900 flex items-center">
                    {book.title}
                    {book.favorite && (
                      <span className="ml-2 text-yellow-500 text-sm">⭐</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{book.pages} pages</div>
                </div>
                <div className="col-span-3 text-gray-700">{book.author?.author || 'Unknown'}</div>
                <div className="col-span-2 text-gray-600">{book.genre}</div>
                <div className="col-span-1 text-gray-600">{book.year}</div>
                <div className="col-span-2">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      book.status === 'readed' ? 'bg-green-100 text-green-800' :
                      book.status === 'read' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {book.status === 'readed' ? 'Finished' : book.status === 'read' ? 'Reading' : 'Plan'}
                    </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              <div className="mb-2">No books found</div>
              <button 
                onClick={() => setShowReadForm(true)}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Add your first book
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex justify-between">
            <div>Total books: {sortedBooks?.length || 0}</div>
            <div>Last updated: {new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      
      {/* Overlay untuk close dropdown */}
      {showFavoriteDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowFavoriteDropdown(false)}
        />
      )}
    </div>
  )
}

export default List