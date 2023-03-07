import { citys } from "../models/City.model";
export const cityList = citys.map((city) => {
  return (
    <option key={city} value={city} className="text-dark">
      {city}
    </option>
  );
});
