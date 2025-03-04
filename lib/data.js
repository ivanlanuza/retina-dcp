export const PAGINATION_LIMIT = 5;
export const IRIPPLE_ADMIN_NAME = "irippleadmin";

export const USER_ACCESS_RIGHTS_LEVELS = [
  { id: 1, label: "Client Account", keyword: "clientaccount" },
  { id: 2, label: "Location", keyword: "location" },
  { id: 3, label: "Product", keyword: "product" },
  { id: 4, label: "Agency", keyword: "agency" },
  { id: 5, label: "Supplier", keyword: "supplier" },
  { id: 6, label: "Category", keyword: "category" },
  { id: 7, label: "Competitor", keyword: "competitor" },
];

export const REFERENCE_TABLE_OPTIONS = [
  {
    id: 0,
    value: "Products",
    disabled: false,
    fields: [
      { id: 0, value: "Product Name", field: "name" },
      { id: 1, value: "Barcode", field: "barcode" },
      { id: 2, value: "Category", field: "category" },
      { id: 3, value: "Subcategory", field: "subcategory" },
      { id: 4, value: "Class", field: "class" },
      { id: 5, value: "Subclass", field: "subclass" },
      { id: 6, value: "Brand", field: "brand" },
      { id: 7, value: "Supplier", field: "supplier" },
      {
        id: 8,
        value: "Product Description",
        field: "description",
      },
      { id: 9, value: "External Code", field: "externalcode" },
    ],
  },
  {
    id: 2,
    value: "Location",
    disabled: true,
    fields: [
      { id: 0, value: "Name" },
      { id: 1, value: "Coordinates" },
      { id: 2, value: "Client Account" },
    ],
  },
  { id: 3, value: "Brands", disabled: true },
  { id: 4, value: "Competitors", disabled: true },
];
