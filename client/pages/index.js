import axios from "axios";
import Layout from "../components/Layout";
import Link from "next/link";

const Home = ({ categories }) => {
  const listCategories = () =>
    categories.map((category) => (
      <Link href="/" key={category.name}>
        <a
          style={{ border: "1px solid red" }}
          className="bg-light p-3 col-md-4"
        >
          <div>
            <div className="row">
              <div className="col-md-4">
                <img src={category.image.url} width="100" />
              </div>
              <div className="col-md-8">{category.name}</div>
            </div>
          </div>
        </a>
      </Link>
    ));

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1 className="font-weight-bold">Browse Categories</h1>
          <br />
        </div>
      </div>

      <div className="row">{listCategories()}</div>
    </Layout>
  );
};

export default Home;

export const getServerSideProps = async () => {
  let data;

  try {
    const response = await axios.get(`${process.env.API}/category`);
    data = response.data;
  } catch (error) {}

  return {
    props: {
      categories: data,
    },
  };
};
