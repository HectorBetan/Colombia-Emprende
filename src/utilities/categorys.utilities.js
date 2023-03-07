import { categorys } from "../models/Categorys.model";
export const categoryList = categorys.map((category) => {
  return (
    <option key={category} value={category} className="text-dark">
      {category}
    </option>
  );
});
