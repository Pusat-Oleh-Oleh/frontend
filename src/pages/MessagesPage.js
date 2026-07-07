import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/context/AuthContext';
import Header from '../components/section/header';
import Footer from '../components/section/footer';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon,
  UserIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { EnvelopeOpenIcon } from '@heroicons/react/24/solid';

const MessagesPage = () => {
  const { token, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchConversations();
  }, [isAuthenticated, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${apiUrl}/message/conversations`, { headers });
      setConversations(response.data.conversations || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${apiUrl}/message/${userId}`, { headers });
      setMessages(response.data.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      toast.error('Gagal memuat pesan');
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await fetchMessages(conversation.userId);
    // Update unread count locally
    setConversations(prev =>
      prev.map(c =>
        c.userId === conversation.userId ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(`${apiUrl}/message/send`, {
        receiverId: selectedConversation.userId,
        content: newMessage.trim(),
      }, { headers });

      setMessages(prev => [...prev, response.data.message]);
      setNewMessage('');
      // Update last message in conversations list
      setConversations(prev =>
        prev.map(c =>
          c.userId === selectedConversation.userId
            ? { ...c, lastMessage: response.data.message }
            : c
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Gagal mengirim pesan');
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.shopName && c.shopName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Kemarin';
    } else if (days < 7) {
      return d.toLocaleDateString('id-ID', { weekday: 'long' });
    }
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  // Empty state - no conversations
  const EmptyConversations = () => (
    <div className="flex flex-col items-center justify-center h-full py-16 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10 rounded-full flex items-center justify-center mb-6">
        <ChatBubbleLeftRightIcon className="w-10 h-10 text-[#4F46E5]" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Pesan</h3>
      <p className="text-gray-500 text-center max-w-sm">
        Pesan dari penjual terkait pesanan Anda akan muncul di sini.
      </p>
    </div>
  );

  // Empty state - no conversation selected
  const NoConversationSelected = () => (
    <div className="flex flex-col items-center justify-center h-full py-16 px-4">
      <div className="w-24 h-24 bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <EnvelopeOpenIcon className="w-12 h-12 text-[#4F46E5]" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Pilih Percakapan</h3>
      <p className="text-gray-500 text-center max-w-sm">
        Pilih percakapan dari daftar di sebelah kiri untuk membaca dan membalas pesan.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5]/5 to-[#7C3AED]/5">
      <Header />
      <main className="container mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED] rounded mr-3"></div>
          <h1 className="text-2xl font-bold text-gray-900">Pesan</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className={`w-full md:w-96 border-r border-gray-100 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
              {/* Search */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari percakapan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-sm transition-all"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="space-y-4 p-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <EmptyConversations />
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => handleSelectConversation(conv)}
                      className={`w-full flex items-center p-4 hover:bg-gray-50 transition-all duration-200 border-b border-gray-50 ${
                        selectedConversation?.userId === conv.userId
                          ? 'bg-gradient-to-r from-[#4F46E5]/5 to-[#7C3AED]/5 border-l-4 border-l-[#4F46E5]'
                          : ''
                      }`}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white font-bold text-lg">
                          {conv.userName?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="ml-3 flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 truncate text-sm">
                            {conv.shopName || conv.userName}
                          </h4>
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                            {conv.lastMessage && formatTime(conv.lastMessage.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-sm text-gray-500 truncate">
                            {conv.lastMessage?.content || 'Belum ada pesan'}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="ml-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 min-w-[20px] text-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        {conv.userRole && (
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                            conv.userRole === 'seller' 
                              ? 'bg-amber-50 text-amber-600' 
                              : 'bg-blue-50 text-blue-600'
                          }`}>
                            {conv.userRole === 'seller' ? '🏪 Penjual' : '👤 Pembeli'}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold">
                        {selectedConversation.userName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversation.shopName || selectedConversation.userName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.userRole === 'seller' ? '🏪 Penjual' : '👤 Pembeli'}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <EnvelopeIcon className="w-12 h-12 mb-3" />
                        <p>Mulai percakapan...</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        const isMine = String(msg.senderId?._id || msg.senderId) === String(user?.id);
                        return (
                          <div key={msg._id || index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] ${isMine ? 'order-2' : 'order-1'}`}>
                              {/* Order info badge */}
                              {msg.type === 'order_info' && (
                                <div className="flex items-center space-x-1 mb-1">
                                  <ShoppingBagIcon className="w-3.5 h-3.5 text-[#4F46E5]" />
                                  <span className="text-xs text-[#4F46E5] font-medium">Info Pesanan</span>
                                </div>
                              )}
                              <div
                                className={`px-4 py-3 rounded-2xl shadow-sm ${
                                  isMine
                                    ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-br-md'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
                                }`}
                              >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                              </div>
                              <p className={`text-xs mt-1 ${isMine ? 'text-right text-gray-400' : 'text-gray-400'}`}>
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-100 bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ketik pesan..."
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-sm transition-all"
                        disabled={sendingMessage}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sendingMessage}
                        className="p-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      >
                        <PaperAirplaneIcon className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <NoConversationSelected />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MessagesPage;
