export const showSuccessMessage = (success) => (
  <div
    className="alert alert-success"
    style={{
      filter: `invert(1)`,
    }}
  >
    {success}
  </div>
);

export const showErrorMessage = (error) => (
  <div
    className="alert alert-danger"
    style={{
      filter: `invert(1)`,
    }}
  >
    {error}
  </div>
);
