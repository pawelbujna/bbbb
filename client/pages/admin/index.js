import Layout from "../../components/Layout";
import withAdmin from "../withAdmin";
import Link from "next/link";

const Admin = ({ admin, token }) => {
  return (
    <Layout>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h1>Panel sterowania</h1>

          <br />

          <Link href="/admin/article/create">
            <a className="btn btn-success btn-sm">Dodaj ogłoszenie</a>
          </Link>

          <br />

          <Link href="/admin/invite">
            <a className="btn btn-primary btn-sm mt-3">Wyślij zaproszenie</a>
          </Link>

          <br />

          <Link href="/admin/users">
            <a className="btn btn-danger btn-sm mt-3">Lista uzytkownikow</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;

export const getServerSideProps = withAdmin();
