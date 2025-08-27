import SliderUtil from "../../components/SliderUtil";
import { useGetNewBooksQuery } from "../../redux/api/books";
import { Link } from "react-router-dom";

const Header = () => {
  const { data } = useGetNewBooksQuery();

  return (
    <div className="flex flex-col gap-8 mt-[5rem] ml-[2rem] md:flex-row justify-between items-center md:items-start">
      <nav className="w-full md:w-[10rem] ml-0 md:ml-2 mb-4 md:mb-0 self-center">
        <Link
          to="/books"
          className="transition duration-300 ease-in-out hover:bg-teal-200 bg-[#3498db] block p-2 rounded mb-1 md:mb-2 text-lg"
        >
          Browse Books
        </Link>
      </nav>

      <div className="w-full md:w-[85%] mr-0 md:mr-2">
        <SliderUtil data={data} />
      </div>
    </div>
  );
};

export default Header;