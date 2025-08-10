import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../redux/api/users";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-black">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#2c3e50]">Welcome Back</h1>
          <p className="text-[#7f8c8d]">Sign in to your account</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#3498db] text-white font-medium rounded-lg hover:bg-[#2980b9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2"
          >
            {isLoading ? <Loader /> : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm text-[#7f8c8d]">
          New to our platform?{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="text-[#3498db] hover:underline font-medium"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;