import { string, z } from 'zod';
import {
  useFieldArray,
  useForm,
  SubmitHandler,
  Controller,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { BASE_URL } from '../utils/constants';
import UserCard from './UserCard';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('First name is required'),
  photoUrl: z.string().url('Enter  a valid URL'),
  age: z.number().min(14, 'Age is must be above 14'),
  gender: z.enum(['male', 'female', 'others']),
  about: z.string(),
  skills: z
    .array(z.string().min(1, 'Skill cannot be empty'))
    .min(1, 'At least one skill is required'),
  DOB: z.date(),
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
    setValue,
    getValues,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName,
      lastName,
      photoUrl,
      age,
      gender,
      about,
      skills,
      DOB,
    },
  });

  // const { fields, append, remove } = useFieldArray<FormData>({
  //   control,
  //   name: 'skills',
  // });

  const [inputValue, setInputValue] = useState('');
  const [showToast,setShowToast]= useState(false);

  // Add a skill to the array
  const addSkill = () => {
    if (inputValue.trim() === '') return;

    const currentSkills = getValues('skills');
    setValue('skills', [...currentSkills, inputValue]);
    setInputValue('');
  };

  // Remove a skill by index
  const removeSkill = (index: number) => {
    const updatedSkills = getValues('skills').filter((_, i) => i !== index);
    setValue('skills', updatedSkills);
  };

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
      setShowToast(true);
      const interval = setTimeout(()=>{
        setShowToast(false);
      },3000)
    } catch (error: any) {
      setError('root', {
        message: error?.message,
      });
    }
  };
  if (!user) return;

  return (
    <>
      <div className="flex">
        <form
          className="card bg-base-300 w-1/2 h-1/2 overflow-y-auto shadow-xl rounded-lg m-4 "
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
                placeholder="Enter your age"
                className="input input-bordered w-full "
                type="number"
                {...register('age', { valueAsNumber: true })} // ✅ Correct way to register number
              />
              {errors.age && (
                <p className="text-red-600">{errors.age.message}</p>
              )}
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
              <Controller
                control={control}
                name="DOB"
                render={({ field }) => (
                  <DatePicker
                    className="bg-white text-black dark:bg-gray-800 dark:text-white border rounded p-2 w-full"
                    placeholderText="Select date"
                    onChange={(date: Date | null) => field.onChange(date)}
                    selected={field.value}
                    popperPlacement="bottom-start"
                    portalId="root"
                  />
                )}
              />

              {errors.DOB && (
                <p className="text-red-600">{errors?.DOB.message}</p>
              )}
            </label>

            {/* Skills */}
            <label className="form-control w-full ">
              <span className="label-text">Skills</span>
              <div className="flex space-x-2 mt-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter a skill"
                  className="border p-2 rounded w-full"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
              <Controller
                control={control}
                name="skills"
                render={({ field, fieldState }) => (
                  <>
                    {field.value.length > 0 && (
                      <ul className="mt-2 space-y-2">
                        {field.value.map((skill, index) => (
                          <li
                            key={index}
                            className="flex justify-between bg-gray-100 p-2 rounded text-blue-400"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(index)}
                              className="text-red-500 font-bold"
                            >
                              X
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {fieldState.error && (
                      <p className="text-red-500">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </label>

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
        <UserCard user={user} className="w-1/2 h-1/2" />
      </div>
      {showToast && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <span>Saved Profile successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
