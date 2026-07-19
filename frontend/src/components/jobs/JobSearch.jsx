function JobSearch({
  query,
  setQuery,
  onSearch,
  loading,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form
      className="job-search"
      onSubmit={handleSubmit}
    >
      <label htmlFor="job-query">
        Job title, skill or location
      </label>

      <div className="job-search-row">
        <input
          id="job-query"
          type="text"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Example: Python Developer in Bengaluru"
          minLength={2}
          maxLength={120}
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search Jobs"}
        </button>
      </div>
    </form>
  );
}

export default JobSearch;