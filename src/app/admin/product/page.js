"use client";

import { useState, useEffect } from 'react';
import { fetchGraphQLData } from '../../../lib/graphqlClient'; // Ensure this path is correct


// GraphQL Queries and Mutations
const GET_PRODUCTS = `
  query Products {
    products {
      id
      name
      description
      price
      color
      images
      stock
      created_at
      updated_at
      brand_id
      category_id
      sub_category_id
      display_image
      sku
      is_active
    }
  }
`;

const ADD_PRODUCT = `
  mutation AddProduct($newProduct: NewProductInput!) {
    addProduct(newProduct: $newProduct) {
      status
      data {
        id
        name
        description
        price
        color
        brand_id
        category_id
        sub_category_id
        display_image
        images
        stock
        sku
        is_active
        created_at
        updated_at
      }
      message
    }
  }
`;

const UPDATE_PRODUCT = `
  mutation UpdateProduct($updateProductId: ID!, $productData: UpdateProductInput!) {
    updateProduct(id: $updateProductId, productData: $productData) {
      status
      data {
        id
        name
        description
        price
        color
        brand_id
        category_id
        sub_category_id
        display_image
        images
        stock
        sku
        is_active
        created_at
        updated_at
      }
      message
    }
  }
`;

const DELETE_PRODUCT = `
  mutation DeleteProduct($deleteProductId: ID!) {
    deleteProduct(id: $deleteProductId) {
      status
      data {
        id
      }
      message
    }
  }
`;

const TOGGLE_PRODUCT_STATUS = `
  mutation ToggleProductStatusById($toggleProductStatusByIdId: ID!) {
    toggleProductStatusById(id: $toggleProductStatusByIdId) {
      status
      data {
        id
        is_active
      }
      message
    }
  }
`;

const PRODUCT_COUNT = `
  query Query {
    productCount
  }
`;

const GET_BRANDS_CATEGORIES_SUBCATEGORIES = `
  query Brands {
    brands {
      id
      name
    }
    categories {
      id
      name
    }
    subCategories {
      id
      name
      category_id
    }
  }
`;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    color: '',
    brand_id: '',
    category_id: '',
    sub_category_id: '',
    display_image: '',
    images: [],
    stock: 0,
    sku: '',
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await fetchGraphQLData(GET_PRODUCTS);
        setProducts(productData.products);

        const countData = await fetchGraphQLData(PRODUCT_COUNT);
        setProductCount(countData.productCount);

        const brandData = await fetchGraphQLData(GET_BRANDS_CATEGORIES_SUBCATEGORIES);
        setBrands(brandData.brands);
        setCategories(brandData.categories);
        setSubCategories(brandData.subCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault(); // Prevent form refresh
    try {
      const formattedProduct = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10),
      };

      const data = await fetchGraphQLData(ADD_PRODUCT, { newProduct: formattedProduct });
      setProducts([...products, data.addProduct.data]);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        color: '',
        brand_id: '',
        category_id: '',
        sub_category_id: '',
        display_image: '',
        images: [],
        stock: 0,
        sku: '',
      });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault(); // Prevent form refresh
    try {
      const formattedProductData = {
        ...editingProduct,
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock, 10),
      };

      const { id, ...productData } = formattedProductData;
      const data = await fetchGraphQLData(UPDATE_PRODUCT, {
        updateProductId: id,
        productData,
      });

      setProducts(
        products.map((prod) =>
          prod.id === data.updateProduct.data.id
            ? data.updateProduct.data
            : prod
        )
      );
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await fetchGraphQLData(DELETE_PRODUCT, { deleteProductId: id });
      setProducts(products.filter((prod) => prod.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleToggleProductStatus = async (id) => {
    try {
      const data = await fetchGraphQLData(TOGGLE_PRODUCT_STATUS, { toggleProductStatusByIdId: id });
      setProducts(
        products.map((prod) =>
          prod.id === data.toggleProductStatusById.data.id
            ? data.toggleProductStatusById.data
            : prod
        )
      );
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Admin Portal - Manage Products
      </h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Total Products: {productCount}
        </h2>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={editingProduct ? editingProduct.name : newProduct.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:text-gray-100"
            />
            <input
              type="text"
              name="description"
              value={editingProduct ? editingProduct.description : newProduct.description}
              onChange={handleInputChange}
              placeholder="Product Description"
              className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:text-gray-100"
            />
            <input
              type="number"
              name="price"
              value={editingProduct ? editingProduct.price : newProduct.price}
              onChange={handleInputChange}
              placeholder="Product Price"
              className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:text-gray-100"
            />
            <input
              type="number"
              name="stock"
              value={editingProduct ? editingProduct.stock : newProduct.stock}
              onChange={handleInputChange}
              placeholder="Product Stock"
              className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:text-gray-100"
            />
            <input
              type="text"
              name="sku"
              value={editingProduct ? editingProduct.sku : newProduct.sku}
              onChange={handleInputChange}
              placeholder="SKU"
              className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <select
              name="brand_id"
              value={editingProduct ? editingProduct.brand_id : newProduct.brand_id}
              onChange={handleInputChange}
              className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            <select
              name="category_id"
              value={editingProduct ? editingProduct.category_id : newProduct.category_id}
              onChange={handleInputChange}
              className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              name="sub_category_id"
              value={editingProduct ? editingProduct.sub_category_id : newProduct.sub_category_id}
              onChange={handleInputChange}
              className="border p-2 rounded w-full bg-white dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Select Subcategory</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {editingProduct ? 'Update Product' : 'Create Product'}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="ml-4 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Product List
        </h2>
        <table className="table-auto w-full bg-white dark:bg-gray-800 shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <th className="p-4">Name</th>
              <th className="p-4">Description</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.description}</td>
                <td className="p-4">{product.price}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">{product.sku}</td>
                <td className="p-4 flex space-x-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                    onClick={() => setEditingProduct(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </button>
                  <button
                    className={`${
                      product.is_active
                        ? 'bg-gray-500 hover:bg-gray-700'
                        : 'bg-green-500 hover:bg-green-700'
                    } text-white px-4 py-2 rounded`}
                    onClick={() => handleToggleProductStatus(product.id)}
                  >
                    {product.is_active ? 'Archive' : 'Unarchive'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
