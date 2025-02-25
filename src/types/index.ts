export type user = {
  _id?: string;
  firstName: string;
  lastName: string;
  emailId: string;
  age?: number;
  gender?: string;
  photoUrl?: string;
  DOB?: Date;
  about: string;
  skills?: string[];
};

export type connection = {
  _id: string;
  fromUserId: user;
  toUserId: user;
  status: string;
};
