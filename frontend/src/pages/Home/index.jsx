import { Link } from "react-router-dom";
import axios from "axios";
import "./index.scss";
import { useEffect, useState } from "react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchKeyword]);

  useEffect(() => {
    getProducts();
  }, [debouncedKeyword]);

  const getProducts = async () => {
    const response = await axios.get("http://localhost:5000/api/v2/products/");
    setProducts(response.data);
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v2/products/${id}`);
      getProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(debouncedKeyword.toLowerCase())
  );

  return (
    <div className="main">
      <Link to="/tambah" className="btn btn-primary">
        Tambah Produk
      </Link>
      <div className="search">
        <input
          type="text"
          placeholder="Masukan kata kunci..."
          value={searchKeyword}
          onChange={handleSearchChange}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th className="text-right">Price</th>
            <th className="text-right">Stock</th>
            <th className="text-center">Image</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={product._id}>
              <td className="centered">{index + 1}</td>
              <td className="centered">{product.name}</td>
              <td className="centered">Rp. {product.price.toLocaleString()}</td>
              <td className="centered">{product.stock}</td>
              <td className="centered">
                <img
                  src={`http://localhost:5000/${product.image}`}
                  alt="Product"
                  style={{ maxWidth: "100px" }}
                />
              </td>
              <td className="text-center">
                <Link to={`/detail/${product._id}`} className="btn btn-sm btn-info">
                  Detail
                </Link>
                <Link
                  to={`/edit/${product._id}`}
                  className="btn btn-sm btn-warning"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
