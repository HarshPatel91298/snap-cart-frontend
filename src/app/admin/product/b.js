 {/* Description */}
 <div className="mb-4">
 <label className="block text-sm font-medium mb-1">Description</label>
 <textarea
   name="description"
   value={
     editingProduct
       ? editingProduct.description
       : newProduct.description
   }
   onChange={handleInputChange}
   className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
   placeholder="Description"
 />
</div>

{/* Price */}
<div className="mb-4">
 <label className="block text-sm font-medium mb-1">Price</label>
 <input
   type="number"
   name="price"
   value={editingProduct ? editingProduct.price : newProduct.price}
   onChange={handleInputChange}
   className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
   placeholder="Price"
 />
</div>

{/* Stock */}
<div className="mb-4">
 <label className="block text-sm font-medium mb-1">Stock</label>
 <input
   type="number"
   name="stock"
   value={editingProduct ? editingProduct.stock : newProduct.stock}
   onChange={handleInputChange}
   className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
   placeholder="Stock"
 />
</div>

{/* SKU */}
<div className="mb-4">
 <label className="block text-sm font-medium mb-1">SKU</label>
 <input
   type="text"
   name="sku"
   value={editingProduct ? editingProduct.sku : newProduct.sku}
   onChange={handleInputChange}
   className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
   placeholder="SKU"
 />
</div>

{/* Brand */}
<div className="mb-4">
 <label className="block text-sm font-medium mb-1">Brand</label>
 <select
   name="brand_id"
   value={editingProduct ? editingProduct.brand_id : newProduct.brand_id}
   onChange={handleInputChange}
   className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
 >
   <option value="">Select Brand</option>
   {brands.map((brand) => (
     <option key={brand.id} value={brand.id}>
       {brand.name}
     </option>
   ))}
 </select>
</div>

{/* Category */}
<div className="mb-4">
 <label className="block text-sm font-medium mb-1">Category</label>
 <select
   name="category_id"
   value={editingProduct ? editingProduct.category_id : newProduct.category_id}
   onChange={handleInputChange}
   className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
 >
   <option value="">Select Category</option>
   {categories.map((category) => (
     <option key={category.id} value={category.id}>
       {category.name}
     </option>
   ))}
 </select>
</div>

{/* Sub Category */}
<div className="mb-4">
 <label className="block text-sm font-medium mb-1">Sub Category</label>
 <select
   name="sub_category_id"
   value={editingProduct ? editingProduct.sub_category_id : newProduct.sub_category_id}
   onChange={handleInputChange}
   className="border p-2 rounded w-full bg-gray-50 dark:bg-neutral-700"
 >
   <option value="">Select Sub Category</option>
   {getSubCategoriesByCategoryId(newProduct.category_id).map((subCategory) => (
     <option key={subCategory.id} value={subCategory.id}>
       {subCategory.name}
     </option>
   ))}
 </select>
</div>