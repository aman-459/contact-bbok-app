import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend Register API call (Port 5000)
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      login(res.data); // Automatic login after signup
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h2 className="text-3xl font-extrabold text-white text-center mb-2">Create Account</h2>
        <p className="text-slate-400 text-sm text-center mb-6">Get started with your personal contact book</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">Password (Min 6 chars)</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
              minLength="6"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-700 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;