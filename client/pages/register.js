// import { useState, useEffect } from "react";
// import Layout from "../components/Layout";
// import axios from "axios";
// import Router from "next/router";

// import { isAuth } from "../helpers/auth";

// import { showSuccessMessage, showErrorMessage } from "../helpers/alert";

// const Register = () => {
//   const [state, setState] = useState({
//     name: "",
//     email: "",
//     password: "",
//     error: "",
//     success: "",
//     buttonText: "Stwórz",
//     isDisabled: false,
//   });

//   const handleChange = (name) => (e) => {
//     setState({
//       ...state,
//       [name]: e.target.value,
//       error: "",
//       success: "",
//       buttonText: "Stwórz",
//     });
//   };

//   const {
//     name,
//     email,
//     password,
//     error,
//     success,
//     buttonText,
//     isDisabled,
//   } = state;

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setState({ ...state, buttonText: "Tworzenie...", isDisabled: true });

//     try {
//       const response = await axios.post(`${process.env.API}/register/private`, {
//         name,
//         email,
//         password,
//       });

//       setState({
//         ...state,
//         name: "",
//         email: "",
//         password: "",
//         buttonText: "Stwórz",
//         isDisabled: false,
//         success: response.data.message,
//       });
//     } catch (error) {
//       setState({
//         ...state,
//         buttonText: "Stwórz",
//         isDisabled: false,
//         error: error.response.data.error,
//       });
//     }
//   };

//   const registerForm = () => {
//     return (
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <input
//             value={name}
//             type="text"
//             className="form-control"
//             placeholder="Name"
//             onChange={handleChange("name")}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <input
//             value={email}
//             type="email"
//             className="form-control"
//             placeholder="Email"
//             onChange={handleChange("email")}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <input
//             value={password}
//             type="password"
//             className="form-control"
//             placeholder="Password"
//             onChange={handleChange("password")}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <button
//             disabled={isDisabled}
//             className="btn btn-outline-warning"
//             type="submit"
//           >
//             {buttonText}
//           </button>
//         </div>
//       </form>
//     );
//   };

//   return (
//     <Layout>
//       <div className="col-md-6 offset-md-3">
//         <h1>Stwórz konto</h1>

//         <br />

//         {success && showSuccessMessage(success)}
//         {error && showErrorMessage(error)}

//         {registerForm()}
//       </div>
//     </Layout>
//   );
// };

// export default Register;
