import Layout from "../../components/Layout";
import withAdmin from "../withAdmin";
import Link from "next/link";

const Admin = ({ admin, token }) => {
  return (
    <Layout>
      <h1>Admin dashboard</h1>
      <br />
      <div className="row">
        <div className="col-md-4">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link href="/admin/article/create">
                <a className="nav-link">Create article</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/invite">
                <a className="nav-link">Send invitation</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-8"></div>
      </div>
    </Layout>
  );
};

export default Admin;

export const getServerSideProps = withAdmin();
