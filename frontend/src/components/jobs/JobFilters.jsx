function JobFilters({
  country,
  setCountry,
  datePosted,
  setDatePosted,
  remoteOnly,
  setRemoteOnly,
  onApply,
  loading,
}) {
  return (
    <div className="job-filters">
      <div className="job-filter-field">
        <label htmlFor="job-country">
          Country
        </label>

        <select
          id="job-country"
          value={country}
          onChange={(event) =>
            setCountry(event.target.value)
          }
        >
          <option value="in">India</option>
          <option value="us">United States</option>
          <option value="gb">United Kingdom</option>
          <option value="ca">Canada</option>
          <option value="au">Australia</option>
        </select>
      </div>

      <div className="job-filter-field">
        <label htmlFor="date-posted">
          Date posted
        </label>

        <select
          id="date-posted"
          value={datePosted}
          onChange={(event) =>
            setDatePosted(event.target.value)
          }
        >
          <option value="all">Any time</option>
          <option value="today">Today</option>
          <option value="3days">Past 3 days</option>
          <option value="week">Past week</option>
          <option value="month">Past month</option>
        </select>
      </div>

      <label className="remote-filter">
        <input
          type="checkbox"
          checked={remoteOnly}
          onChange={(event) =>
            setRemoteOnly(event.target.checked)
          }
        />

        Remote jobs only
      </label>

      <button
        type="button"
        onClick={onApply}
        disabled={loading}
      >
        Apply Filters
      </button>
    </div>
  );
}

export default JobFilters;