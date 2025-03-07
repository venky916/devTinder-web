import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import { useState } from 'react';

// Zod schemas
const loginSchema = z.object({
  emailId: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = loginSchema.extend({
  firstName: z.string().min(5, 'First name must be at least 5 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
});

// Infer the form data type
type FormData = z.infer<typeof loginSchema | typeof signUpSchema>;

const Login = () => {
  const [authLogin, setAuthLogin] = useState(true); // Toggle between login/signup
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(authLogin ? loginSchema : signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      emailId: '',
      password: '',
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormData) => {
    try {
      const endpoint = authLogin ? 'login' : 'signup'; // Dynamic endpoint
      const response = await axios.post(BASE_URL + endpoint, data, {
        withCredentials: true,
      });
      dispatch(addUser(response.data.data)); // Update Redux store
      navigate('/'); // Navigate to home page
    } catch (error :any) {
      setError('root', {
        message: error?.response?.data?.message || 'An error occurred',
      });
    }
  };

  return (
    <form
      className="my-10 flex justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="card bg-base-300 w-96 shadow-xl rounded-2xl">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {authLogin ? 'Login' : 'Sign Up'}
          </h2>

          {/* First Name and Last Name fields (only for signup) */}
          {!authLogin && (
            <>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">First Name</span>
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full max-w-xs"
                  id="firstName"
                  {...register('firstName')}
                />
                {/* {(errors as typeof signUpSchema).firstName && (
                  <p className="text-red-600">
                    {(errors as typeof signUpSchema).firstName.message}
                  </p>
                )} */}
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Last Name</span>
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full max-w-xs"
                  id="lastName"
                  {...register('lastName')}
                />
                {/* {errors?.lastName && (
                  <p className="text-red-600">{errors?.lastName.message}</p>
                )} */}
              </label>
            </>
          )}

          {/* Email field */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email ID</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              id="email"
              {...register('emailId')}
            />
            {errors.emailId && (
              <p className="text-red-600">{errors.emailId.message}</p>
            )}
          </label>

          {/* Password field */}
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input
              className="input input-bordered w-full max-w-xs"
              id="password"
              type="password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-red-600">{errors.password.message}</p>
            )}
          </label>

          {/* Submit button */}
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? authLogin
                  ? 'Logging In...'
                  : 'Creating Account...'
                : authLogin
                ? 'Sign In'
                : 'Sign Up'}
            </button>
          </div>

          {/* Toggle between login/signup */}
          <div className="flex justify-center gap-2 mt-4">
            <p>
              {authLogin
                ? "Don't have an account?"
                : 'Already have an account?'}
            </p>
            <button
              type="button"
              className="text-primary underline"
              onClick={() => setAuthLogin(!authLogin)}
            >
              {authLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>

          {/* Root error message */}
          {errors.root && (
            <p className="text-red-600 text-center">{errors.root.message}</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;
