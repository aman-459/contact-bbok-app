import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiPlus, FiTrash2, FiEdit2, FiSearch, FiUser, FiPhone, FiMail, FiTag } from 'react-icons/fi';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', tag: 'Personal', notes: '' });
  const [editId, setEditId] = useState(null); // Agar edit mode me hain toh id hold karega

  const { name, phone, email, tag, notes } = formData;

  // 1. Fetch User Contacts
  const fetchContacts = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('http://localhost:5000/api/contacts', config);
      setContacts(res.data);
    } catch (err) {
      console.error(err.response?.data?.message || 'Failed to fetch contacts');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // 2. Form Handle Changes
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // 3. Create or Update Contact
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const config = { headers: { Authorization: `Bearer ${user.token}` } };

    try {
      if (editId) {
        // Update Mode
        const res = await axios.put(`http://localhost:5000/api/contacts/${editId}`, formData, config);
        setContacts(contacts.map((c) => (c._id === editId ? res.data : c)));
        setEditId(null);
      } else {
        // Create Mode
        const res = await axios.post('http://localhost:5000/api/contacts', formData, config);
        setContacts([res.data, ...contacts]);
      }
      setFormData({ name: '', phone: '', email: '', tag: 'Personal', notes: '' }); // Reset form
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  // 4. Set Contact into Edit Mode
  const handleEdit = (contact) => {
    setEditId(contact._id);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      tag: contact.tag || 'Personal',
      notes: contact.notes || '',
    });
  };

  // 5. Delete Contact
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/contacts/${id}`, config);
        setContacts(contacts.filter((c) => c._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  // 6. Real-time Search Filtering
  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Navbar Section */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="text-2xl font-extrabold text-emerald-400 tracking-wide flex items-center gap-2">
          📖 SmartContact
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-300 text-sm bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Welcome, <b>{user?.name}</b>
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </nav>

      {/* Main Dashboard Grid */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl sticky top-24 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
              {editId ? <FiEdit2 /> : <FiPlus />} {editId ? 'Edit Contact' : 'Add New Contact'}
            </h3>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-all"
                  placeholder="Rahul Kumar"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Phone *</label>
                <input
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={onChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-all"
                  placeholder="9876543210"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-all"
                  placeholder="rahul@example.com"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Tag Group</label>
                <select
                  name="tag"
                  value={tag}
                  onChange={onChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-all text-white"
                >
                  <option value="Personal">👨‍👩‍👦 Personal</option>
                  <option value="Work">💼 Work</option>
                  <option value="Important">⭐ Important</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={notes}
                  onChange={onChange}
                  rows="3"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none"
                  placeholder="College friend, works at..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-700 text-slate-950 font-bold rounded-lg transition-all text-sm cursor-pointer shadow-lg"
              >
                {loading ? 'Processing...' : editId ? 'Update Contact' : 'Save Contact'}
              </button>
              
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setFormData({ name: '', phone: '', email: '', tag: 'Personal', notes: '' });
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-sm mt-2 transition-all cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Contact List & Search Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search Header */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center gap-3">
            <FiSearch className="text-slate-400 text-lg shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none placeholder-slate-500"
              placeholder="Search contacts by name or phone number..."
            />
          </div>

          {/* Contact Display Cards Grid */}
          {filteredContacts.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              No contacts found. Start adding some contacts on the left side! 🔍
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all shadow-md relative group flex flex-col justify-between"
                >
                  <div>
                    {/* Card Head details */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h4 className="font-bold text-lg text-white tracking-wide truncate">{contact.name}</h4>
                      <span
                        className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${
                          contact.tag === 'Important'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : contact.tag === 'Work'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {contact.tag}
                      </span>
                    </div>

                    {/* Meta Fields */}
                    <div className="space-y-1.5 text-sm text-slate-400">
                      <p className="flex items-center gap-2"><FiPhone className="text-emerald-400 text-xs" /> {contact.phone}</p>
                      {contact.email && (
                        <p className="flex items-center gap-2 truncate"><FiMail className="text-emerald-400 text-xs" /> {contact.email}</p>
                      )}
                      {contact.notes && (
                        <p className="text-xs text-slate-500 bg-slate-950 p-2 rounded-lg mt-2 border border-slate-800/80 italic">
                          "{contact.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-all cursor-pointer"
                      title="Edit Contact"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg text-sm transition-all cursor-pointer"
                      title="Delete Contact"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;