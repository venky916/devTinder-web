import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const formSchema = z.object({
  emailId: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailId: 'Shankar@gmail.com',
      password: 'Sankar@1234',
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    // console.log('Form Data:', data);
    try {
      const response: any = await axios.post(
        BASE_URL+'login',
        data,
        {
          withCredentials: true,
        },
      );
      // console.log(response.data.data)
      dispatch(addUser(response.data.data));
      navigate('/');
    } catch (error: any) {
      setError('root', {
        message: error?.message,
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
          <h2 className="card-title justify-center">Login</h2>

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

          <div className="card-actions justify-center">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
