import Card from "../components/Card";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Pagination from "../components/Paginate";
import SearchBox from "../components/SearchBox";
import ShimmerHome from "../components/ShimmerHome";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  if (isLoading) {
    return <ShimmerHome />;
  }
  if (error) {
    return <div>{error?.data?.message || error.error}</div>;
  }

  return (
    <>
      <div className="p-3">
        <SearchBox />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-5 p-5">
        {data?.products.map((product) => (
          <div
            className="m-2 shadow-lg rounded-lg bg-gray-200 hover:scale-105"
            key={product._id}
          >
            <Link to={`/product/${product._id}`}>
              <Card product={product} />
            </Link>
          </div>
        ))}
      </div>
      <div className="p-10">
        <Pagination
          pages={data.pages}
          page={data.page}
          keyword={keyword ? keyword : ""}
        />
      </div>
    </>
  );
};

export default HomeScreen;
