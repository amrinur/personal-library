import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchBooks = async () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await axios.get(`${apiUrl}/book`);
  return res.data;
};

const Homepage = () => {
  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks
  });

  const finishedBooks = books?.filter(book => book.status === 'readed') || [];
  const currentlyReading = books?.filter(book => book.status === 'read') || [];
  const favoriteBooks = books?.filter(book => book.favorite === true) || []; // Filter buku favorite

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-16">
          <div>
            <h1 className="text-3xl font-normal text-gray-900 mb-8">Jabami Yumeko</h1>
          </div>
          
          {/* Stats Horizontal */}
          <div className="flex space-x-12">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{books?.length || 0}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Total Books</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{finishedBooks.length}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Finished</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{currentlyReading.length}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Reading</div>
            </div>
          </div>
        </div>

        {/* Favorite Books */}
        <div className="mb-16">
          <h2 className="text-2xl font-medium text-gray-900 mb-8">Favorite</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteBooks.length > 0 ? (
              favoriteBooks.map((book) => (
                <div key={book._id} className="bg-white p-4 border border-gray-200 hover:shadow-sm transition-shadow">
                  <div className="aspect-[3/4] bg-gray-100 mb-3 flex items-center justify-center text-gray-400">
                    {book.image ? (
                      <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs">No Image</span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{book.author?.author}</p>
                  <div className={`text-xs px-2 py-1 rounded inline-block ${
                    book.status === 'readed' ? 'bg-green-100 text-green-800' :
                    book.status === 'read' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {book.status === 'readed' ? 'Finished' : book.status === 'read' ? 'Reading' : 'Plan'}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p>No favorite books yet.</p>
                <p className="text-sm">Mark books as favorite from your reading list.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage