import { string, z } from 'zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { BASE_URL } from '../utils/constants';
import UserCard from './UserCard';

const formSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('First name is required'),
  photoUrl: z.string().url('Enter  a valid URL'),
  age: z.number().min(14, 'Age is must be above 14'),
  gender: z.enum(['male', 'female', 'others']),
  about: z.string(),
  // skills : z.array(string().nonempty('Skill cannot be empty')),
  DOB: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date (YYYY-MM-DD)'),
});

type FormData = z.infer<typeof formSchema>;

const Profile = () => {
  const user = useSelector((store: any) => store.user);
  const dispatch = useDispatch();
  const { firstName, lastName, photoUrl, age, gender, about, skills, DOB } =
    user;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName,
      lastName,
      photoUrl,
      age,
      gender,
      about,
      // skills,
      DOB,
    },
  });

  // const { fields, append, remove } = useFieldArray({
  //   name: 'skills',
  //   control,
  // });

  const onSubmit = async (data: FormData) => {
    console.log('Form Data:', data);
    try {
      const response: any = await axios.post(
        BASE_URL + 'profile/update',
        data,
        {
          withCredentials: true,
        },
      );
      console.log(response);
      dispatch(addUser(response.data.data));
    } catch (error: any) {
      setError('root', {
        message: error?.message,
      });
    }
  };
  if (!user) return;

  return (
    <div className="flex">
      <form
        className="card bg-base-300 w-1/2 shadow-xl rounded-lg m-4 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="card-body">
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">First Name</span>
            </div>
            <input
              type="text"
              className="input input-bordered w-full "
              id="firstName"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-red-600">{errors.firstName.message}</p>
            )}
          </label>
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">Last Name</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full "
              id="lastName"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-red-600">{errors.lastName.message}</p>
            )}
          </label>
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">Photo URL</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full "
              id="photoUrl"
              {...register('photoUrl')}
            />
            {errors.photoUrl && (
              <p className="text-red-600">{errors.photoUrl.message}</p>
            )}
          </label>
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">Age</span>
            </div>
            <input
              type="number"
              placeholder="Enter your age"
              className="input input-bordered w-full "
              id="age"
              {...(register('age'), { valueAsNumber: true })}
            />
            {errors.age && <p className="text-red-600">{errors.age.message}</p>}
          </label>
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">Gender</span>
            </div>
            <select
              className="select select-bordered"
              id="gender"
              {...register('gender')}
            >
              <option disabled>Select one</option>
              <option value={'male'}>Male</option>
              <option value={'female'}>Female</option>
              <option value={'others'}>Others</option>
            </select>
          </label>
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">About</span>
            </div>
            <textarea
              placeholder=""
              className="textarea textarea-bordered textarea-lg w-full"
              id="about"
              {...register('about')}
            ></textarea>
          </label>
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">Date of Birth</span>
            </div>
            <input
              type="date"
              className="input input-bordered w-full "
              id="DOB"
              {...register('DOB')}
            />
            {errors.DOB && (
              <p className="text-red-600">{errors?.DOB.message}</p>
            )}
          </label>

          {/* Skills */}
          {/* <label className="form-control w-full ">
            <span className="label-text">Skills</span>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...register(`skills.${index}`)}
                />
                <button
                  type="button"
                  className="btn btn-error btn-xs"
                  onClick={() => remove(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => append('')}
            >
              Add Skill
            </button>
            {errors.skills && (
              <p className="text-red-600">{errors.skills.message}</p>
            )}
          </label> */}

          <div className="card-actions justify-center mt-4">
            <button
              className="btn btn-primary"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'UPDATING' : 'UPDATE'}
            </button>
          </div>
        </div>
      </form>
      <div className="divider divider-success lg:divider-horizontal"></div>
      <UserCard user={user} />
    </div>
  );
};

export default Profile;
