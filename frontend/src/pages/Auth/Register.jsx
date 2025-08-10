import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useRegisterMutation } from "../../redux/api/users";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("Welcome aboard!");
      } catch (err) {
        toast.error(err.data.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-black">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#2c3e50]">Sign Up</h1>
          <p className="text-[#4e5152]">Join our community in seconds</p>
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
              placeholder="Password"
              className="w-full px-4 py-2 border border-[#bdc3c7] rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border border-[#bdc3c7] rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#3498db] text-white font-medium rounded-lg hover:bg-[#2980b9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2"
          >
            {isLoading ? <Loader /> : "Create Account"}
          </button>
        </form>

        <div className="text-center text-sm text-[#7f8c8d]">
          Already have an account?{" "}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : "/login"}
            className="text-[#3498db] hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;