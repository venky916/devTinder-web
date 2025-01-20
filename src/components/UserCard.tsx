import React from 'react';

interface UserCardProps {
  user: user;
}

interface user {
  firstName: string;
  lastName: string;
  emailId: string;
  age: number;
  gender: string;
  photoUrl: string;
  DOB: Date;
  about: string;
  skills: string[];
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const {
    firstName,
    lastName,
    age,
    gender,
    photoUrl,
    DOB,
    about,
    skills,
    emailId,
  } = user;
  return (
    <div className="card bg-base-300 w-1/2 shadow-xl rounded-xl m-4 items-center">
      <figure className="px-10 pt-10 w-3/4 ">
        <img src={photoUrl} alt={emailId} className="rounded-xl" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{firstName + ' ' + lastName}</h2>
        {age && gender && (
          <p>
            {age}, {gender}
          </p>
        )}
        <p>{about}</p>
        <div className="card-actions">
          <button className="btn btn-success">interested</button>
          <button className="btn btn-error">ignored</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
