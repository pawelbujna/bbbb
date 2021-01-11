import Layout from "../../components/Layout";
import withAdmin from "../withAdmin";

const Admin = ({ admin, token }) => {
  return <Layout>{JSON.stringify(admin, token)}</Layout>;
};

export default Admin;

export const getServerSideProps = withAdmin();
