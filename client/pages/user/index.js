import Layout from "../../components/Layout";
import withUser from "../withUser";

const User = ({ user, token }) => {
  return <Layout>{JSON.stringify(user, token)}</Layout>;
};

export default User;

export const getServerSideProps = withUser();
