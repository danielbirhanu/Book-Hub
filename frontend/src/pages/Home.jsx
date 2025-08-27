import Header from "./Books/Header";
import BooksContainerPage from "./Books/BooksContainerPage";

const Home = () => {
  return (
    <div className="text-black">
      <Header />

      <section className="mt-[3rem]">
        <BooksContainerPage />
      </section>
    </div>
  );
};

export default Home;