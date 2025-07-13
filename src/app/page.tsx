"use client";
import { useEffect, useState } from "react";
import { Product, Variant, Option } from "../types/Product.type";

const initialProduct: Product = {
  id: "",
  code: "CN-EHC",
  name: "",
  brief_description: "",
  description: "",
  price: 0,
  main_image: "",
  category: [],
  delivery_charges: 0,
  stock: true,
  processing_time: "",
  variants: [],
  optional_upgrade: "",
  care_instructions: [],
  options: [],
  size: "",
  material: "",
  features: [],
  is_featured: true,
  is_active: true,
  orders_count: 0,
};

/**
 * @brief To turn object variables from "id" => id
 */
function objectToLiteral(obj: unknown, indent = 2): string {
  const spacing = " ".repeat(indent);

  const format = (val: unknown, depth: number): string => {
    const pad = " ".repeat(depth * indent);

    if (Array.isArray(val)) {
      if (val.length === 0) return "[]";
      const inner = val.map((item) => format(item, depth + 1)).join(",\n" + pad + spacing);
      return `[\n${pad + spacing}${inner}\n${pad}]`;
    }

    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      const entries = Object.entries(val as Record<string, unknown>)
        .map(([key, value]) => `${pad + spacing}${key}: ${format(value, depth + 1)}`)
        .join(",\n");
      return `{\n${entries}\n${pad}}`;
    }

    if (typeof val === "string") return `"${val}"`;
    return String(val);
  };

  return format(obj, 0);
}


const Tooltip = ({ text, onClose }: { text: string; onClose: () => void }) => (
  <div className="fixed inset-0 min-h-screen p-10 bg-amber-600/90 flex items-center justify-center z-50">
    <div className="bg-gradient-to-r from-amber-100 to-amber-200 border-2 border-amber-700 rounded-lg p-6 shadow-xl shadow-amber-700/50 w-full max-w-md relative ">
      <p className="text-purple-900 text-sm">{text}</p>
      <button onClick={onClose} className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700">✖</button>
    </div>
  </div>
);

