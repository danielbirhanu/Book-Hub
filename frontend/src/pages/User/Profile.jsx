import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/users";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] text-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#2c3e50]">Update Profile</h1>
          <p className="text-[#7f8c8d]">Manage your account details</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 border border-[#bdc3c7] rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-[#bdc3c7] rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <input
              type="password"
              placeholder="New Password (leave blank to keep current)"
              className="w-full px-4 py-2 border border-[#bdc3c7] rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border border-[#bdc3c7] rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loadingUpdateProfile}
            className="w-full py-3 px-4 bg-[#3498db] text-white font-medium rounded-lg hover:bg-[#2980b9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2"
          >
            {loadingUpdateProfile ? <Loader /> : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;