'use client'

import { useState, useEffect } from 'react'

// GraphQL Queries and Mutations for Products and Related Data
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
`

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
`

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
`

const DELETE_PRODUCT = `
  mutation DeleteProduct($deleteProductId: ID!) {
    deleteProduct(id: $deleteProductId) {
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
`

const TOGGLE_PRODUCT_STATUS = `
  mutation ToggleProductStatusById($toggleProductStatusByIdId: ID!) {
    toggleProductStatusById(id: $toggleProductStatusByIdId) {
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
        created_at
        updated_at
        is_active
      }
      message
    }
  }
`

const PRODUCT_COUNT = `
  query Query {
    productCount
  }
`

const GET_BRANDS_CATEGORIES_SUBCATEGORIES = `
  query Brands {
    brands {
      id
      name
      description
      is_active
      logoURL
      createdAt
      updatedAt
    }
    categories {
      id
      name
      description
      is_active
      createdAt
      updatedAt
    }
    subCategories {
      id
      name
      description
      is_active
      createdAt
      updatedAt
      category_id
    }
  }
`

const AdminProducts = () => {
  const [products, setProducts] = useState([])
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
    sku: '', // Added SKU field
  })
  const [editingProduct, setEditingProduct] = useState(null)
  const [productCount, setProductCount] = useState(0)
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])

  // Fetch products, brands, categories, and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: GET_PRODUCTS,
          }),
        })

        const { data: productData } = await productRes.json()
        setProducts(productData.products)

        const countRes = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: PRODUCT_COUNT,
          }),
        })

        const { data: countData } = await countRes.json()
        setProductCount(countData.productCount)

        const brandRes = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: GET_BRANDS_CATEGORIES_SUBCATEGORIES,
          }),
        })

        const { data: brandData } = await brandRes.json()
        setBrands(brandData.brands)
        setCategories(brandData.categories)
        setSubCategories(brandData.subCategories)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  // Handle input changes for new or editing products
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (editingProduct) {
      setEditingProduct((prev) => ({ ...prev, [name]: value }))
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Create a new product
  const handleCreateProduct = async () => {
    console.log(newProduct)
    try {
      const formattedProduct = {
        ...newProduct,
        price: parseFloat(newProduct.price), // Ensure price is a float
        stock: parseInt(newProduct.stock, 10), // Ensure stock is an integer
      }

      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: ADD_PRODUCT,
          variables: { newProduct: formattedProduct },
        }),
      })

      const { data } = await res.json()
      setProducts([...products, data.addProduct.data])
      setNewProduct({
        name: '',
        description: '',
        price: '',
        color: '',
        brand_id: '',
        category_id: '',
        sub_category_id: '',
        display_image: '',
        images: [],
        stock: '',
        sku: '',
      })
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const handleUpdateProduct = async () => {
    try {
      const formattedProductData = {
        ...editingProduct,
        price: parseFloat(editingProduct.price), // Ensure price is a float
        stock: parseInt(editingProduct.stock, 10), // Ensure stock is an integer
      }

      const { id, created_at, updated_at, ...productData } =
        formattedProductData

      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: UPDATE_PRODUCT,
          variables: {
            updateProductId: id,
            productData,
          },
        }),
      })

      const { data } = await res.json()
      setProducts(
        products.map((prod) =>
          prod.id === data.updateProduct.data.id
            ? data.updateProduct.data
            : prod
        )
      )
      setEditingProduct(null)
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  // Delete a product
  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: DELETE_PRODUCT,
          variables: { deleteProductId: id },
        }),
      })

      const { data } = await res.json()
      if (data.deleteProduct.status) {
        setProducts(products.filter((prod) => prod.id !== id))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  // Toggle product status
  const handleToggleProductStatus = async (id) => {
    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: TOGGLE_PRODUCT_STATUS,
          variables: { toggleProductStatusByIdId: id },
        }),
      })

      const { data } = await res.json()
      setProducts(
        products.map((prod) =>
          prod.id === data.toggleProductStatusById.data.id
            ? data.toggleProductStatusById.data
            : prod
        )
      )
    } catch (error) {
      console.error('Error toggling product status:', error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Admin Portal - Manage Products
      </h1>

      {/* Display Product Count */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Total Products: {productCount}
        </h2>
      </div>

      {/* Form for Adding/Editing Product */}
      <div className="bg-gray-100 p-6 rounded shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <input
          type="text"
          name="name"
          value={editingProduct ? editingProduct.name : newProduct.name}
          onChange={handleInputChange}
          placeholder="Product Name"
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="text"
          name="description"
          value={
            editingProduct ? editingProduct.description : newProduct.description
          }
          onChange={handleInputChange}
          placeholder="Product Description"
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="number"
          name="price"
          value={editingProduct ? editingProduct.price : newProduct.price}
          onChange={handleInputChange}
          placeholder="Product Price"
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="number"
          name="stock"
          value={editingProduct ? editingProduct.stock : newProduct.stock}
          onChange={handleInputChange}
          placeholder="Product Stock"
          className="border p-2 rounded w-full mb-4"
        />
        <input
          type="text"
          name="sku"
          value={editingProduct ? editingProduct.sku : newProduct.sku}
          onChange={handleInputChange}
          placeholder="SKU"
          className="border p-2 rounded w-full mb-4"
        />

        {/* Dropdowns for Brands, Categories, Subcategories */}
        <select
          name="brand_id"
          value={editingProduct ? editingProduct.brand_id : newProduct.brand_id}
          onChange={handleInputChange}
          className="border p-2 rounded w-full mb-4"
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
          value={
            editingProduct ? editingProduct.category_id : newProduct.category_id
          }
          onChange={handleInputChange}
          className="border p-2 rounded w-full mb-4"
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
          value={
            editingProduct
              ? editingProduct.sub_category_id
              : newProduct.sub_category_id
          }
          onChange={handleInputChange}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="">Select Subcategory</option>
          {subCategories.map((subCategory) => (
            <option key={subCategory.id} value={subCategory.id}>
              {subCategory.name}
            </option>
          ))}
        </select>

        <button
          onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {editingProduct ? 'Update Product' : 'Create Product'}
        </button>
        {editingProduct && (
          <button
            onClick={() => setEditingProduct(null)}
            className="ml-4 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Product Table */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Product List</h2>
        <table className="table-auto w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
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
              <tr key={product.id} className="border-b hover:bg-gray-100">
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
  )
}

export default AdminProducts
