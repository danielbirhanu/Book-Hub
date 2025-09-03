const GenreForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="p-1 md:p-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="py-2 md:py-3 px-3 md:px-4 border rounded-lg w-full max-w-md"
          placeholder="Write genre name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex flex-col xs:flex-row gap-2 justify-between max-w-md">
          <button className="bg-[#3498db] text-white py-2 px-4 rounded-lg hover:bg-[#2980b9] focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-opacity-50 transition-colors duration-200 flex-1">
            {buttonText}
          </button>

          {handleDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200 flex-1"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GenreForm;