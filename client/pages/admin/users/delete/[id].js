import { useState } from "react";
import axios from "axios";
import Link from "next/link";

import Layout from "../../../../components/Layout";
import withAdmin from "../../../withAdmin";

import {
  showSuccessMessage,
  showErrorMessage,
} from "../../../../helpers/alert";

const Delete = ({ token, user }) => {
  const [state, setState] = useState({
    error: "",
    success: "",
    buttonText: "Usuń",
    isButtonDisabled: false,
  });

  const { error, success, isButtonDisabled } = state;

  const deleteUser = async (e) => {
    e.preventDefault();

    try {
      setState({ ...state, buttonText: "Usuwanie...", isButtonDisabled: true });

      const response = await axios.delete(
        `${process.env.API}/user/${user.salt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setState({
        ...state,
        success: `Ogłoszenie ${response.data.name} zostało usunięte.`,
        isButtonDisabled: true,
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        error: error.response.data.error,
      });
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {!success && !error && (
            <>
              <h1>Usuń użytkownika</h1>

              <br />

              <p>
                Jesteś pewien ze chcesz usunąc <strong>{user.email}</strong>?
              </p>

              <button
                disabled={isButtonDisabled}
                className="btn btn-danger"
                onClick={deleteUser}
              >
                Tak
              </button>
            </>
          )}

          {success && (
            <>
              {showSuccessMessage(success)}
              <br />
              <p>Użytkownik został usunięty</p>
            </>
          )}

          {error && showErrorMessage(error)}
          <br />

          {success ||
            (error && (
              <>
                <p>Wróć do listy użytkowników</p>

                <Link href={"/admin/users"}>
                  <a className="btn btn-primary">Użytkownicy</a>
                </Link>
              </>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default Delete;

export const getServerSideProps = withAdmin(async ({ context, token }) => {
  let data;
  const { id } = context.query;

  try {
    const response = await axios.get(`${process.env.API}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    data = response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong when downloading users.");
  }

  return {
    props: {
      user: data,
      token,
    },
  };
});