export default function ProductForm() {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [jsonResult, setJsonResult] = useState<string>("");
  const [tooltip, setTooltip] = useState<string | null>(null);

  const [categoryInputs, setCategoryInputs] = useState<string[]>([]);
  const [careInputs, setCareInputs] = useState<string[]>([]);
  const [featureInputs, setFeatureInputs] = useState<string[]>([]);
  const [variantsInputs, setVariantsInputs] = useState<Variant[]>([]);
  const [optionsInputs, setOptionsInputs] = useState<Option[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("product-form-data");
    if (saved) {
      const parsed = JSON.parse(saved);
      setProduct(parsed.product || initialProduct);
      setCategoryInputs(parsed.category || []);
      setCareInputs(parsed.care || []);
      setFeatureInputs(parsed.features || []);
      setVariantsInputs(parsed.variants || []);
      setOptionsInputs(parsed.options || []);
    }
  }, []);

  useEffect(() => {
    const data = {
      product,
      category: categoryInputs,
      care: careInputs,
      features: featureInputs,
      variants: variantsInputs,
      options: optionsInputs,
    };
    localStorage.setItem("product-form-data", JSON.stringify(data));
  }, [product, categoryInputs, careInputs, featureInputs, variantsInputs, optionsInputs]);


  useEffect(() => {
    if (tooltip) {
      const timer = setTimeout(() => {
        setTooltip(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [tooltip]);


  const updateField = <K extends keyof Product>(field: K, value: Product[K]) => {
    setProduct({ ...product, [field]: value });
  };


  const handleGenerate = () => {
    const finalProduct = {
      ...product,
      id: "",
      main_image: "",
      category: categoryInputs,
      care_instructions: careInputs,
      features: featureInputs,
      variants: variantsInputs,
      options: optionsInputs,
      discount_price: product.discount_price || 0,
      custom_note: product.custom_note || "",
    };

    const jsLiteral = objectToLiteral(finalProduct);
    setJsonResult(jsLiteral);
  };

  function handleAddInput<T>(
    stateSetter: React.Dispatch<React.SetStateAction<T[]>>,
    defaultValue: T
  ) {
    stateSetter((prev) => [...prev, defaultValue]);
  }


  function handleInputChange<T>(
    stateSetter: React.Dispatch<React.SetStateAction<T[]>>,
    index: number,
    value: T | T[keyof T],
    key?: keyof T
  ) {
    stateSetter((prev) => {
      const updated = [...prev];

      if (key) {
        updated[index] = {
          ...updated[index],
          [key]: value as T[keyof T],
        };
      } else {
        updated[index] = value as T;
      }

      return updated;
    });
  }

  const label_CSS: string = "font-bold";
  const baseButton_CSS: string = "w-full max-w-[120px] text-white border px-4 py-2 rounded-md shadow-xl active:scale-110 hover:scale-105 transition-all ease-in-out duration-300";

  const greenButton_CSS: string = `${baseButton_CSS} bg-gradient-to-r from-green-400 to-green-600 text-green-100 border-green-500 shadow-green-500/50`;
  const redButton_CSS: string = `${baseButton_CSS} bg-gradient-to-r from-red-400 to-red-600 text-red-100 border-red-500 shadow-red-500/50`;
  const blueButton_CSS: string = `${baseButton_CSS} bg-gradient-to-r from-blue-400 to-blue-600 text-blue-100 border-blue-500 shadow-blue-500/50`;

  return (
    <div className="p-6 m-6 max-w-4xl mx-auto space-y-6 bg-white border border-amber-600/40 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-center">🛍️ Crafti Nagma Product Entry</h1>

      {tooltip && <Tooltip text={tooltip} onClose={() => setTooltip(null)} />}

      {/* Code */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Code</label>
          <button onClick={() => setTooltip("Enter a unique product code to identify the item.")} className="text-blue-500 text-sm">Help</button>
        </div>
        <input
          placeholder="Code"
          value={product.code}
          onChange={(e) => updateField("code", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      {/* Name */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Name</label>
          <button onClick={() => setTooltip("Enter the full name of the product.")} className="text-blue-500 text-sm">Help</button>
        </div>
        <input
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      {/* Brief Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Brief Description</label>
          <button
            onClick={() => setTooltip("A short summary of the product (max 200 characters).")}
            className="text-blue-500 text-sm"
          >
            Help
          </button>
        </div>
        <div className="relative">
          <textarea
            maxLength={200}
            placeholder="Brief Description"
            value={product.brief_description}
            onChange={(e) => updateField("brief_description", e.target.value)}
            className="w-full border px-3 py-2 rounded resize-none"
          />
          <div className="absolute bottom-2 right-1 text-xs text-gray-400">
            {product.brief_description.length}/200
          </div>
        </div>
      </div>

      {/* Full Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Full Description</label>
          <button
            onClick={() => setTooltip("A detailed product description (max 2000 characters).")}
            className="text-blue-500 text-sm"
          >
            Help
          </button>
        </div>
        <div className="relative">
          <textarea
            maxLength={2000}
            placeholder="Full Description"
            value={product.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full border px-3 py-2 rounded resize-none"
          />
          <div className="absolute bottom-2 right-1 text-xs text-gray-400">
            {product.description.length}/2000
          </div>
        </div>
      </div>


      <div className="grid grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label className={`${label_CSS}`}>Price</label>
          <input
            type="number"
            placeholder="Price"
            value={product.price}
            onChange={(e) => updateField("price", Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        {/* Delivery Charges */}
        <div>
          <label className={`${label_CSS}`}>Delivery Charges</label>
          <input
            type="number"
            placeholder="Delivery Charges"
            value={product.delivery_charges}
            onChange={(e) => updateField("delivery_charges", Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* Category Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Categories</label>
          <button
            onClick={() => handleAddInput<string>(setCategoryInputs, "")}
            className="text-blue-500 text-sm"
          >
            + Add Category
          </button>
        </div>

        {categoryInputs.map((cat, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              value={cat}
              onChange={(e) => handleInputChange(setCategoryInputs, i, e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder={`Category ${i + 1}`}
            />
            <button
              onClick={() =>
                setCategoryInputs((prev) => prev.filter((_, index) => index !== i))
              }
              className="text-red-500 hover:text-red-700 text-xl font-bold px-2"
              title="Delete Category"
            >
              ✖
            </button>
          </div>
        ))}
      </div>



      <div className="grid grid-cols-2 gap-4">
        {/* Discount Price */}
        <div>
          <label className={`${label_CSS}`}>Discount Price (optional)</label>
          <input
            type="number"
            placeholder="Discount Price"
            value={product.discount_price || ""}
            onChange={(e) => updateField("discount_price", Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        {/* Processing Time */}
        <div>
          <label className={`${label_CSS}`}>Processing Time</label>
          <input
            placeholder="e.g. 2-3 days"
            value={product.processing_time}
            onChange={(e) => updateField("processing_time", e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* Stock */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Stock</label>
          <button onClick={() => setTooltip("Select whether the product is currently in stock.")} className="text-blue-500 text-sm">Help</button>
        </div>
        <select
          value={product.stock ? "true" : "false"}
          onChange={(e) => updateField("stock", e.target.value === "true")}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </div>


      {/* Variants Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Variants</label>
          <button
            onClick={() =>
              handleAddInput(setVariantsInputs, { name: "", description: "" })
            }
            className="text-blue-500 text-sm"
          >
            + Add Variant
          </button>
        </div>

        {variantsInputs.map((v, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <input
              placeholder="Variant Name"
              value={v.name}
              onChange={(e) =>
                handleInputChange(setVariantsInputs, i, e.target.value, "name")
              }
              className="border px-3 py-2 rounded w-full"
            />
            <input
              placeholder="Variant Description"
              value={v.description}
              onChange={(e) =>
                handleInputChange(
                  setVariantsInputs,
                  i,
                  e.target.value,
                  "description"
                )
              }
              className="border px-3 py-2 rounded w-full"
            />
            <button
              onClick={() =>
                setVariantsInputs((prev) => prev.filter((_, index) => index !== i))
              }
              className="text-red-500 hover:text-red-700 text-xl font-bold px-2"
              title="Delete Variant"
            >
              ✖
            </button>
          </div>
        ))}
      </div>


      {/* Custom Note */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Custom Note</label>
          <button onClick={() => setTooltip("Optional note that will be visible to the customer, like packaging or delivery instructions.")} className="text-blue-500 text-sm">Help</button>
        </div>
        <input
          value={product.custom_note || ""}
          onChange={(e) => updateField("custom_note", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Optional Upgrade */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Optional Upgrade</label>
          <button onClick={() => setTooltip("Mention any optional upgrade available for the product, like premium packaging.")} className="text-blue-500 text-sm">Help</button>
        </div>
        <input
          value={product.optional_upgrade}
          onChange={(e) => updateField("optional_upgrade", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Care Instructions Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Care Instructions</label>
          <button
            onClick={() => handleAddInput<string>(setCareInputs, "")}
            className="text-blue-500 text-sm"
          >
            + Add Instruction
          </button>
        </div>

        {careInputs.map((item, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              value={item}
              onChange={(e) => handleInputChange(setCareInputs, i, e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder={`Instruction ${i + 1}`}
            />
            <button
              onClick={() =>
                setCareInputs((prev) => prev.filter((_, index) => index !== i))
              }
              className="text-red-500 hover:text-red-700 text-xl font-bold px-2"
              title="Delete Instruction"
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      {/* Options Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Options</label>
          <button
            onClick={() =>
              handleAddInput(setOptionsInputs, {
                option_name: "",
                option_description: "",
              })
            }
            className="text-blue-500 text-sm"
          >
            + Add Option
          </button>
        </div>

        {optionsInputs.map((opt, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              placeholder="Option Name"
              value={opt.option_name}
              onChange={(e) =>
                handleInputChange(setOptionsInputs, i, e.target.value, "option_name")
              }
              className="w-full border px-3 py-2 rounded"
            />
            <input
              placeholder="Option Description"
              value={opt.option_description}
              onChange={(e) =>
                handleInputChange(setOptionsInputs, i, e.target.value, "option_description")
              }
              className="w-full border px-3 py-2 rounded"
            />
            <button
              onClick={() =>
                setOptionsInputs((prev) => prev.filter((_, index) => index !== i))
              }
              className="text-red-500 hover:text-red-700 text-xl font-bold px-2"
              title="Delete Option"
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      {/* Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Size</label>
          <button onClick={() => setTooltip("Specify size details like dimensions or standard sizes.")} className="text-blue-500 text-sm">Help</button>
        </div>
        <input
          placeholder="e.g. 10x15cm or Medium"
          value={product.size}
          onChange={(e) => updateField("size", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Material */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Material</label>
          <button onClick={() => setTooltip("Describe what materials the product is made of.")} className="text-blue-500 text-sm">Help</button>
        </div>
        <input
          placeholder="e.g. Cotton, Fabric"
          value={product.material}
          onChange={(e) => updateField("material", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Features Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Features</label>
          <button
            onClick={() => handleAddInput<string>(setFeatureInputs, "")}
            className="text-blue-500 text-sm"
          >
            + Add Feature
          </button>
        </div>

        {featureInputs.map((item, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              value={item}
              onChange={(e) => handleInputChange(setFeatureInputs, i, e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder={`Feature ${i + 1}`}
            />
            <button
              onClick={() =>
                setFeatureInputs((prev) => prev.filter((_, index) => index !== i))
              }
              className="text-red-500 hover:text-red-700 text-xl font-bold px-2"
              title="Delete Feature"
            >
              ✖
            </button>
          </div>
        ))}
      </div>


      {/* Is Featured */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Is Featured</label>
          <button onClick={() => setTooltip("Mark this as featured if you want to highlight this product on your store.")} className="text-blue-500 text-sm">Help</button>
        </div>
        <select
          value={product.is_featured ? "true" : "false"}
          onChange={(e) => updateField("is_featured", e.target.value === "true")}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="true">Featured</option>
          <option value="false">Not Featured</option>
        </select>
      </div>

      {/* Is Active */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`${label_CSS}`}>Is Active</label>
          <button onClick={() => setTooltip("Only active products will appear on your store. Disable if you're hiding this product.")} className="text-blue-500 text-sm">Help</button>
        </div>
        <select
          value={product.is_active ? "true" : "false"}
          onChange={(e) => updateField("is_active", e.target.value === "true")}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="text-center">
        <button
          onClick={handleGenerate}
          className={`${greenButton_CSS}`}
        >
          Generate
        </button>
      </div>

      <div className="text-center mt-3">
        <button
          onClick={() => {
            setProduct(initialProduct);
            setCategoryInputs([]);
            setCareInputs([]);
            setFeatureInputs([]);
            setVariantsInputs([]);
            setOptionsInputs([]);
            localStorage.removeItem("product-form-data");
            setJsonResult("");
            setTooltip("Form has been reset.");
          }}
          className={`${redButton_CSS}`}
        >
          Reset Form
        </button>
      </div>


      {jsonResult && (
        <div className="mt-6 flex flex-col items-center gap-5">
          <textarea
            className="w-full h-64 border p-4 rounded bg-white text-gray-800"
            readOnly
            value={jsonResult}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(jsonResult);
              setTooltip("Copied to clipboard!");
            }}
            className={`${blueButton_CSS}`}
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
