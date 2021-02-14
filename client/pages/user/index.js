import Layout from "../../components/Layout";
import withUser from "../withUser";

const User = ({ user }) => {
  return (
    <Layout>
      <h1>Cześć {user.name}!</h1>
      <p>Strona w trakcie konstrukcji.</p>
    </Layout>
  );
};

export default User;

export const getServerSideProps = withUser();
