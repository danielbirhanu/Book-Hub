import Header from "./Books/Header";
import BooksContainerPage from "./Books/BooksContainerPage";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-16">
      <Header />
      <section className="mt-4">
        <BooksContainerPage />
      </section>
    </div>
  );
};

export default Home;