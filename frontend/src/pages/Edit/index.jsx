import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/input';
import axios from 'axios';

const Edit = () => {
  const { id } = useParams(); 
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null); 
  const [errors, setErrors] = useState({}); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v2/products/${id}`);
        const product = response.data;
        setName(product.name);
        setPrice(product.price);
        setStock(product.stock);
        setImage(product.image); 
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleStockChange = (event) => {
    setStock(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('stock', stock);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.put(`http://localhost:5000/api/v2/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Produk berhasil diperbarui');
      navigate('/')
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="main">
      <div className="card">
        <h2>Edit Produk</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <Input name="name" type="text" placeholder="Nama Produk..." label="Nama" value={name} onChange={handleNameChange} error={errors.name} />
          <Input name="price" type="number" placeholder="Harga Produk..." label="Harga" value={price} onChange={handlePriceChange} error={errors.price} />
          <Input name="stock" type="number" placeholder="Stock Produk..." label="Stock" value={stock} onChange={handleStockChange} error={errors.stock} />
          <div className="form-group">
            <label htmlFor="image">Gambar</label>
            <input type="file" name="image" onChange={handleImageChange} className="form-control" />
            {image && <img src={`http://localhost:5000/${image}`} alt="Product" style={{ maxWidth: '100px' }} />}
          </div>
          <button type="submit" className="btn btn-primary">Simpan</button>
        </form>
      </div>
    </div>
  );
}

export default Edit;
