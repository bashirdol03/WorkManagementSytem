import React,{useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import newRequest from '../../utils/newRequest'
import {useNavigate} from 'react-router-dom'
import { useUserStore } from '../../store/userStore'

 
function Register() {

  const navigate = useNavigate()

  const {user, setUser} = useUserStore();

  useEffect(() => {
    if (user) {
      navigate('/'); // Redirect to home if user is already logged in
    }
  }, [user, navigate]); // Add `user` and `navigate` as dependencies

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
});

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
};

   const handleSubmit = async (event) => {
    event.preventDefault();
        try {
            const response = await newRequest.post("/users/register",
              formData
            );
            console.log(response.data)
            navigate('/login')
          } catch (err) {
            console.log(err);
          
          }
      }  

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 justify-center items-center">
    <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create An Account</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="firstname" className="sr-only">First Name</label>
                <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    autoComplete="given-name"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="First Name"
                    value={formData.firstname}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="lastname" className="sr-only">Last Name</label>
                <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    autoComplete="family-name"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="Last Name"
                    value={formData.lastname}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>
            <div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    Sign Up
                </button>
            </div>
            <div className="text-sm text-center">
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                    Already have an account? Login
                </Link>
            </div>
        </form>
    </div>
</div>
  )
}

export default Register