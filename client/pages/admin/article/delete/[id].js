import { useState } from "react";
import axios from "axios";
import Link from "next/link";

import Layout from "../../../../components/Layout";
import withAdmin from "../../../withAdmin";

import {
  showSuccessMessage,
  showErrorMessage,
} from "../../../../helpers/alert";

const Delete = ({ id, token }) => {
  const [state, setState] = useState({
    error: "",
    success: "",
    buttonText: "Usuń",
    isButtonDisabled: false,
  });

  const { error, success } = state;

  const deleteArticle = async (e) => {
    e.preventDefault();

    try {
      setState({ ...state, buttonText: "Usuwanie..." });

      const response = await axios.delete(`${process.env.API}/article/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setState({
        ...state,
        success: `Ogłoszenie ${id} zostało usunięte.`,
        isButtonDisabled: true,
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Usuń",
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
              <h1>Usuń ogłoszenie</h1>

              <br />

              <p>
                Jesteś pewien ze chcesz usunąc ogłoszenie <strong>{id}</strong>?
              </p>

              <button className="btn btn-danger" onClick={deleteArticle}>
                Tak
              </button>
            </>
          )}
          {success && <>{showSuccessMessage(success)}</>}
          {error && showErrorMessage(error)}
          <br />
          {success || error ? (
            <>
              <p>Wróć do ogłoszeń</p>

              <Link href={"/articles"}>
                <a className="btn btn-primary">Ogłoszenia</a>
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export default Delete;

export const getServerSideProps = withAdmin(async ({ context, token }) => {
  const id = context.query.id;

  return {
    props: {
      id,
      token,
    },
  };
});
