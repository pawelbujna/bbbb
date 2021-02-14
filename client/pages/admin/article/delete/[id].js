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
        success: `Ogłoszenie ${response.data.name} zostało usunięte.`,
        isButtonDisabled: true,
      });
    } catch (error) {
      console.log(error);
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
              <h1>Delete article</h1>

              <br />

              <p>
                Jesteś pewien ze chcesz usunąc ogłoszenie <strong>{id}</strong>?
              </p>
              <button className="btn btn-rpimary" onClick={deleteArticle}>
                Tak
              </button>
            </>
          )}

          {success && (
            <>
              {showSuccessMessage(success)}
              <br />
              <p>Artykuł został usunięty</p>
            </>
          )}
          {error && showErrorMessage(error)}
          <br />

          {success ||
            (error && (
              <>
                <p>Wróć do ogłoszeń</p>

                <Link href={"/articles"}>
                  <a className="btn btn-primary">Artykuły</a>
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
  const id = context.query.id;

  return {
    props: {
      id,
      token,
    },
  };
});
