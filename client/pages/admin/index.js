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
          <ul className="nav">
            <li className="nav-item">
              <Link href="/admin/article/create">
                <a className="nav-link">Dodaj ogłoszenie</a>
              </Link>
            </li>
            <li className="nav-item ml-3">
              <Link href="/admin/invite">
                <a className="nav-link">Wyślij zaproszenie</a>
              </Link>
            </li>
            <li className="nav-item ml-3">
              <Link href="/admin/users">
                <a className="nav-link">Lista uzytkownikow</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;

export const getServerSideProps = withAdmin();
