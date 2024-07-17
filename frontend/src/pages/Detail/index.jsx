import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './index.scss';

const Detail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v2/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main">
      <Link to="/" className="btn btn-primary">Kembali</Link>

      <table className="table">
        <tbody>
          <tr>
            <td>ID</td>
            <td>: {product._id}</td>
          </tr>
          <tr>
            <td>Nama</td>
            <td>: {product.name}</td>
          </tr>
          <tr>
            <td>Harga</td>
            <td>: Rp. {product.price.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Stock</td>
            <td>: {product.stock}</td>
          </tr>
          <tr>
            <td>Gambar</td>
            <td>
              {product.image && (
                <img
                  src={`http://localhost:5000/${product.image}`}
                  alt={product.name}
                  style={{ maxWidth: '100px', marginTop: '10px' }}
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Detail;
